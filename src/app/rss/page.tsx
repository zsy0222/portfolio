"use client";

import { useState } from "react";
import Footer from "@/components/Footer";

const FEED_URL = "https://chenmuqingtongyan.vercel.app/feed.xml";

const readers = [
  { name: "Feedly", url: "https://feedly.com", desc: "Most popular RSS reader" },
  { name: "Inoreader", url: "https://www.inoreader.com", desc: "Powerful filtering & rules" },
  { name: "NetNewsWire", url: "https://netnewswire.com", desc: "Free, open-source for Mac/iOS" },
  { name: "Miniflux", url: "https://miniflux.app", desc: "Self-hosted, minimal" },
];

export default function RssPage() {
  const [copied, setCopied] = useState(false);

  const copyUrl = () => {
    navigator.clipboard.writeText(FEED_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <section className="px-15 pt-25 pb-16">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
          RSS
        </div>
        <h1 className="text-[56px] font-light text-ink leading-[1.2] mb-5" style={{ textWrap: "balance" }}>
          Subscribe to my <span className="text-accent font-semibold">feed</span>.
        </h1>
        <p className="text-[24px] font-medium text-lead leading-[1.6] max-w-[520px]">
          Get notified when I publish new blog posts. Add the feed URL to your
          RSS reader.
        </p>
      </section>

      <section className="px-15 pb-14 border-t border-line">
        <div className="py-10">
          <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
            Feed URL
          </div>
          <div className="flex items-center gap-4">
            <code className="text-[18px] text-lead bg-card border border-line rounded-lg px-4 py-2.5 flex-1 max-w-[600px] overflow-x-auto">
              {FEED_URL}
            </code>
            <button
              onClick={copyUrl}
              className="text-[18px] font-medium text-ink border-b border-ink pb-1 hover:text-accent hover:border-accent transition-colors shrink-0"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className="py-10 border-t border-line">
          <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
            Recommended Readers
          </div>
          <div className="flex flex-col">
            {readers.map((r, idx) => (
              <div
                key={r.name}
                className={`py-6 ${idx < readers.length - 1 ? "border-b border-line" : ""}`}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[22px] font-medium text-lead hover:text-accent transition-colors"
                  >
                    {r.name}
                  </a>
                  <span className="text-[18px] text-muted">{r.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="py-10 border-t border-line">
          <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
            How to Subscribe
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex gap-4">
              <span className="text-[22px] font-semibold text-accent shrink-0">1</span>
              <p className="text-[20px] font-medium text-lead leading-[1.6]">
                Copy the feed URL above.
              </p>
            </div>
            <div className="flex gap-4">
              <span className="text-[22px] font-semibold text-accent shrink-0">2</span>
              <p className="text-[20px] font-medium text-lead leading-[1.6]">
                Open your RSS reader (e.g. Feedly).
              </p>
            </div>
            <div className="flex gap-4">
              <span className="text-[22px] font-semibold text-accent shrink-0">3</span>
              <p className="text-[20px] font-medium text-lead leading-[1.6]">
                Paste the URL to add a new subscription.
              </p>
            </div>
            <div className="flex gap-4">
              <span className="text-[22px] font-semibold text-accent shrink-0">4</span>
              <p className="text-[20px] font-medium text-lead leading-[1.6]">
                New posts will appear automatically in your reader.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
