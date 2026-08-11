import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags, tagSlug } from "@/lib/posts";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().filter((post) => !post.draft);
  const latest = posts[0]?.date;

  return [
    { url: SITE.url, lastModified: latest, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/blog`, lastModified: latest, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/about`, changeFrequency: "yearly", priority: 0.5 },
    ...posts.map((post) => ({
      url: `${SITE.url}/blog/${post.slug}`,
      lastModified: post.date,
      changeFrequency: "yearly" as const,
      priority: 0.8
    })),
    ...getAllTags().map(({ tag }) => ({
      url: `${SITE.url}/tags/${tagSlug(tag)}`,
      lastModified: latest,
      changeFrequency: "monthly" as const,
      priority: 0.4
    }))
  ];
}
