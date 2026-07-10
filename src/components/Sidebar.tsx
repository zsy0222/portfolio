"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  { href: "https://github.com", label: "GitHub" },
  { href: "mailto:hello@example.com", label: "Email" },
  { href: "https://twitter.com", label: "Twitter" },
  { href: "https://linkedin.com", label: "LinkedIn" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[22%] min-w-[220px] shrink-0 sticky top-0 h-screen border-r border-line flex flex-col px-10 py-15">
      <div className="text-base font-semibold tracking-[0.18em] text-ink mb-1.5">
        PORTFOLIO
      </div>
      <div className="text-sm font-medium text-body mb-9">
        Designer &amp; Developer
      </div>

      <div className="flex items-center gap-2 text-sm font-medium text-lead mb-9">
        <span className="w-[7px] h-[7px] rounded-full bg-accent shrink-0" />
        Available for work
      </div>

      <div className="h-px bg-line mb-7" />

      <nav className="flex flex-col gap-0.5 mb-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-base py-1.5 transition-colors hover:text-accent ${
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
          <div className="text-xs font-medium tracking-[0.14em] uppercase text-muted mb-2">
            Currently
          </div>
          <div className="text-sm font-medium text-lead">
            Building AI-assisted creative tools
          </div>
        </div>
        <div className="mb-7">
          <div className="text-xs font-medium tracking-[0.14em] uppercase text-muted mb-2">
            Based in
          </div>
          <div className="text-sm font-medium text-lead">
            Shanghai, CN
          </div>
        </div>
        <div className="h-px bg-line mb-7" />
        <div className="flex flex-wrap gap-x-4 gap-y-2.5 mb-4">
          {socialLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-muted hover:text-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="text-sm text-muted">&copy; 2026</div>
      </div>
    </aside>
  );
}
