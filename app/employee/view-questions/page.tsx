"use client";
import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/Card";
import { Table } from "@/components/Table";
import { Select } from "@/components/Select";
import { Input } from "@/components/Input";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { Textarea } from "@/components/Textarea";
import MathRenderer from "@/components/MathRenderer";
import { useCurriculum } from "@/hooks/useCurriculum";
import { API_URL, apiFetch } from "@/lib/api";

import {
  Eye,
  Trash2,
  Pencil,
  Save,
  X,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  BookOpen,
  ImageIcon,
} from "lucide-react";

interface Question {
  id: number;
  class_level: number;
  subject: string;
  chapter: string;
  topic: string | null;
  difficulty: string;
  correct_option: number;
  status: string;
  admin_note: string | null;
  created_at: string;
  content: {
    question: { text: string; image: string | null };
    options: { text: string; image: string | null }[];
    explanation: { text: string; image: string | null };
  };
}

const OPTION_LABELS = ["A", "B", "C", "D"];

const difficultyStyle: Record<string, string> = {
  EASY: "bg-green-100 text-green-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  HARD: "bg-red-100 text-red-600",
};

const statusStyle: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-600",
  CORRECTION: "bg-orange-100 text-orange-700",
};

// ─── ImageUploader (inline, same as question-entry) ───────────────────────────
function ImageUploader({
  label,
  imageUrl,
  onChange,
}: {
  label: string;
  imageUrl: string | null;
  onChange: (url: string | null) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await apiFetch(`${API_URL}/upload/question-image`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (res.ok) {
        const json = await res.json();
        onChange(json.data?.url || null);
      }
    } catch { }
    setUploading(false);
  };

  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      {imageUrl ? (
        <div className="relative inline-block">
          <img src={imageUrl} alt={label} className="max-h-32 rounded-lg border border-gray-200" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-600"
          >
            <X size={10} />
          </button>
        </div>
      ) : (
        <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 cursor-pointer hover:border-brand-400 hover:text-brand-600 transition-colors w-fit">
          {uploading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <ImageIcon size={14} />
          )}
          {uploading ? "Uploading…" : "Upload image"}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
      )}
    </div>
  );
}

