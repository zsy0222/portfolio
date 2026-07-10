"use client";

import Giscus from "@giscus/react";
import { useEffect, useState } from "react";

export default function GiscusComments() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <Giscus
      repo="zsy0222/portfolio"
      repoId=""
      category="General"
      categoryId=""
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={isDark ? "dark" : "light"}
      lang="zh-CN"
      loading="lazy"
    />
  );
}
