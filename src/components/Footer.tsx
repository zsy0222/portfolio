export default function Footer() {
  return (
    <footer className="px-15 py-10 border-t border-line flex justify-between items-center">
      <span className="text-[20px] text-muted">
        &copy; 2026 — All rights reserved
      </span>
      <a
        href="#top"
        className="text-[20px] text-muted hover:text-accent transition-colors"
      >
        Back to top &uarr;
      </a>
    </footer>
  );
}
