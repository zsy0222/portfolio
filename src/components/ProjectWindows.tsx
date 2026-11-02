"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import Link from "next/link";
import { projects } from "@/data/projects";
import Icon from "./Icon";
import "./project-windows.css";

type Phase = "open" | "minimizing" | "minimized" | "closing";
type ProjectWindow = { id: string; x: number; y: number; phase: Phase };
type FocusRequest = { id: string; target: "panel" | "dock" | "return" };
type Drag = { id: string; pointerId: number; startX: number; startY: number; x: number; y: number; width: number; height: number };
const WindowContext = createContext<{ openProject: (id: string) => void } | null>(null);
const mobileQuery = "(max-width: 700px)";
const subscribeMobile = (listener: () => void) => {
  const media = window.matchMedia(mobileQuery);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
};
const mobileSnapshot = () => window.matchMedia(mobileQuery).matches;
const serverSnapshot = () => false;
const clamp = (n: number, minimum: number, maximum: number) => Math.min(Math.max(minimum, maximum), Math.max(minimum, n));
const windowSize = () => ({ width: Math.min(570, window.innerWidth - 32), height: Math.min(650, window.innerHeight - 132) });
const fitPosition = (x: number, y: number, width: number, height: number) => ({
  x: clamp(x, 16, window.innerWidth - width - 16),
  y: clamp(y, 16, window.innerHeight - height - 90),
});

export function useProjectWindows() {
  const context = useContext(WindowContext);
  if (!context) throw new Error("useProjectWindows must be inside ProjectWindowsProvider");
  return context;
}

