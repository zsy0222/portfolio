"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/wiki", label: "Wiki" },
  { href: "/rss", label: "RSS" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const linkItems = [
  { href: "https://github.com/zsy0222", label: "GitHub" },
  { href: "mailto:3578379159@qq.com", label: "Email" },
];

const wechatId = "chenmuqingtongyan";
const focusClasses =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg";

export default function Sidebar() {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setDark(localStorage.getItem("theme") === "dark");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen]);

  const copyWechat = async () => {
    await navigator.clipboard.writeText(wechatId);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const navigation = (mobile = false) => (
    <nav aria-label={mobile ? "Mobile navigation" : "Primary navigation"} className="flex flex-col gap-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive(item.href) ? "page" : undefined}
          className={`${mobile ? "text-[25px] py-2" : "text-[22px] py-1.5"} ${focusClasses} transition-colors hover:text-accent ${
            isActive(item.href)
              ? "text-ink font-semibold"
              : "text-body font-normal"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );

  const secondaryLinks = (
    <div className="flex flex-wrap gap-x-4 gap-y-2.5">
      {linkItems.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className={`text-[18px] text-muted hover:text-accent transition-colors ${focusClasses}`}
        >
          {link.label}
        </Link>
      ))}
      <button
        type="button"
        onClick={copyWechat}
        className={`text-[18px] text-muted hover:text-accent transition-colors cursor-pointer ${focusClasses}`}
        title="Copy WeChat ID"
      >
        <span aria-live="polite">{copied ? "Copied!" : "WeChat"}</span>
      </button>
    </div>
  );

  return (
    <>
      <header className="mobile-site-header sticky top-0 z-30 flex items-center justify-between border-b border-line bg-bg/95 px-5 pb-3 backdrop-blur-md lg:hidden">
        <Link
          href="/"
          className={`min-w-0 text-[17px] font-semibold tracking-[0.14em] text-ink ${focusClasses}`}
        >
          SIYUAN ZHENG
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDark((value) => !value)}
            className={`grid size-10 place-items-center rounded-full text-[19px] text-muted transition-colors hover:bg-card hover:text-accent ${focusClasses}`}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span aria-hidden="true">{dark ? "☀" : "☾"}</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className={`grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-card hover:text-accent ${focusClasses}`}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation-panel"
          >
            <span className="relative block h-4 w-5" aria-hidden="true">
              <span
                className={`absolute left-0 top-0 h-px w-5 bg-current transition-transform duration-200 ${
                  mobileOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] h-px w-5 bg-current transition-opacity duration-200 ${
                  mobileOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 h-px w-5 bg-current transition-transform duration-200 ${
                  mobileOpen ? "-translate-y-[8px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
        inert={!mobileOpen}
      >
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-ink/25 transition-opacity duration-200 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          id="mobile-navigation-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className={`mobile-nav-panel absolute right-0 top-0 flex h-full w-[min(86vw,360px)] flex-col overflow-y-auto border-l border-line bg-bg px-7 pt-8 shadow-2xl transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="mb-8 flex items-start justify-between">
            <div>
              <div className="text-[17px] font-semibold tracking-[0.14em] text-ink">
                SIYUAN ZHENG
              </div>
              <div className="mt-1 text-[15px] text-body">
                SE &amp; Business Administration, NJU
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className={`grid size-10 place-items-center rounded-full text-[24px] text-muted transition-colors hover:bg-card hover:text-accent ${focusClasses}`}
              aria-label="Close navigation"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          {navigation(true)}

          <div className="mt-auto border-t border-line pt-7">
            <div className="mb-5">
              <div className="mb-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">
                Currently
              </div>
              <p className="text-[17px] text-lead">
                Exploring quantitative analysis &amp; AI product management
              </p>
            </div>
            {secondaryLinks}
            <div className="mt-6 text-[15px] text-muted">&copy; 2026</div>
          </div>
        </div>
      </div>

      <aside className="sticky top-0 hidden h-screen w-[22%] min-w-[220px] shrink-0 flex-col border-r border-line px-8 py-12 lg:flex xl:px-10 xl:py-15">
        <div className="mb-1.5 flex items-center justify-between">
          <div className="text-[20px] font-semibold tracking-[0.16em] text-ink xl:text-[22px]">
            SIYUAN ZHENG
          </div>
          <button
            type="button"
            onClick={() => setDark((value) => !value)}
            className={`grid size-9 place-items-center rounded-full text-[20px] text-muted transition-colors hover:bg-card hover:text-accent ${focusClasses}`}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            title="Toggle Dark Mode"
          >
            <span aria-hidden="true">{dark ? "☀" : "☾"}</span>
          </button>
        </div>
        <div className="mb-8 text-[18px] font-medium text-body xl:text-[20px]">
          SE &amp; Business Administration, NJU
        </div>

        <div className="mb-8 flex items-center gap-2 text-[18px] font-medium text-lead xl:text-[20px]">
          <span className="size-[7px] shrink-0 rounded-full bg-accent" aria-hidden="true" />
          Available for work
        </div>

        <div className="mb-6 h-px bg-line" />
        <div className="mb-auto">{navigation()}</div>

        <div className="mt-8">
          <div className="mb-6">
            <div className="mb-2 text-[14px] font-semibold uppercase tracking-[0.14em] text-muted xl:text-[16px]">
              Currently
            </div>
            <div className="text-[18px] font-medium text-lead xl:text-[20px]">
              Exploring quantitative analysis &amp; AI product management
            </div>
          </div>
          <div className="mb-6">
            <div className="mb-2 text-[14px] font-semibold uppercase tracking-[0.14em] text-muted xl:text-[16px]">
              Based in
            </div>
            <div className="text-[18px] font-medium text-lead xl:text-[20px]">
              Wenzhou, CN
            </div>
          </div>
          <div className="mb-6 h-px bg-line" />
          {secondaryLinks}
          <div className="mt-4 text-[17px] text-muted xl:text-[20px]">&copy; 2026</div>
        </div>
      </aside>
    </>
  );
}
