import Link from "next/link";
import { formatDate, tagSlug, type PostMeta } from "@/lib/posts";

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group border-b border-line py-9 first:pt-0 last:border-b-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-faint">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden="true">·</span>
        <span>{post.readingMinutes} min read</span>
        {post.draft && (
          <span className="rounded-sm border border-amber-500/60 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            Draft
          </span>
        )}
      </div>

      <h2 className="mt-3 text-2xl font-extrabold leading-snug tracking-tight text-balance sm:text-3xl">
        <Link href={`/blog/${post.slug}`} className="transition-colors group-hover:text-accent">
          {post.title}
        </Link>
      </h2>

      {post.description && (
        <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted">{post.description}</p>
      )}

      {post.tags.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <li key={tag}>
              <Link
                href={`/tags/${tagSlug(tag)}`}
                className="inline-block rounded-md border border-line px-2 py-1 font-mono text-[11px] text-faint transition-colors hover:border-accent hover:text-accent"
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
