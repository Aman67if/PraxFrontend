"use client";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Textarea } from "@/components/Textarea";
import { Modal } from "@/components/Modal";
import MathRenderer from "@/components/MathRenderer";
import { useCurriculum } from "@/hooks/useCurriculum";
import { API_URL, apiFetch } from "@/lib/api";

import { 
  Eye,
  CheckCircle2,
  ImageIcon,
  X,
  Plus,
  Minus,
  Search,
  AlertTriangle,
  XCircle,
} from "lucide-react";

interface QuestionContent {
  question: { text: string; image: string | null };
  options: { text: string; image: string | null }[];
  explanation: { text: string; image: string | null };
}

const defaultContent: QuestionContent = {
  question: { text: "", image: null },
  options: [
    { text: "", image: null },
    { text: "", image: null },
    { text: "", image: null },
    { text: "", image: null },
  ],
  explanation: { text: "", image: null },
};

const CLASSES = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: `Class ${i + 1}`,
}));

const SUBJECTS: Record<string, { value: string; label: string }[]> = {
  "1": [
    { value: "math", label: "Mathematics" },
    { value: "english", label: "English" },
    { value: "evs", label: "EVS" },
  ],
  "2": [
    { value: "math", label: "Mathematics" },
    { value: "english", label: "English" },
    { value: "evs", label: "EVS" },
  ],
  "3": [
    { value: "math", label: "Mathematics" },
    { value: "english", label: "English" },
    { value: "evs", label: "EVS" },
  ],
  "4": [
    { value: "math", label: "Mathematics" },
    { value: "english", label: "English" },
    { value: "evs", label: "EVS" },
  ],
  "5": [
    { value: "math", label: "Mathematics" },
    { value: "english", label: "English" },
    { value: "evs", label: "EVS" },
  ],
  "6": [
    { value: "math", label: "Mathematics" },
    { value: "english", label: "English" },
    { value: "science", label: "Science" },
    { value: "social", label: "Social Studies" },
  ],
  "7": [
    { value: "math", label: "Mathematics" },
    { value: "english", label: "English" },
    { value: "science", label: "Science" },
    { value: "social", label: "Social Studies" },
  ],
  "8": [
    { value: "math", label: "Mathematics" },
    { value: "english", label: "English" },
    { value: "science", label: "Science" },
    { value: "social", label: "Social Studies" },
  ],
  "9": [
    { value: "math", label: "Mathematics" },
    { value: "english", label: "English" },
    { value: "science", label: "Science" },
  ],
  "10": [
    { value: "math", label: "Mathematics" },
    { value: "english", label: "English" },
    { value: "science", label: "Science" },
  ],
  "11": [
    { value: "math", label: "Mathematics" },
    { value: "physics", label: "Physics" },
    { value: "chemistry", label: "Chemistry" },
    { value: "biology", label: "Biology" },
    { value: "english", label: "English" },
  ],
  "12": [
    { value: "math", label: "Mathematics" },
    { value: "physics", label: "Physics" },
    { value: "chemistry", label: "Chemistry" },
    { value: "biology", label: "Biology" },
    { value: "english", label: "English" },
  ],
};

