"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Content is visible by default; every animation is a disposable enhancement. */
export default function MotionEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.getElementById("main-content");
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const registered = new WeakSet<Element>();
    const animations = new Set<Animation>();
    const hero = root.querySelector<HTMLElement>(".hero-portrait-composition");
    let observer: IntersectionObserver | undefined;
    let activeSurface: HTMLElement | null = null;
    let pointerFrame = 0;
    let scrollFrame = 0;
    let latestX = 0;
    let latestY = 0;

    const resetSurface = () => {
      cancelAnimationFrame(pointerFrame);
      pointerFrame = 0;
      if (!activeSurface) return;
      for (const property of ["--tilt-x", "--tilt-y", "--pointer-x", "--pointer-y"])
        activeSurface.style.removeProperty(property);
      activeSurface = null;
    };

    const reveal = (element: HTMLElement) => {
      if (reduced.matches || typeof element.animate !== "function") return;
      const isPlate = element.classList.contains("ui-card-enter") || element.classList.contains("work-project");
      const isLine = element.matches(".home-journal-row, .journal-entry") || element.dataset.motion === "timeline";
      const delay = Math.min(140, Math.max(0, parseFloat(element.style.animationDelay) || 0));
      const keyframes: Keyframe[] = isPlate ? [
        { opacity: 0, translate: "0 32px", scale: ".98", rotate: ".6deg" },
        { opacity: 1, translate: "0 0", scale: "1", rotate: "0deg" },
      ] : [
        { opacity: 0, translate: isLine ? "-18px 0" : "0 20px" },
        { opacity: 1, translate: "0 0" },
      ];
      const animation = element.animate(keyframes, {
        duration: isPlate ? 900 : 680, delay,
        easing: "cubic-bezier(.16,1,.3,1)", fill: "backwards",
      });
      animations.add(animation);
      animation.onfinish = animation.oncancel = () => animations.delete(animation);
    };

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver((records) => {
        for (const record of records) {
          if (!record.isIntersecting) continue;
          observer?.unobserve(record.target);
          reveal(record.target as HTMLElement);
        }
      }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });
    }

    const register = () => {
      root.querySelectorAll<HTMLElement>(".ui-card-enter, [data-motion]").forEach(element => {
        if (registered.has(element)) return;
        registered.add(element);
        // History navigation must not replay content above the restored position.
        if (element.getBoundingClientRect().bottom <= 0) return;
        observer?.observe(element);
      });
    };
    register();
    const mutations = new MutationObserver(register);
    mutations.observe(root, { childList: true, subtree: true });

    const pointerMove = (event: PointerEvent) => {
      if (reduced.matches || !finePointer.matches || event.pointerType !== "mouse") return;
      const target = event.target instanceof Element
        ? event.target.closest<HTMLElement>(".home-work-visual, .work-project-art, .portrait-print, .studio-footer") : null;
      if (!target) { resetSurface(); return; }
      if (activeSurface !== target) { resetSurface(); activeSurface = target; }
      latestX = event.clientX; latestY = event.clientY;
      if (pointerFrame) return;
      pointerFrame = requestAnimationFrame(() => {
        pointerFrame = 0;
        if (!activeSurface) return;
        const rect = activeSurface.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const x = Math.max(0, Math.min(1, (latestX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (latestY - rect.top) / rect.height));
        activeSurface.style.setProperty("--tilt-x", `${(0.5 - y) * 6}deg`);
        activeSurface.style.setProperty("--tilt-y", `${(x - 0.5) * 6}deg`);
        activeSurface.style.setProperty("--pointer-x", `${x * 100}%`);
        activeSurface.style.setProperty("--pointer-y", `${y * 100}%`);
      });
    };

    const scroll = () => {
      resetSurface();
      if (!hero || reduced.matches || !finePointer.matches || document.hidden || scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        const rect = hero.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
        hero.style.setProperty("--scroll-drift", `${progress * 24}px`);
      });
    };
    const preferenceChanged = () => {
      resetSurface();
      cancelAnimationFrame(scrollFrame); scrollFrame = 0;
      hero?.style.removeProperty("--scroll-drift");
      if (reduced.matches || document.hidden) animations.forEach(animation => animation.cancel());
    };
    // Animate only the opened contents; the disclosure itself remains a native control.
    const disclosure = (event: Event) => {
      const details = event.target;
      if (!(details instanceof HTMLDetailsElement) || !details.open || !details.matches(".work-project-details")) return;
      const body = details.querySelector<HTMLElement>(".work-project-detail-body");
      if (body) reveal(body);
    };
    root.addEventListener("pointermove", pointerMove, { passive: true });
    root.addEventListener("pointerleave", resetSurface);
    root.addEventListener("toggle", disclosure, true);
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("blur", resetSurface);
    document.addEventListener("visibilitychange", preferenceChanged);
    reduced.addEventListener("change", preferenceChanged);
    finePointer.addEventListener("change", preferenceChanged);
    return () => {
      observer?.disconnect(); mutations.disconnect(); resetSurface();
      cancelAnimationFrame(scrollFrame);
      hero?.style.removeProperty("--scroll-drift");
      animations.forEach(animation => animation.cancel());
      root.removeEventListener("pointermove", pointerMove);
      root.removeEventListener("pointerleave", resetSurface);
      root.removeEventListener("toggle", disclosure, true);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("blur", resetSurface);
      document.removeEventListener("visibilitychange", preferenceChanged);
      reduced.removeEventListener("change", preferenceChanged);
      finePointer.removeEventListener("change", preferenceChanged);
    };
  }, [pathname]);

  return null;
}
