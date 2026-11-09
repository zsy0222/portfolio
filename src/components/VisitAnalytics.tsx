"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./VisitAnalytics.module.css";

const preferenceKey = "portfolio-visit-preference";
const denied = "declined";
export const openVisitPreferences = "portfolio:visit-preferences";

export default function VisitAnalytics({ enabled }: { enabled: boolean }) {
  const pathname = usePathname();
  const [preference, setPreference] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const panel = useRef<HTMLElement>(null);
  const lastSent = useRef<{ id: string; time: number } | null>(null);

  useEffect(() => {
    const load = () => {
      try {
        setPreference(localStorage.getItem(preferenceKey) ?? "");
      } catch {
        setPreference(denied);
      }
    };
    const frame = requestAnimationFrame(load);
    const sync = (event: StorageEvent) => {
      if (event.key === preferenceKey || event.key === null) load();
    };
    const open = () => {
      setEditing(true);
      requestAnimationFrame(() => panel.current?.focus());
    };
    window.addEventListener("storage", sync);
    window.addEventListener(openVisitPreferences, open);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("storage", sync);
      window.removeEventListener(openVisitPreferences, open);
    };
  }, []);

  useEffect(() => {
    if (!enabled || !preference || preference === denied || pathname === "/status") return;
    const record = () => {
      if (document.visibilityState !== "visible") return;
      const now = Date.now();
      const previous = lastSent.current;
      if (previous?.id === preference && now - previous.time < 60_000) return;
      lastSent.current = { id: preference, time: now };
      void fetch("/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ browserId: preference }),
        keepalive: true,
      }).catch(() => {});
    };
    record();
    document.addEventListener("visibilitychange", record);
    return () => document.removeEventListener("visibilitychange", record);
  }, [enabled, pathname, preference]);

  function save(allow: boolean) {
    let value = denied;
    try {
      if (allow) value = preference && preference !== denied ? preference : crypto.randomUUID();
      localStorage.setItem(preferenceKey, value);
    } catch {
      value = denied;
    }
    setPreference(value);
    setEditing(false);
  }

  if (!editing && (!enabled || preference !== "" || pathname === "/status")) return null;

  return (
    <section className={styles.panel} ref={panel} tabIndex={-1} lang="zh-CN" aria-labelledby="visit-preference-title">
      <div>
        <strong id="visit-preference-title">回访统计</strong>
        <p>同意后，此网站会用随机浏览器编号统计回访，统计使用最近 90 天的记录。你可以在页脚更改偏好。</p>
      </div>
      <div className={styles.actions}>
        <button type="button" onClick={() => save(false)}>不参与</button>
        <button type="button" onClick={() => save(true)}>同意统计</button>
      </div>
    </section>
  );
}
