"use client";

import { useState, useEffect } from "react";

interface TypingTextProps {
  segments: { text: string; accent?: boolean }[];
  speed?: number;
}

export default function TypingText({ segments, speed = 60 }: TypingTextProps) {
  const fullText = segments.map((s) => s.text).join("");
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [displayed, setDisplayed] = useState(prefersReduced ? fullText : "");
  const [done, setDone] = useState(prefersReduced);

  useEffect(() => {
    if (prefersReduced) return;

    let i = 0;
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setDisplayed(fullText.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [fullText, speed, prefersReduced]);

  const renderText = () => {
    let remaining = displayed;
    return segments.map((seg, idx) => {
      const part = remaining.slice(0, seg.text.length);
      remaining = remaining.slice(seg.text.length);
      return (
        <span
          key={idx}
          className={seg.accent ? "text-accent font-semibold" : ""}
        >
          {part}
        </span>
      );
    });
  };

  return (
    <span>
      {renderText()}
      {!done && <span className="text-accent animate-pulse">|</span>}
    </span>
  );
}
