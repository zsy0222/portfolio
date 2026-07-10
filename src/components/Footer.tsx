export default function Footer() {
  return (
    <footer className="px-15 py-10 border-t border-line flex justify-between items-center">
      <span className="text-sm text-muted">
        &copy; 2026 — All rights reserved
      </span>
      <a
        href="#top"
        className="text-sm text-muted hover:text-accent transition-colors"
      >
        Back to top &uarr;
      </a>
    </footer>
  );
}
