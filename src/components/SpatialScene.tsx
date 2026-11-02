"use client";

import { useEffect, useRef, useState } from "react";
import type { SpatialSceneController } from "./spatial-scene-engine";
import "./spatial-scene.css";

type SceneState = "loading" | "ready" | "fallback";

/** The photograph and all page content remain independent of this optional 3D layer. */
export default function SpatialScene({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<SpatialSceneController | null>(null);
  const [state, setState] = useState<SceneState>("loading");

  useEffect(() => {
    const element = root.current;
    const canvasHost = host.current;
    if (!element || !canvasHost) return;
    let cancelled = false;
    let started = false;
    const load = async () => {
      if (started || cancelled) return;
      started = true;
      try {
        const { createSpatialScene } = await import("./spatial-scene-engine");
        if (cancelled) return;
        controller.current = createSpatialScene(canvasHost, {
          onReady: () => { if (!cancelled) setState("ready"); },
          onError: () => { if (!cancelled) setState("fallback"); },
        });
      } catch {
        if (!cancelled) setState("fallback");
      }
    };
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { observer?.disconnect(); void load(); }
    }, { rootMargin: "180px" });
    if (observer) observer.observe(element); else void load();
    return () => {
      cancelled = true;
      observer?.disconnect();
      controller.current?.dispose();
      controller.current = null;
    };
  }, []);

  return (
    <div ref={root} className={`spatial-scene ${className}`} data-state={state}>
      <div className="spatial-material-fallback" aria-hidden="true">
        <i className="spatial-fallback-plinth" /><i className="spatial-fallback-ring" /><i className="spatial-fallback-ring spatial-fallback-ring-two" /><i className="spatial-fallback-glass" />
      </div>
      <div ref={host} className="spatial-canvas-host" tabIndex={state === "ready" ? 0 : -1} role="group"
        aria-label="Interactive abstract sculpture. Drag horizontally or use arrow keys to rotate. Press Home to reset the view." />
      {state === "ready" && <div className="spatial-scene-controls"><span>Drag to rotate</span><button type="button" onClick={() => controller.current?.reset()} aria-label="Reset 3D view" title="Reset 3D view">↺</button></div>}
      <span className="sr-only" role="status">{state === "loading" ? "Loading 3D sculpture" : state === "fallback" ? "3D is unavailable. A static material study is shown." : "3D sculpture ready"}</span>
    </div>
  );
}
