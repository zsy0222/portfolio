export default function Footer() {
  return (
    <footer className="px-15 py-10 border-t border-line flex justify-between items-center">
      <span className="text-[20px] text-muted">
        &copy; 2026 — All rights reserved
      </span>
      <div className="flex items-center gap-6">
        <a
          href="/feed.xml"
          className="text-[20px] text-muted hover:text-accent transition-colors"
        >
          RSS
        </a>
        <a
          href="#top"
          className="text-[20px] text-muted hover:text-accent transition-colors"
        >
          Back to top &uarr;
        </a>
      </div>
    </footer>
  );
}
