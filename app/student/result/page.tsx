import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  CreditCard,
  User,
  LogOut,
  TrendingUp,
} from "lucide-react";

export default function ResultsList() {
  const sidebarItems = [
    {
      label: "Dashboard",
      path: "/student",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Attempt Test",
      path: "/student/enrolled-tests",
      icon: <FileText size={20} />,
    },
    {
      label: "My Results",
      path: "/student/result",
      icon: <BarChart3 size={20} />,
    },
    {
      label: "Performance Analytics",
      path: "/student/analytics",
      icon: <TrendingUp size={20} />,
    },
    {
      label: "Subscription",
      path: "/student/subscription",
      icon: <CreditCard size={20} />,
    },
    { label: "Profile", path: "/profile", icon: <User size={20} /> },
    { label: "Logout", path: "/", icon: <LogOut size={20} /> },
  ];

  const results = [
    {
      subject: "Mathematics",
      chapter: "Linear Equations",
      score: 85,
      total: 20,
      date: "Feb 12, 2026",
      time: "18:45",
    },
    {
      subject: "English",
      chapter: "Comprehension",
      score: 72,
      total: 15,
      date: "Feb 10, 2026",
      time: "14:30",
    },
    {
      subject: "Physics",
      chapter: "Motion",
      score: 90,
      total: 25,
      date: "Feb 8, 2026",
      time: "22:15",
    },
    {
      subject: "Chemistry",
      chapter: "Periodic Table",
      score: 68,
      total: 20,
      date: "Feb 6, 2026",
      time: "16:20",
    },
    {
      subject: "Biology",
      chapter: "Cell Structure",
      score: 82,
      total: 18,
      date: "Feb 4, 2026",
      time: "19:05",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar items={sidebarItems} />

      <main className="lg:ml-64 p-4 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2 text-gray-900">My Results</h1>
          <p className="text-gray-600">
            View all your test results and performance
          </p>
        </div>

        <div className="space-y-4">
          {results.map((result, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl text-gray-900 mb-1">
                    {result.subject}
                  </h3>
                  <p className="text-gray-600 mb-2">{result.chapter}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>📅 {result.date}</span>
                    <span>⏱️ {result.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-3xl text-blue-600 mb-1">
                      {Math.round((result.score / result.total) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">
                      {result.score}/{result.total}
                    </div>
                  </div>
                  <Link href="/student/result">
                    <Button>View Details</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
