"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/Card";
import { Select } from "@/components/Select";
import { useCurriculum } from "@/hooks/useCurriculum";
import {
  BookOpen,
  ChevronRight,
  Loader2,
} from "lucide-react";

export default function TestSelection() {
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const { getSubjects, getTopics, entries } = useCurriculum();

  const [classLevel, setClassLevel] = useState(10);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedClass = localStorage.getItem("praxes_selected_class");
    if (storedClass) {
      setClassLevel(parseInt(storedClass, 10));
    }
  }, []);

  const subjects = getSubjects(classLevel);
  const subjectOptions = [
    { value: "all", label: "All Subjects" },
    ...subjects.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) })),
  ];

  // Compute unique topics based on selected class and subject
  useEffect(() => {
    setLoading(true);
    const filtered = entries.filter((e) => {
      if (e.class_level !== classLevel) return false;
      if (selectedSubject !== "all" && e.subject !== selectedSubject) return false;
      return true;
    });
    const uniqueTopics = [...new Set(filtered.map((e) => e.topic))].sort();
    setTopics(uniqueTopics);
    setLoading(false);
  }, [entries, classLevel, selectedSubject]);

  return (
    <>
      <Navbar title="Attempt Test" subtitle={`Class ${classLevel}`} />

        <div className="p-5 lg:p-8">
          {/* Subject Filter */}
          <Card className="mb-6">
            <div className="max-w-xs">
              <Select
                label="Filter by Subject"
                options={subjectOptions}
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              />
            </div>
          </Card>

          {/* Loading */}
          {loading && (
            <div className="py-20 text-center text-gray-400">
              <Loader2 size={24} className="animate-spin mx-auto mb-3" />
              <p className="text-sm">Loading topics…</p>
            </div>
          )}

          {/* Empty */}
          {!loading && topics.length === 0 && (
            <Card className="py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <BookOpen size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium mb-1">No topics found</p>
              <p className="text-xs text-gray-400">
                Select a different class in your profile or try another subject
              </p>
            </Card>
          )}

          {/* Topic Cards — clickable */}
          {!loading && topics.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics.map((topic) => (
                <div
                  key={topic}
                  onClick={() =>
                    router.push(`/student/topic/${encodeURIComponent(topic)}`)
                  }
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 
                    hover:border-brand-200 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                        <BookOpen size={18} className="text-brand-500" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm group-hover:text-brand-600 transition-colors">
                          {topic}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Tap to view tests
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-gray-300 group-hover:text-brand-400 transition-colors"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    </>
  );
}
