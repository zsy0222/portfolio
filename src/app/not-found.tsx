import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-16 text-center sm:px-10 xl:px-15">
      <h1 className="mb-7 max-w-[800px] text-pretty text-[40px] font-light leading-[1.1] text-ink sm:text-[56px] xl:text-[64px]">
        <span className="text-accent font-semibold">404</span> — Page not found.
      </h1>
      <p className="mb-9 max-w-[520px] text-pretty text-[18px] font-medium leading-[1.7] text-lead sm:text-[22px] xl:text-[24px]">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-sm border-b border-ink pb-1 text-[19px] font-semibold text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg sm:text-[22px]"
      >
        Back Home <span aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  );
}
