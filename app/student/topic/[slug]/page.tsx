"use client";
import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { API_URL, apiFetch } from "@/lib/api";

import {
  BookOpen,
  GraduationCap,
  Youtube,
  Clock,
  FileQuestion,
  Lock,
  Unlock,
  Play,
  ArrowLeft,
  Loader2,
} from "lucide-react";

interface TestGroup {
  id: number;
  name: string;
  group_type: "EXAM" | "PRE_EXAM" | "PRACTICE";
  time_limit: number;
  is_paid: boolean;
  _count: { questions: number };
}

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

const GROUP_TYPE_CONFIG = {
  EXAM: {
    label: "Exam",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-100",
    badge: "bg-red-100 text-red-700",
  },
  PRE_EXAM: {
    label: "Pre-exam",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    badge: "bg-amber-100 text-amber-700",
  },
  PRACTICE: {
    label: "Practice",
    color: "text-brand-600",
    bg: "bg-brand-50",
    border: "border-brand-100",
    badge: "bg-brand-100 text-brand-700",
  },
};

function TopicContent() {
  const params = useParams();
  const router = useRouter();
  const slug = decodeURIComponent(params.slug as string);

  const [groups, setGroups] = useState<TestGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"EXAM" | "PRE_EXAM" | "PRACTICE">("EXAM");

  const [classLevel, setClassLevel] = useState("10");

  useEffect(() => {
    const storedClass = localStorage.getItem("praxes_selected_class");
    if (storedClass) {
      setClassLevel(storedClass);
    }
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await apiFetch(`${API_URL}/test-groups?topic=${encodeURIComponent(slug)}&class=${classLevel}`,
          { credentials: "include" }
        );
        if (res.ok) {
          const json = await res.json();
          setGroups(json.data || []);
        }
      } catch {}
      setLoading(false);
    };
    fetchGroups();
  }, [slug, classLevel]);

  const filteredGroups = groups.filter((g) => g.group_type === activeTab);
  const tabs: ("EXAM" | "PRE_EXAM" | "PRACTICE")[] = ["EXAM", "PRE_EXAM", "PRACTICE"];

  const handleYouTube = () => {
    const query = encodeURIComponent(`${slug} class ${classLevel}`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
  };

  return (
    <>
      <Navbar title={slug} subtitle={`Class ${classLevel} • Topic`} />

        <div className="p-5 lg:p-8">
          {/* Back + Learn button */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft size={16} /> Back
            </Button>
            <Button size="sm" onClick={handleYouTube}>
              <Youtube size={16} /> Learn this topic
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit mb-6">
            {tabs.map((tab) => {
              const cfg = GROUP_TYPE_CONFIG[tab];
              const count = groups.filter((g) => g.group_type === tab).length;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {cfg.label}
                  {count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${cfg.badge}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Loading */}
          {loading && (
            <div className="py-20 text-center text-gray-400">
              <Loader2 size={24} className="animate-spin mx-auto mb-3" />
              <p className="text-sm">Loading test groups…</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredGroups.length === 0 && (
            <Card className="py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <FileQuestion size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium mb-1">
                No {GROUP_TYPE_CONFIG[activeTab].label} tests available
              </p>
              <p className="text-xs text-gray-400">
                Check back later or try a different category
              </p>
            </Card>
          )}

          {/* Test Group Cards */}
          {!loading && filteredGroups.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGroups.map((group) => {
                const cfg = GROUP_TYPE_CONFIG[group.group_type];
                return (
                  <Card key={group.id} className={`${cfg.bg} ${cfg.border} border`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${cfg.badge} mb-2`}>
                          {cfg.label}
                        </span>
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {group.name}
                        </h3>
                      </div>
                      {group.is_paid ? (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-900 text-white text-[10px] font-bold">
                          <Lock size={10} /> Paid
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold">
                          <Unlock size={10} /> Free
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-600 mb-4">
                      <span className="flex items-center gap-1">
                        <FileQuestion size={13} />
                        {group._count.questions} questions
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} />
                        {formatTime(group.time_limit)}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        router.push(`/student/test/notice?groupId=${group.id}`)
                      }
                    >
                      <Play size={14} /> Start Test
                    </Button>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
    </>
  );
}

export default function TopicPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <TopicContent />
    </Suspense>
  );
}
