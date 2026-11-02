"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import { useState } from "react";
import FormField from "@/components/FormField";
import Icon from "@/components/Icon";
import "@/components/editorial-pages.css";

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copyError, setCopyError] = useState("");

  const updateField = (name: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const copyWechat = async () => {
    try {
      await navigator.clipboard.writeText(wechatId);
      setCopyError("");
      setCopiedWechat(true);
      window.setTimeout(() => setCopiedWechat(false), 2000);
    } catch { setCopyError("Copy unavailable. Select the contact details and copy manually."); }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
      setCopyError("");
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2000);
    } catch { setCopyError("Copy unavailable. Select the contact details and copy manually."); }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = "Please enter your name.";
    const email = e.currentTarget.elements.namedItem("email") as HTMLInputElement;
    if (!form.email.trim()) nextErrors.email = "Please enter your email address.";
    else if (!email.validity.valid) nextErrors.email = "Please enter a valid email address.";
    if (!form.message.trim()) nextErrors.message = "Please enter a message.";
    setErrors(nextErrors);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) { (e.currentTarget.elements.namedItem(firstError) as HTMLElement)?.focus(); return; }
    const subject = encodeURIComponent(`Portfolio contact from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name}\nEmail: ${form.email}`);
    window.location.href = `mailto:3578379159@qq.com?subject=${subject}&body=${body}`;
    setSent(true);
    window.setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="contact-page">
      <section className="page-intro contact-intro ui-enter">
        <div className="page-kicker">Contact</div>
        <h1 className="page-title">Get in <em>touch.</em></h1>
        <p className="page-description">
          Open to opportunities in quantitative analysis, AI product
          management, and algorithm research. Feel free to reach out.
        </p>
      </section>

      <div className="contact-workspace editorial-wrap">
        <div className="contact-details">
          <section className="contact-info" aria-labelledby="contact-info-heading">
            <h2 id="contact-info-heading" className="section-label">Quick Info</h2>
            <dl className="contact-facts">
              {infoCards.map((card) => (
                <div key={card.label}>
                  <dt>{card.label}</dt>
                  <dd>{card.href ? <Link href={card.href}>{card.value}</Link> : card.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="contact-connect" aria-labelledby="contact-connect-heading">
            <h2 id="contact-connect-heading" className="section-label">Connect</h2>
            <div className="contact-links">
              {linkCards.map((contact) => (
                <div key={contact.label} className="contact-link-row" data-motion="contact">
                  <span className="contact-link-label">{contact.label}</span>
                  <Link href={contact.href} target="_blank" rel="noopener noreferrer">
                    <span>{contact.value}</span><Icon name="arrow-up-right" />
                  </Link>
                </div>
              ))}
              <div className="contact-link-row" data-motion="contact">
                <span className="contact-link-label">Email</span>
                <button type="button" onClick={copyEmail} className="contact-copy" data-copied={copiedEmail} title="Copy email address">
                  <span aria-live="polite">{copiedEmail ? "Copied" : emailAddress}</span>
                  <Icon name={copiedEmail ? "check" : "copy"} />
                </button>
              </div>
              <div className="contact-link-row" data-motion="contact">
                <span className="contact-link-label">WeChat</span>
                <button type="button" onClick={copyWechat} className="contact-copy" data-copied={copiedWechat} title="Copy WeChat ID">
                  <span aria-live="polite">{copiedWechat ? "Copied" : wechatId}</span>
                  <Icon name={copiedWechat ? "check" : "copy"} />
                </button>
              </div>
            </div>
            {copyError && <p role="status" className="contact-copy-error">{copyError}</p>}
          </section>
        </div>

        <section className="contact-message" aria-labelledby="contact-message-heading">
          <h2 id="contact-message-heading" className="section-label">Send a Message</h2>
          <p className="contact-message-intro">
            Fill in the form and click send — your email client will open with the message pre-filled.
          </p>
          <form onSubmit={handleSubmit} noValidate className="contact-form">
            <FormField id="name" label="Name" error={errors.name}>
              <input id="name" name="name" type="text" required autoComplete="name"
                placeholder="Your name…" value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} />
            </FormField>
            <FormField id="email" label="Email" error={errors.email}>
              <input id="email" name="email" type="email" required autoComplete="email" spellCheck={false}
                placeholder="you@example.com…" value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />
            </FormField>
            <FormField id="message" label="Message" error={errors.message}>
              <textarea id="message" name="message" required rows={5}
                placeholder="Tell me about your opportunity or idea…" value={form.message}
                onChange={(e) => updateField("message", e.target.value)}
                aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "message-error" : undefined} />
            </FormField>
            <button type="submit" className="contact-send">
              <span aria-live="polite">{sent ? "Opening email…" : "Send Message"}</span>
              <Icon name="arrow-right" />
            </button>
          </form>
        </section>
      </div>
      <Footer />
    </div>
  );
}
