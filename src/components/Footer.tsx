export default function Footer() {
  return (
    <footer className="flex flex-col gap-3 border-t border-line px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-10 xl:px-15">
      <span className="text-[15px] text-muted sm:text-[18px]">
        &copy; 2026 — All rights reserved
      </span>
      <a
        href="#top"
        className="w-fit rounded-sm text-[15px] text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg sm:text-[18px]"
      >
        Back to top &uarr;
      </a>
    </footer>
  );
}
