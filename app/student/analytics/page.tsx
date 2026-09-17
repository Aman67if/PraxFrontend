"use client"
import { Card } from "@/components/Card";
import {
  TrendingUp, TrendingDown,
} from "lucide-react";

export default function Analytics() {
  const weekData = [
    { date: "Feb 8", accuracy: 75 },
    { date: "Feb 9", accuracy: 78 },
    { date: "Feb 10", accuracy: 72 },
    { date: "Feb 11", accuracy: 82 },
    { date: "Feb 12", accuracy: 85 },
    { date: "Feb 13", accuracy: 80 },
    { date: "Feb 14", accuracy: 88 },
  ];

  const topicPerformance = [
    { topic: "Linear Equations", accuracy: 92, trend: "up" },
    { topic: "Quadratic Equations", accuracy: 85, trend: "up" },
    { topic: "Trigonometry", accuracy: 78, trend: "up" },
    { topic: "Coordinate Geometry", accuracy: 72, trend: "down" },
    { topic: "Statistics", accuracy: 65, trend: "down" },
    { topic: "Probability", accuracy: 58, trend: "down" },
  ];

  const subjectStats = [
    { subject: "Mathematics", tests: 12, avg: 81 },
    { subject: "English", tests: 8, avg: 74 },
    { subject: "Science", tests: 10, avg: 79 },
    { subject: "Physics", tests: 6, avg: 88 },
  ];

  const getBarColor = (pct: number) => {
    if (pct >= 80) return "bg-brand-500";
    if (pct >= 65) return "bg-yellow-400";
    return "bg-orange-400";
  };

  const maxWeekAcc = Math.max(...weekData.map((d) => d.accuracy));

  return (
    <div className="p-5 lg:p-8">
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-gray-900">Performance Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Track your progress and spot areas for improvement</p>
      </div>

      {/* Weekly trend — bar chart */}
      <Card className="mb-6">
        <h2 className="font-semibold text-gray-900 mb-5">Accuracy Trend — Last 7 Days</h2>
        <div className="flex items-end gap-2 h-40">
          {weekData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-500 font-medium">{d.accuracy}%</span>
              <div
                className="w-full rounded-t-md bg-brand-500 transition-all"
                style={{ height: `${(d.accuracy / maxWeekAcc) * 100}%`, minHeight: "8px" }}
              />
              <span className="text-[10px] text-gray-400">{d.date.split(" ")[1]}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Subject stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {subjectStats.map((s, i) => (
          <Card key={i}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{s.subject}</p>
            <p className="text-2xl font-bold text-brand-600 mb-0.5">{s.avg}%</p>
            <p className="text-xs text-gray-400">{s.tests} tests attempted</p>
          </Card>
        ))}
      </div>

      {/* Topic-wise */}
      <Card>
        <h2 className="font-semibold text-gray-900 mb-6">Topic-wise Performance</h2>
        <div className="space-y-5">
          {topicPerformance.map((item, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {item.trend === "up"
                    ? <TrendingUp size={14} className="text-brand-500" />
                    : <TrendingDown size={14} className="text-orange-400" />}
                  <span className="text-sm text-gray-700">{item.topic}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{item.accuracy}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${getBarColor(item.accuracy)}`}
                  style={{ width: `${item.accuracy}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
