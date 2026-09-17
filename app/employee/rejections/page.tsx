"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/Card";
import { Table } from "@/components/Table";
import { Select } from "@/components/Select";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import MathRenderer from "@/components/MathRenderer";
import { API_URL, apiFetch } from "@/lib/api";

import {
  XCircle,
  Eye,
  Pencil,
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
  content: {
    question: { text: string; image: string | null };
    options: { text: string; image: string | null }[];
    explanation: { text: string; image: string | null };
  };
  creator: { id: number; name: string };
}

const OPTION_LABELS = ["A", "B", "C", "D"];

const statusStyle: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-600",
  CORRECTION: "bg-orange-100 text-orange-700",
};

export default function EmployeeRejections() {
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterClass, setFilterClass] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterChapter, setFilterChapter] = useState("");
  const [filterTopic, setFilterTopic] = useState("");

  const [curriculumClasses, setCurriculumClasses] = useState<number[]>([]);
  const [curriculumSubjects, setCurriculumSubjects] = useState<string[]>([]);
  const [curriculumChapters, setCurriculumChapters] = useState<string[]>([]);
  const [curriculumTopics, setCurriculumTopics] = useState<string[]>([]);

  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    apiFetch(`${API_URL}/curriculum/classes`, { credentials: "include" })
      .then((res) => res.json()).then((data) => setCurriculumClasses(data.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!filterClass) { setCurriculumSubjects([]); return; }
    apiFetch(`${API_URL}/curriculum/subjects?class=${filterClass}`, { credentials: "include" })
      .then((res) => res.json()).then((data) => setCurriculumSubjects(data.data || [])).catch(() => {});
  }, [filterClass]);

  useEffect(() => {
    if (!filterClass || !filterSubject) { setCurriculumChapters([]); return; }
    apiFetch(`${API_URL}/curriculum/chapters?class=${filterClass}&subject=${filterSubject}`, { credentials: "include" })
      .then((res) => res.json()).then((data) => setCurriculumChapters(data.data || [])).catch(() => {});
  }, [filterClass, filterSubject]);

  useEffect(() => {
    if (!filterClass || !filterSubject || !filterChapter) { setCurriculumTopics([]); return; }
    apiFetch(`${API_URL}/curriculum/topics?class=${filterClass}&subject=${filterSubject}&chapter=${filterChapter}`, { credentials: "include" })
      .then((res) => res.json()).then((data) => setCurriculumTopics(data.data || [])).catch(() => {});
  }, [filterClass, filterSubject, filterChapter]);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterClass) params.set("class_level", filterClass);
      if (filterSubject) params.set("subject", filterSubject);
      if (filterChapter) params.set("chapter", filterChapter);
      if (filterTopic) params.set("topic", filterTopic);
      const res = await apiFetch(`${API_URL}/questions/my/rejections?${params}`, { credentials: "include" });
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch { setQuestions([]); } finally { setLoading(false); }
  }, [filterClass, filterSubject, filterChapter, filterTopic]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const currentPreviewQ = questions[previewIndex] || null;
  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const columns = [
    { key: "id", header: "ID", render: (v: number) => <span className="font-mono text-brand-600 font-semibold">#{v}</span> },
    { key: "content", header: "Question", render: (_: any, row: Question) => <p className="text-gray-800 text-sm line-clamp-2 max-w-xs">{row.content?.question?.text ?? "—"}</p> },
    { key: "class_level", header: "Class", render: (v: number) => `Class ${v}` },
    { key: "subject", header: "Subject", render: (v: string) => <span className="capitalize">{v}</span> },
    { key: "created_at", header: "Entry Date", render: (v: string) => formatDate(v) },
    {
      key: "actions", header: "Actions",
      render: (_: any, row: Question) => (
        <div className="flex items-center gap-1.5">
          <button onClick={() => { setPreviewIndex(questions.findIndex((q) => q.id === row.id)); setPreviewOpen(true); }} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-brand-200 bg-brand-50 text-brand-600 hover:bg-brand-100 transition-all"><Eye size={12} /> Preview</button>
          <button onClick={() => router.push(`/employee/rejections/${row.id}/edit`)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-all"><Pencil size={12} /> Edit</button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Navbar title="Rejections" subtitle="Questions that were rejected by admin" />
      <div className="p-5 lg:p-8">
        <Card>
          <div className="flex flex-wrap items-end gap-4 mb-6">
            <div className="w-40"><Select label="Class" options={[{ value: "", label: "All" }, ...curriculumClasses.map((c) => ({ value: String(c), label: `Class ${c}` }))]} value={filterClass} onChange={(e) => { setFilterClass(e.target.value); setFilterSubject(""); setFilterChapter(""); setFilterTopic(""); }} /></div>
            <div className="w-44"><Select label="Subject" options={[{ value: "", label: "All" }, ...curriculumSubjects.map((s) => ({ value: s, label: s }))]} value={filterSubject} onChange={(e) => { setFilterSubject(e.target.value); setFilterChapter(""); setFilterTopic(""); }} /></div>
            <div className="w-44"><Select label="Chapter" options={[{ value: "", label: "All" }, ...curriculumChapters.map((c) => ({ value: c, label: c }))]} value={filterChapter} onChange={(e) => { setFilterChapter(e.target.value); setFilterTopic(""); }} /></div>
            <div className="w-44"><Select label="Topic" options={[{ value: "", label: "All" }, ...curriculumTopics.map((t) => ({ value: t, label: t }))]} value={filterTopic} onChange={(e) => setFilterTopic(e.target.value)} /></div>
          </div>

          {loading && <div className="py-12 text-center text-gray-400"><div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" /><p className="text-sm">Loading rejected questions…</p></div>}
          {!loading && questions.length === 0 && <div className="py-12 text-center text-gray-400 text-sm">No rejected questions.</div>}
          {!loading && questions.length > 0 && <Table columns={columns} data={questions} />}
        </Card>
      </div>

      <Modal isOpen={previewOpen} onClose={() => setPreviewOpen(false)} title="Question Preview">
        {currentPreviewQ && (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-gray-900 text-white font-bold">#{currentPreviewQ.id}</span>
              <span className="px-2.5 py-1 rounded-full bg-brand-100 text-brand-700 font-medium">Class {currentPreviewQ.class_level}</span>
              <span className="px-2.5 py-1 rounded-full bg-brand-100 text-brand-700 font-medium capitalize">{currentPreviewQ.subject}</span>
              <span className={`px-2.5 py-1 rounded-full font-medium ${statusStyle[currentPreviewQ.status]}`}>{currentPreviewQ.status}</span>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Question</p>
              <div className="text-gray-900 text-sm"><MathRenderer content={currentPreviewQ.content?.question?.text || ""} /></div>
              {currentPreviewQ.content?.question?.image && <img src={currentPreviewQ.content.question.image} alt="question" className="mt-3 max-h-48 rounded-lg" />}
            </div>

            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Options</p>
              {currentPreviewQ.content?.options?.map((opt, i) => (
                <div key={i} className={`flex items-start gap-3 p-3.5 rounded-xl border-2 ${currentPreviewQ.correct_option === i ? "border-brand-500 bg-brand-50" : "border-gray-100"}`}>
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${currentPreviewQ.correct_option === i ? "bg-brand-500 text-white" : "bg-gray-100 text-gray-500"}`}>{OPTION_LABELS[i]}</span>
                  <div className="text-sm text-gray-700 pt-0.5"><MathRenderer content={opt.text} /></div>
                  {currentPreviewQ.correct_option === i && <span className="ml-auto text-xs text-brand-600 font-medium shrink-0">✓ Correct</span>}
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-brand-50 border border-brand-100">
              <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-2">Explanation</p>
              <div className="text-sm text-gray-700"><MathRenderer content={currentPreviewQ.content?.explanation?.text || ""} /></div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={previewIndex <= 0} onClick={() => setPreviewIndex((i) => i - 1)}><ChevronLeft size={14} /> Previous</Button>
                <Button variant="outline" size="sm" disabled={previewIndex >= questions.length - 1} onClick={() => setPreviewIndex((i) => i + 1)}>Next <ChevronRight size={14} /></Button>
              </div>
              <Button variant="outline" size="sm" onClick={() => setPreviewOpen(false)}><X size={14} /> Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
