"use client";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Select } from "@/components/Select";
import { Input } from "@/components/Input";
import { Modal } from "@/components/Modal";
import { useCurriculum } from "@/hooks/useCurriculum";
import { API_URL, apiFetch } from "@/lib/api";

import {
  Plus,
  Trash2,
  Info,
  CheckSquare,
  Square,
  Clock,
  FileQuestion,
  Loader2,
} from "lucide-react";

const DIFFICULTY_CHIP: Record<string, string> = {
  EASY: "bg-green-100 text-green-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  HARD: "bg-red-100 text-red-600",
};

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const parts: string[] = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (s > 0 && h === 0) parts.push(`${s}s`);
  return parts.join(" ") || "0s";
}

export default function TestGroupsPage() {
  const [tab, setTab] = useState<"create" | "list">("create");

  // Create form state
  const [groupName, setGroupName] = useState("");
  const [groupType, setGroupType] = useState("EXAM");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("30");
  const [seconds, setSeconds] = useState("0");
  const [isPaid, setIsPaid] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  // Question filter state (separate from group form)
  const [qFilterClass, setQFilterClass] = useState("");
  const [qFilterSubject, setQFilterSubject] = useState("");
  const [qFilterChapter, setQFilterChapter] = useState("");
  const [qFilterTopic, setQFilterTopic] = useState("");

  // Data
  const [questions, setQuestions] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [qLoading, setQLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [infoGroup, setInfoGroup] = useState<any>(null);

  // New Topic modal
  const [showNewTopic, setShowNewTopic] = useState(false);
  const [newClass, setNewClass] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newChapter, setNewChapter] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [creatingTopic, setCreatingTopic] = useState(false);

  const curriculum = useCurriculum();
  const classes = curriculum.getClasses();

  const hourOptions = Array.from({ length: 6 }, (_, i) => ({ value: String(i), label: `${i} hr` }));
  const minuteOptions = Array.from({ length: 60 }, (_, i) => ({ value: String(i), label: `${i} min` }));
  const secondOptions = Array.from({ length: 60 }, (_, i) => ({ value: String(i), label: `${i} sec` }));

  // Fetch questions for selection
  const fetchQuestions = async () => {
    setQLoading(true);
    const params = new URLSearchParams();
    if (qFilterClass) params.set("class", qFilterClass);
    if (qFilterSubject) params.set("subject", qFilterSubject);
    if (qFilterChapter) params.set("chapter", qFilterChapter);
    if (qFilterTopic) params.set("topic", qFilterTopic);
    params.set("limit", "100");

    try {
      const res = await apiFetch(`${API_URL}/admin/questions-for-group?${params}`, {
        credentials: "include",
      });
      if (res.ok) {
        const json = await res.json();
        setQuestions(json.questions || []);
      }
    } catch { }
    setQLoading(false);
  };

  // Fetch groups for list
  const fetchGroups = async () => {
    setGLoading(true);
    try {
      const res = await apiFetch(`${API_URL}/admin/test-groups`, {
        credentials: "include",
      });
      if (res.ok) {
        const json = await res.json();
        setGroups(json.data || []);
      }
    } catch { }
    setGLoading(false);
  };

  useEffect(() => {
    if (tab === "list") fetchGroups();
  }, [tab]);

  // Create group
  const handleCreate = async () => {
    const timeLimit = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
    if (!groupName.trim() || !selectedClass || !selectedSubject || !selectedTopic || timeLimit === 0) {
      alert("Please fill all required fields.");
      return;
    }
    if (selectedQuestions.size === 0) {
      alert("Please select at least one question.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiFetch(`${API_URL}/admin/test-groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: groupName,
          group_type: groupType,
          class_level: parseInt(selectedClass),
          subject: selectedSubject,
          chapter: selectedChapter,
          topic: selectedTopic,
          time_limit: timeLimit,
          is_paid: isPaid,
          question_ids: [...selectedQuestions],
        }),
      });
      if (res.ok) {
        alert("Test group created successfully!");
        setGroupName("");
        setSelectedQuestions(new Set());
      } else {
        const json = await res.json();
        alert(json.message || "Failed to create group.");
      }
    } catch {
      alert("Failed to connect to server.");
    }
    setSubmitting(false);
  };

  // Create new topic
  const handleCreateTopic = async () => {
    if (!newClass || !newSubject.trim() || !newChapter.trim() || !newTopic.trim()) {
      alert("All fields are required.");
      return;
    }
    setCreatingTopic(true);
    try {
      const res = await apiFetch(`${API_URL}/admin/curriculum`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          class_level: parseInt(newClass),
          subject: newSubject.trim(),
          chapter: newChapter.trim(),
          topic: newTopic.trim(),
        }),
      });
      if (res.ok) {
        setShowNewTopic(false);
        setNewClass("");
        setNewSubject("");
        setNewChapter("");
        setNewTopic("");
      } else {
        const json = await res.json();
        alert(json.message || "Failed to create topic.");
      }
    } catch {
      alert("Failed to connect to server.");
    }
    setCreatingTopic(false);
  };

  const toggleQuestion = (id: number) => {
    setSelectedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Cascading dropdown values
  const formSubjects = selectedClass ? curriculum.getSubjects(parseInt(selectedClass)) : [];
  const formChapters = selectedClass && selectedSubject
    ? curriculum.getChapters(parseInt(selectedClass), selectedSubject) : [];
  const formTopics = selectedClass && selectedSubject && selectedChapter
    ? curriculum.getTopics(parseInt(selectedClass), selectedSubject, selectedChapter) : [];

  const qSubjects = qFilterClass ? curriculum.getSubjects(parseInt(qFilterClass)) : [];
  const qChapters = qFilterClass && qFilterSubject
    ? curriculum.getChapters(parseInt(qFilterClass), qFilterSubject) : [];
  const qTopics = qFilterClass && qFilterSubject && qFilterChapter
    ? curriculum.getTopics(parseInt(qFilterClass), qFilterSubject, qFilterChapter) : [];

  return (
    <>
      <Navbar title="Test Groups" subtitle="Create and manage test groups" />

      <div className="p-5 lg:p-8">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit mb-6">
          {(["create", "list"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {t === "create" ? "Create Group" : "View Groups"}
            </button>
          ))}
        </div>

        {tab === "create" && (
          <div className="space-y-5">
            {/* Group Details */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-1 h-4 rounded-full bg-brand-500" /> Group Details
                </h2>
                <Button variant="outline" size="sm" onClick={() => setShowNewTopic(true)}>
                  <Plus size={14} /> Add New Topic
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <Input label="Group Name" value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="e.g. Chapter 1 Practice" required />
                <Select label="Type" options={[
                  { value: "EXAM", label: "Exam" },
                  { value: "PRE_EXAM", label: "Pre-exam" },
                  { value: "PRACTICE", label: "Practice" },
                ]} value={groupType} onChange={(e) => setGroupType(e.target.value)} />
                <Select label="Class" options={[{ value: "", label: "Select class" }, ...classes.map((c) => ({ value: String(c), label: `Class ${c}` }))]}
                  value={selectedClass} onChange={(e) => { setSelectedClass(e.target.value); setSelectedSubject(""); setSelectedChapter(""); setSelectedTopic(""); }} />
                <Select label="Subject" options={[{ value: "", label: "Select subject" }, ...formSubjects.map((s) => ({ value: s, label: s }))]}
                  value={selectedSubject} onChange={(e) => { setSelectedSubject(e.target.value); setSelectedChapter(""); setSelectedTopic(""); }} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Select label="Chapter" options={[{ value: "", label: "Select chapter" }, ...formChapters.map((c) => ({ value: c, label: c }))]}
                  value={selectedChapter} onChange={(e) => { setSelectedChapter(e.target.value); setSelectedTopic(""); }} />
                <Select label="Topic" options={[{ value: "", label: "Select topic" }, ...formTopics.map((t) => ({ value: t, label: t }))]}
                  value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)} />
                <div>
                  <label className="block text-sm mb-2 text-gray-700">Time Limit</label>
                  <div className="flex gap-2">
                    <Select options={hourOptions} value={hours} onChange={(e) => setHours(e.target.value)} />
                    <Select options={minuteOptions} value={minutes} onChange={(e) => setMinutes(e.target.value)} />
                    <Select options={secondOptions} value={seconds} onChange={(e) => setSeconds(e.target.value)} />
                  </div>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer py-2.5">
                    <input type="checkbox" checked={isPaid} onChange={(e) => setIsPaid(e.target.checked)} className="w-4 h-4 accent-brand-500" />
                    <span className="text-sm text-gray-700 font-medium">Paid Test</span>
                  </label>
                </div>
              </div>
            </Card>

            {/* Question Selection */}
            <Card>
              <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <div className="w-1 h-4 rounded-full bg-brand-500" /> Select Questions
                {selectedQuestions.size > 0 && (
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-brand-100 text-brand-700">
                    {selectedQuestions.size} selected
                  </span>
                )}
              </h2>

              {/* Question filters */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                <Select options={[{ value: "", label: "Class" }, ...classes.map((c) => ({ value: String(c), label: `Class ${c}` }))]}
                  value={qFilterClass} onChange={(e) => { setQFilterClass(e.target.value); setQFilterSubject(""); setQFilterChapter(""); setQFilterTopic(""); }} />
                <Select options={[{ value: "", label: "Subject" }, ...qSubjects.map((s) => ({ value: s, label: s }))]}
                  value={qFilterSubject} onChange={(e) => { setQFilterSubject(e.target.value); setQFilterChapter(""); setQFilterTopic(""); }} />
                <Select options={[{ value: "", label: "Chapter" }, ...qChapters.map((c) => ({ value: c, label: c }))]}
                  value={qFilterChapter} onChange={(e) => { setQFilterChapter(e.target.value); setQFilterTopic(""); }} />
                <Select options={[{ value: "", label: "Topic" }, ...qTopics.map((t) => ({ value: t, label: t }))]}
                  value={qFilterTopic} onChange={(e) => setQFilterTopic(e.target.value)} />
                <Button size="sm" onClick={fetchQuestions} disabled={qLoading}>
                  {qLoading ? <Loader2 size={14} className="animate-spin" /> : "Search"}
                </Button>
              </div>

              {/* Question list */}
              {questions.length > 0 && (
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  {questions.map((q, i) => {
                    const content = q.content as any;
                    const isSelected = selectedQuestions.has(q.id);
                    return (
                      <div
                        key={q.id}
                        className={`flex items-start gap-3 p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${isSelected ? "bg-brand-50" : ""
                          }`}
                      >
                        <button onClick={() => toggleQuestion(q.id)} className="mt-0.5">
                          {isSelected ? (
                            <CheckSquare size={18} className="text-brand-500" />
                          ) : (
                            <Square size={18} className="text-gray-300" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 truncate">
                            {content?.question?.text || "No text"}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${DIFFICULTY_CHIP[q.difficulty] || "bg-gray-100 text-gray-600"}`}>
                              {q.difficulty}
                            </span>
                            {q.is_in_group && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold">
                                Already Added
                              </span>
                            )}
                          </div>
                        </div>
                        {q.is_in_group && q.groups?.length > 0 && (
                          <button
                            onClick={() => setInfoGroup(q.groups)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-brand-500 hover:bg-brand-50 transition-colors"
                          >
                            <Info size={16} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {questions.length === 0 && !qLoading && (
                <p className="text-center text-sm text-gray-400 py-8">
                  Use the filters above and click Search to find questions
                </p>
              )}
            </Card>

            {/* Create Button */}
            <div className="flex justify-end">
              <Button size="lg" onClick={handleCreate} disabled={submitting || selectedQuestions.size === 0}>
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                Create Group ({selectedQuestions.size} questions)
              </Button>
            </div>
          </div>
        )}

        {/* List tab */}
        {tab === "list" && (
          <div>
            {gLoading ? (
              <div className="py-20 text-center"><Loader2 size={24} className="animate-spin mx-auto text-gray-400" /></div>
            ) : groups.length === 0 ? (
              <Card className="py-16 text-center">
                <p className="text-gray-500">No test groups yet.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groups.map((g: any) => (
                  <Card key={g.id}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 mb-1 inline-block">
                          {g.group_type?.replace("_", "-")}
                        </span>
                        <h3 className="font-semibold text-gray-900 text-sm">{g.name}</h3>
                      </div>
                      {g.is_paid ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-900 text-white">Paid</span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Free</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>Class {g.class_level} • {g.subject} • {g.topic}</p>
                      <div className="flex gap-3">
                        <span className="flex items-center gap-1"><FileQuestion size={12} /> {g._count?.questions || 0} Qs</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {formatTime(g.time_limit)}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* New Topic Modal */}
      < Modal isOpen={showNewTopic} onClose={() => setShowNewTopic(false)
      } title="Add New Topic" >
        <div className="space-y-4">
          <Select label="Class *" options={[{ value: "", label: "Select class" }, ...Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: `Class ${i + 1}` }))]}
            value={newClass} onChange={(e) => setNewClass(e.target.value)} />
          <Input label="Subject *" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder="e.g. Mathematics" required />
          <Input label="Chapter *" value={newChapter} onChange={(e) => setNewChapter(e.target.value)} placeholder="e.g. Linear Equations" required />
          <Input label="Topic *" value={newTopic} onChange={(e) => setNewTopic(e.target.value)} placeholder="e.g. Word Problems" required />
          <p className="text-xs text-gray-400">All fields are required. A class cannot be created without subject, chapter, and topic.</p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowNewTopic(false)}>Cancel</Button>
            <Button onClick={handleCreateTopic} disabled={creatingTopic}>
              {creatingTopic ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Create
            </Button>
          </div>
        </div>
      </Modal >

      {/* Info popover modal */}
      < Modal isOpen={!!infoGroup} onClose={() => setInfoGroup(null)} title="Group Membership" >
        {infoGroup && (
          <div className="space-y-2">
            {infoGroup.map((g: any, i: number) => (
              <div key={i} className="p-3 rounded-lg bg-gray-50 border border-gray-100 text-sm">
                <p className="font-medium text-gray-900">{g.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {g.group_type?.replace("_", "-")} • Class {g.class_level} • {g.topic}
                </p>
              </div>
            ))}
          </div>
        )}
      </ Modal>
    </>
  );
}
