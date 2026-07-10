"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/wiki", label: "Wiki" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const linkItems = [
  { href: "https://github.com/zsy0222", label: "GitHub" },
  { href: "mailto:3578379159@qq.com", label: "Email" },
];

const wechatId = "chenmuqingtongyan";

export default function Sidebar() {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const copyWechat = () => {
    navigator.clipboard.writeText(wechatId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="w-[22%] min-w-[220px] shrink-0 sticky top-0 h-screen border-r border-line flex flex-col px-10 py-15">
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-[22px] font-semibold tracking-[0.18em] text-ink">
          SIYUAN ZHENG
        </div>
        <button
          onClick={() => setDark(!dark)}
          className="text-[20px] text-muted hover:text-accent transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-accent rounded"
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          title="Toggle dark mode"
        >
          {dark ? "☀" : "☾"}
        </button>
      </div>
      <div className="text-[20px] font-medium text-body mb-9">
        SE &amp; Business Administration, NJU
      </div>

      <div className="flex items-center gap-2 text-[20px] font-medium text-lead mb-9">
        <span className="w-[7px] h-[7px] rounded-full bg-accent shrink-0" />
        Available for work
      </div>

      <div className="h-px bg-line mb-7" />

      <nav className="flex flex-col gap-0.5 mb-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-[22px] py-1.5 transition-colors hover:text-accent ${
              pathname === item.href
                ? "text-ink font-semibold"
                : "text-body font-normal"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-10">
        <div className="mb-7">
          <div className="text-[16px] font-medium tracking-[0.14em] uppercase text-muted mb-2">
            Currently
          </div>
          <div className="text-[20px] font-medium text-lead">
            Exploring quantitative analysis &amp; AI product management
          </div>
        </div>
        <div className="mb-7">
          <div className="text-[16px] font-medium tracking-[0.14em] uppercase text-muted mb-2">
            Based in
          </div>
          <div className="text-[20px] font-medium text-lead">
            Wenzhou, CN
          </div>
        </div>
        <div className="h-px bg-line mb-7" />
        <div className="flex flex-wrap gap-x-4 gap-y-2.5 mb-4">
          {linkItems.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[20px] text-muted hover:text-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={copyWechat}
            className="text-[20px] text-muted hover:text-accent transition-colors cursor-pointer"
            title="Click to copy WeChat ID"
          >
            {copied ? "Copied!" : "WeChat"}
          </button>
        </div>
        <div className="text-[20px] text-muted">&copy; 2026</div>
      </div>
    </aside>
  );
}
