"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import "./page-transition.css";

/** Navigation remains owned by Next; this decorates only a committed route. */
export default function PageTransition() {
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const accent = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    const content = document.getElementById("main-content");
    if (!content) return;

    // Keep this marker after settling: removing it would restart CSS entrances.
    content.dataset.clientNavigation = "true";
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || document.hidden || typeof content.animate !== "function") return;
    const animations: Animation[] = [];
    content.dataset.routeTransition = "entering";
    const page = content.animate([{ opacity: .72 }, { opacity: 1 }], {
      duration: 360, easing: "cubic-bezier(.22,1,.36,1)",
    });
    animations.push(page);
    if (accent.current) {
      animations.push(accent.current.animate([
        { transform: "scaleX(0)", opacity: 0, offset: 0 },
        { transform: "scaleX(.16)", opacity: .8, offset: .12 },
        { transform: "scaleX(1)", opacity: .7, offset: .72 },
        { transform: "scaleX(1)", opacity: 0, offset: 1 },
      ], { duration: 520, easing: "cubic-bezier(.22,1,.36,1)" }));
    }
    page.onfinish = () => { delete content.dataset.routeTransition; };
    const stop = () => {
      if (!preference.matches && !document.hidden) return;
      animations.forEach(animation => animation.cancel());
      delete content.dataset.routeTransition;
    };
    preference.addEventListener("change", stop);
    document.addEventListener("visibilitychange", stop);
    return () => {
      animations.forEach(animation => animation.cancel());
      delete content.dataset.routeTransition;
      preference.removeEventListener("change", stop);
      document.removeEventListener("visibilitychange", stop);
    };
  }, [pathname]);

  return <div ref={accent} className="route-transition-accent" aria-hidden="true" />;
}
