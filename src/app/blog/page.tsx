import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import PostCard from "@/components/post-card";
import Sidebar from "@/components/sidebar";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Writing",
  description: "Every post — software architecture, AI engineering, performance and payments.",
  alternates: { canonical: "/blog" }
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <PageHeader
        eyebrow="Archive"
        title="Writing"
        lead="Everything published so far, newest first."
      />

      <div className="mx-auto grid max-w-5xl gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_16rem] lg:gap-16">
        <div className="flex flex-col">
          {posts.length === 0 ? (
            <p className="text-muted">No posts yet.</p>
          ) : (
            posts.map((post) => <PostCard key={post.slug} post={post} />)
          )}
        </div>

        <Sidebar />
      </div>
    </>
  );
}
