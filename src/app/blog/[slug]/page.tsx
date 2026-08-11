import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents, mdxOptions } from "@/components/mdx";
import { formatDate, getAllPosts, getPost, tagSlug } from "@/lib/posts";
import { SITE } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    robots: post.draft ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `${SITE.url}/blog/${post.slug}`,
      publishedTime: post.date,
      authors: [SITE.author.fullName],
      tags: [...post.tags]
    }
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const all = getAllPosts();
  const index = all.findIndex((p) => p.slug === post.slug);
  const newer = index > 0 ? all[index - 1] : undefined;
  const older = index < all.length - 1 ? all[index + 1] : undefined;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    keywords: post.tags.join(", "),
    mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
    author: {
      "@type": "Person",
      name: SITE.author.fullName,
      url: SITE.author.portfolio
    },
    publisher: { "@type": "Person", name: SITE.author.fullName }
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Author-controlled frontmatter only — nothing user-supplied reaches this.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <article className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-20">
        <header className="text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-faint">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingMinutes} min read</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-balance sm:text-5xl">
            {post.title}
          </h1>

          <hr className="mx-auto mt-7 w-10 border-0 border-t-2 border-line-strong" />

          {post.description && (
            <p className="mt-7 text-pretty text-lg leading-relaxed text-muted">
              {post.description}
            </p>
          )}

          {post.tags.length > 0 && (
            <ul className="mt-7 flex flex-wrap justify-center gap-2">
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
        </header>

        <div className="prose-batdev prose prose-lg mt-14 max-w-none">
          <MDXRemote source={post.body} options={mdxOptions} components={mdxComponents} />
        </div>

        <nav
          aria-label="More posts"
          className="mt-20 grid gap-4 border-t border-line pt-10 sm:grid-cols-2"
        >
          {older && (
            <Link
              href={`/blog/${older.slug}`}
              className="rounded-xl border border-line bg-card p-5 transition-colors hover:border-accent"
            >
              <span className="text-[11px] font-extrabold uppercase tracking-label text-faint">
                Older
              </span>
              <span className="mt-2 block font-bold leading-snug">{older.title}</span>
            </Link>
          )}
          {newer && (
            <Link
              href={`/blog/${newer.slug}`}
              className="rounded-xl border border-line bg-card p-5 text-right transition-colors hover:border-accent sm:col-start-2"
            >
              <span className="text-[11px] font-extrabold uppercase tracking-label text-faint">
                Newer
              </span>
              <span className="mt-2 block font-bold leading-snug">{newer.title}</span>
            </Link>
          )}
        </nav>
      </article>
    </>
  );
}
