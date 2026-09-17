"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/Card";
import { Table } from "@/components/Table";
import { Select } from "@/components/Select";
import { Input } from "@/components/Input";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { Textarea } from "@/components/Textarea";
import MathRenderer from "@/components/MathRenderer";
import { API_URL, apiFetch } from "@/lib/api";

import {
  Search,
  Eye,
  List,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  X,
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
  reviewed_at: string | null;
  content: {
    question: { text: string; image: string | null };
    options: { text: string; image: string | null }[];
    explanation: { text: string; image: string | null };
  };
  creator: { id: number; name: string };
  reviewer?: { id: number; name: string } | null;
}

interface Employee {
  id: number;
  name: string;
}

const OPTION_LABELS = ["A", "B", "C", "D"];

const statusStyle: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-600",
  CORRECTION: "bg-orange-100 text-orange-700",
};

const difficultyStyle: Record<string, string> = {
  EASY: "bg-green-100 text-green-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  HARD: "bg-red-100 text-red-600",
};

const MONTHS = [
  { value: "", label: "All Months" },
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export default function AdminQuestions() {
  const router = useRouter();

  // ─── State ──────────────────────────────────────────────────────────────────
  const [searchId, setSearchId] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterChapter, setFilterChapter] = useState("");
  const [filterTopic, setFilterTopic] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterEmployee, setFilterEmployee] = useState("");

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [searchResults, setSearchResults] = useState<Question[]>([]);
  const [searchMeta, setSearchMeta] = useState<any>(null);
  const [allMeta, setAllMeta] = useState<any>(null);
  const [allPage, setAllPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [allLoading, setAllLoading] = useState(true);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searchMode, setSearchMode] = useState<"id" | "filters" | null>(null);

  // Preview modal
  const [previewQuestions, setPreviewQuestions] = useState<Question[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Status update
  const [statusLoading, setStatusLoading] = useState(false);
  const [correctionNoteOpen, setCorrectionNoteOpen] = useState(false);
  const [correctionNote, setCorrectionNote] = useState("");

  // Curriculum data for dropdowns
  const [curriculumClasses, setCurriculumClasses] = useState<number[]>([]);
  const [curriculumSubjects, setCurriculumSubjects] = useState<string[]>([]);
  const [curriculumChapters, setCurriculumChapters] = useState<string[]>([]);
  const [curriculumTopics, setCurriculumTopics] = useState<string[]>([]);

  // ─── Fetch employees for dropdown ───────────────────────────────────────────
  useEffect(() => {
    apiFetch(`${API_URL}/questions/employees-list`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setEmployees(data.data || []))
      .catch(() => { });
  }, []);

  // ─── Fetch curriculum data for dropdowns ────────────────────────────────────
  useEffect(() => {
    apiFetch(`${API_URL}/curriculum/classes`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setCurriculumClasses(data.data || []))
      .catch(() => { });
  }, []);

  useEffect(() => {
    if (!filterClass) { setCurriculumSubjects([]); return; }
    apiFetch(`${API_URL}/curriculum/subjects?class=${filterClass}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setCurriculumSubjects(data.data || []))
      .catch(() => { });
  }, [filterClass]);

  useEffect(() => {
    if (!filterClass || !filterSubject) { setCurriculumChapters([]); return; }
    apiFetch(`${API_URL}/curriculum/chapters?class=${filterClass}&subject=${filterSubject}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setCurriculumChapters(data.data || []))
      .catch(() => { });
  }, [filterClass, filterSubject]);

  useEffect(() => {
    if (!filterClass || !filterSubject || !filterChapter) { setCurriculumTopics([]); return; }
    apiFetch(`${API_URL}/curriculum/topics?class=${filterClass}&subject=${filterSubject}&chapter=${filterChapter}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setCurriculumTopics(data.data || []))
      .catch(() => { });
  }, [filterClass, filterSubject, filterChapter]);

  // ─── Fetch all entered questions ────────────────────────────────────────────
  const fetchAllQuestions = useCallback(async () => {
    setAllLoading(true);
    try {
      const res = await apiFetch(`${API_URL}/questions/all-entries?page=${allPage}&limit=20`,
        { credentials: "include" }
      );
      const data = await res.json();
      setAllQuestions(data.questions || []);
      setAllMeta(data.meta || null);
    } catch {
    } finally {
      setAllLoading(false);
    }
  }, [allPage]);

  useEffect(() => {
    fetchAllQuestions();
  }, [fetchAllQuestions]);

  // ─── Search by ID ───────────────────────────────────────────────────────────
  const handleSearchById = async () => {
    if (!searchId.trim()) return;
    setLoading(true);
    setSearchPerformed(true);
    setSearchMode("id");
    try {
      const res = await apiFetch(`${API_URL}/questions/search?id=${searchId.trim()}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (data.status === "success" && data.data) {
        setSearchResults([data.data]);
      } else {
        setSearchResults([]);
      }
    } catch {
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // ─── Search by filters ─────────────────────────────────────────────────────
  const handleSearchByFilters = async () => {
    setLoading(true);
    setSearchPerformed(true);
    setSearchMode("filters");
    try {
      const params = new URLSearchParams();
      if (filterClass) params.set("class_level", filterClass);
      if (filterSubject) params.set("subject", filterSubject);
      if (filterChapter) params.set("chapter", filterChapter);
      if (filterTopic) params.set("topic", filterTopic);
      if (filterMonth) params.set("month", filterMonth);
      if (filterEmployee) params.set("employee_id", filterEmployee);
      params.set("limit", "100");

      const res = await apiFetch(`${API_URL}/questions/search?${params}`,
        { credentials: "include" }
      );
      const data = await res.json();
      setSearchResults(data.questions || []);
      setSearchMeta(data.meta || null);
    } catch {
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // ─── Status update handlers ─────────────────────────────────────────────────
  const handleStatusUpdate = async (questionId: number, status: string, note?: string) => {
    setStatusLoading(true);
    try {
      const res = await apiFetch(`${API_URL}/questions/${questionId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status, admin_note: note || undefined }),
        }
      );
      if (res.ok) {
        // Refresh data
        fetchAllQuestions();
        if (searchPerformed) {
          searchMode === "id" ? handleSearchById() : handleSearchByFilters();
        }
        // Update preview question
        const updated = await res.json();
        if (previewOpen && previewQuestions[previewIndex]?.id === questionId) {
          const newPreviewQuestions = [...previewQuestions];
          newPreviewQuestions[previewIndex] = updated.data;
          setPreviewQuestions(newPreviewQuestions);
        }
      }
    } catch {
    } finally {
      setStatusLoading(false);
      setCorrectionNoteOpen(false);
      setCorrectionNote("");
    }
  };

  // ─── Open preview mode ──────────────────────────────────────────────────────
  const openPreview = (questions: Question[], startIndex = 0) => {
    setPreviewQuestions(questions);
    setPreviewIndex(startIndex);
    setPreviewOpen(true);
  };

  const currentPreviewQ = previewQuestions[previewIndex] || null;

  // ─── Navigate to question list route ────────────────────────────────────────
  const handleViewAsList = () => {
    const params = new URLSearchParams();
    if (filterClass) params.set("class_level", filterClass);
    if (filterSubject) params.set("subject", filterSubject);
    if (filterChapter) params.set("chapter", filterChapter);
    if (filterTopic) params.set("topic", filterTopic);
    if (filterMonth) params.set("month", filterMonth);
    if (filterEmployee) params.set("employee_id", filterEmployee);
    router.push(`/admin/questions/list?${params}`);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  // ─── Table columns for all entries ──────────────────────────────────────────
  const allColumns = [
    {
      key: "id",
      header: "ID",
      render: (v: number) => (
        <span className="font-mono text-brand-600 font-semibold">#{v}</span>
      ),
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
      key: "status",
      header: "Status",
      render: (v: string) => (
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle[v] ?? "bg-gray-100 text-gray-600"}`}
        >
          {v}
        </span>
      ),
    },
    {
      key: "creator",
      header: "Entered By",
      render: (_: any, row: Question) => (
        <span className="text-sm text-gray-700">{row.creator?.name ?? "—"}</span>
      ),
    },
    {
      key: "created_at",
      header: "Entry Date",
      render: (v: string) => formatDate(v),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_: any, row: Question) => (
        <button
          onClick={() => openPreview(allQuestions, allQuestions.findIndex((q) => q.id === row.id))}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-brand-200 bg-brand-50 text-brand-600 hover:bg-brand-100 transition-all"
        >
          <Eye size={12} /> View
        </button>
      ),
    },
  ];

  return (
    <>
      <Navbar title="Review Questions" subtitle="Review employee submissions" />

      <div className="p-5 lg:p-8 space-y-6">
        {/* ─── Search Section ─────────────────────────────────────────── */}
        <Card>
          <h2 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-brand-500" />
            Search Questions
          </h2>

          {/* Search by ID */}
          <div className="flex items-end gap-3 mb-5">
            <div className="w-64">
              <Input
                label="Search by Question ID"
                placeholder="Enter question ID (e.g. 123)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
            </div>
            <Button onClick={handleSearchById} disabled={loading || !searchId.trim()}>
              <Search size={14} /> Search
            </Button>
          </div>

          {/* Filter dropdowns */}
          <div className="border-t border-gray-100 pt-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Or search using filters
            </p>
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
              <Select
                label="Class"
                options={[
                  { value: "", label: "All Classes" },
                  ...curriculumClasses.map((c) => ({ value: String(c), label: `Class ${c}` })),
                ]}
                value={filterClass}
                onChange={(e) => {
                  setFilterClass(e.target.value);
                  setFilterSubject("");
                  setFilterChapter("");
                  setFilterTopic("");
                }}
              />
              <Select
                label="Subject"
                options={[
                  { value: "", label: "All Subjects" },
                  ...curriculumSubjects.map((s) => ({ value: s, label: s })),
                ]}
                value={filterSubject}
                onChange={(e) => {
                  setFilterSubject(e.target.value);
                  setFilterChapter("");
                  setFilterTopic("");
                }}
              />
              <Select
                label="Chapter"
                options={[
                  { value: "", label: "All Chapters" },
                  ...curriculumChapters.map((c) => ({ value: c, label: c })),
                ]}
                value={filterChapter}
                onChange={(e) => {
                  setFilterChapter(e.target.value);
                  setFilterTopic("");
                }}
              />
              <Select
                label="Topic"
                options={[
                  { value: "", label: "All Topics" },
                  ...curriculumTopics.map((t) => ({ value: t, label: t })),
                ]}
                value={filterTopic}
                onChange={(e) => setFilterTopic(e.target.value)}
              />
              <Select
                label="Month"
                options={MONTHS}
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
              />
              <Select
                label="Employee"
                options={[
                  { value: "", label: "All Employees" },
                  ...employees.map((emp) => ({ value: String(emp.id), label: emp.name })),
                ]}
                value={filterEmployee}
                onChange={(e) => setFilterEmployee(e.target.value)}
              />
            </div>
            <Button onClick={handleSearchByFilters} disabled={loading}>
              <Search size={14} /> Search with Filters
            </Button>
          </div>
        </Card>

        {/* ─── Search Results ─────────────────────────────────────────── */}
        {searchPerformed && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-brand-500" />
                Search Results
                {searchMeta && (
                  <span className="text-sm font-normal text-gray-500">
                    ({searchMeta.total} found)
                  </span>
                )}
              </h2>
              {searchMode === "filters" && searchResults.length > 0 && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleViewAsList}>
                    <List size={14} /> Questions List
                  </Button>
                  <Button size="sm" onClick={() => openPreview(searchResults, 0)}>
                    <Eye size={14} /> View Questions
                  </Button>
                </div>
              )}
            </div>

            {loading && (
              <div className="py-12 text-center text-gray-400">
                <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm">Searching…</p>
              </div>
            )}

            {!loading && searchResults.length === 0 && (
              <div className="py-8 text-center text-gray-400 text-sm">
                No questions found.
              </div>
            )}

            {!loading && searchResults.length > 0 && searchMode === "id" && (
              <Table columns={allColumns} data={searchResults} />
            )}

            {!loading && searchResults.length > 0 && searchMode === "filters" && (
              <div className="p-4 bg-brand-50 rounded-xl border border-brand-100">
                <p className="text-sm text-brand-700 font-medium">
                  {searchResults.length} questions found matching your filters.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Use &quot;Questions List&quot; to view in a table, or &quot;View Questions&quot; to preview with approve/reject actions.
                </p>
              </div>
            )}
          </Card>
        )}

        {/* ─── All Entered Questions ─────────────────────────────────── */}
        <Card>
          <h2 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-brand-500" />
            All Entered Questions
          </h2>

          {allLoading && (
            <div className="py-12 text-center text-gray-400">
              <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm">Loading questions…</p>
            </div>
          )}

          {!allLoading && <Table columns={allColumns} data={allQuestions} />}

          {/* Pagination */}
          {allMeta && allMeta.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-5">
              <Button
                variant="outline"
                size="sm"
                disabled={allPage <= 1}
                onClick={() => setAllPage((p) => p - 1)}
              >
                <ChevronLeft size={14} /> Prev
              </Button>
              <span className="text-sm text-gray-500">
                Page {allPage} of {allMeta.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={allPage >= allMeta.pages}
                onClick={() => setAllPage((p) => p + 1)}
              >
                Next <ChevronRight size={14} />
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* ─── Preview Modal ───────────────────────────────────────────── */}
      < Modal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)
        }
        title="Question Preview"
      >
        {currentPreviewQ && (
          <div className="space-y-5">
            {/* Question ID + metadata badges */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-gray-900 text-white font-bold">
                #{currentPreviewQ.id}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-brand-100 text-brand-700 font-medium">
                Class {currentPreviewQ.class_level}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-brand-100 text-brand-700 font-medium capitalize">
                {currentPreviewQ.subject}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                {currentPreviewQ.chapter}
              </span>
              {currentPreviewQ.topic && (
                <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                  {currentPreviewQ.topic}
                </span>
              )}
              <span
                className={`px-2.5 py-1 rounded-full font-medium ${statusStyle[currentPreviewQ.status] ?? "bg-gray-100 text-gray-600"}`}
              >
                {currentPreviewQ.status}
              </span>
              <span
                className={`px-2.5 py-1 rounded-full font-medium capitalize ${difficultyStyle[currentPreviewQ.difficulty] ?? "bg-gray-100 text-gray-600"}`}
              >
                {currentPreviewQ.difficulty}
              </span>
            </div>

            {/* Creator info */}
            <div className="text-xs text-gray-500">
              By <span className="font-medium text-gray-700">{currentPreviewQ.creator?.name}</span> on{" "}
              {formatDate(currentPreviewQ.created_at)}
            </div>

            {/* Question */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Question
              </p>
              <div className="text-gray-900 text-sm leading-relaxed">
                <MathRenderer content={currentPreviewQ.content?.question?.text || ""} />
              </div>
              {currentPreviewQ.content?.question?.image && (
                <img
                  src={currentPreviewQ.content.question.image}
                  alt="question"
                  className="mt-3 max-h-48 rounded-lg border border-gray-200"
                />
              )}
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Options
              </p>
              {currentPreviewQ.content?.options?.map((opt, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border-2 ${currentPreviewQ.correct_option === i ? "border-brand-500 bg-brand-50" : "border-gray-100"}`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${currentPreviewQ.correct_option === i ? "bg-brand-500 text-white" : "bg-gray-100 text-gray-500"}`}
                  >
                    {OPTION_LABELS[i]}
                  </span>
                  <div className="text-sm text-gray-700 pt-0.5 flex-1">
                    <MathRenderer content={opt.text} />
                  </div>
                  {currentPreviewQ.correct_option === i && (
                    <span className="ml-auto text-xs text-brand-600 font-medium shrink-0">
                      ✓ Correct
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Explanation */}
            <div className="p-4 rounded-xl bg-brand-50 border border-brand-100">
              <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-2">
                Explanation
              </p>
              <div className="text-sm text-gray-700 leading-relaxed">
                <MathRenderer content={currentPreviewQ.content?.explanation?.text || ""} />
              </div>
            </div>

            {/* Admin note if exists */}
            {currentPreviewQ.admin_note && (
              <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
                <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-2">
                  Admin Note
                </p>
                <p className="text-sm text-gray-700">{currentPreviewQ.admin_note}</p>
              </div>
            )}

            {/* ─── Admin Action Buttons ──────────────────────────────────── */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
              <Button
                size="sm"
                onClick={() => handleStatusUpdate(currentPreviewQ.id, "APPROVED")}
                disabled={statusLoading || currentPreviewQ.status === "APPROVED"}
              >
                <CheckCircle2 size={14} /> Approve
              </Button>
              <button
                onClick={() => handleStatusUpdate(currentPreviewQ.id, "REJECTED")}
                disabled={statusLoading || currentPreviewQ.status === "REJECTED"}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <XCircle size={14} /> Reject
              </button>
              <button
                onClick={() => setCorrectionNoteOpen(true)}
                disabled={statusLoading || currentPreviewQ.status === "CORRECTION"}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RotateCcw size={14} /> Send Back for Correction
              </button>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={previewIndex <= 0}
                  onClick={() => setPreviewIndex((i) => i - 1)}
                >
                  <ChevronLeft size={14} /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={previewIndex >= previewQuestions.length - 1}
                  onClick={() => setPreviewIndex((i) => i + 1)}
                >
                  Next <ChevronRight size={14} />
                </Button>
              </div>
              <span className="text-xs text-gray-400">
                {previewIndex + 1} of {previewQuestions.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewOpen(false)}
              >
                <X size={14} /> Close
              </Button>
            </div>
          </div>
        )}
      </Modal >

      {/* ─── Correction Note Modal ───────────────────────────────────── */}
      < Modal
        isOpen={correctionNoteOpen}
        onClose={() => {
          setCorrectionNoteOpen(false);
          setCorrectionNote("");
        }}
        title="Send Back for Correction"
      >
        <div className="space-y-4">
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <p className="text-sm text-orange-800 font-medium">
              Add notes about what needs to be corrected
            </p>
          </div>
          <Textarea
            label="Correction Notes"
            placeholder="Describe what needs to be corrected…"
            value={correctionNote}
            onChange={(e) => setCorrectionNote(e.target.value)}
            rows={4}
          />
          <div className="flex gap-2">
            <Button
              onClick={() => {
                if (currentPreviewQ) {
                  handleStatusUpdate(currentPreviewQ.id, "CORRECTION", correctionNote);
                }
              }}
              disabled={statusLoading || !correctionNote.trim()}
            >
              {statusLoading ? "Sending…" : "Send for Correction"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setCorrectionNoteOpen(false);
                setCorrectionNote("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal >
    </>
  );
}
