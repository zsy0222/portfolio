"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { projects, type Project } from "@/data/projects";
import ProjectVisual from "./ProjectVisual";
import Icon from "./Icon";
import { useProjectWindows } from "./ProjectWindows";
import "./project-gallery.css";

type Layout = "gallery" | "editorial" | "canvas" | "orbit";
type Point = { x: number; y: number };
type Drag = { id: string; pointerId: number; start: Point; origin: Point; handle: HTMLButtonElement };
const layouts: { id: Layout; label: string }[] = [
  { id: "gallery", label: "Gallery" },
  { id: "editorial", label: "Editorial" },
  { id: "canvas", label: "Canvas" },
  { id: "orbit", label: "Orbit" },
];
const initialPoints = [
  { x: .025, y: .035 }, { x: .5, y: .095 }, { x: .98, y: .02 },
  { x: .065, y: .93 }, { x: .55, y: .99 }, { x: .95, y: .85 },
];
const clamp = (value: number, max: number) => Math.min(Math.max(0, max), Math.max(0, value));

export default function ProjectGallery() {
  const { openProject } = useProjectWindows();
  const [layout, setLayout] = useState<Layout>("gallery");
  const [positions, setPositions] = useState<Record<string, Point>>({});
  const positionsRef = useRef<Record<string, Point>>({});
  const [dragging, setDragging] = useState<string | null>(null);
  const [topCard, setTopCard] = useState<string | null>(null);
  const [orbitTurn, setOrbitTurn] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const stage = useRef<HTMLDivElement>(null);
  const cardNodes = useRef<Record<string, HTMLElement | null>>({});
  const drag = useRef<Drag | null>(null);
  const instructionId = useId();
  const stageId = useId();
  const activeOrbit = ((orbitTurn % projects.length) + projects.length) % projects.length;

  const updatePositions = useCallback((next: Record<string, Point>) => {
    positionsRef.current = next;
    setPositions(next);
  }, []);

  const endDrag = useCallback(() => {
    const current = drag.current;
    drag.current = null;
    if (current?.handle.hasPointerCapture(current.pointerId)) current.handle.releasePointerCapture(current.pointerId);
    setDragging(null);
  }, []);

  const placeCards = useCallback((reset = false) => {
    const board = stage.current;
    if (!board) return;
    const next: Record<string, Point> = {};
    projects.forEach((project, index) => {
      const card = cardNodes.current[project.id];
      if (!card) return;
      const maxX = Math.max(0, board.clientWidth - card.offsetWidth);
      const maxY = Math.max(0, board.clientHeight - card.offsetHeight);
      const initial = initialPoints[index % initialPoints.length];
      const previous = !reset && positionsRef.current[project.id];
      next[project.id] = previous
        ? { x: clamp(previous.x, maxX), y: clamp(previous.y, maxY) }
        : { x: maxX * initial.x, y: maxY * initial.y };
    });
    updatePositions(next);
  }, [updatePositions]);

  useLayoutEffect(() => {
    if (layout !== "canvas") return;
    placeCards();
    const board = stage.current;
    const resize = () => { endDrag(); placeCards(); };
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }
    const observer = new ResizeObserver(resize);
    if (board) observer.observe(board);
    Object.values(cardNodes.current).forEach(card => { if (card) observer.observe(card); });
    return () => observer.disconnect();
  }, [layout, placeCards, endDrag]);

  useEffect(() => () => {
    const current = drag.current;
    drag.current = null;
    if (current?.handle.hasPointerCapture(current.pointerId)) current.handle.releasePointerCapture(current.pointerId);
  }, []);

  const selectLayout = (next: Layout) => {
    endDrag();
    setLayout(next);
    setAnnouncement(`${layouts.find(item => item.id === next)?.label} layout selected.`);
  };

  const moveCard = (id: string, point: Point) => {
    const board = stage.current;
    const card = cardNodes.current[id];
    if (!board || !card) return;
    updatePositions({ ...positionsRef.current, [id]: {
      x: clamp(point.x, board.clientWidth - card.offsetWidth),
      y: clamp(point.y, board.clientHeight - card.offsetHeight),
    } });
  };

  const startDrag = (event: PointerEvent<HTMLButtonElement>, id: string) => {
    if (layout !== "canvas" || event.button !== 0 || window.matchMedia("(max-width: 760px)").matches) return;
    event.preventDefault();
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { id, pointerId: event.pointerId, start: { x: event.clientX, y: event.clientY }, origin: positionsRef.current[id] || { x: 0, y: 0 }, handle: event.currentTarget };
    setDragging(id);
    setTopCard(id);
  };

  const dragMove = (event: PointerEvent<HTMLButtonElement>) => {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    moveCard(current.id, { x: current.origin.x + event.clientX - current.start.x, y: current.origin.y + event.clientY - current.start.y });
  };

  const moveWithKeys = (event: KeyboardEvent<HTMLButtonElement>, project: Project, index: number) => {
    const point = positionsRef.current[project.id] || { x: 0, y: 0 };
    const step = event.shiftKey ? 40 : 12;
    const changes: Record<string, Point> = { ArrowLeft: { x: -step, y: 0 }, ArrowRight: { x: step, y: 0 }, ArrowUp: { x: 0, y: -step }, ArrowDown: { x: 0, y: step } };
    if (changes[event.key]) {
      event.preventDefault();
      setTopCard(project.id);
      moveCard(project.id, { x: point.x + changes[event.key].x, y: point.y + changes[event.key].y });
    } else if (event.key === "Home") {
      event.preventDefault();
      const board = stage.current, card = cardNodes.current[project.id];
      if (board && card) moveCard(project.id, { x: (board.clientWidth - card.offsetWidth) * initialPoints[index].x, y: (board.clientHeight - card.offsetHeight) * initialPoints[index].y });
      setAnnouncement(`${project.title} position reset.`);
    }
  };

  const turnOrbit = (amount: number) => setOrbitTurn(turn => turn + amount);
  const selectOrbit = (index: number) => setOrbitTurn(turn => {
    const current = ((turn % projects.length) + projects.length) % projects.length;
    const distance = ((index - current + projects.length * 1.5) % projects.length) - projects.length / 2;
    return turn + distance;
  });
  const orbitKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLInputElement || (event.target instanceof Element && event.target.closest(".pg-open"))) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault(); turnOrbit(event.key === "ArrowLeft" ? -1 : 1);
    } else if (event.key === "Home") { event.preventDefault(); selectOrbit(0); }
  };

  const renderCard = (project: Project, index: number) => {
    const isOrbit = layout === "orbit";
    const active = !isOrbit || activeOrbit === index;
    const point = positions[project.id] || { x: 0, y: 0 };
    const style = {
      "--pg-index": index,
      "--pg-x": `${point.x}px`,
      "--pg-y": `${point.y}px`,
      "--pg-angle": `${index * (360 / projects.length)}deg`,
      zIndex: layout === "canvas" ? topCard === project.id ? 20 : index + 1 : undefined,
    } as CSSProperties;
    return (
      <article key={project.id} ref={node => { cardNodes.current[project.id] = node; }}
        className={`pg-card pg-card-${index + 1}${dragging === project.id ? " is-dragging" : ""}${isOrbit && active ? " is-current" : ""}`}
        style={style} aria-hidden={isOrbit && !active ? true : undefined}>
        {layout === "canvas" && <button type="button" className="pg-drag-handle"
          aria-label={`Move ${project.title}`} aria-describedby={instructionId}
          onPointerDown={event => startDrag(event, project.id)} onPointerMove={dragMove}
          onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={() => { drag.current = null; setDragging(null); }}
          onKeyDown={event => moveWithKeys(event, project, index)}>
          <span>{String(index + 1).padStart(2, "0")}</span><span className="pg-grip" aria-hidden="true">⠿</span><span className="pg-handle-word">Move</span>
        </button>}
        <div className="pg-card-visual"><ProjectVisual variant={index} /></div>
        <div className="pg-card-copy">
          <div className="pg-card-meta"><span className="pg-card-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><span>{project.status}</span></div>
          <h3><button type="button" className="pg-open" disabled={!active} tabIndex={active ? 0 : -1}
            aria-label={`Open ${project.title} in a project window`} aria-haspopup="dialog"
            onClick={() => { if (active) openProject(project.id); }}>
            <span>{project.title}</span><Icon name="arrow-up-right" />
          </button></h3>
          <p className="pg-card-description">{project.description}</p>
        </div>
      </article>
    );
  };

  return (
    <div className="project-gallery" data-layout={layout}>
      <div className="pg-toolbar">
        <div className="pg-layout-picker" role="group" aria-label="Project display layout">
          {layouts.map((item, index) => <button key={item.id} type="button" aria-pressed={layout === item.id} aria-controls={stageId}
            onClick={() => selectLayout(item.id)}><span aria-hidden="true">0{index + 1}</span>{item.label}</button>)}
        </div>
        <span className="pg-count">{String(projects.length).padStart(2, "0")} projects</span>
      </div>
      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>

      {layout === "canvas" && <div className="pg-canvas-tools">
        <p id={instructionId}><span className="pg-desktop-hint">Drag the handles to arrange. Arrow keys move a focused handle; Home resets it.</span><span className="pg-mobile-hint">Tap a project to open its window.</span></p>
        <button type="button" className="pg-reset" onClick={() => { endDrag(); placeCards(true); setTopCard(null); setAnnouncement("Canvas positions reset."); }}>Reset canvas <Icon name="arrow-up-right" /></button>
      </div>}

      {layout === "orbit" ? <div id={stageId} className="pg-orbit" role="region" tabIndex={0} aria-label="Project orbit. Use left and right arrow keys to rotate." onKeyDown={orbitKeys}>
        <div className="pg-orbit-topline"><span>360° / Project orbit</span><span>{String(activeOrbit + 1).padStart(2, "0")} — {String(projects.length).padStart(2, "0")}</span></div>
        <div className="pg-orbit-stage">
          <div className="pg-orbit-ring" style={{ "--pg-turn": `${orbitTurn * -360 / projects.length}deg` } as CSSProperties}>
            {projects.map(renderCard)}
          </div>
        </div>
        <div className="pg-orbit-controls">
          <button type="button" aria-label="Previous project" onClick={() => turnOrbit(-1)}><Icon name="arrow-left" /></button>
          <div className="pg-orbit-progress">
            <label htmlFor={`${stageId}-orbit`}>Project {activeOrbit + 1} of {projects.length}</label>
            <input id={`${stageId}-orbit`} type="range" min={0} max={projects.length - 1} step={1} value={activeOrbit}
              aria-label="Select project in orbit" aria-valuetext={projects[activeOrbit].title}
              onChange={event => selectOrbit(Number(event.target.value))} />
          </div>
          <button type="button" aria-label="Next project" onClick={() => turnOrbit(1)}><Icon name="arrow-right" /></button>
        </div>
        <p className="pg-orbit-current" aria-live="polite" aria-atomic="true">{projects[activeOrbit].title}</p>
      </div> : <div key={layout} id={stageId} className="pg-stage" ref={stage}>{projects.map(renderCard)}</div>}
    </div>
  );
}
