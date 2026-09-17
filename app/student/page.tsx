"use client";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import {
  FileText,
  Award, Target,
} from "lucide-react";

export default function StudentDashboard() {

  const stats = [
    { label: "Tests Attempted", value: "24", icon: <FileText size={22} className="text-brand-500" />, bg: "bg-brand-50" },
    { label: "Overall Accuracy", value: "78%", icon: <Target size={22} className="text-green-600" />, bg: "bg-green-50" },
    { label: "Current Streak", value: "7 days", icon: <Award size={22} className="text-orange-500" />, bg: "bg-orange-50" },
  ];

  const strengths = ["Algebra", "Grammar", "Physics"];
  const weaknesses = ["Geometry", "Vocabulary", "Chemistry"];

  const recentTests = [
    { subject: "Mathematics", chapter: "Linear Equations", score: "85%", date: "Feb 12, 2026" },
    { subject: "English", chapter: "Comprehension", score: "72%", date: "Feb 10, 2026" },
    { subject: "Physics", chapter: "Motion", score: "90%", date: "Feb 8, 2026" },
  ];

  return (
    <>
      <Navbar title="Dashboard" subtitle="Good morning — ready to practice?" />

        {/* CTA banner */}
        <div className="mb-7 rounded-2xl bg-brand-500 text-white px-7 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-lg">Ready for today's test?</p>
            <p className="text-white/70 text-sm mt-0.5">Keep your streak going — pick up where you left off</p>
          </div>
          <Link href="/student/enrolled-tests">
            <button className="flex-shrink-0 bg-white text-brand-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-50 transition-colors">
              Start a Test →
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {stats.map((stat, i) => (
            <Card key={i}>
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card>
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-500 inline-block" />
              Your Strengths
            </h2>
            <div className="space-y-2.5">
              {strengths.map((topic, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                  <span className="text-gray-700">{topic}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
              Areas to Improve
            </h2>
            <div className="space-y-2.5">
              {weaknesses.map((topic, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  <span className="text-gray-700">{topic}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Tests */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900">Recent Tests</h2>
            <Link href="/student/result">
              <span className="text-sm text-brand-600 hover:text-brand-700 font-medium">View all →</span>
            </Link>
          </div>
          <div className="space-y-3">
            {recentTests.map((test, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-brand-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{test.subject}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{test.chapter}</p>
                </div>
                <div className="flex items-center gap-5">
                  <span className="text-xs text-gray-400">{test.date}</span>
                  <span className="text-base font-semibold text-brand-600">{test.score}</span>
                  <Link href="/student/test/result">
                    <Button variant="ghost" size="sm" className="text-xs">View</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
    </>
  );
}
