"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Select } from "@/components/Select";
import { Textarea } from "@/components/Textarea";
import { useCurriculum } from "@/hooks/useCurriculum";
import { API_URL, apiFetch } from "@/lib/api";

import {
  AlertTriangle,
  XCircle,
  CheckCircle2,
  ImageIcon,
  X,
  ArrowLeft,
} from "lucide-react";

interface QuestionContent {
  question: { text: string; image: string | null };
  options: { text: string; image: string | null }[];
  explanation: { text: string; image: string | null };
}

const OPTION_LABELS = ["A", "B", "C", "D"];
const DIFFICULTIES = [
  { value: "EASY", label: "Easy" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD", label: "Hard" },
];

function ImageUploader({ label, imageUrl, onChange }: { label: string; imageUrl: string | null; onChange: (url: string | null) => void }) {
  const [uploading, setUploading] = useState(false);
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await apiFetch(`${API_URL}/upload/image`, { method: "POST", credentials: "include", body: form });
      if (!res.ok) throw new Error();
      const data = await res.json();
      onChange(data.url);
    } catch { alert("Image upload failed."); } finally { setUploading(false); }
  };
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-2">{label}</p>
      {imageUrl ? (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-brand-200 bg-brand-50">
          <img src={imageUrl} alt="uploaded" className="w-12 h-12 object-cover rounded-lg border border-brand-100" />
          <div className="flex-1 text-xs text-gray-500 truncate">{imageUrl}</div>
          <button type="button" onClick={() => onChange(null)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"><X size={14} /></button>
        </div>
      ) : (
        <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-gray-300 bg-gray-50 hover:border-brand-400 hover:bg-brand-50 cursor-pointer transition-all text-sm text-gray-500">
          {uploading ? (<><span className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /> Uploading…</>) : (<><ImageIcon size={15} className="text-gray-400" /> Add image (optional)</>)}
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      )}
    </div>
  );
}

