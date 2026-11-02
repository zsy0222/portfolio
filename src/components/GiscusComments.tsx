"use client";

import Giscus from "@giscus/react";
import { useSyncExternalStore } from "react";

function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

const getTheme = () => document.documentElement.classList.contains("dark");
const getServerTheme = () => false;

export default function GiscusComments() {
  const isDark = useSyncExternalStore(subscribeToTheme, getTheme, getServerTheme);

  return (
    <Giscus
      repo="zsy0222/portfolio"
      repoId="R_kgDOTUEY-w"
      category="Announcements"
      categoryId="DIC_kwDOTUEY-84DA5Fz"
      mapping="pathname"
      strict="1"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme={`https://chenmuqingtongyan.vercel.app/giscus-${isDark ? "dark" : "light"}.css`}
      lang="zh-CN"
      loading="lazy"
    />
  );
}
