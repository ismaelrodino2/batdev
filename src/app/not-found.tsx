import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative isolate overflow-hidden">
      <Image
        src="/batnoir.png"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />
      <div className="art-scrim absolute inset-0 -z-10" />
      <div className="art-fade absolute inset-x-0 bottom-0 -z-10 h-1/2" />

      <div className="mx-auto max-w-xl px-5 py-28 text-center sm:px-8 sm:py-36">
        <p className="text-[11px] font-extrabold uppercase tracking-label text-accent-bright">
          404
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-4xl">
          This page doesn&rsquo;t exist
        </h1>
        <hr className="mx-auto mt-7 w-10 border-0 border-t-2 border-white/40" />
        <p className="mt-7 leading-relaxed text-white/85 drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
          Wrong part of town. Everything published lives in the archive.
        </p>
        <Link
          href="/blog"
          className="mt-9 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-accent-ink transition-opacity hover:opacity-90"
        >
          Browse all posts
        </Link>
      </div>
    </div>
  );
}
