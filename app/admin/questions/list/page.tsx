"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/Card";
import { Table } from "@/components/Table";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { Textarea } from "@/components/Textarea";
import MathRenderer from "@/components/MathRenderer";
import { API_URL, apiFetch } from "@/lib/api";

import {
  Eye,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowLeft,
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

function QuestionListContent() {
  const searchParams = useSearchParams();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  // Preview
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [correctionNoteOpen, setCorrectionNoteOpen] = useState(false);
  const [correctionNote, setCorrectionNote] = useState("");

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const classLevel = searchParams.get("class_level");
      const subject = searchParams.get("subject");
      const chapter = searchParams.get("chapter");
      const topic = searchParams.get("topic");
      const month = searchParams.get("month");
      const employeeId = searchParams.get("employee_id");

      if (classLevel) params.set("class_level", classLevel);
      if (subject) params.set("subject", subject);
      if (chapter) params.set("chapter", chapter);
      if (topic) params.set("topic", topic);
      if (month) params.set("month", month);
      if (employeeId) params.set("employee_id", employeeId);
      params.set("limit", "200");

      const res = await apiFetch(`${API_URL}/questions/search?${params}`,
        { credentials: "include" }
      );
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch {
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

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
        fetchQuestions();
        const updated = await res.json();
        if (previewOpen && questions[previewIndex]?.id === questionId) {
          const newQ = [...questions];
          newQ[previewIndex] = updated.data;
          setQuestions(newQ);
        }
      }
    } catch {
    } finally {
      setStatusLoading(false);
      setCorrectionNoteOpen(false);
      setCorrectionNote("");
    }
  };

  const currentPreviewQ = questions[previewIndex] || null;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

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
      key: "status",
      header: "Status",
      render: (v: string) => (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle[v] ?? "bg-gray-100 text-gray-600"}`}>
          {v}
        </span>
      ),
    },
    {
      key: "creator",
      header: "Entered By",
      render: (_: any, row: Question) => <span className="text-sm text-gray-700">{row.creator?.name ?? "—"}</span>,
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
          onClick={() => {
            setPreviewIndex(questions.findIndex((q) => q.id === row.id));
            setPreviewOpen(true);
          }}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-brand-200 bg-brand-50 text-brand-600 hover:bg-brand-100 transition-all"
        >
          <Eye size={12} /> View
        </button>
      ),
    },
  ];

  return (
    <>
      <Navbar title="Filtered Questions" subtitle={!loading ? `${questions.length} question${questions.length !== 1 ? "s" : ""} found` : undefined} />

      <div className="p-5 lg:p-8">
        <div className="mb-5">
          <Button variant="outline" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft size={14} /> Back to Search
          </Button>
        </div>

        <Card>
          {loading && (
            <div className="py-12 text-center text-gray-400">
              <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm">Loading questions…</p>
            </div>
          )}

          {!loading && questions.length === 0 && (
            <div className="py-8 text-center text-gray-400 text-sm">
              No questions found matching the filters.
            </div>
          )}

          {!loading && questions.length > 0 && <Table columns={columns} data={questions} />}
        </Card>
      </div>

      {/* Preview Modal */}
      < Modal isOpen={previewOpen} onClose={() => setPreviewOpen(false)
      } title="Question Preview" >
        {currentPreviewQ && (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-gray-900 text-white font-bold">#{currentPreviewQ.id}</span>
              <span className="px-2.5 py-1 rounded-full bg-brand-100 text-brand-700 font-medium">Class {currentPreviewQ.class_level}</span>
              <span className="px-2.5 py-1 rounded-full bg-brand-100 text-brand-700 font-medium capitalize">{currentPreviewQ.subject}</span>
              {currentPreviewQ.chapter && <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">{currentPreviewQ.chapter}</span>}
              {currentPreviewQ.topic && <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">{currentPreviewQ.topic}</span>}
              <span className={`px-2.5 py-1 rounded-full font-medium ${statusStyle[currentPreviewQ.status] ?? "bg-gray-100 text-gray-600"}`}>{currentPreviewQ.status}</span>
            </div>

            <div className="text-xs text-gray-500">
              By <span className="font-medium text-gray-700">{currentPreviewQ.creator?.name}</span> on {formatDate(currentPreviewQ.created_at)}
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Question</p>
              <div className="text-gray-900 text-sm leading-relaxed"><MathRenderer content={currentPreviewQ.content?.question?.text || ""} /></div>
              {currentPreviewQ.content?.question?.image && <img src={currentPreviewQ.content.question.image} alt="question" className="mt-3 max-h-48 rounded-lg border border-gray-200" />}
            </div>

            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Options</p>
              {currentPreviewQ.content?.options?.map((opt, i) => (
                <div key={i} className={`flex items-start gap-3 p-3.5 rounded-xl border-2 ${currentPreviewQ.correct_option === i ? "border-brand-500 bg-brand-50" : "border-gray-100"}`}>
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${currentPreviewQ.correct_option === i ? "bg-brand-500 text-white" : "bg-gray-100 text-gray-500"}`}>{OPTION_LABELS[i]}</span>
                  <div className="text-sm text-gray-700 pt-0.5 flex-1"><MathRenderer content={opt.text} /></div>
                  {currentPreviewQ.correct_option === i && <span className="ml-auto text-xs text-brand-600 font-medium shrink-0">✓ Correct</span>}
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-brand-50 border border-brand-100">
              <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-2">Explanation</p>
              <div className="text-sm text-gray-700 leading-relaxed"><MathRenderer content={currentPreviewQ.content?.explanation?.text || ""} /></div>
            </div>

            {currentPreviewQ.admin_note && (
              <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
                <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-2">Admin Note</p>
                <p className="text-sm text-gray-700">{currentPreviewQ.admin_note}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
              <Button size="sm" onClick={() => handleStatusUpdate(currentPreviewQ.id, "APPROVED")} disabled={statusLoading || currentPreviewQ.status === "APPROVED"}>
                <CheckCircle2 size={14} /> Approve
              </Button>
              <button onClick={() => handleStatusUpdate(currentPreviewQ.id, "REJECTED")} disabled={statusLoading || currentPreviewQ.status === "REJECTED"} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <XCircle size={14} /> Reject
              </button>
              <button onClick={() => setCorrectionNoteOpen(true)} disabled={statusLoading || currentPreviewQ.status === "CORRECTION"} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <RotateCcw size={14} /> Send Back for Correction
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={previewIndex <= 0} onClick={() => setPreviewIndex((i) => i - 1)}>
                  <ChevronLeft size={14} /> Previous
                </Button>
                <Button variant="outline" size="sm" disabled={previewIndex >= questions.length - 1} onClick={() => setPreviewIndex((i) => i + 1)}>
                  Next <ChevronRight size={14} />
                </Button>
              </div>
              <span className="text-xs text-gray-400">{previewIndex + 1} of {questions.length}</span>
              <Button variant="outline" size="sm" onClick={() => setPreviewOpen(false)}>
                <X size={14} /> Close
              </Button>
            </div>
          </div>
        )}
      </Modal >

      {/* Correction Note Modal */}
      < Modal isOpen={correctionNoteOpen} onClose={() => { setCorrectionNoteOpen(false); setCorrectionNote(""); }} title="Send Back for Correction" >
        <div className="space-y-4">
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <p className="text-sm text-orange-800 font-medium">Add notes about what needs to be corrected</p>
          </div>
          <Textarea label="Correction Notes" placeholder="Describe what needs to be corrected…" value={correctionNote} onChange={(e) => setCorrectionNote(e.target.value)} rows={4} />
          <div className="flex gap-2">
            <Button onClick={() => { if (currentPreviewQ) handleStatusUpdate(currentPreviewQ.id, "CORRECTION", correctionNote); }} disabled={statusLoading || !correctionNote.trim()}>
              {statusLoading ? "Sending…" : "Send for Correction"}
            </Button>
            <Button variant="outline" onClick={() => { setCorrectionNoteOpen(false); setCorrectionNote(""); }}>Cancel</Button>
          </div>
        </div>
      </Modal >
    </>
  );
}

export default function AdminQuestionsList() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <QuestionListContent />
    </Suspense>
  );
}
