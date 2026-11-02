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

    const animate = (element: HTMLElement, frames: Keyframe[], options: KeyframeAnimationOptions = {}) => {
      if (reduced.matches || document.hidden || typeof element.animate !== "function") return;
      try {
        const animation = element.animate(frames, {
          duration: 680, easing: "cubic-bezier(.16,1,.3,1)", fill: "backwards", ...options,
        });
        animations.add(animation);
        animation.onfinish = animation.oncancel = () => animations.delete(animation);
      } catch {
        // Some browsers cannot animate pseudo-elements; the static rule remains.
      }
    };

    const reveal = (element: HTMLElement) => {
      if (reduced.matches) return;
      const bounds = element.getBoundingClientRect();
      // Committed routes already fade once. Do not animate their visible children again.
      if (root.dataset.routeTransition === "entering" && bounds.top < window.innerHeight) return;
      const delay = Math.min(140, Math.max(0, parseFloat(element.style.animationDelay) || 0));

      if (element.matches(".home-journal-row, .journal-entry")) {
        const title = element.querySelector<HTMLElement>("h2, h3");
        if (title) animate(title, [{ opacity: .35, translate: "8px 0" }, { opacity: 1, translate: "0 0" }]);
        animate(element, [{ scale: "0 1" }, { scale: "1 1" }], { pseudoElement: "::after", duration: 850 });
        return;
      }
      if (element.dataset.motion === "timeline") {
        const dot = element.querySelector<HTMLElement>(".archive-timeline-date > span");
        const copy = element.querySelector<HTMLElement>(".archive-timeline-copy");
        if (dot) animate(dot, [{ scale: ".25", opacity: .2 }, { scale: "1", opacity: 1 }], { duration: 480 });
        if (copy) animate(copy, [{ opacity: .4 }, { opacity: 1 }], { duration: 700 });
        animate(element, [{ scale: "1 0" }, { scale: "1 1" }], { pseudoElement: "::before", duration: 900 });
        return;
      }
      if (element.matches(".home-about")) {
        element.querySelectorAll<HTMLElement>(".home-about-copy em").forEach((word, index) => {
          animate(word, [{ backgroundSize: "0% 100%" }, { backgroundSize: "100% 100%" }], { duration: 950, delay: index * 170 });
        });
        const mark = element.querySelector<HTMLElement>(".about-asterisk");
        if (mark) animate(mark, [{ rotate: "-70deg", opacity: .35 }, { rotate: "0deg", opacity: 1 }], { duration: 1000 });
        return;
      }
      if (element.dataset.motion === "contact") {
        animate(element, [{ scale: "0 1" }, { scale: "1 1" }], { pseudoElement: "::after", duration: 720 });
        const icon = element.querySelector<HTMLElement>(".ui-icon");
        if (icon) animate(icon, [{ opacity: 0, translate: "-7px 0" }, { opacity: 1, translate: "0 0" }], { duration: 500, delay: 140 });
        return;
      }
      if (element.matches(".about-archive-section")) {
        const heading = element.querySelector<HTMLElement>(".about-section-heading");
        if (heading) animate(heading, [{ opacity: .35, translate: "-12px 0" }, { opacity: 1, translate: "0 0" }]);
        // Only the small skill labels assemble; long-form archive text stays still.
        element.querySelectorAll<HTMLElement>(".about-skills > span").forEach((tag, index) => {
          animate(tag, [{ opacity: .2, translate: "0 7px" }, { opacity: 1, translate: "0 0" }], { duration: 440, delay: Math.min(index * 35, 250) });
        });
        return;
      }
      const isPlate = element.classList.contains("ui-card-enter") || element.classList.contains("work-project");
      animate(element, isPlate ? [
        { opacity: .15, translate: "0 24px", scale: ".985" },
        { opacity: 1, translate: "0 0", scale: "1" },
      ] : [
        { opacity: .3, translate: "0 12px" },
        { opacity: 1, translate: "0 0" },
      ], { duration: isPlate ? 800 : 600, delay });
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
      const origin = event.target instanceof Element ? event.target : null;
      const target = origin?.closest<HTMLElement>(".home-work-visual, .work-project-art, .portrait-print, .studio-footer, .pg-card-visual")
        ?? origin?.closest(".pg-card")?.querySelector<HTMLElement>(".pg-card-visual") ?? null;
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
