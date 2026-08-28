"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import { useState } from "react";

const wechatId = "chenmuqingtongyan";
const qqNumber = "3578379159";
const emailAddress = `${qqNumber}@qq.com`;

const infoCards = [
  { label: "Phone", value: "18867701654", href: "tel:18867701654" },
  { label: "Location", value: "Wenzhou, CN", href: null },
  { label: "Timezone", value: "UTC+8 (CST)", href: null },
  { label: "Response Time", value: "Usually within 24h", href: null },
  { label: "Availability", value: "Open to internships", href: null },
];

const linkCards = [
  { label: "GitHub", href: "https://github.com/zsy0222", value: "github.com/zsy0222" },
];

export default function ContactPage() {
  const [copiedWechat, setCopiedWechat] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const copyWechat = async () => {
    await navigator.clipboard.writeText(wechatId);
    setCopiedWechat(true);
    window.setTimeout(() => setCopiedWechat(false), 2000);
  };

  const copyEmail = async () => {
    await navigator.clipboard.writeText(emailAddress);
    setCopiedEmail(true);
    window.setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio contact from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name}\nEmail: ${form.email}`);
    window.location.href = `mailto:3578379159@qq.com?subject=${subject}&body=${body}`;
    setSent(true);
    window.setTimeout(() => setSent(false), 3000);
  };

  return (
    <>
      <section className="ui-enter px-6 pb-14 pt-16 sm:px-10 sm:pb-18 sm:pt-20 xl:px-15 xl:pt-25">
        <div className="mb-6 text-[15px] font-semibold uppercase tracking-[0.16em] text-muted sm:text-[18px]">
          Contact
        </div>
        <h1 className="max-w-[820px] text-pretty text-[42px] font-light leading-[1.08] tracking-[-0.02em] text-ink sm:text-[56px] xl:text-[68px]">
          Get in <span className="text-accent font-semibold">touch</span>.
        </h1>
        <p className="mt-6 max-w-[680px] text-pretty text-[19px] font-medium leading-[1.7] text-lead sm:text-[22px] xl:text-[24px]">
          Open to opportunities in quantitative analysis, AI product
          management, and algorithm research. Feel free to reach out.
        </p>
      </section>

      <section className="border-t border-line px-6 py-12 sm:px-10 sm:py-14 xl:px-15">
        <div className="mb-6 text-[15px] font-semibold uppercase tracking-[0.16em] text-muted sm:text-[18px]">
          Quick Info
        </div>
        <div className="grid max-w-[900px] gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {infoCards.map((card) => (
            <div
              key={card.label}
              className="min-w-0 bg-bg p-5 sm:p-6"
            >
              <div className="text-[16px] font-medium tracking-[0.14em] uppercase text-muted mb-1.5">
                {card.label}
              </div>
              {card.href ? (
                <Link
                  href={card.href}
                  className="rounded-sm text-[19px] font-medium text-lead transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg sm:text-[22px]"
                >
                  {card.value}
                </Link>
              ) : (
                <div className="break-words text-[19px] font-medium text-lead sm:text-[22px]">
                  {card.value}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line px-6 py-12 sm:px-10 sm:py-14 xl:px-15">
        <div className="mb-6 text-[15px] font-semibold uppercase tracking-[0.16em] text-muted sm:text-[18px]">
          Connect
        </div>
        <div className="grid grid-cols-1">
          {linkCards.map((contact) => (
            <div key={contact.label} className="py-6 border-b border-line">
              <div className="text-[16px] font-medium tracking-[0.14em] uppercase text-muted mb-1.5">
                {contact.label}
              </div>
              <Link
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all rounded-sm text-[19px] font-medium text-lead transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg sm:text-[22px]"
              >
                {contact.value}
              </Link>
            </div>
          ))}
          <div className="py-6 border-b border-line">
            <div className="text-[16px] font-medium tracking-[0.14em] uppercase text-muted mb-1.5">
              Email
            </div>
            <button
              type="button"
              onClick={copyEmail}
              className="cursor-pointer break-all rounded-sm text-left text-[19px] font-medium text-lead transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg sm:text-[22px]"
              title="Copy email address"
            >
              <span aria-live="polite">
                {copiedEmail ? "Copied" : emailAddress}
              </span>
            </button>
          </div>
          <div className="py-6 border-b border-line">
            <div className="text-[16px] font-medium tracking-[0.14em] uppercase text-muted mb-1.5">
              WeChat
            </div>
            <button
              type="button"
              onClick={copyWechat}
              className="cursor-pointer break-all rounded-sm text-left text-[19px] font-medium text-lead transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg sm:text-[22px]"
              title="Copy WeChat ID"
            >
              <span aria-live="polite">
                {copiedWechat ? "Copied" : wechatId}
              </span>
            </button>
          </div>
        </div>
      </section>

      <section className="border-t border-line px-6 py-12 sm:px-10 sm:py-14 xl:px-15">
        <div className="mb-6 text-[15px] font-semibold uppercase tracking-[0.16em] text-muted sm:text-[18px]">
          Send a Message
        </div>
        <p className="text-[18px] font-normal text-muted mb-6">
          Fill in the form and click send — your email client will open with the message pre-filled.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-[600px]">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-[16px] font-medium tracking-[0.14em] uppercase text-muted">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Your name\u2026"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-lg border border-line bg-card px-4 py-2.5 text-[18px] text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:text-[20px]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[16px] font-medium tracking-[0.14em] uppercase text-muted">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              spellCheck={false}
              placeholder="you@example.com\u2026"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-lg border border-line bg-card px-4 py-2.5 text-[18px] text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:text-[20px]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="message" className="text-[16px] font-medium tracking-[0.14em] uppercase text-muted">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder="Tell me about your opportunity or idea\u2026"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="resize-y rounded-lg border border-line bg-card px-4 py-2.5 text-[18px] text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:text-[20px]"
            />
          </div>
          <button
            type="submit"
            className="self-start rounded-sm border-b border-ink pb-1 text-[19px] font-semibold text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg sm:text-[22px]"
          >
            {sent ? "Opening email\u2026" : "Send Message"}{" "}
            <span aria-hidden="true">&rarr;</span>
          </button>
        </form>
      </section>

      <Footer />
    </>
  );
}
