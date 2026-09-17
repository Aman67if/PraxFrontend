"use client";
import { useState, useEffect, useCallback } from "react";
import { API_URL, apiFetch } from "@/lib/api";

interface CurriculumEntry {
  class_level: number;
  subject: string;
  chapter: string;
  topic: string;
}



export function useCurriculum() {
  const [entries, setEntries] = useState<CurriculumEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch from server (Redis-cached on backend)
  const fetchFromServer = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`${API_URL}/curriculum`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setEntries(json.data || []);
    } catch {
      // Keep existing entries on failure
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFromServer();
  }, [fetchFromServer]);

  // Derived data helpers
  const getClasses = useCallback((): number[] => {
    return [...new Set(entries.map((e) => e.class_level))].sort((a, b) => a - b);
  }, [entries]);

  const getSubjects = useCallback(
    (classLevel: number): string[] => {
      return [
        ...new Set(
          entries
            .filter((e) => e.class_level === classLevel)
            .map((e) => e.subject)
        ),
      ].sort();
    },
    [entries]
  );

  const getChapters = useCallback(
    (classLevel: number, subject: string): string[] => {
      return [
        ...new Set(
          entries
            .filter(
              (e) => e.class_level === classLevel && e.subject === subject
            )
            .map((e) => e.chapter)
        ),
      ].sort();
    },
    [entries]
  );

  const getTopics = useCallback(
    (classLevel: number, subject: string, chapter: string): string[] => {
      return [
        ...new Set(
          entries
            .filter(
              (e) =>
                e.class_level === classLevel &&
                e.subject === subject &&
                e.chapter === chapter
            )
            .map((e) => e.topic)
        ),
      ].sort();
    },
    [entries]
  );

  return {
    entries,
    loading,
    refresh: fetchFromServer,
    getClasses,
    getSubjects,
    getChapters,
    getTopics,
  };
}
