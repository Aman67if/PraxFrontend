"use client";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Textarea } from "@/components/Textarea";
import { Table } from "@/components/Table";
import { Modal } from "@/components/Modal";
import { PlusCircle, FileText, LogOut, Eye, Edit } from "lucide-react";

export default function DataEntry() {
  const [showPreview, setShowPreview] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);

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

  const questionTypeOptions = [
    { value: "mcq", label: "Multiple Choice (MCQ)" },
    { value: "true-false", label: "True / False" },
  ];

  const difficultyOptions = [
    { value: "1", label: "Easy (1)" },
    { value: "2", label: "Medium (2)" },
    { value: "3", label: "Hard (3)" },
  ];

  const correctOptionOptions = [
    { value: "A", label: "Option A" },
    { value: "B", label: "Option B" },
    { value: "C", label: "Option C" },
    { value: "D", label: "Option D" },
  ];

  const recentQuestions = [
    {
      question: "What is the value of x in 2x + 5 = 15?",
      difficulty: "Medium",
      date: "Feb 14, 2026",
    },
    {
      question: "Which is a prime number?",
      difficulty: "Easy",
      date: "Feb 14, 2026",
    },
    {
      question: "What is the square root of 144?",
      difficulty: "Easy",
      date: "Feb 13, 2026",
    },
    {
      question: "Solve the quadratic equation x² - 5x + 6 = 0",
      difficulty: "Hard",
      date: "Feb 13, 2026",
    },
    {
      question: "What is the derivative of x²?",
      difficulty: "Medium",
      date: "Feb 12, 2026",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Question submitted successfully!");
  };

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
    { key: "date", header: "Date Added" },
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
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar items={sidebarItems} logo="Praxes Entry" />

      <main className="lg:ml-64 p-4 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2 text-gray-900">Add Question</h1>
          <p className="text-gray-600">Enter question details and options</p>
        </div>

        {/* Add Question Form */}
        <Card className="mb-8">
          <form onSubmit={handleSubmit} className="space-y-6 text-gray-900">
            <div className="grid md:grid-cols-2 gap-6">
              <Select label="Select Class" options={classOptions} required />
              <Select
                label="Select Subject"
                options={subjectOptions}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Chapter Name"
                placeholder="e.g., Linear Equations"
                required
              />
              <Input label="Topic" placeholder="e.g., Solving for x" required />
            </div>

            <Select
              label="Question Type"
              options={questionTypeOptions}
              required
            />

            <Textarea
              label="Question"
              placeholder="Enter the question (LaTeX supported)"
              rows={3}
              required
            />

            <div className="grid md:grid-cols-2 gap-6">
              <Input label="Option A" placeholder="Enter option A" required />
              <Input label="Option B" placeholder="Enter option B" required />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input label="Option C" placeholder="Enter option C" required />
              <Input label="Option D" placeholder="Enter option D" required />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Select
                label="Correct Option"
                options={correctOptionOptions}
                required
              />
              <Select
                label="Difficulty Level"
                options={difficultyOptions}
                required
              />
            </div>

            <Textarea
              label="Explanation"
              placeholder="Provide a detailed explanation for the answer"
              rows={4}
              required
            />

            <div className="flex gap-4">
              <Button type="submit">Submit Question</Button>
              <Button type="button" variant="outline">
                Clear Form
              </Button>
            </div>
          </form>
        </Card>

        {/* Recent Questions */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl text-gray-900">Recent Questions</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
              >
                Previous 10
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next 10
              </Button>
            </div>
          </div>
          <Table columns={columns} data={recentQuestions} />
        </Card>
      </main>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Question Preview"
      >
        {selectedQuestion && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm text-gray-600 mb-2">Question</h3>
              <p className="text-gray-900">{selectedQuestion.question}</p>
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
