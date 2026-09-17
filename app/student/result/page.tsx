"use client"
import Link from "next/link";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import {
  Calendar, Clock,
} from "lucide-react";

export default function ResultsList() {
  const results = [
    { subject: "Mathematics", chapter: "Linear Equations", score: 85, total: 20, date: "Feb 12, 2026", time: "18:45" },
    { subject: "English", chapter: "Comprehension", score: 72, total: 15, date: "Feb 10, 2026", time: "14:30" },
    { subject: "Physics", chapter: "Motion", score: 90, total: 25, date: "Feb 8, 2026", time: "22:15" },
    { subject: "Chemistry", chapter: "Periodic Table", score: 68, total: 20, date: "Feb 6, 2026", time: "16:20" },
    { subject: "Biology", chapter: "Cell Structure", score: 82, total: 18, date: "Feb 4, 2026", time: "19:05" },
  ];

  const getScoreColor = (pct: number) => {
    if (pct >= 80) return "text-brand-600";
    if (pct >= 65) return "text-yellow-600";
    return "text-orange-500";
  };

  return (
    <div className="p-5 lg:p-8">
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-gray-900">My Results</h1>
        <p className="text-sm text-gray-500 mt-1">All your test results and performance history</p>
      </div>

      <div className="space-y-3">
        {results.map((r, i) => {
          const pct = Math.round((r.score / r.total) * 100);
          return (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-brand-200 hover:shadow-md transition-all"
            >
              <div className="flex-1">
                <p className="font-semibold text-gray-900 mb-0.5">{r.subject}</p>
                <p className="text-sm text-gray-500 mb-3">{r.chapter}</p>
                <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} /> {r.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} /> {r.time}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getScoreColor(pct)}`}>{pct}%</div>
                  <div className="text-xs text-gray-400">{r.score}/{r.total} correct</div>
                </div>
                <Link href="/student/test/result">
                  <Button size="sm">View Details</Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