const DIFFICULTIES = [
  { value: "EASY", label: "Easy" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD", label: "Hard" },
];

const OPTION_LABELS = ["A", "B", "C", "D"];

function ImageUploader({
  label,
  imageUrl,
  onChange,
}: {
  label: string;
  imageUrl: string | null;
  onChange: (url: string | null) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await apiFetch(`${API_URL}/upload/image`, {
        method: "POST",
        credentials: "include",
        body: form,
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      onChange(data.url);
    } catch {
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-2">{label}</p>
      {imageUrl ? (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-brand-200 bg-brand-50">
          <img
            src={imageUrl}
            alt="uploaded"
            className="w-12 h-12 object-cover rounded-lg border border-brand-100"
          />
          <div className="flex-1 text-xs text-gray-500 truncate">
            {imageUrl}
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-gray-300 bg-gray-50 hover:border-brand-400 hover:bg-brand-50 cursor-pointer transition-all text-sm text-gray-500">
          {uploading ? (
            <>
              <span className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />{" "}
              Uploading…
            </>
          ) : (
            <>
              <ImageIcon size={15} className="text-gray-400" /> Add image
              (optional)
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
}

export default function QuestionEntry() {
  const curriculum = useCurriculum();

  const [selectedClass, setSelectedClass] = useState("10");
  const [selectedSubject, setSelectedSubject] = useState("math");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [difficulty, setDifficulty] = useState("EASY");
  const [correctOption, setCorrectOption] = useState<number>(0);
  const [content, setContent] = useState<QuestionContent>(defaultContent);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  const curriculumSubjects = selectedClass ? curriculum.getSubjects(parseInt(selectedClass)) : [];
  const curriculumChapters = selectedClass && selectedSubject
    ? curriculum.getChapters(parseInt(selectedClass), selectedSubject) : [];
  const curriculumTopics = selectedClass && selectedSubject && selectedChapter
    ? curriculum.getTopics(parseInt(selectedClass), selectedSubject, selectedChapter) : [];

  const updateQuestionText = (text: string) =>
    setContent((p) => ({ ...p, question: { ...p.question, text } }));

  const updateQuestionImage = (image: string | null) =>
    setContent((p) => ({ ...p, question: { ...p.question, image } }));

  const updateOptionText = (i: number, text: string) =>
    setContent((p) => {
      const opts = [...p.options];
      opts[i] = { ...opts[i], text };
      return { ...p, options: opts };
    });

  const updateOptionImage = (i: number, image: string | null) =>
    setContent((p) => {
      const opts = [...p.options];
      opts[i] = { ...opts[i], image };
      return { ...p, options: opts };
    });

  const updateExplanationText = (text: string) =>
    setContent((p) => ({ ...p, explanation: { ...p.explanation, text } }));

  const updateExplanationImage = (image: string | null) =>
    setContent((p) => ({ ...p, explanation: { ...p.explanation, image } }));

  const isFormValid =
    content.question.text.trim() &&
    content.options.every((o) => o.text.trim()) &&
    content.explanation.text.trim() &&
    selectedChapter.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await apiFetch(`${API_URL}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          class_level: parseInt(selectedClass, 10),
          subject: selectedSubject,
          chapter: selectedChapter,
          topic: selectedTopic,
          difficulty,
          correct_option: correctOption,
          content,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.message || "Failed to submit.");
        return;
      }
      setSubmitSuccess(true);
      setContent(defaultContent);
      setSelectedChapter("");
      setSelectedTopic("");
      setCorrectOption(0);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch {
      setSubmitError("Unable to connect to server.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setContent(defaultContent);
    setSelectedChapter("");
    setSelectedTopic("");
    setCorrectOption(0);
  };

  return (
    <>
      <Navbar title="Add Question" subtitle="Create new questions for the platform" />

      <div className="p-5 lg:p-8">
        <div className="mb-5 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewOpen(true)}
          >
            <Eye size={14} /> Preview
          </Button>
        </div>

        {submitSuccess && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center gap-2.5 text-sm font-medium">
            <CheckCircle2 size={16} className="text-brand-500" />
            Question submitted successfully!
          </div>
        )}
        {submitError && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Classification */}
          <Card>
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-brand-500" />
              Classification
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select
                label="Class"
                options={CLASSES}
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setSelectedSubject(
                    SUBJECTS[e.target.value]?.[0]?.value ?? "",
                  );
                }}
              />
              <Select
                label="Subject"
                options={[{ value: "", label: "Select subject" }, ...curriculumSubjects.map((s) => ({ value: s, label: s }))]}
                value={selectedSubject}
                onChange={(e) => { setSelectedSubject(e.target.value); setSelectedChapter(""); setSelectedTopic(""); }}
              />
              <Select
                label="Chapter"
                options={[{ value: "", label: "Select chapter" }, ...curriculumChapters.map((c) => ({ value: c, label: c }))]}
                value={selectedChapter}
                onChange={(e) => { setSelectedChapter(e.target.value); setSelectedTopic(""); }}
              />
              <Select
                label="Topic"
                options={[{ value: "", label: "Select topic" }, ...curriculumTopics.map((t) => ({ value: t, label: t }))]}
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
              />
            </div>
            <div className="mt-4 max-w-xs">
              <Select
                label="Difficulty"
                options={DIFFICULTIES}
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              />
            </div>
          </Card>

          {/* Question */}
          <Card>
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-brand-500" />
              Question
            </h2>
            <div className="space-y-3">
              <Textarea
                label="Question text "
                placeholder="e.g. Solve: $x^2 + 5x + 6 = 0$"
                value={content.question.text}
                onChange={(e) => updateQuestionText(e.target.value)}
                rows={3}
                required
              // hint="Use $...$ for inline LaTeX and $$...$$ for display math"
              />
              <ImageUploader
                label="Question image"
                imageUrl={content.question.image}
                onChange={updateQuestionImage}
              />
            </div>
          </Card>

          {/* Options */}
          <Card>
            <h2 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-brand-500" />
              Answer Options
            </h2>
            <p className="text-xs text-gray-500 mb-5">
              Select the radio button next to the correct option
            </p>
            <div className="space-y-5">
              {content.options.map((option, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border-2 transition-all ${correctOption === i ? "border-brand-500 bg-brand-50" : "border-gray-100 bg-gray-50"}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="radio"
                      name="correct_option"
                      checked={correctOption === i}
                      onChange={() => setCorrectOption(i)}
                      className="w-4 h-4 accent-brand-500 cursor-pointer"
                    />
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${correctOption === i ? "bg-brand-500 text-white" : "bg-gray-200 text-gray-600"}`}
                    >
                      {OPTION_LABELS[i]}
                    </span>
                    {correctOption === i && (
                      <span className="text-xs font-semibold text-brand-600 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Correct answer
                      </span>
                    )}
                  </div>
                  <Textarea
                    placeholder={`Option ${OPTION_LABELS[i]} — LaTeX supported`}
                    value={option.text}
                    onChange={(e) => updateOptionText(i, e.target.value)}
                    rows={2}
                    required
                  />
                  <div className="mt-3">
                    <ImageUploader
                      label={`Option ${OPTION_LABELS[i]} image`}
                      imageUrl={option.image}
                      onChange={(url) => updateOptionImage(i, url)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Explanation */}
          <Card>
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-brand-500" />
              Explanation / Solution
            </h2>
            <div className="space-y-3">
              <Textarea
                label="Explanation text (LaTeX supported)"
                placeholder="Provide a detailed explanation of the correct answer…"
                value={content.explanation.text}
                onChange={(e) => updateExplanationText(e.target.value)}
                rows={4}
                required
              />
              <ImageUploader
                label="Explanation image"
                imageUrl={content.explanation.image}
                onChange={updateExplanationImage}
              />
            </div>
          </Card>

          {/* Actions */}
          <div className="flex items-center gap-3 pb-4">
            <Button
              type="submit"
              size="lg"
              disabled={!isFormValid || submitting}
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                  Submitting…
                </>
              ) : (
                <>
                  <Plus size={16} /> Submit Question
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleReset}
            >
              <Minus size={16} /> Reset
            </Button>
          </div>
        </form>
      </div>

      {/* Preview Modal */ }
      < Modal
  isOpen = { previewOpen }
  onClose = {() => setPreviewOpen(false)
}
title = "Question Preview"
  // size="lg"
  >
  <div className="space-y-5">
    <div className="p-5 rounded-xl bg-gray-50 border border-gray-100">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Question
      </p>
      <div className="text-gray-900">
        {content.question.text ? (
          <MathRenderer content={content.question.text} />
        ) : (
          <span className="text-gray-400 italic">
            No question text yet
          </span>
        )}
      </div>
      {content.question.image && (
        <img
          src={content.question.image}
          alt="question"
          className="mt-3 max-h-48 rounded-lg"
        />
      )}
    </div>
    <div className="space-y-2.5">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Options
      </p>
      {content.options.map((opt, i) => (
        <div
          key={i}
          className={`flex items-start gap-3 p-3.5 rounded-xl border-2 ${correctOption === i ? "border-brand-500 bg-brand-50" : "border-gray-100"}`}
        >
          <span
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${correctOption === i ? "bg-brand-500 text-white" : "bg-gray-100 text-gray-500"}`}
          >
            {OPTION_LABELS[i]}
          </span>
          <span className="text-sm text-gray-700 pt-0.5">
            {opt.text ? (
              <MathRenderer content={opt.text} />
            ) : (
              <span className="italic text-gray-400">Empty</span>
            )}
          </span>
          {correctOption === i && (
            <CheckCircle2
              size={15}
              className="text-brand-500 ml-auto mt-0.5 shrink-0"
            />
          )}
        </div>
      ))}
    </div>
    <div className="p-4 rounded-xl bg-brand-50 border border-brand-100">
      <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-2">
        Explanation
      </p>
        {content.explanation.text ? (
          <MathRenderer content={content.explanation.text} />
        ) : (
          <span className="italic text-gray-400">No explanation yet</span>
        )}
    </div>
  </div>
      </Modal >
    </>
  );
}
