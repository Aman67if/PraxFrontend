"use client";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Select } from "@/components/Select";
import { Table } from "@/components/Table";
import { Modal } from "@/components/Modal";
import { PlusCircle, FileText, LogOut, Eye, Edit, Trash2 } from "lucide-react";

export default function ViewQuestions() {
  const [showPreview, setShowPreview] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");

  const sidebarItems = [
    {
      label: "Add Question",
      path: "/employee/question-entry",
      icon: <PlusCircle size={20} />,
    },
    {
      label: "View Questions",
      path: "/employee/view-questions",
      icon: <FileText size={20} />,
    },
    { label: "Logout", path: "/", icon: <LogOut size={20} /> },
  ];

  const classOptions = [
    { value: "all", label: "All Classes" },
    ...Array.from({ length: 12 }, (_, i) => ({
      value: String(i + 1),
      label: `Class ${i + 1}`,
    })),
  ];

  const subjectOptions = [
    { value: "all", label: "All Subjects" },
    { value: "math", label: "Mathematics" },
    { value: "english", label: "English" },
    { value: "science", label: "Science" },
    { value: "physics", label: "Physics" },
    { value: "chemistry", label: "Chemistry" },
    { value: "biology", label: "Biology" },
  ];

  const questions = [
    {
      id: 1,
      question: "What is the value of x in 2x + 5 = 15?",
      class: "10",
      subject: "Mathematics",
      chapter: "Linear Equations",
      difficulty: "Medium",
      date: "Feb 14, 2026",
    },
    {
      id: 2,
      question: "Which of the following is a prime number?",
      class: "10",
      subject: "Mathematics",
      chapter: "Number System",
      difficulty: "Easy",
      date: "Feb 14, 2026",
    },
    {
      id: 3,
      question: "What is the square root of 144?",
      class: "9",
      subject: "Mathematics",
      chapter: "Square Roots",
      difficulty: "Easy",
      date: "Feb 13, 2026",
    },
    {
      id: 4,
      question: "Solve the quadratic equation x² - 5x + 6 = 0",
      class: "10",
      subject: "Mathematics",
      chapter: "Quadratic Equations",
      difficulty: "Hard",
      date: "Feb 13, 2026",
    },
    {
      id: 5,
      question: "What is the derivative of x²?",
      class: "12",
      subject: "Mathematics",
      chapter: "Calculus",
      difficulty: "Medium",
      date: "Feb 12, 2026",
    },
  ];

  const handleView = (question: any) => {
    setSelectedQuestion(question);
    setShowPreview(true);
  };

  const columns = [
    {
      key: "question",
      header: "Question",
      render: (value: string) => (
        <div className="max-w-md truncate">{value}</div>
      ),
    },
    { key: "class", header: "Class" },
    { key: "subject", header: "Subject" },
    { key: "chapter", header: "Chapter" },
    {
      key: "difficulty",
      header: "Difficulty",
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            value === "Easy"
              ? "bg-green-100 text-green-700"
              : value === "Medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {value}
        </span>
      ),
    },
    { key: "date", header: "Date" },
    {
      key: "actions",
      header: "Actions",
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleView(row)}>
            <Eye size={16} />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit size={16} />
          </Button>
          <Button variant="ghost" size="sm">
            <Trash2 size={16} className="text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar items={sidebarItems} logo="Praxes Entry" />

      <main className="lg:ml-64 p-4 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2 text-gray-900">View Questions</h1>
          <p className="text-gray-600">Browse and manage all questions</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <Select
              label="Filter by Class"
              options={classOptions}
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="text-gray-900"
            />
            <Select
              label="Filter by Subject"
              options={subjectOptions}
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="text-gray-900"
            />
          </div>
        </Card>

        {/* Questions Table */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl text-gray-900">
              All Questions ({questions.length})
            </h2>
            <Button>Export to CSV</Button>
          </div>
          <Table columns={columns} data={questions} />
        </Card>
      </main>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Question Details"
      >
        {selectedQuestion && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm text-gray-600 mb-2">Question</h3>
              <p className="text-gray-900">{selectedQuestion.question}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm text-gray-600 mb-2">Class</h3>
                <p className="text-gray-900">Class {selectedQuestion.class}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-600 mb-2">Subject</h3>
                <p className="text-gray-900">{selectedQuestion.subject}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm text-gray-600 mb-2">Chapter</h3>
                <p className="text-gray-900">{selectedQuestion.chapter}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-600 mb-2">Difficulty</h3>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    selectedQuestion.difficulty === "Easy"
                      ? "bg-green-100 text-green-700"
                      : selectedQuestion.difficulty === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {selectedQuestion.difficulty}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-sm text-gray-600 mb-2">Date Added</h3>
              <p className="text-gray-900">{selectedQuestion.date}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
