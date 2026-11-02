"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import { useState } from "react";
import FormField from "@/components/FormField";
import Icon from "@/components/Icon";
import { useWorldLocale } from "@/components/world/WorldProvider";

const wechatId = "chenmuqingtongyan";
const qqNumber = "3578379159";
const emailAddress = `${qqNumber}@qq.com`;

const infoCards = [
  { label: "Phone", labelZh: "电话", value: "18867701654", valueZh: "18867701654", href: "tel:18867701654" },
  { label: "Location", labelZh: "所在地", value: "Wenzhou, CN", valueZh: "中国 · 温州", href: null },
  { label: "Timezone", labelZh: "时区", value: "UTC+8 (CST)", valueZh: "UTC+8（北京时间）", href: null },
  { label: "Response Time", labelZh: "回复时间", value: "Usually within 24h", valueZh: "通常在 24 小时内", href: null },
  { label: "Availability", labelZh: "合作意向", value: "Open to internships", valueZh: "欢迎交流实习机会", href: null },
];

const linkCards = [
  { label: "GitHub", href: "https://github.com/zsy0222", value: "github.com/zsy0222" },
];

const contactMessages: Record<string, string> = {
  "Copy unavailable. Select the contact details and copy manually.": "无法自动复制，请选中联系方式手动复制。",
  "Please enter your name.": "请填写姓名。",
  "Please enter your email address.": "请填写邮箱地址。",
  "Please enter a valid email address.": "请输入有效的邮箱地址。",
  "Please enter a message.": "请填写留言内容。",
};

export default function ContactPage() {
  const { t } = useWorldLocale();
  const localizedError = (value: string | undefined) => value ? t(contactMessages[value] || value, value) : undefined;
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
    <>
      <section className="ui-enter px-6 pb-14 pt-16 sm:px-10 sm:pb-18 sm:pt-20 xl:px-15 xl:pt-25">
        <div className="mb-6 text-[15px] font-semibold uppercase tracking-[0.16em] text-muted sm:text-[18px]">
          {t("联系我", "Contact")}
        </div>
        <h1 className="max-w-[820px] text-pretty text-[42px] font-light leading-[1.08] tracking-[-0.02em] text-ink sm:text-[56px] xl:text-[68px]">
          {t("让我们开始交流。", "Get in touch.")}
        </h1>
        <p className="mt-6 max-w-[680px] text-pretty text-[19px] font-medium leading-[1.7] text-lead sm:text-[22px] xl:text-[24px]">
          {t("欢迎交流量化分析、AI 产品管理与算法研究相关的机会，或分享你的想法。", "Open to opportunities in quantitative analysis, AI product management, and algorithm research. Feel free to reach out.")}
        </p>
      </section>

      <section className="border-t border-line px-6 py-12 sm:px-10 sm:py-14 xl:px-15">
        <div className="mb-6 text-[15px] font-semibold uppercase tracking-[0.16em] text-muted sm:text-[18px]">
          {t("基本信息", "Quick Info")}
        </div>
        <div className="ui-surface grid max-w-[900px] gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
          {infoCards.map((card) => (
            <div
              key={card.label}
              className="min-w-0 bg-bg p-5 sm:p-6"
            >
              <div className="text-[16px] font-medium tracking-[0.14em] uppercase text-muted mb-1.5">
                {t(card.labelZh, card.label)}
              </div>
              {card.href ? (
                <Link
                  href={card.href}
                  className="rounded-sm text-[19px] font-medium text-lead transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg sm:text-[22px]"
                >
                  {t(card.valueZh, card.value)}
                </Link>
              ) : (
                <div className="break-words text-[19px] font-medium text-lead sm:text-[22px]">
                  {t(card.valueZh, card.value)}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line px-6 py-12 sm:px-10 sm:py-14 xl:px-15">
        <div className="mb-6 text-[15px] font-semibold uppercase tracking-[0.16em] text-muted sm:text-[18px]">
          {t("找到我", "Connect")}
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
              {t("邮箱", "Email")}
            </div>
            <button
              type="button"
              onClick={copyEmail}
              className="cursor-pointer break-all rounded-sm text-left text-[19px] font-medium text-lead transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg sm:text-[22px]"
              title={t("复制邮箱地址", "Copy email address")}
            >
              <span aria-live="polite">
                {copiedEmail ? t("已复制", "Copied") : emailAddress}
              </span>
              <Icon name={copiedEmail ? "check" : "copy"} className="ml-2" />
            </button>
          </div>
          <div className="py-6 border-b border-line">
            <div className="text-[16px] font-medium tracking-[0.14em] uppercase text-muted mb-1.5">
              {t("微信", "WeChat")}
            </div>
            <button
              type="button"
              onClick={copyWechat}
              className="cursor-pointer break-all rounded-sm text-left text-[19px] font-medium text-lead transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg sm:text-[22px]"
              title={t("复制微信号", "Copy WeChat ID")}
            >
              <span aria-live="polite">
                {copiedWechat ? t("已复制", "Copied") : wechatId}
              </span>
              <Icon name={copiedWechat ? "check" : "copy"} className="ml-2" />
            </button>
          </div>
        </div>
        {copyError && <p role="status" className="mt-3 text-sm text-muted">{localizedError(copyError)}</p>}
      </section>

      <section className="border-t border-line px-6 py-12 sm:px-10 sm:py-14 xl:px-15">
        <div className="mb-6 text-[15px] font-semibold uppercase tracking-[0.16em] text-muted sm:text-[18px]">
          {t("写封邮件", "Send a Message")}
        </div>
        <p className="text-[18px] font-normal text-muted mb-6">
          {t("填写后点击发送，将打开你的邮件应用并预填内容；邮件仍需在邮件应用中确认发送。", "Fill in the form and click send — your email client will open with the message pre-filled. Confirm sending in your email app.")}
        </p>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 max-w-[600px]">
          <FormField id="name" label={t("姓名", "Name")} error={localizedError(errors.name)}>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder={t("你的姓名…", "Your name…")}
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              className="rounded-lg border border-line bg-card px-4 py-2.5 text-[18px] text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:text-[20px]"
            />
          </FormField>
          <FormField id="email" label={t("邮箱", "Email")} error={localizedError(errors.email)}>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              spellCheck={false}
              placeholder="you@example.com…"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="rounded-lg border border-line bg-card px-4 py-2.5 text-[18px] text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:text-[20px]"
            />
          </FormField>
          <FormField id="message" label={t("留言", "Message")} error={localizedError(errors.message)}>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder={t("分享你的合作机会或想法…", "Tell me about your opportunity or idea…")}
              value={form.message}
              onChange={(e) => updateField("message", e.target.value)}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "message-error" : undefined}
              className="resize-y rounded-lg border border-line bg-card px-4 py-2.5 text-[18px] text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:text-[20px]"
            />
          </FormField>
          <button
            type="submit"
            className="self-start rounded-sm border-b border-ink pb-1 text-[19px] font-semibold text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg sm:text-[22px]"
          >
            <span aria-live="polite">{sent ? t("正在打开邮件应用…", "Opening email…") : t("用邮件发送", "Send Message")}</span>{" "}
            <Icon name="arrow-right" />
          </button>
        </form>
      </section>

      <Footer />
    </>
  );
}
