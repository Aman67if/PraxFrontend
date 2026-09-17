"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { QuestionOption } from "@/components/QuestionOption";
import { API_URL, apiFetch } from "@/lib/api";

import {
  CheckCircle2,
  XCircle,
  Target,
  Award,
  ChevronDown,
  SkipForward,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Loader2,
} from "lucide-react";

interface ContentBlock {
  text: string;
  image: string | null;
}

interface BreakdownItem {
  question_id: number;
  question: ContentBlock;
  options: ContentBlock[];
  selected_option: number | null;
  correct_option: number;
  is_correct: boolean;
  explanation: ContentBlock;
}

interface TestResult {
  test_id: number;
  test_type: string;
  score: number;
  correct_count: number;
  incorrect_count: number;
  unattempted_count: number;
  total_questions: number;
  accuracy: number;
  submitted_at: string;
  breakdown: BreakdownItem[];
}

function ResultContent() {
  const params = useSearchParams();
  const testId = params.get("testId");

  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);
  const [reviewIdx, setReviewIdx] = useState(0);

  useEffect(() => {
    if (!testId) return;
    const fetchResult = async () => {
      try {
        const res = await apiFetch(`${API_URL}/tests/${testId}`,
          { credentials: "include" }
        );
        if (res.ok) {
          const json = await res.json();
          setResult(json.data);
        }
      } catch {}
      setLoading(false);
    };
    fetchResult();
  }, [testId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={24} className="animate-spin mx-auto mb-3 text-brand-500" />
          <p className="text-gray-500 text-sm">Loading results…</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center p-10">
          <p className="text-gray-500">Result not found.</p>
          <Link href="/student/enrolled-tests">
            <Button className="mt-4">Go to Tests</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const { correct_count, incorrect_count, unattempted_count, total_questions, accuracy, breakdown } = result;
  const attempted = correct_count + incorrect_count;
  const skippedCount = unattempted_count;
  // Accuracy based on attempted only
  const attemptedAccuracy = attempted > 0
    ? Math.round((correct_count / attempted) * 100)
    : 0;

  const summaryCards = [
    { label: "Total", value: total_questions, color: "text-gray-900", bg: "bg-gray-50 border-gray-100" },
    { label: "Correct", value: correct_count, color: "text-green-600", bg: "bg-green-50 border-green-100" },
    { label: "Incorrect", value: incorrect_count, color: "text-red-500", bg: "bg-red-50 border-red-100" },
    { label: "Skipped", value: skippedCount, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
    { label: "Accuracy", value: `${attemptedAccuracy}%`, color: "text-brand-600", bg: "bg-brand-50 border-brand-100" },
  ];

  // Check Answers Review mode
  if (showAnswers && breakdown.length > 0) {
    const item = breakdown[reviewIdx];
    const hasExplanation = item.explanation?.text?.trim();

    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="sm" onClick={() => setShowAnswers(false)}>
              <ArrowLeft size={16} /> Back to Results
            </Button>
            <span className="text-sm text-gray-500">
              Question {reviewIdx + 1} of {breakdown.length}
            </span>
          </div>

          <Card className="mb-5">
            <div className="flex items-start gap-4 mb-6">
              <span className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white ${
                item.is_correct ? "bg-green-500" : item.selected_option === null ? "bg-amber-500" : "bg-red-500"
              }`}>
                {reviewIdx + 1}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {item.is_correct ? (
                    <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
                      <CheckCircle2 size={13} /> Correct
                    </span>
                  ) : item.selected_option === null ? (
                    <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                      <SkipForward size={13} /> Skipped
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-red-500 flex items-center gap-1">
                      <XCircle size={13} /> Incorrect
                    </span>
                  )}
                </div>
                <p className="text-gray-900 leading-relaxed">{item.question.text}</p>
                {item.question.image && (
                  <img src={item.question.image} alt="Question" className="mt-3 max-h-48 rounded-lg" />
                )}
              </div>
            </div>

            <div className="space-y-2.5">
              {item.options.map((opt, oi) => (
                <QuestionOption
                  key={oi}
                  option={String.fromCharCode(65 + oi)}
                  label={opt.text}
                  isSelected={item.selected_option === oi}
                  onClick={() => {}}
                  showCorrect
                  isCorrect={oi === item.correct_option}
                />
              ))}
            </div>

            {/* Explanation — only if data exists */}
            {hasExplanation && (
              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <BookOpen size={12} /> Explanation
                </p>
                <div className="text-sm text-gray-700 bg-brand-50 rounded-lg p-4 border border-brand-100 leading-relaxed">
                  {item.explanation.text}
                  {item.explanation.image && (
                    <img src={item.explanation.image} alt="Explanation" className="mt-3 max-h-48 rounded-lg" />
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReviewIdx((i) => Math.max(0, i - 1))}
              disabled={reviewIdx === 0}
            >
              <ArrowLeft size={14} /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReviewIdx((i) => Math.min(breakdown.length - 1, i + 1))}
              disabled={reviewIdx === breakdown.length - 1}
            >
              Next <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Result Summary
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-2xl bg-brand-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-brand-500/25">
            <Award size={36} className="text-white" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Test Completed!
          </h1>
          <p className="text-gray-500">
            Here&apos;s a breakdown of your performance
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-7">
          {summaryCards.map((c, i) => (
            <div key={i} className={`rounded-xl border p-4 text-center ${c.bg}`}>
              <div className={`text-2xl font-bold mb-1 ${c.color}`}>{c.value}</div>
              <div className="text-xs text-gray-500">{c.label}</div>
            </div>
          ))}
        </div>

        {/* Performance summary */}
        <Card className="mb-7">
          <div className="flex items-center gap-2.5 mb-5">
            <Target size={18} className="text-brand-500" />
            <h2 className="font-semibold text-gray-900">Performance Summary</h2>
          </div>
          <div className="space-y-3 text-sm">
            {[
              ["Questions Attempted", `${attempted} / ${total_questions}`],
              ["Questions Skipped", skippedCount],
              ["Accuracy (of attempted)", `${attemptedAccuracy}%`],
            ].map(([label, value], i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            size="lg"
            variant="outline"
            onClick={() => setShowAnswers(true)}
          >
            <BookOpen size={16} /> Check Answers
          </Button>
          <Link href="/student/enrolled-tests">
            <Button size="lg">Attempt Another Test</Button>
          </Link>
          <Link href="/student">
            <Button variant="ghost" size="lg">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <ResultContent />
    </Suspense>
  );
}