export default function EditRejectedQuestion() {
  const router = useRouter();
  const params = useParams();
  const questionId = parseInt(params.id as string);
  const curriculum = useCurriculum();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [correctOption, setCorrectOption] = useState(0);
  const [content, setContent] = useState<QuestionContent>({
    question: { text: "", image: null },
    options: [{ text: "", image: null }, { text: "", image: null }, { text: "", image: null }, { text: "", image: null }],
    explanation: { text: "", image: null },
  });

  useEffect(() => {
    if (!questionId) return;
    setLoading(true);
    apiFetch(`${API_URL}/questions/${questionId}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const q = data.data;
        if (q) {
          setSelectedClass(String(q.class_level));
          setSelectedSubject(q.subject);
          setSelectedChapter(q.chapter);
          setSelectedTopic(q.topic || "");
          setDifficulty(q.difficulty);
          setCorrectOption(q.correct_option);
          setContent(q.content);
        }
      })
      .catch(() => setSubmitError("Failed to load question data."))
      .finally(() => setLoading(false));
  }, [questionId]);

  const curriculumSubjects = selectedClass ? curriculum.getSubjects(parseInt(selectedClass)) : [];
  const curriculumChapters = selectedClass && selectedSubject ? curriculum.getChapters(parseInt(selectedClass), selectedSubject) : [];
  const curriculumTopics = selectedClass && selectedSubject && selectedChapter ? curriculum.getTopics(parseInt(selectedClass), selectedSubject, selectedChapter) : [];

  const updateQuestionText = (text: string) => setContent((p) => ({ ...p, question: { ...p.question, text } }));
  const updateQuestionImage = (image: string | null) => setContent((p) => ({ ...p, question: { ...p.question, image } }));
  const updateOptionText = (i: number, text: string) => setContent((p) => { const opts = [...p.options]; opts[i] = { ...opts[i], text }; return { ...p, options: opts }; });
  const updateOptionImage = (i: number, image: string | null) => setContent((p) => { const opts = [...p.options]; opts[i] = { ...opts[i], image }; return { ...p, options: opts }; });
  const updateExplanationText = (text: string) => setContent((p) => ({ ...p, explanation: { ...p.explanation, text } }));
  const updateExplanationImage = (image: string | null) => setContent((p) => ({ ...p, explanation: { ...p.explanation, image } }));

  const isFormValid = content.question.text.trim() && content.options.every((o) => o.text.trim()) && content.explanation.text.trim() && selectedChapter.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await apiFetch(`${API_URL}/questions/${questionId}/edit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ class_level: parseInt(selectedClass), subject: selectedSubject, chapter: selectedChapter, topic: selectedTopic, difficulty, correct_option: correctOption, content }),
      });
      const data = await res.json();
      if (!res.ok) { setSubmitError(data.message || "Failed to update."); return; }
      setSubmitSuccess(true);
      setTimeout(() => router.push("/employee/rejections"), 1500);
    } catch { setSubmitError("Unable to connect to server."); } finally { setSubmitting(false); }
  };

  return (
    <>
      <Navbar title={`Edit Rejected Question #${questionId}`} subtitle="Fix and resubmit for review" />
      <div className="p-5 lg:p-8">
        <div className="mb-5"><Button variant="outline" size="sm" onClick={() => router.back()}><ArrowLeft size={14} /> Back</Button></div>

        {loading && <div className="py-12 text-center text-gray-400"><div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" /><p className="text-sm">Loading question…</p></div>}

        {!loading && (
          <>
            {submitSuccess && <div className="mb-6 px-4 py-3 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center gap-2.5 text-sm font-medium"><CheckCircle2 size={16} className="text-brand-500" /> Question updated and resubmitted!</div>}
            {submitError && <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{submitError}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Card>
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><div className="w-1 h-4 rounded-full bg-brand-500" /> Classification</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Select label="Class" options={Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: `Class ${i + 1}` }))} value={selectedClass} onChange={(e) => { setSelectedClass(e.target.value); setSelectedSubject(""); setSelectedChapter(""); setSelectedTopic(""); }} />
                  <Select label="Subject" options={[{ value: "", label: "Select subject" }, ...curriculumSubjects.map((s) => ({ value: s, label: s }))]} value={selectedSubject} onChange={(e) => { setSelectedSubject(e.target.value); setSelectedChapter(""); setSelectedTopic(""); }} />
                  <Select label="Chapter" options={[{ value: "", label: "Select chapter" }, ...curriculumChapters.map((c) => ({ value: c, label: c }))]} value={selectedChapter} onChange={(e) => { setSelectedChapter(e.target.value); setSelectedTopic(""); }} />
                  <Select label="Topic" options={[{ value: "", label: "Select topic" }, ...curriculumTopics.map((t) => ({ value: t, label: t }))]} value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)} />
                </div>
                <div className="mt-4 max-w-xs"><Select label="Difficulty" options={DIFFICULTIES} value={difficulty} onChange={(e) => setDifficulty(e.target.value)} /></div>
              </Card>

              <Card>
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><div className="w-1 h-4 rounded-full bg-brand-500" /> Question</h2>
                <div className="space-y-3">
                  <Textarea label="Question text" placeholder="e.g. Solve: $x^2 + 5x + 6 = 0$" value={content.question.text} onChange={(e) => updateQuestionText(e.target.value)} rows={3} required />
                  <ImageUploader label="Question image" imageUrl={content.question.image} onChange={updateQuestionImage} />
                </div>
              </Card>

              <Card>
                <h2 className="font-semibold text-gray-900 mb-2 flex items-center gap-2"><div className="w-1 h-4 rounded-full bg-brand-500" /> Answer Options</h2>
                <p className="text-xs text-gray-500 mb-5">Select the correct option</p>
                <div className="space-y-5">
                  {content.options.map((option, i) => (
                    <div key={i} className={`p-4 rounded-xl border-2 transition-all ${correctOption === i ? "border-brand-500 bg-brand-50" : "border-gray-100 bg-gray-50"}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <input type="radio" name="correct_option" checked={correctOption === i} onChange={() => setCorrectOption(i)} className="w-4 h-4 accent-brand-500 cursor-pointer" />
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${correctOption === i ? "bg-brand-500 text-white" : "bg-gray-200 text-gray-600"}`}>{OPTION_LABELS[i]}</span>
                        {correctOption === i && <span className="text-xs font-semibold text-brand-600 flex items-center gap-1"><CheckCircle2 size={12} /> Correct</span>}
                      </div>
                      <Textarea placeholder={`Option ${OPTION_LABELS[i]}`} value={option.text} onChange={(e) => updateOptionText(i, e.target.value)} rows={2} required />
                      <div className="mt-3"><ImageUploader label={`Option ${OPTION_LABELS[i]} image`} imageUrl={option.image} onChange={(url) => updateOptionImage(i, url)} /></div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><div className="w-1 h-4 rounded-full bg-brand-500" /> Explanation</h2>
                <div className="space-y-3">
                  <Textarea label="Explanation text" placeholder="Provide a detailed explanation…" value={content.explanation.text} onChange={(e) => updateExplanationText(e.target.value)} rows={4} required />
                  <ImageUploader label="Explanation image" imageUrl={content.explanation.image} onChange={updateExplanationImage} />
                </div>
              </Card>

              <div className="flex items-center gap-3 pb-4">
                <Button type="submit" size="lg" disabled={!isFormValid || submitting}>
                  {submitting ? (<><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting…</>) : (<><CheckCircle2 size={16} /> Resubmit Question</>)}
                </Button>
                <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>Cancel</Button>
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
}
