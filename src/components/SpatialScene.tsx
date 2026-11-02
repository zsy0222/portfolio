"use client";

import { useEffect, useRef, useState } from "react";
import type { SpatialMaterial, SpatialRenderMode, SpatialSceneController } from "./spatial-scene-engine";
import "./spatial-scene.css";

const finishes: { value: SpatialMaterial; label: string }[] = [
  { value: "titanium", label: "Titanium" }, { value: "crystal", label: "Crystal" }, { value: "porcelain", label: "Porcelain" },
];

export default function SpatialScene({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<SpatialSceneController | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [mode, setMode] = useState<SpatialRenderMode>("webgl");
  const [material, setMaterial] = useState<SpatialMaterial>("titanium");
  const [playing, setPlaying] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const element = root.current; const canvasHost = host.current;
    if (!element || !canvasHost) return;
    let cancelled = false; let started = false;
    const load = async () => {
      if (started || cancelled) return;
      started = true;
      try {
        const { createSpatialScene } = await import("./spatial-scene-engine");
        if (cancelled) return;
        controller.current = createSpatialScene(canvasHost, {
          onReady: renderMode => { if (!cancelled) { setMode(renderMode); setState("ready"); } },
          onError: () => { if (!cancelled) setState("error"); },
          onPlayingChange: value => { if (!cancelled) setPlaying(value); },
          onZoomChange: value => { if (!cancelled) setZoom(value); },
        });
      } catch { if (!cancelled) setState("error"); }
    };
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { observer?.disconnect(); void load(); }
    }, { rootMargin: "180px" });
    if (observer) observer.observe(element); else void load();
    return () => { cancelled = true; observer?.disconnect(); controller.current?.dispose(); controller.current = null; };
  }, []);

  const chooseMaterial = (value: SpatialMaterial) => { controller.current?.setMaterial(value); setMaterial(value); };
  return (
    <div ref={root} className={`spatial-scene ${className}`} data-state={state} data-render-mode={mode}>
      <div className="spatial-toolbar">
        <div className="spatial-finishes" role="group" aria-label="Sculpture material">
          {finishes.map(finish => <button key={finish.value} type="button" disabled={state !== "ready"} aria-pressed={material === finish.value} data-finish={finish.value} onClick={() => chooseMaterial(finish.value)}><i aria-hidden="true" />{finish.label}</button>)}
        </div>
        <div className="spatial-view-controls" role="group" aria-label="Sculpture view controls">
          <button type="button" disabled={state !== "ready"} aria-pressed={playing} onClick={() => controller.current?.setPlaying(!playing)} aria-label={playing ? "Pause sculpture rotation" : "Play sculpture rotation"}><span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span>{playing ? "Pause" : "Play"}</button>
          <span className="spatial-control-divider" />
          <button type="button" disabled={state !== "ready" || zoom <= .75} aria-label="Zoom out sculpture" onClick={() => controller.current?.setZoom(zoom - .1)}>−</button>
          <output aria-label="Sculpture zoom">{Math.round(zoom * 100)}%</output>
          <button type="button" disabled={state !== "ready" || zoom >= 1.45} aria-label="Zoom in sculpture" onClick={() => controller.current?.setZoom(zoom + .1)}>+</button>
          <button type="button" disabled={state !== "ready"} aria-label="Reset sculpture view" onClick={() => controller.current?.reset()}>↺</button>
          <span className="spatial-mode-label">{state === "ready" ? mode === "canvas" ? "3D preview" : "LIVE / 360°" : state === "loading" ? "Loading…" : "Unavailable"}</span>
        </div>
      </div>
      <div ref={host} className="spatial-canvas-host" tabIndex={state === "ready" ? 0 : -1} role="group" aria-label="Interactive 3D sculpture. Drag for a full 360-degree view. Arrow keys rotate, plus and minus zoom, and Home resets." />
      {state === "loading" && <div className="spatial-loading" aria-hidden="true"><span /></div>}
      {state === "error" && <p className="spatial-error" role="status">The sculpture is unavailable in this browser.</p>}
      {state === "ready" && <div className="spatial-interaction-hint" aria-hidden="true">360° <span>DRAG TO EXPLORE</span></div>}
      <span className="sr-only" role="status">{state === "ready" ? `${material} material. ${mode === "canvas" ? "Interactive 3D preview with simplified lighting." : "Interactive WebGL rendering."}` : state === "loading" ? "Loading 3D sculpture" : "3D sculpture unavailable"}</span>
    </div>
  );
}
