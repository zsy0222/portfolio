"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import { useState } from "react";

const wechatId = "chenmuqingtongyan";

const infoCards = [
  { label: "Phone", value: "18867701654", href: "tel:18867701654" },
  { label: "Location", value: "Wenzhou, CN", href: null },
  { label: "Timezone", value: "UTC+8 (CST)", href: null },
  { label: "Response Time", value: "Usually within 24h", href: null },
  { label: "Availability", value: "Open to internships", href: null },
];

const linkCards = [
  { label: "GitHub", href: "https://github.com/zsy0222", value: "github.com/zsy0222" },
  { label: "Email", href: "mailto:3578379159@qq.com", value: "3578379159@qq.com" },
];

export default function ContactPage() {
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const copyWechat = () => {
    navigator.clipboard.writeText(wechatId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio contact from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name}\nEmail: ${form.email}`);
    window.location.href = `mailto:3578379159@qq.com?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <>
      <section className="px-15 pt-25 pb-20">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-8">
          Contact
        </div>
        <h1 className="text-[64px] font-light text-ink leading-[1.15] tracking-[-0.01em] mb-7" style={{ textWrap: "balance" }}>
          Get in <span className="text-accent font-semibold">touch</span>.
        </h1>
        <p className="text-[24px] font-medium text-lead leading-[1.6] max-w-[520px] mb-9">
          Open to opportunities in quantitative analysis, AI product
          management, and algorithm research. Feel free to reach out.
        </p>
      </section>

      <section className="px-15 py-18 border-t border-line">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-8">
          Quick Info
        </div>
        <div className="grid grid-cols-2 gap-0">
          {infoCards.map((card, index) => (
            <div
              key={card.label}
              className={`p-8 ${index % 2 === 0 ? "border-r border-line" : ""} ${index < infoCards.length - 2 ? "border-b border-line" : ""}`}
            >
              <div className="text-[16px] font-medium tracking-[0.14em] uppercase text-muted mb-2">
                {card.label}
              </div>
              {card.href ? (
                <Link
                  href={card.href}
                  className="text-[22px] font-medium text-lead hover:text-accent transition-colors"
                >
                  {card.value}
                </Link>
              ) : (
                <div className="text-[22px] font-medium text-lead">
                  {card.value}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="px-15 py-18 border-t border-line">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-8">
          Connect
        </div>
        <div className="grid grid-cols-1">
          {linkCards.map((contact) => (
            <div key={contact.label} className="py-8 border-b border-line">
              <div className="text-[16px] font-medium tracking-[0.14em] uppercase text-muted mb-2">
                {contact.label}
              </div>
              <Link
                href={contact.href}
                target={contact.href.startsWith("http") ? "_blank" : undefined}
                rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="text-[24px] font-medium text-lead hover:text-accent transition-colors"
              >
                {contact.value}
              </Link>
            </div>
          ))}
          <div className="py-8 border-b border-line flex items-start justify-between gap-8">
            <div>
              <div className="text-[16px] font-medium tracking-[0.14em] uppercase text-muted mb-2">
                WeChat
              </div>
              <button
                onClick={copyWechat}
                className="text-[24px] font-medium text-lead hover:text-accent transition-colors cursor-pointer"
                title="Click to copy WeChat ID"
              >
                {copied ? "Copied!" : wechatId}
              </button>
            </div>
            <div className="shrink-0">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${wechatId}`}
                alt="WeChat QR Code"
                width={120}
                height={120}
                className="rounded-lg border border-line"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-15 py-18 border-t border-line">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-8">
          Send a Message
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-[600px]">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-[16px] font-medium tracking-[0.14em] uppercase text-muted">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="off"
              placeholder="Your name\u2026"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-card border border-line rounded-lg px-4 py-3 text-[20px] text-ink focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-[16px] font-medium tracking-[0.14em] uppercase text-muted">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="off"
              spellCheck={false}
              placeholder="your@email.com\u2026"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="bg-card border border-line rounded-lg px-4 py-3 text-[20px] text-ink focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
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
              className="bg-card border border-line rounded-lg px-4 py-3 text-[20px] text-ink focus:outline-none focus:border-accent transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            className="self-start text-[22px] font-medium text-ink border-b border-ink pb-1 hover:text-accent hover:border-accent transition-colors"
          >
            {sent ? "Opening email\u2026" : "Send Message"} <span>&rarr;</span>
          </button>
        </form>
      </section>

      <Footer />
    </>
  );
}
