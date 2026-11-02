"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Progressive enhancement: content stays visible without JS or motion support. */
export default function MotionEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.getElementById("main-content");
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const registered = new WeakSet<Element>();
    const animations = new Set<Animation>();
    let observer: IntersectionObserver | undefined;
    let activeCard: HTMLElement | null = null;
    let frame = 0;
    let latestX = 0;
    let latestY = 0;

    const resetCard = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (!activeCard) return;
      for (const property of ["--tilt-x", "--tilt-y", "--pointer-x", "--pointer-y"])
        activeCard.style.removeProperty(property);
      activeCard = null;
    };

    const reveal = (element: HTMLElement) => {
      if (reduced.matches || typeof element.animate !== "function") return;
      const isCard = element.classList.contains("ui-card-enter");
      const isTimeline = element.dataset.motion === "timeline";
      const delay = Math.min(140, Math.max(0, parseFloat(element.style.animationDelay) || 0));
      const animation = element.animate([
        { opacity: 0, translate: isTimeline ? "-12px 0" : `0 ${isCard ? 22 : 16}px` },
        { opacity: 1, translate: "0 0" },
      ], { duration: isCard ? 620 : 520, delay, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" });
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
        // Don't replay items above the viewport after history/scroll restoration.
        if (element.getBoundingClientRect().bottom <= 0) return;
        observer?.observe(element);
      });
    };
    register();
    const mutations = new MutationObserver(register);
    mutations.observe(root, { childList: true, subtree: true });

    const pointerMove = (event: PointerEvent) => {
      if (reduced.matches || !finePointer.matches || event.pointerType !== "mouse") return;
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>(".motion-project-card") : null;
      if (!target) { resetCard(); return; }
      if (activeCard !== target) { resetCard(); activeCard = target; }
      latestX = event.clientX; latestY = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!activeCard) return;
        const rect = activeCard.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (latestX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (latestY - rect.top) / rect.height));
        activeCard.style.setProperty("--tilt-x", `${(0.5 - y) * 1.5}deg`);
        activeCard.style.setProperty("--tilt-y", `${(x - 0.5) * 1.5}deg`);
        activeCard.style.setProperty("--pointer-x", `${x * 100}%`);
        activeCard.style.setProperty("--pointer-y", `${y * 100}%`);
      });
    };
    const preferenceChanged = () => {
      resetCard();
      if (reduced.matches) animations.forEach(animation => animation.cancel());
    };
    root.addEventListener("pointermove", pointerMove, { passive: true });
    root.addEventListener("pointerleave", resetCard);
    window.addEventListener("scroll", resetCard, { passive: true });
    window.addEventListener("blur", resetCard);
    reduced.addEventListener("change", preferenceChanged);
    finePointer.addEventListener("change", preferenceChanged);
    return () => {
      observer?.disconnect(); mutations.disconnect(); resetCard();
      animations.forEach(animation => animation.cancel());
      root.removeEventListener("pointermove", pointerMove);
      root.removeEventListener("pointerleave", resetCard);
      window.removeEventListener("scroll", resetCard);
      window.removeEventListener("blur", resetCard);
      reduced.removeEventListener("change", preferenceChanged);
      finePointer.removeEventListener("change", preferenceChanged);
    };
  }, [pathname]);

  return null;
}
