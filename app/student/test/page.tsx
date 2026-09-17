"use client";
import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";
import { QuestionOption } from "@/components/QuestionOption";
import { Clock, SkipForward, Flag } from "lucide-react";
import { API_URL, apiFetch } from "@/lib/api";

interface ContentBlock {
  text: string;
  image: string | null;
}
interface Question {
  question_id: number;
  question: ContentBlock;
  options: ContentBlock[];
}

function TestContent() {
  const router = useRouter();
  const params = useSearchParams();
  const groupId = params.get("groupId");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [testId, setTestId] = useState<number | null>(null);
  const [timeLimit, setTimeLimit] = useState(1200);
  const [timeLeft, setTimeLeft] = useState(1200);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Map<number, number>>(new Map());
  const [skipped, setSkipped] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const submittedRef = useRef(false);

  // Start test from group
  useEffect(() => {
    if (!groupId) return;
    const startTest = async () => {
      try {
        const res = await apiFetch(`${API_URL}/tests/start-from-group`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ test_group_id: parseInt(groupId) }),
        });
        if (!res.ok) throw new Error();
        const json = await res.json();
        const data = json.data;
        setQuestions(data.questions);
        setTestId(data.test_id);
        setTimeLimit(data.time_limit || 1200);
        setTimeLeft(data.time_limit || 1200);
      } catch {
        alert("Failed to start test. Please try again.");
        router.back();
      }
      setLoading(false);
    };
    startTest();
  }, [groupId, router]);

  // Enter fullscreen on mount
  useEffect(() => {
    if (!loading && questions.length > 0) {
      try { document.documentElement.requestFullscreen?.(); } catch {}
    }
  }, [loading, questions.length]);

  // Submit function
  const doSubmit = useCallback(async () => {
    if (submittedRef.current || !testId) return;
    submittedRef.current = true;
    setSubmitted(true);

    const answerArray = questions.map((q) => ({
      question_id: q.question_id,
      selected_option: answers.get(q.question_id) ?? -1,
    }));

    try {
      await apiFetch(`${API_URL}/tests/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ test_id: testId, answers: answerArray }),
      });
    } catch {}

    // Exit fullscreen
    try { document.exitFullscreen?.(); } catch {}
    router.push(`/student/test/result?testId=${testId}`);
  }, [testId, questions, answers, router]);

  // Beacon submit (for beforeunload)
  const beaconSubmit = useCallback(() => {
    if (submittedRef.current || !testId) return;
    submittedRef.current = true;

    const answerArray = questions.map((q) => ({
      question_id: q.question_id,
      selected_option: answers.get(q.question_id) ?? -1,
    }));

    navigator.sendBeacon(
      `${API_URL}/tests/beacon-submit`,
      JSON.stringify({ test_id: testId, answers: answerArray })
    );
  }, [testId, questions, answers]);

  // Auto-submit on fullscreen exit (STRICT)
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !submittedRef.current && !loading) {
        doSubmit();
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [doSubmit, loading]);

  // Auto-submit on tab switch
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && !submittedRef.current) {
        doSubmit();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [doSubmit]);

  // Beacon on beforeunload
  useEffect(() => {
    const handleUnload = () => beaconSubmit();
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [beaconSubmit]);

  // Timer
  useEffect(() => {
    if (loading || submitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          doSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, submitted, doSubmit]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  const handleSelect = (optIdx: number) => {
    if (submitted) return;
    const q = questions[current];
    setAnswers((prev) => new Map(prev).set(q.question_id, optIdx));
    // Remove from skipped if re-answered
    setSkipped((prev) => {
      const next = new Set(prev);
      next.delete(q.question_id);
      return next;
    });
  };

  const handleSkip = () => {
    const q = questions[current];
    if (!answers.has(q.question_id)) {
      setSkipped((prev) => new Set(prev).add(q.question_id));
    }
    setCurrent((c) => Math.min(questions.length - 1, c + 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Preparing your test…</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const question = questions[current];
  const answered = answers.size;
  const progress = (answered / questions.length) * 100;
  const isLowTime = timeLeft < 120;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-5 py-3 sticky top-0 z-20 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold ${
            isLowTime ? "bg-red-50 text-red-600 animate-pulse" : "bg-brand-50 text-brand-700"
          }`}>
            <Clock size={15} />
            {formatTime(timeLeft)}
          </div>

          <div className="flex-1 max-w-xs">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Q {current + 1} of {questions.length}</span>
              <span>{answered} answered • {skipped.size} skipped</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={doSubmit}>
            <Flag size={14} /> Submit
          </Button>
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 mb-5">
          <div className="flex items-start gap-4 mb-7">
            <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-brand-500 text-white flex items-center justify-center text-sm font-bold">
              {current + 1}
            </span>
            <div>
              <p className="text-gray-900 leading-relaxed text-base pt-1">
                {question.question.text}
              </p>
              {question.question.image && (
                <img
                  src={question.question.image}
                  alt="Question"
                  className="mt-3 max-h-48 rounded-lg"
                />
              )}
            </div>
          </div>

          <div className="space-y-3">
            {question.options.map((opt, idx) => (
              <QuestionOption
                key={idx}
                option={String.fromCharCode(65 + idx)}
                label={opt.text}
                isSelected={answers.get(question.question_id) === idx}
                onClick={() => handleSelect(idx)}
              />
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
          >
            Previous
          </Button>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              disabled={current === questions.length - 1}
            >
              <SkipForward size={14} /> Skip
            </Button>
            {current === questions.length - 1 ? (
              <Button onClick={doSubmit}>
                <Flag size={14} /> Submit Test
              </Button>
            ) : (
              <Button onClick={() => setCurrent((c) => c + 1)}>
                Next →
              </Button>
            )}
          </div>
        </div>

        {/* Question grid */}
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Question Navigator
          </p>
          <div className="flex flex-wrap gap-2">
            {questions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={[
                  "w-9 h-9 rounded-lg text-xs font-semibold transition-all",
                  current === idx
                    ? "bg-brand-500 text-white"
                    : answers.has(q.question_id)
                    ? "bg-brand-100 text-brand-700 border border-brand-200"
                    : skipped.has(q.question_id)
                    ? "bg-amber-100 text-amber-700 border border-amber-200"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200",
                ].join(" ")}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <div className="flex gap-4 mt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-brand-500 inline-block" /> Current
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-brand-100 border border-brand-200 inline-block" /> Answered
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-100 border border-amber-200 inline-block" /> Skipped
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-gray-100 inline-block" /> Unattempted
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestInterface() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <TestContent />
    </Suspense>
  );
}
