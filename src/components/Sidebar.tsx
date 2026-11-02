"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";

const navItems = [
  { href: "/", label: "Home" }, { href: "/projects", label: "Work" },
  { href: "/blog", label: "Blog" }, { href: "/wiki", label: "Wiki" },
  { href: "/rss", label: "RSS" }, { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [dark, setDark] = useState(true);
  const dialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const previousOverflow = useRef("");
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      let saved = true;
      try { saved = localStorage.getItem("theme") !== "light"; } catch {}
      setDark(saved);
      document.documentElement.classList.toggle("dark", saved);
      document.documentElement.style.colorScheme = saved ? "dark" : "light";
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", saved ? "#141323" : "#f8f5f1");
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    const activeDark = document.documentElement.classList.contains("dark");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", activeDark ? "#141323" : "#f8f5f1");
  }, [pathname]);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1000px)");
    const closeOnDesktop = () => { if (query.matches) dialog.current?.close(); };
    query.addEventListener("change", closeOnDesktop);
    return () => query.removeEventListener("change", closeOnDesktop);
  }, []);
  const toggleTheme = () => {
    const next = !document.documentElement.classList.contains("dark");
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.style.colorScheme = next ? "dark" : "light";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next ? "#141323" : "#f8f5f1");
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
  };
  const closeMenu = () => { dialog.current?.close(); };
  const openMenu = () => {
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.showModal();
  };
  const active = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <>
      <header className="studio-header">
        <Link href="/" className="studio-brand" aria-label="Chenmu — Home">
          <span className="brand-mark" aria-hidden="true">c<span>.</span></span>
          <span className="brand-name">CHENMU<small>SIYUAN ZHENG</small></span>
        </Link>
        <nav className="desktop-navigation motion-navigation" aria-label="Primary navigation">
          {navItems.map(item => <Link key={item.href} href={item.href} aria-current={active(item.href) ? "page" : undefined}>{item.label}</Link>)}
        </nav>
        <div className="header-actions">
          <button type="button" className="ui-icon-button theme-toggle" onClick={toggleTheme} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}><Icon name={dark ? "sun" : "moon"} /></button>
          <button ref={menuButton} type="button" className="menu-toggle" aria-label="Open navigation" aria-haspopup="dialog" onClick={openMenu}><span /><span /></button>
        </div>
      </header>
      <dialog ref={dialog} className="navigation-dialog" aria-label="Site navigation" onClick={event => { if (event.target === dialog.current) closeMenu(); }} onClose={() => { document.body.style.overflow = previousOverflow.current; menuButton.current?.focus(); }}>
        <div className="navigation-dialog-head"><span className="section-label">Navigation</span><button type="button" className="ui-icon-button" aria-label="Close navigation" onClick={closeMenu}><Icon name="close" /></button></div>
        <nav aria-label="Mobile navigation">{navItems.map((item, i) => <Link key={item.href} href={item.href} aria-current={active(item.href) ? "page" : undefined} onClick={closeMenu}><span>{String(i + 1).padStart(2, "0")}</span>{item.label}<Icon name="arrow-up-right" /></Link>)}</nav>
        <div className="navigation-dialog-foot"><span>SE &amp; Business Administration, NJU</span><a href="mailto:3578379159@qq.com">Email <Icon name="arrow-up-right" /></a></div>
      </dialog>
    </>
  );
}
