"use client";
import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/Card";
import { Table } from "@/components/Table";
import { Select } from "@/components/Select";
import { Input } from "@/components/Input";
import { Modal } from "@/components/Modal";
import { API_URL, apiFetch } from "@/lib/api";

import {
  RefreshCw,
  ImageIcon,
  X,
  Search,
  BookOpen,
  Download,
} from "lucide-react";

/* ─── Types ───────────────────────────────────────────────────────── */
interface MetricRow {
  subject: string;
  class: string;
  chapter: string;
  count: number;
}

interface QuestionImage {
  questionId: number;
  class: string;
  subject: string;
  chapter: string;
  topic: string | null;
  imageUrl: string;
  /** Where in the question the image lives */
  imageType: "question" | "option" | "explanation";
  /** Only present when imageType === "option" */
  optionIndex?: number;
  /** The question text for context */
  questionText: string;
}

/* ─── Label helpers ───────────────────────────────────────────────── */
const imageTypeLabel: Record<string, string> = {
  question: "Question",
  option: "Option",
  explanation: "Explanation",
};
const imageTypeBadge: Record<string, string> = {
  question: "bg-brand-100 text-brand-700",
  option: "bg-purple-100 text-purple-700",
  explanation: "bg-amber-100 text-amber-700",
};

/* ─── Component ───────────────────────────────────────────────────── */
export default function UploadedImagesPage() {
  /* ── Shared filters ─────────────────────────────────────────────── */
  const [filterClass, setFilterClass] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");

  /* ── Images state ───────────────────────────────────────────────── */
  const [images, setImages] = useState<QuestionImage[]>([]);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgError, setImgError] = useState("");
  const [filterChapter, setFilterChapter] = useState("");
  const [filterTopic, setFilterTopic] = useState("");
  const [filterImgType, setFilterImgType] = useState<
    "all" | "question" | "option" | "explanation"
  >("all");
  const [previewImg, setPreviewImg] = useState<QuestionImage | null>(null);
  const [imgSearch, setImgSearch] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  /* ── Options ────────────────────────────────────────────────────── */
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
    { value: "evs", label: "EVS" },
    { value: "social", label: "Social Studies" },
  ];
  const imgTypeOptions = [
    { value: "all", label: "All Types" },
    { value: "question", label: "Question image" },
    { value: "option", label: "Option image" },
    { value: "explanation", label: "Explanation image" },
  ];

  /* ── Fetch images ───────────────────────────────────────────────── */
  const fetchImages = useCallback(async () => {
    setImgLoading(true);
    setImgError("");
    try {
      const params = new URLSearchParams();
      if (filterClass !== "all") params.set("class", filterClass);
      if (filterSubject !== "all") params.set("subject", filterSubject);
      if (filterChapter.trim()) params.set("chapter", filterChapter.trim());
      if (filterTopic.trim()) params.set("topic", filterTopic.trim());
      if (filterImgType !== "all") params.set("type", filterImgType);
      const res = await apiFetch(`${API_URL}/admin/question-images?${params}`,
        { credentials: "include" },
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setImages(data.images ?? []);
      setLastUpdated(new Date());
    } catch {
      setImgError("Failed to load images.");
    } finally {
      setImgLoading(false);
    }
  }, [filterClass, filterSubject, filterChapter, filterTopic, filterImgType]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  /* Client-side image search */
  const filteredImages = images.filter((img) => {
    if (!imgSearch.trim()) return true;
    const q = imgSearch.toLowerCase();
    return (
      img.chapter.toLowerCase().includes(q) ||
      (img.topic?.toLowerCase().includes(q) ?? false) ||
      img.subject.toLowerCase().includes(q) ||
      img.questionText.toLowerCase().includes(q)
    );
  });

  /* ── Render ─────────────────────────────────────────────────────── */
  return (
    <>
      <Navbar title="Uploaded Images" subtitle="Browse uploaded images" />

      <div className="p-5 lg:p-8">
        <div className="flex flex-col items-end gap-1">
          <button
            onClick={fetchImages}
            disabled={imgLoading}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                border border-gray-200 bg-white text-gray-600 hover:bg-gray-50
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw
              size={13}
              className={imgLoading ? "animate-spin" : ""}
            />
            Refresh
          </button>
          {lastUpdated && (
            <span className="text-xs text-gray-400">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Image filters */}
      <Card className="mb-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-40">
            <Select
              label="Class"
              options={classOptions}
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
            />
          </div>
          <div className="w-44">
            <Select
              label="Subject"
              options={subjectOptions}
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            />
          </div>
          <div className="w-44">
            <Input
              label="Chapter"
              placeholder="e.g. Linear Equations"
              value={filterChapter}
              onChange={(e) => setFilterChapter(e.target.value)}
            />
          </div>
          <div className="w-40">
            <Input
              label="Topic"
              placeholder="e.g. Word Problems"
              value={filterTopic}
              onChange={(e) => setFilterTopic(e.target.value)}
            />
          </div>
          <div className="w-44">
            <Select
              label="Image Type"
              options={imgTypeOptions}
              value={filterImgType}
              onChange={(e) => setFilterImgType(e.target.value as any)}
            />
          </div>
        </div>
      </Card>

      {/* ── Tab switcher ────────────────────────────────────────── */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit mb-6">
        <button
          onClick={() => fetchImages}
          className={
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-brand-400 hover:bg-brand-500 text-white"
          }
        >
          <ImageIcon size={15} /> Search{" "}
          {images.length > 0 && `(${images.length})`}
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════
            IMAGES TAB
            ══════════════════════════════════════════════════════════ */}
      <div className="space-y-5">
        {/* Search bar */}
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={imgSearch}
            onChange={(e) => setImgSearch(e.target.value)}
            placeholder="Search by chapter, topic, subject or question text…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl
                  bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                  placeholder:text-gray-400 transition-all"
          />
          {imgSearch && (
            <button
              onClick={() => setImgSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Loading */}
        {imgLoading && (
          <Card>
            <div className="py-14 text-center text-gray-400">
              <div
                className="w-5 h-5 border-2 border-brand-500 border-t-transparent
                    rounded-full animate-spin mx-auto mb-3"
              />
              <p className="text-sm">Loading images…</p>
            </div>
          </Card>
        )}

        {/* Error */}
        {/* {imgError && !imgLoading && (
            <Card>
              <div className="py-10 text-center text-red-500 text-sm">
                {imgError}
                <button
                  onClick={fetchImages}
                  className="ml-2 text-brand-600 underline"
                >
                  Retry
                </button>
              </div>
            </Card>
          )} */}

        {/* Empty */}
        {!imgLoading && imgError && filteredImages.length === 0 && (
          <Card>
            <div className="py-16 text-center">
              <div
                className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center
                    justify-center mx-auto mb-4"
              >
                <ImageIcon size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium mb-1">
                No images found
              </p>
              <p className="text-xs text-gray-400">
                Try adjusting the class, chapter, or topic filters above
              </p>
            </div>
          </Card>
        )}

        {/* Results header */}
        {!imgLoading && !imgError && filteredImages.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-900">
                {filteredImages.length}
              </span>{" "}
              image
              {filteredImages.length !== 1 ? "s" : ""} found
              {imgSearch && (
                <span className="text-gray-400"> for "{imgSearch}"</span>
              )}
            </p>
            {/* Type breakdown pills */}
            <div className="flex gap-2 flex-wrap justify-end">
              {(["question", "option", "explanation"] as const).map(
                (type) => {
                  const cnt = filteredImages.filter(
                    (i) => i.imageType === type,
                  ).length;
                  if (!cnt) return null;
                  return (
                    <span
                      key={type}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${imageTypeBadge[type]}`}
                    >
                      {imageTypeLabel[type]}: {cnt}
                    </span>
                  );
                },
              )}
            </div>
          </div>
        )}

        {/* Image grid */}
        {!imgLoading && !imgError && filteredImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setPreviewImg(img)}
                className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm
                      overflow-hidden hover:border-brand-200 hover:shadow-lg
                      hover:-translate-y-0.5 transition-all duration-200 text-left"
              >
                {/* Thumbnail */}
                <div className="relative h-36 bg-gray-50 overflow-hidden">
                  <img
                    src={img.imageUrl}
                    alt={`${img.imageType} image`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='%239ca3af' font-size='12'%3ENo image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  {/* Overlay on hover */}
                  <div
                    className="absolute inset-0 bg-brand-900/60 opacity-0
                        group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <span className="text-white text-xs font-medium">
                      View full
                    </span>
                  </div>
                </div>

                {/* Meta */}
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0
                          ${imageTypeBadge[img.imageType]}`}
                    >
                      {imageTypeLabel[img.imageType]}
                      {img.imageType === "option" &&
                        img.optionIndex !== undefined
                        ? ` ${String.fromCharCode(65 + img.optionIndex)}`
                        : ""}
                    </span>
                    <span className="text-[10px] text-gray-400 capitalize truncate">
                      Cls {img.class}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-gray-700 capitalize truncate mb-0.5">
                    {img.chapter}
                  </p>
                  {img.topic && (
                    <p className="text-[10px] text-gray-400 truncate">
                      {img.topic}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Image preview modal ────────────────────────────────────── */}
      < Modal
        isOpen={!!previewImg
        }
        onClose={() => setPreviewImg(null)}
        title="Image Preview"
      // size="lg"
      >
        {previewImg && (
          <div className="space-y-4">
            {/* Meta strip */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span
                className={`px-2.5 py-1 rounded-full font-semibold ${imageTypeBadge[previewImg.imageType]}`}
              >
                {imageTypeLabel[previewImg.imageType]}
                {previewImg.imageType === "option" &&
                  previewImg.optionIndex !== undefined
                  ? ` ${String.fromCharCode(65 + previewImg.optionIndex)}`
                  : ""}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-brand-100 text-brand-700 font-medium">
                Class {previewImg.class}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 font-medium capitalize">
                {previewImg.subject}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                {previewImg.chapter}
              </span>
              {previewImg.topic && (
                <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
                  {previewImg.topic}
                </span>
              )}
              <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-400">
                Q#{previewImg.questionId}
              </span>
            </div>

            {/* Image */}
            <div className="rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center min-h-[200px]">
              <img
                src={previewImg.imageUrl}
                alt="Full preview"
                className="max-w-full max-h-[60vh] object-contain"
              />
            </div>

            {/* Question context */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen size={11} /> Question context
              </p>
              <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">
                {previewImg.questionText || "—"}
              </p>
            </div>

            {/* Download link */}
            <a
              href={previewImg.imageUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                border border-brand-200 bg-brand-50 text-brand-700
                text-sm font-medium hover:bg-brand-100 transition-colors"
            >
              <Download size={14} /> Download image
            </a>
          </div>
        )}
      </Modal >
    </>
  );
}
