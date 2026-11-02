"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";

const FEED_URL = "https://chenmuqingtongyan.vercel.app/feed.xml";

const readers = [
  { name: "Feedly", url: "https://feedly.com", desc: "Popular & easy to start" },
  {
    name: "Inoreader",
    url: "https://www.inoreader.com",
    desc: "Powerful filters & rules",
  },
  {
    name: "NetNewsWire",
    url: "https://netnewswire.com",
    desc: "Free for Mac & iOS",
  },
  {
    name: "Miniflux",
    url: "https://miniflux.app",
    desc: "Minimal & self-hosted",
  },
];

type CopyState = "idle" | "copied" | "failed";

export default function RssPage() {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(FEED_URL);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    window.setTimeout(() => setCopyState("idle"), 2000);
  };

  const copyLabel =
    copyState === "copied"
      ? "Copied"
      : copyState === "failed"
        ? "Copy Failed"
        : "Copy Feed URL";

  return (
    <>
      <section className="ui-enter px-6 pb-14 pt-16 sm:px-10 sm:pb-18 sm:pt-20 xl:px-15 xl:pt-25">
        <div className="mb-6 text-[15px] font-semibold uppercase tracking-[0.16em] text-muted sm:text-[18px]">
          RSS
        </div>
        <h1 className="max-w-[820px] text-pretty text-[42px] font-light leading-[1.08] tracking-[-0.02em] text-ink sm:text-[56px] xl:text-[68px]">
          Subscribe to my <span className="font-semibold text-accent">feed</span>.
        </h1>
        <p className="mt-6 max-w-[680px] text-pretty text-[19px] font-medium leading-[1.7] text-lead sm:text-[22px] xl:text-[24px]">
          The feed is active. Add it to any RSS reader to receive new blog
          posts without checking the site manually.
        </p>
      </section>

      <section className="border-t border-line px-6 py-12 sm:px-10 sm:py-14 xl:px-15">
        <div className="mb-6 text-[15px] font-semibold uppercase tracking-[0.16em] text-muted sm:text-[18px]">
          Feed URL
        </div>
        <div className="ui-surface max-w-[820px] border border-line bg-card/55 p-5 sm:p-7">
          <code className="block overflow-x-auto break-all text-[14px] leading-[1.6] text-lead sm:text-[17px]">
            {FEED_URL}
          </code>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={FEED_URL}
              target="_blank"
              rel="noopener noreferrer"
              type="application/rss+xml"
              className="inline-flex min-h-11 items-center rounded-lg bg-accent px-4 py-2 text-[16px] font-semibold text-white transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg"
            >
              Open RSS Feed <Icon name="arrow-up-right" className="ml-2" />
            </a>
            <button
              type="button"
              onClick={copyUrl}
              className="min-h-11 rounded-lg border border-line px-4 py-2 text-[16px] font-semibold text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg"
            >
              <span aria-live="polite">{copyLabel}</span>
              <Icon name={copyState === "copied" ? "check" : "copy"} className="ml-2" />
            </button>
          </div>
          {copyState === "failed" && (
            <p className="mt-3 text-[14px] text-muted" role="status">
              Your browser blocked clipboard access. Select the URL above and
              copy it manually.
            </p>
          )}
        </div>
      </section>

      <section className="border-t border-line px-6 py-12 sm:px-10 sm:py-14 xl:px-15">
        <div className="mb-6 text-[15px] font-semibold uppercase tracking-[0.16em] text-muted sm:text-[18px]">
          Recommended Readers
        </div>
        <div className="max-w-[820px] divide-y divide-line">
          {readers.map((reader) => (
            <a
              key={reader.name}
              href={reader.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-1 rounded-sm py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <span className="text-[20px] font-semibold text-ink transition-colors group-hover:text-accent sm:text-[22px]">
                {reader.name}
              </span>
              <span className="text-[15px] text-muted sm:text-[17px]">
                {reader.desc}
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="border-t border-line px-6 py-12 sm:px-10 sm:py-14 xl:px-15">
        <div className="mb-6 text-[15px] font-semibold uppercase tracking-[0.16em] text-muted sm:text-[18px]">
          How to Subscribe
        </div>
        <ol className="grid max-w-[900px] gap-4 sm:grid-cols-3">
          {[
            "Copy the feed URL above.",
            "Add a new subscription in your RSS reader.",
            "New posts will appear automatically.",
          ].map((step, index) => (
            <li
              key={step}
              className="ui-surface border border-line bg-card/40 p-5"
            >
              <span className="font-mono text-[13px] font-semibold tabular-nums text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 text-pretty text-[17px] font-medium leading-[1.6] text-lead sm:text-[18px]">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <Footer />
    </>
  );
}
