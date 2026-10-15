import Link from "next/link";
import PageHeader from "@/components/page-header";
import PostCard from "@/components/post-card";
import Sidebar from "@/components/sidebar";
import { formatDate, getAllPosts } from "@/lib/posts";
import { SITE } from "@/lib/site";

export default function HomePage() {
  const posts = getAllPosts();
  // Engineering write-ups lead; the career essays follow as a compact list so they
  // don't crowd out the posts with code and numbers behind them.
  const featured = posts.filter((post) => post.featured);
  const recent = featured.length > 0 ? featured : posts.slice(0, 5);
  const essays = featured.length > 0 ? posts.filter((post) => !post.featured).slice(0, 3) : [];

  return (
    <>
      <PageHeader
        image="/batnoir2.png"
        // The brand shot — framed to keep the bat-signal in view.
        imagePosition="50% 22%"
        eyebrow={SITE.tagline}
        title="Engineering notes, written from the inside of the problem"
        lead={
          <>
            I&rsquo;m {SITE.author.name}. I build production systems &mdash; marketplaces, payment
            infrastructure, AI pipelines &mdash; and write here about the decisions behind them:
            what I chose, what it cost, and what the numbers said afterwards.
          </>
        }
      />

      <div className="mx-auto grid max-w-5xl gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_16rem] lg:gap-16">
        <div>
          <h2 className="mb-8 text-[11px] font-extrabold uppercase tracking-label text-faint">
            {recent.length === 0 ? "Nothing here yet" : featured.length > 0 ? "Engineering" : "Latest"}
          </h2>

          {recent.length === 0 ? (
            <p className="text-muted">
              The first post is being written. Check back shortly, or subscribe via{" "}
              <a href="/rss.xml" className="text-accent hover:underline">
                RSS
              </a>
              .
            </p>
          ) : (
            <div className="flex flex-col">
              {recent.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}

          {essays.length > 0 && (
            <section className="mt-6 border-t border-line pt-10">
              <h2 className="mb-6 text-[11px] font-extrabold uppercase tracking-label text-faint">
                Essays on career and the industry
              </h2>
              <ul className="flex flex-col gap-4">
                {essays.map((post) => (
                  <li key={post.slug} className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                    <time dateTime={post.date} className="shrink-0 text-xs text-faint sm:w-32">
                      {formatDate(post.date)}
                    </time>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="font-bold leading-snug transition-colors hover:text-accent"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {posts.length > recent.length && (
            <Link
              href="/blog"
              className="mt-10 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-accent-ink transition-opacity hover:opacity-90"
            >
              All {posts.length} posts
            </Link>
          )}
        </div>

        <Sidebar />
      </div>
    </>
  );
}
