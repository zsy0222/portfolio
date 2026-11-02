"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import ScrollReveal from "./ScrollReveal";
import styles from "./PortfolioShell.module.css";

const links = [["/v2", "Studio"], ["/projects", "Work"], ["/blog", "Journal"], ["/wiki", "Library"], ["/v2/travel-wall", "Travel"], ["/about", "About"], ["/contact", "Contact"]];

export function PortfolioHeader() {
  const pathname = usePathname();
  return <header className={styles.header}>
      <Link href="/v2" className={styles.brand}>sz<span>·</span><small>SIYUAN ZHENG<br/>PERSONAL ARCHIVE / VOL. 02</small></Link>
      <nav aria-label="Main navigation">{links.map(([href, label]) => <Link key={href} href={href} aria-current={pathname === href || (href !== "/v2" && pathname.startsWith(href + "/")) ? "page" : undefined}>{label}</Link>)}</nav>
      <Link className={styles.directory} href="/v2#studio-chapters">Explore ↓</Link>
    </header>;
}

export default function PortfolioShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const immersive = pathname.startsWith("/v2");
  return <div className={immersive ? undefined : styles.shell}>
    {!immersive && <PortfolioHeader />}

    <main id="main-content" tabIndex={-1} className={immersive ? undefined : styles.content} data-page={pathname.split("/")[1] || "home"} data-detail={pathname.split("/").length > 2}>
      {!immersive && <ScrollReveal key={pathname} />}
      {children}
    </main>
    {!immersive && <ChapterContinuation pathname={pathname} />}
    {!immersive && <div className={styles.archiveLinks}><Link href="/v2">← Back to the studio</Link><nav aria-label="More pages"><Link href="/studio">Character studio</Link><Link href="/creative-studio">Cyber studio</Link><Link href="/guestbook">Guestbook</Link><Link href="/rss">RSS</Link><Link href="/status">Status</Link><Link href="/">Original home</Link></nav></div>}
  </div>;
}

function ChapterContinuation({ pathname }: { pathname: string }) {
  const page = pathname.split("/")[1];
  const routes: Record<string, [string,string,string,string]> = {
    projects: ["/blog", "Behind the work.", "Research logs, decisions, and things learned along the way.", "selected-work"],
    blog: ["/wiki", "Keep exploring.", "Follow a thought into the library of notes and references.", "writing"],
    wiki: ["/v2/travel-wall", "A little further out.", "Step away from the books and into a collection of places.", "writing"],
    about: ["/contact", "Start a conversation.", "A question, a collaboration, or simply a hello.", "person"],
    contact: ["/v2", "Back to the room.", "There is always another idea to explore.", "person"],
  };
  const [href,title,description,anchor] = routes[page] ?? ["/v2", "Return to the studio.", "Work, words, and a few places in between.", "studio-chapters"];
  return <section className={styles.continue} aria-label="Continue exploring"><div><small>THE NEXT CHAPTER</small><Link href={href}>{title} <span>↗</span></Link><p>{description}</p></div><Link className={styles.return} href={`/v2#${anchor}`}>← Back to Studio</Link></section>;
}
