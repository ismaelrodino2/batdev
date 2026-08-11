import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/page-header";
import PostCard from "@/components/post-card";
import Sidebar from "@/components/sidebar";
import { getAllTags, getPostsByTag, tagSlug } from "@/lib/posts";

type Props = { params: Promise<{ tag: string }> };

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag: tagSlug(tag) }));
}

/** Slugs are lossy (`AI Agents` → `ai-agents`), so map back via the tag index. */
function resolveTag(slug: string) {
  return getAllTags().find(({ tag }) => tagSlug(tag) === slug)?.tag;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag: slug } = await params;
  const tag = resolveTag(slug);
  if (!tag) return {};

  return {
    title: `Posts tagged “${tag}”`,
    description: `Everything on BatDev about ${tag}.`,
    alternates: { canonical: `/tags/${slug}` }
  };
}

export default async function TagPage({ params }: Props) {
  const { tag: slug } = await params;
  const tag = resolveTag(slug);
  if (!tag) notFound();

  const posts = getPostsByTag(tag);

  return (
    <>
      <PageHeader
        eyebrow="Topic"
        title={tag}
        lead={`${posts.length} ${posts.length === 1 ? "post" : "posts"}.`}
      />

      <div className="mx-auto grid max-w-5xl gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_16rem] lg:gap-16">
        <div className="flex flex-col">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        <Sidebar />
      </div>
    </>
  );
}
