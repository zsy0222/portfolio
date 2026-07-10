"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import { useState } from "react";

const wechatId = "chenmuqingtongyan";
const qqNumber = "3578379159";

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
  const [copiedQQ, setCopiedQQ] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const copyWechat = () => {
    navigator.clipboard.writeText(wechatId);
    setCopiedWechat(true);
    setTimeout(() => setCopiedWechat(false), 2000);
  };

  const copyQQ = () => {
    navigator.clipboard.writeText(qqNumber);
    setCopiedQQ(true);
    setTimeout(() => setCopiedQQ(false), 2000);
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
      <section className="px-15 pt-25 pb-16">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
          Contact
        </div>
        <h1 className="text-[64px] font-light text-ink leading-[1.15] tracking-[-0.01em] mb-5" style={{ textWrap: "balance" }}>
          Get in <span className="text-accent font-semibold">touch</span>.
        </h1>
        <p className="text-[24px] font-medium text-lead leading-[1.6] max-w-[520px] mb-7">
          Open to opportunities in quantitative analysis, AI product
          management, and algorithm research. Feel free to reach out.
        </p>
      </section>

      <section className="px-15 py-14 border-t border-line">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
          Quick Info
        </div>
        <div className="grid grid-cols-2 gap-0">
          {infoCards.map((card, index) => (
            <div
              key={card.label}
              className={`p-6 ${index % 2 === 0 ? "border-r border-line" : ""} ${index < infoCards.length - 2 ? "border-b border-line" : ""}`}
            >
              <div className="text-[16px] font-medium tracking-[0.14em] uppercase text-muted mb-1.5">
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

      <section className="px-15 py-14 border-t border-line">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
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
                className="text-[24px] font-medium text-lead hover:text-accent transition-colors"
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
              onClick={copyQQ}
              className="text-[24px] font-medium text-lead hover:text-accent transition-colors cursor-pointer"
              title="Click to copy QQ number"
            >
              {copiedQQ ? "Copied!" : "3578379159@qq.com"}
            </button>
          </div>
          <div className="py-6 border-b border-line">
            <div className="text-[16px] font-medium tracking-[0.14em] uppercase text-muted mb-1.5">
              WeChat
            </div>
            <button
              onClick={copyWechat}
              className="text-[24px] font-medium text-lead hover:text-accent transition-colors cursor-pointer"
              title="Click to copy WeChat ID"
            >
              {copiedWechat ? "Copied!" : wechatId}
            </button>
          </div>
        </div>
      </section>

      <section className="px-15 py-14 border-t border-line">
        <div className="text-[20px] font-medium tracking-[0.16em] uppercase text-muted mb-6">
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
              autoComplete="off"
              placeholder="Your name\u2026"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-card border border-line rounded-lg px-4 py-2.5 text-[20px] text-ink focus:outline-none focus:border-accent transition-colors"
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
              autoComplete="off"
              spellCheck={false}
              placeholder="your@email.com\u2026"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="bg-card border border-line rounded-lg px-4 py-2.5 text-[20px] text-ink focus:outline-none focus:border-accent transition-colors"
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
              className="bg-card border border-line rounded-lg px-4 py-2.5 text-[20px] text-ink focus:outline-none focus:border-accent transition-colors resize-none"
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
