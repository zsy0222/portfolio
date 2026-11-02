"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type WorldLocale = "zh" | "en";
interface WorldContextValue {
  locale: WorldLocale;
  setLocale: (locale: WorldLocale) => void;
  t: (zh: string, en: string) => string;
}
const WorldContext = createContext<WorldContextValue>({ locale: "zh", setLocale: () => {}, t: (zh) => zh });

export function WorldProvider({ children }: { children: React.ReactNode }) {
  const [locale, updateLocale] = useState<WorldLocale>("zh");
  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem("chenmu-language"); } catch { /* Reading remains available without storage. */ }
    const frame = requestAnimationFrame(() => {
      const language = saved === "en" ? "en" : "zh";
      updateLocale(language);
      document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  const setLocale = useCallback((next: WorldLocale) => {
    updateLocale(next);
    document.documentElement.lang = next === "zh" ? "zh-CN" : "en";
    try { localStorage.setItem("chenmu-language", next); } catch { /* Optional preference persistence. */ }
  }, []);
  const t = useCallback((zh: string, en: string) => locale === "zh" ? zh : en, [locale]);
  return <WorldContext.Provider value={{ locale, setLocale, t }}>{children}</WorldContext.Provider>;
}

export function useWorldLocale() { return useContext(WorldContext); }
