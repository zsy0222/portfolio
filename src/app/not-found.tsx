import Link from "next/link";

export default function NotFound() {
  return (
    <div className="px-15 pt-25 pb-20 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-[64px] font-light text-ink leading-[1.15] mb-7" style={{ textWrap: "balance" }}>
        <span className="text-accent font-semibold">404</span> — Page not found.
      </h1>
      <p className="text-[24px] font-medium text-lead leading-[1.6] max-w-[520px] mb-9">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[22px] font-medium text-ink border-b border-ink pb-1 hover:text-accent hover:border-accent transition-colors"
      >
        Back home <span>&rarr;</span>
      </Link>
    </div>
  );
}
