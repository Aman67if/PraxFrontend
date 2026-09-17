"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    MathJax?: {
      typesetPromise?: (elements?: HTMLElement[]) => Promise<void>;
    };
  }
}

export default function MathRenderer({
  content,
}: {
  content: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.MathJax || !ref.current) return;

    window.MathJax.typesetPromise?.([ref.current]);
  }, [content]);


  return (
    <div ref={ref} className="whitespace-pre-wrap math-content">
      {content}
    </div>
  );
}