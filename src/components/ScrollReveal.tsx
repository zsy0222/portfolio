"use client";
import { useEffect, useRef } from "react";
export default function ScrollReveal() {
  const marker = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const root = marker.current?.parentElement;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const sections = Array.from(root.querySelectorAll<HTMLElement>(":scope > section"));
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.setAttribute("data-entered", "true"); observer.unobserve(entry.target); }
    }), { threshold:0.06 });
    sections.forEach(section => { section.setAttribute("data-entered", section.getBoundingClientRect().top < window.innerHeight ? "true" : "false"); observer.observe(section); });
    return () => { observer.disconnect(); sections.forEach(section => section.removeAttribute("data-entered")); };
  }, []);
  return <span ref={marker} hidden />;
}
