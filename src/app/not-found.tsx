import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-28 text-center sm:px-8">
      <p className="text-[11px] font-extrabold uppercase tracking-label text-accent">404</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
        This page doesn&rsquo;t exist
      </h1>
      <hr className="mx-auto mt-7 w-10 border-0 border-t-2 border-line-strong" />
      <p className="mt-7 leading-relaxed text-muted">
        The link is broken or the post moved. Everything published lives in the archive.
      </p>
      <Link
        href="/blog"
        className="mt-9 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-accent-ink transition-opacity hover:opacity-90"
      >
        Browse all posts
      </Link>
    </div>
  );
}
