"use client";
import { useState } from "react";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Select } from "@/components/Select";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  CreditCard,
  User,
  LogOut,
  TrendingUp,
} from "lucide-react";

export default function TestSelection() {
  const [selectedClass, setSelectedClass] = useState("10");
  const [selectedSubject, setSelectedSubject] = useState("math");

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

  const classOptions = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: `Class ${i + 1}`,
  }));

  const subjectOptions = [
    { value: "math", label: "Mathematics" },
    { value: "english", label: "English" },
    { value: "science", label: "Science" },
    { value: "physics", label: "Physics" },
    { value: "chemistry", label: "Chemistry" },
    { value: "biology", label: "Biology" },
  ];

  const chapters = [
    { name: "Linear Equations", questions: 20, difficulty: "Medium" },
    { name: "Quadratic Equations", questions: 25, difficulty: "Hard" },
    { name: "Trigonometry", questions: 30, difficulty: "Medium" },
    { name: "Coordinate Geometry", questions: 20, difficulty: "Easy" },
    { name: "Statistics", questions: 15, difficulty: "Easy" },
    { name: "Probability", questions: 18, difficulty: "Medium" },
  ];

  const handleStartTest = (chapter: string) => {
    redirect("/student/test");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar items={sidebarItems} />

      <main className="lg:ml-64 p-4 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2 text-gray-900">Attempt Test</h1>
          <p className="text-gray-600">
            Select your class, subject, and chapter to begin
          </p>
        </div>

        {/* Selection Filters */}
        <Card className="mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <Select
              label="Select Class"
              options={classOptions}
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="text-gray-900"
            />
            <Select
              label="Select Subject"
              options={subjectOptions}
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="text-gray-900"
            />
          </div>
        </Card>

        {/* Chapters */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <h3 className="text-xl mb-2 text-gray-900">{chapter.name}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span>{chapter.questions} Questions</span>
                <span
                  className={`px-2 py-1 rounded ${
                    chapter.difficulty === "Easy"
                      ? "bg-green-100 text-green-700"
                      : chapter.difficulty === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {chapter.difficulty}
                </span>
              </div>
              <Button
                onClick={() => handleStartTest(chapter.name)}
                className="w-full"
              >
                Start Test
              </Button>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