/** A small, local workspace; all project text comes from the existing catalog. */
export function ProjectWindowsProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<ProjectWindow[]>([]);
  const mobile = useSyncExternalStore(subscribeMobile, mobileSnapshot, serverSnapshot);
  const workspace = useRef<HTMLDivElement>(null);
  const panels = useRef(new Map<string, HTMLElement>());
  const dockButtons = useRef(new Map<string, HTMLButtonElement>());
  const triggers = useRef(new Map<string, HTMLElement>());
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const focusRequest = useRef<FocusRequest | null>(null);
  const drag = useRef<Drag | null>(null);
  const dragFrame = useRef(0);
  const pointerPosition = useRef({ x: 0, y: 0 });
  const activeId = windows.findLast(item => item.phase !== "minimized")?.id;
  const isModal = mobile && !!activeId;

  const front = useCallback((id: string) => {
    setWindows(current => {
      const target = current.find(item => item.id === id);
      return !target || current.at(-1)?.id === id ? current : [...current.filter(item => item.id !== id), target];
    });
  }, []);

  const openProject = useCallback((id: string) => {
    if (!projects.some(project => project.id === id)) return;
    const source = document.activeElement;
    if (source instanceof HTMLElement && !source.closest(".project-workspace")) triggers.current.set(id, source);
    const timer = timers.current.get(id);
    if (timer) { clearTimeout(timer); timers.current.delete(id); }
    focusRequest.current = { id, target: "panel" };
    const size = windowSize();
    const width = window.innerWidth;
    const height = window.innerHeight;
    setWindows(current => {
      const target = current.find(item => item.id === id);
      if (target) return [...current.filter(item => item.id !== id), { ...target, phase: "open" }];
      // Windows contain no unsaved input. The least recently used one makes room for a fourth.
      const retained = current.slice(-2);
      const offset = retained.length * 28;
      const position = fitPosition((width - size.width) / 2 + offset, (height - size.height - 70) / 2 + offset, size.width, size.height);
      return [...retained, { id, ...position, phase: "open" }];
    });
  }, []);

  const contextValue = useMemo(() => ({ openProject }), [openProject]);

  const dismiss = useCallback((id: string, minimize = false) => {
    const existing = timers.current.get(id);
    if (existing) clearTimeout(existing);
    setWindows(current => current.map(item => item.id === id ? { ...item, phase: minimize ? "minimizing" : "closing" } : item));
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 200;
    const timer = setTimeout(() => {
      timers.current.delete(id);
      if (!dockButtons.current.has(id)) return;
      const focused = document.activeElement;
      if (panels.current.get(id)?.contains(focused) || dockButtons.current.get(id) === focused) {
        focusRequest.current = { id, target: minimize ? "dock" : "return" };
      }
      setWindows(current => minimize ? current.map(item => item.id === id ? { ...item, phase: "minimized" } : item) : current.filter(item => item.id !== id));
    }, duration);
    timers.current.set(id, timer);
  }, []);

  const center = useCallback((id: string) => {
    const panel = panels.current.get(id);
    const size = panel?.getBoundingClientRect() ?? windowSize();
    const position = fitPosition((window.innerWidth - size.width) / 2, (window.innerHeight - size.height - 70) / 2, size.width, size.height);
    setWindows(current => current.map(item => item.id === id ? { ...item, ...position } : item));
  }, []);

  useEffect(() => {
    const request = focusRequest.current;
    if (!request) return;
    focusRequest.current = null;
    const target = request.target === "panel" ? panels.current.get(request.id)
      : request.target === "dock" ? dockButtons.current.get(request.id) : triggers.current.get(request.id);
    if (target?.isConnected && target.getClientRects().length && !target.closest("[inert]")) target.focus({ preventScroll: true });
    else if (activeId) panels.current.get(activeId)?.focus({ preventScroll: true });
    else document.getElementById("main-content")?.focus({ preventScroll: true });
    if (request.target === "return") triggers.current.delete(request.id);
  }, [windows, activeId, mobile]);

  useEffect(() => {
    const currentIds = new Set(windows.map(item => item.id));
    timers.current.forEach((timer, id) => {
      if (!currentIds.has(id)) { clearTimeout(timer); timers.current.delete(id); }
    });
    triggers.current.forEach((_, id) => { if (!currentIds.has(id)) triggers.current.delete(id); });
  }, [windows]);

  const dismissAll = () => {
    timers.current.forEach(clearTimeout);
    timers.current.clear(); triggers.current.clear(); focusRequest.current = null;
    cancelAnimationFrame(dragFrame.current); dragFrame.current = 0; drag.current = null;
    setWindows([]);
  };

  useEffect(() => {
    if (!isModal) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    // A desktop window may already be open when the viewport becomes narrow.
    if (!(previousFocus instanceof HTMLElement) || !workspace.current?.contains(previousFocus)) {
      panels.current.get(activeId!)?.focus({ preventScroll: true });
    }
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isModal, activeId]);

  useEffect(() => {
    const fit = () => {
      drag.current = null;
      cancelAnimationFrame(dragFrame.current); dragFrame.current = 0;
      if (window.matchMedia(mobileQuery).matches) return;
      const size = windowSize();
      setWindows(current => current.map(item => ({ ...item, ...fitPosition(item.x, item.y, size.width, size.height) })));
    };
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => { pending.forEach(clearTimeout); cancelAnimationFrame(dragFrame.current); };
  }, []);

  const startDrag = (event: PointerEvent<HTMLButtonElement>, item: ProjectWindow) => {
    if (mobile || event.button !== 0 || item.phase !== "open") return;
    const panel = panels.current.get(item.id);
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    event.preventDefault();
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { id: item.id, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, x: item.x, y: item.y, width: rect.width, height: rect.height };
    front(item.id);
  };
  const flushDrag = () => {
    dragFrame.current = 0;
    const moving = drag.current;
    if (!moving) return;
    const position = fitPosition(moving.x + pointerPosition.current.x - moving.startX, moving.y + pointerPosition.current.y - moving.startY, moving.width, moving.height);
    setWindows(current => current.map(item => item.id === moving.id ? { ...item, ...position } : item));
  };
  const moveDrag = (event: PointerEvent<HTMLButtonElement>) => {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return;
    pointerPosition.current = { x: event.clientX, y: event.clientY };
    if (!dragFrame.current) dragFrame.current = requestAnimationFrame(flushDrag);
  };
  const stopDrag = (event: PointerEvent<HTMLButtonElement>) => {
    if (drag.current?.pointerId !== event.pointerId) return;
    if (dragFrame.current) { cancelAnimationFrame(dragFrame.current); flushDrag(); }
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const moveKey = (event: KeyboardEvent<HTMLButtonElement>, item: ProjectWindow) => {
    if (mobile) return;
    if (event.key === "Home") { event.preventDefault(); center(item.id); return; }
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    const size = panels.current.get(item.id)?.getBoundingClientRect() ?? windowSize();
    const step = event.shiftKey ? 50 : 20;
    const position = fitPosition(item.x + (event.key === "ArrowRight" ? step : event.key === "ArrowLeft" ? -step : 0), item.y + (event.key === "ArrowDown" ? step : event.key === "ArrowUp" ? -step : 0), size.width, size.height);
    setWindows(current => current.map(entry => entry.id === item.id ? { ...entry, ...position } : entry));
  };
  const workspaceKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && activeId) {
      event.preventDefault(); event.stopPropagation();
      const panelId = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-project-window]")?.dataset.projectWindow : undefined;
      dismiss(panelId ?? activeId);
    }
    if (event.key !== "Tab" || !isModal || !workspace.current) return;
    const focusable = [...workspace.current.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])')].filter(element => element.getClientRects().length > 0);
    const first = focusable[0]; const last = focusable.at(-1);
    if (!first || !last) return;
    const focused = document.activeElement;
    if (event.shiftKey && (focused === first || !focusable.includes(focused as HTMLElement))) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && (focused === last || !focusable.includes(focused as HTMLElement))) { event.preventDefault(); first.focus(); }
  };

  return (
    <WindowContext.Provider value={contextValue}>
      <div className="project-workspace-page" inert={isModal} data-windows-open={windows.length > 0}>{children}</div>
      {windows.length > 0 && <div ref={workspace} className="project-workspace" data-modal={isModal} onKeyDown={workspaceKeys}
        role={isModal ? "dialog" : undefined} aria-modal={isModal || undefined} aria-label={isModal ? "Project workspace" : undefined}>
        {windows.map((item, index) => {
          const project = projects.find(entry => entry.id === item.id)!;
          if (item.phase === "minimized" || (mobile && item.id !== activeId)) return null;
          const number = String(projects.indexOf(project) + 1).padStart(2, "0");
          return <section key={item.id} ref={element => { if (element) panels.current.set(item.id, element); else panels.current.delete(item.id); }}
            className="project-window" data-phase={item.phase} data-active={item.id === activeId} data-project-window={item.id}
            style={{ left: item.x, top: item.y, zIndex: 110 + index } as CSSProperties} tabIndex={-1}
            role={mobile ? "group" : "dialog"} aria-labelledby={`project-window-title-${item.id}`} onPointerDown={() => front(item.id)} onFocusCapture={() => front(item.id)}>
            <header className="project-window-bar">
              <button type="button" className="project-window-move" onPointerDown={event => startDrag(event, item)} onPointerMove={moveDrag}
                onPointerUp={stopDrag} onPointerCancel={stopDrag} onLostPointerCapture={stopDrag} onKeyDown={event => moveKey(event, item)}
                aria-label={mobile ? project.title : `Move ${project.title}. Use arrow keys; Home centers the window.`} title={mobile ? project.title : "Drag to move · Arrow keys to move · Home to center"}>
                <span aria-hidden="true" className="project-window-grip">⠿</span><span>{number} / Project</span>
              </button>
              <div className="project-window-actions">
                {!mobile && <button type="button" onClick={() => center(item.id)} aria-label={`Center ${project.title} window`} title="Center window"><span aria-hidden="true">↺</span></button>}
                <button type="button" onClick={() => dismiss(item.id, true)} aria-label={`Minimize ${project.title}`} title="Minimize"><span aria-hidden="true">−</span></button>
                <button type="button" onClick={() => dismiss(item.id)} aria-label={`Close ${project.title}`} title="Close"><Icon name="close" /></button>
              </div>
            </header>
            <div className="project-window-scroll">
              <div className="project-window-intro"><span className="project-window-status">{project.status}</span><h2 id={`project-window-title-${item.id}`}>{project.title}</h2><p>{project.description}</p></div>
              <div className="project-window-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
              <div className="project-window-body"><h3>My role</h3><p>{project.role}</p><h3>Selected outcomes</h3><ol>{project.highlights.map((text, i) => <li key={text}><span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><p>{text}</p></li>)}</ol></div>
              <div className="project-window-links">
                <Link href={`/projects#${project.id}`} onClick={dismissAll}>Read on Work page <Icon name="arrow-up-right" /></Link>
                {project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">Repository <Icon name="arrow-up-right" /></a>}
                {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">View project <Icon name="arrow-up-right" /></a>}
              </div>
              {project.availability && <p className="project-window-availability">{project.availability}</p>}
            </div>
          </section>;
        })}
        <nav className="project-window-dock" aria-label="Open project windows">
          <span className="project-dock-label">Workspace <b>{windows.length}/3</b></span>
          <div className="project-dock-items">{windows.map(item => {
            const project = projects.find(entry => entry.id === item.id)!;
            const selected = item.id === activeId && item.phase !== "minimized";
            return <button key={item.id} ref={element => { if (element) dockButtons.current.set(item.id, element); else dockButtons.current.delete(item.id); }}
              type="button" className="project-dock-item" data-active={selected} data-minimized={item.phase === "minimized"} onClick={() => openProject(item.id)}
              aria-label={`${item.phase === "minimized" ? "Restore" : "Focus"} ${project.title}`} aria-pressed={selected} title={project.title}>
              <span className="project-dock-index" aria-hidden="true">{String(projects.indexOf(project) + 1).padStart(2, "0")}</span><span className="project-dock-title">{project.title}</span><i aria-hidden="true" />
            </button>;
          })}</div>
        </nav>
      </div>}
    </WindowContext.Provider>
  );
}