export default function ViewQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [filterClass, setFilterClass] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterChapter, setFilterChapter] = useState("all");
  const [filterTopic, setFilterTopic] = useState("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [filterDate, setFilterDate] = useState("");

  // Preview
  const [previewQ, setPreviewQ] = useState<Question | null>(null);

  // Edit mode inside preview
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState<Question["content"] | null>(null);
  const [editCorrectOption, setEditCorrectOption] = useState(0);
  const [editSaving, setEditSaving] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [editError, setEditError] = useState("");

  // Delete
  const [deleteQ, setDeleteQ] = useState<Question | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Grouped topic sections - collapse state
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  // Curriculum for chapter/topic filter options
  const curriculum = useCurriculum();

  // ─── Fetch employee's own questions ─────────────────────────────────────────
  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filterClass !== "all") params.set("class_level", filterClass);
      if (filterSubject !== "all") params.set("subject", filterSubject);
      if (filterChapter !== "all") params.set("chapter", filterChapter);
      if (filterTopic !== "all") params.set("topic", filterTopic);
      if (filterDifficulty !== "all") params.set("difficulty", filterDifficulty);
      if (filterDate) {
        const d = new Date(filterDate);
        params.set("month", String(d.getMonth() + 1));
        params.set("year", String(d.getFullYear()));
      }
      params.set("limit", "200");

      const res = await apiFetch(`${API_URL}/questions/search?${params}`,
        { credentials: "include" },
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setQuestions(data.questions ?? []);
    } catch {
      setError("Failed to load questions.");
    } finally {
      setLoading(false);
    }
  }, [filterClass, filterSubject, filterChapter, filterTopic, filterDifficulty, filterDate]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // ─── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteQ) return;
    setDeleteLoading(true);
    try {
      const res = await apiFetch(`${API_URL}/questions/${deleteQ.id}`,
        { method: "DELETE", credentials: "include" },
      );
      if (!res.ok) throw new Error();
      setDeleteQ(null);
      fetchQuestions();
    } catch {
      alert("Failed to delete question.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ─── Edit helpers ───────────────────────────────────────────────────────────
  const openEditMode = (q: Question) => {
    setEditContent(JSON.parse(JSON.stringify(q.content)));
    setEditCorrectOption(q.correct_option);
    setEditMode(true);
    setEditSuccess(false);
    setEditError("");
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditContent(null);
    setEditSuccess(false);
    setEditError("");
  };

  const saveEdit = async () => {
    if (!previewQ || !editContent) return;
    setEditSaving(true);
    setEditError("");
    setEditSuccess(false);
    try {
      const res = await apiFetch(`${API_URL}/questions/${previewQ.id}/edit`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            content: editContent,
            correct_option: editCorrectOption,
          }),
        },
      );
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.message || "Failed to save changes.");
      }
      setEditSuccess(true);
      setEditMode(false);
      // Update local state
      setPreviewQ({
        ...previewQ,
        content: editContent,
        correct_option: editCorrectOption,
        status: "PENDING",
      });
      fetchQuestions();
    } catch (err: any) {
      setEditError(err.message || "Failed to save.");
    } finally {
      setEditSaving(false);
    }
  };

  // ─── Filter options ─────────────────────────────────────────────────────────
  const classOptions = [
    { value: "all", label: "All Classes" },
    ...Array.from({ length: 12 }, (_, i) => ({
      value: String(i + 1),
      label: `Class ${i + 1}`,
    })),
  ];

  const subjectOptions = [
    { value: "all", label: "All Subjects" },
    ...(filterClass !== "all"
      ? curriculum.getSubjects(parseInt(filterClass)).map((s) => ({
        value: s,
        label: s.charAt(0).toUpperCase() + s.slice(1),
      }))
      : [
        { value: "math", label: "Mathematics" },
        { value: "english", label: "English" },
        { value: "science", label: "Science" },
        { value: "physics", label: "Physics" },
        { value: "chemistry", label: "Chemistry" },
        { value: "biology", label: "Biology" },
      ]),
  ];

  const chapterOptions = [
    { value: "all", label: "All Chapters" },
    ...(filterClass !== "all" && filterSubject !== "all"
      ? curriculum.getChapters(parseInt(filterClass), filterSubject).map((c) => ({
        value: c,
        label: c,
      }))
      : []),
  ];

  const topicOptions = [
    { value: "all", label: "All Topics" },
    ...(filterClass !== "all" && filterSubject !== "all" && filterChapter !== "all"
      ? curriculum.getTopics(parseInt(filterClass), filterSubject, filterChapter).map((t) => ({
        value: t,
        label: t,
      }))
      : []),
  ];

  const difficultyOptions = [
    { value: "all", label: "All Difficulties" },
    { value: "EASY", label: "Easy" },
    { value: "MEDIUM", label: "Medium" },
    { value: "HARD", label: "Hard" },
  ];

  // Reset dependent filters when parent changes
  useEffect(() => { setFilterSubject("all"); setFilterChapter("all"); setFilterTopic("all"); }, [filterClass]);
  useEffect(() => { setFilterChapter("all"); setFilterTopic("all"); }, [filterSubject]);
  useEffect(() => { setFilterTopic("all"); }, [filterChapter]);

  // ─── Grouping logic ─────────────────────────────────────────────────────────
  // Group questions by topic, sort groups by most recent question's created_at
  const groupedQuestions = (() => {
    const groups: Record<string, Question[]> = {};
    for (const q of questions) {
      const key = q.topic || "Uncategorized";
      if (!groups[key]) groups[key] = [];
      groups[key].push(q);
    }
    // Sort questions within each group (newest first)
    for (const key of Object.keys(groups)) {
      groups[key].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    // Sort groups by the most recent question's created_at
    const sortedEntries = Object.entries(groups).sort(([, aQuestions], [, bQuestions]) => {
      const aLatest = new Date(aQuestions[0].created_at).getTime();
      const bLatest = new Date(bQuestions[0].created_at).getTime();
      return bLatest - aLatest;
    });
    return sortedEntries;
  })();

  const toggleGroup = (topic: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(topic)) {
        next.delete(topic);
      } else {
        next.add(topic);
      }
      return next;
    });
  };

  // ─── Table columns (inside each group) ──────────────────────────────────────
  const columns = [
    {
      key: "id",
      header: "ID",
      render: (v: number) => <span className="font-mono text-brand-600 font-semibold">#{v}</span>,
    },
    {
      key: "content",
      header: "Question",
      render: (_: any, row: Question) => (
        <p className="text-gray-800 text-sm line-clamp-2 max-w-xs">
          {row.content?.question?.text ?? "—"}
        </p>
      ),
    },
    {
      key: "class_level",
      header: "Class",
      render: (value: number) => `Class ${value}`,
    },
    {
      key: "subject",
      header: "Subject",
      render: (value: string) => <span className="capitalize">{value}</span>,
    },
    { key: "chapter", header: "Chapter" },
    {
      key: "difficulty",
      header: "Difficulty",
      render: (value: string) => (
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${difficultyStyle[value] ?? "bg-gray-100 text-gray-600"}`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (value: string) => (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle[value] ?? "bg-gray-100 text-gray-600"}`}>
          {value}
        </span>
      ),
    },
    {
      key: "created_at",
      header: "Added",
      render: (v: string) =>
        new Date(v).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_: any, row: Question) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setPreviewQ(row);
              setEditMode(false);
              setEditSuccess(false);
              setEditError("");
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-brand-200 bg-brand-50 text-brand-600 hover:bg-brand-100 transition-all"
          >
            <Eye size={12} /> View
          </button>
          <button
            onClick={() => setDeleteQ(row)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-all"
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      ),
    },
  ];

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar title="View Questions" subtitle="Manage and monitor question status" />
      <div className="p-5 lg:p-8">

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-wrap items-end gap-4">
            <div className="w-36">
              <Select label="Class" options={classOptions} value={filterClass} onChange={(e) => setFilterClass(e.target.value)} />
            </div>
            <div className="w-40">
              <Select label="Subject" options={subjectOptions} value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} />
            </div>
            <div className="w-44">
              <Select label="Chapter" options={chapterOptions} value={filterChapter} onChange={(e) => setFilterChapter(e.target.value)} />
            </div>
            <div className="w-44">
              <Select label="Topic" options={topicOptions} value={filterTopic} onChange={(e) => setFilterTopic(e.target.value)} />
            </div>
            <div className="w-36">
              <Select label="Difficulty" options={difficultyOptions} value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)} />
            </div>
            <div className="w-40">
              <Input label="Date (month)" type="month" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
            </div>
          </div>
        </Card>

        {/* Loading */}
        {loading && (
          <div className="py-12 text-center text-gray-400">
            <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm">Loading questions…</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="py-6 text-center text-red-500 text-sm">
            {error}
            <button onClick={fetchQuestions} className="ml-2 text-brand-600 underline">
              Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && questions.length === 0 && (
          <Card className="py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium mb-1">No questions found</p>
            <p className="text-xs text-gray-400">Try adjusting your filters or add your first question.</p>
          </Card>
        )}

        {/* Grouped question sections */}
        {!loading && !error && groupedQuestions.map(([topic, topicQuestions]) => (
          <div key={topic} className="mb-6">
            <button
              onClick={() => toggleGroup(topic)}
              className="w-full flex items-center justify-between px-5 py-3.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all mb-2 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                  <BookOpen size={16} className="text-brand-500" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-gray-900">{topic}</h3>
                  <p className="text-xs text-gray-400">{topicQuestions.length} question{topicQuestions.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
              {collapsedGroups.has(topic) ? (
                <ChevronDown size={18} className="text-gray-400" />
              ) : (
                <ChevronUp size={18} className="text-gray-400" />
              )}
            </button>
            {!collapsedGroups.has(topic) && (
              <Card>
                <Table columns={columns} data={topicQuestions} />
              </Card>
            )}
          </div>
        ))}
      </div>

      {/* ─── Preview / Edit Modal ──────────────────────────────────────────────── */}
      < Modal
        isOpen={!!previewQ}
        onClose={() => {
          setPreviewQ(null);
          cancelEdit();
        }}
        title={editMode ? "Edit Question" : "Question Preview"}
      >
        {previewQ && !editMode && (
          <div className="space-y-5">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-gray-900 text-white font-bold">#{previewQ.id}</span>
              <span className="px-2.5 py-1 rounded-full bg-brand-100 text-brand-700 font-medium">
                Class {previewQ.class_level}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-brand-100 text-brand-700 font-medium capitalize">
                {previewQ.subject}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                {previewQ.chapter}
              </span>
              {previewQ.topic && (
                <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                  {previewQ.topic}
                </span>
              )}
              <span
                className={`px-2.5 py-1 rounded-full font-medium capitalize ${difficultyStyle[previewQ.difficulty] ?? "bg-gray-100 text-gray-600"}`}
              >
                {previewQ.difficulty}
              </span>
              <span className={`px-2.5 py-1 rounded-full font-medium ${statusStyle[previewQ.status]}`}>
                {previewQ.status}
              </span>
            </div>

            {/* Admin note */}
            {previewQ.admin_note && (
              <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-sm text-orange-800">
                <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-orange-600">Admin Note</p>
                {previewQ.admin_note}
              </div>
            )}

            {/* Question */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Question</p>
              <div className="text-gray-900 text-sm leading-relaxed">
                <MathRenderer content={previewQ.content?.question?.text || ""} />
              </div>
              {previewQ.content?.question?.image && (
                <img src={previewQ.content.question.image} alt="question" className="mt-3 max-h-48 rounded-lg border border-gray-200" />
              )}
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Options</p>
              {previewQ.content?.options?.map((opt, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border-2 ${previewQ.correct_option === i ? "border-brand-500 bg-brand-50" : "border-gray-100"}`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${previewQ.correct_option === i ? "bg-brand-500 text-white" : "bg-gray-100 text-gray-500"}`}
                  >
                    {OPTION_LABELS[i]}
                  </span>
                  <div className="text-sm text-gray-700 pt-0.5 flex-1">
                    <MathRenderer content={opt.text} />
                  </div>
                  {previewQ.correct_option === i && (
                    <span className="ml-auto text-xs text-brand-600 font-medium shrink-0">✓ Correct</span>
                  )}
                </div>
              ))}
            </div>

            {/* Explanation */}
            <div className="p-4 rounded-xl bg-brand-50 border border-brand-100">
              <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-2">Explanation</p>
              <div className="text-sm text-gray-700 leading-relaxed">
                <MathRenderer content={previewQ.content?.explanation?.text || ""} />
              </div>
            </div>

            {/* Success message */}
            {editSuccess && (
              <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-sm text-green-700 flex items-center gap-2">
                <CheckCircle2 size={14} /> Changes saved successfully. Status reset to PENDING.
              </div>
            )}

            {/* Edit button */}
            {(previewQ.status === "CORRECTION" || previewQ.status === "REJECTED" || previewQ.status === "PENDING") && (
              <Button variant="outline" size="sm" onClick={() => openEditMode(previewQ)}>
                <Pencil size={14} /> Edit Question
              </Button>
            )}
          </div>
        )}

        {/* ─── Edit Form ─────────────────────────────────────────────────────── */}
        {previewQ && editMode && editContent && (
          <div className="space-y-5">
            {editError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                {editError}
              </div>
            )}

            {/* Question text */}
            <div>
              <Textarea
                label="Question text (LaTeX supported)"
                value={editContent.question.text}
                onChange={(e) =>
                  setEditContent({
                    ...editContent,
                    question: { ...editContent.question, text: e.target.value },
                  })
                }
                rows={3}
              />
              <div className="mt-2">
                <ImageUploader
                  label="Question image"
                  imageUrl={editContent.question.image}
                  onChange={(url) =>
                    setEditContent({
                      ...editContent,
                      question: { ...editContent.question, image: url },
                    })
                  }
                />
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Options</p>
              {editContent.options.map((opt, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => setEditCorrectOption(i)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-2 transition-colors ${editCorrectOption === i ? "bg-brand-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                    >
                      {OPTION_LABELS[i]}
                    </button>
                    <div className="flex-1">
                      <Textarea
                        placeholder={`Option ${OPTION_LABELS[i]}`}
                        value={opt.text}
                        onChange={(e) => {
                          const newOptions = [...editContent.options];
                          newOptions[i] = { ...newOptions[i], text: e.target.value };
                          setEditContent({ ...editContent, options: newOptions });
                        }}
                        rows={2}
                      />
                    </div>
                  </div>
                  <div className="ml-10">
                    <ImageUploader
                      label={`Option ${OPTION_LABELS[i]} image`}
                      imageUrl={opt.image}
                      onChange={(url) => {
                        const newOptions = [...editContent.options];
                        newOptions[i] = { ...newOptions[i], image: url };
                        setEditContent({ ...editContent, options: newOptions });
                      }}
                    />
                  </div>
                </div>
              ))}
              <p className="text-xs text-gray-400">Click an option label (A/B/C/D) to mark it as correct.</p>
            </div>

            {/* Explanation */}
            <div>
              <Textarea
                label="Explanation (LaTeX supported)"
                value={editContent.explanation.text}
                onChange={(e) =>
                  setEditContent({
                    ...editContent,
                    explanation: { ...editContent.explanation, text: e.target.value },
                  })
                }
                rows={3}
              />
              <div className="mt-2">
                <ImageUploader
                  label="Explanation image"
                  imageUrl={editContent.explanation.image}
                  onChange={(url) =>
                    setEditContent({
                      ...editContent,
                      explanation: { ...editContent.explanation, image: url },
                    })
                  }
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button onClick={saveEdit} disabled={editSaving}>
                {editSaving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Saving…
                  </>
                ) : (
                  <>
                    <Save size={14} /> Save Changes
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={cancelEdit}>
                <X size={14} /> Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal >

      {/* ─── Delete confirm modal ──────────────────────────────────────────── */}
      < Modal
        isOpen={!!deleteQ}
        onClose={() => setDeleteQ(null)}
        title="Delete Question"
      >
        {deleteQ && (
          <div className="space-y-5">
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-sm font-medium text-red-800 mb-2">Delete this question?</p>
              <p className="text-xs text-gray-600 bg-white rounded-lg p-3 border border-gray-100 line-clamp-3">
                {deleteQ.content?.question?.text}
              </p>
              <p className="text-xs text-red-500 mt-3">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {deleteLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Deleting…
                  </>
                ) : (
                  <>
                    <Trash2 size={14} /> Delete
                  </>
                )}
              </button>
              <Button variant="outline" onClick={() => setDeleteQ(null)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal >
    </>
  );
}
