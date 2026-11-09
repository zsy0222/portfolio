"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { openVisitPreferences } from "./VisitAnalytics";

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const copyWechat = async () => {
    try {
      await navigator.clipboard.writeText("chenmuqingtongyan"); setCopied(true); setFailed(false);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch { setFailed(true); }
  };
  return (
    <footer className="studio-footer">
      <div className="footer-top"><div><span className="section-label">Contact</span><Link className="footer-title" href="/contact">Get in <em>touch.</em><Icon name="arrow-up-right" /></Link></div><div className="footer-availability"><span><i /> Available for work</span><p>Wenzhou, CN<br />SE &amp; Business Administration, NJU</p></div></div>
      <div className="footer-bottom"><span>© 2026 SIYUAN ZHENG</span><nav aria-label="Social links"><a href="https://github.com/zsy0222" target="_blank" rel="noopener noreferrer">GitHub <Icon name="arrow-up-right" /></a><a href="mailto:3578379159@qq.com">Email <Icon name="arrow-up-right" /></a><button type="button" onClick={copyWechat}><span aria-live="polite">{copied ? "Copied!" : "WeChat"}</span><Icon name={copied ? "check" : "copy"} /></button><Link href="/rss">RSS <Icon name="arrow-up-right" /></Link><button type="button" lang="zh-CN" onClick={() => window.dispatchEvent(new Event(openVisitPreferences))}>统计偏好</button></nav><a href="#top" className="back-top-link">Back to top <Icon name="arrow-up" /></a></div>
      {failed && <p role="status" className="copy-fallback">Copy manually: chenmuqingtongyan</p>}
    </footer>
  );
}
