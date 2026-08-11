import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  readingMinutes: number;
  draft: boolean;
};

export type Post = PostMeta & { body: string };

const WORDS_PER_MINUTE = 220;

function readingMinutes(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function parse(fileName: string): Post {
  const raw = fs.readFileSync(path.join(POSTS_DIR, fileName), "utf8");
  const { data, content } = matter(raw);

  const slug = String(data.slug || fileName.replace(/\.mdx?$/, ""));

  if (!data.title || !data.date) {
    throw new Error(`content/posts/${fileName}: "title" and "date" are required in the frontmatter`);
  }

  return {
    slug,
    title: String(data.title),
    // Normalised to YYYY-MM-DD: gray-matter turns an unquoted YAML date into a
    // Date object, and toISOString would shift it by the runner's timezone.
    date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date),
    description: String(data.description ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: data.draft === true,
    readingMinutes: readingMinutes(content),
    body: content
  };
}

/** Every publishable post, newest first. Drafts are excluded in production. */
export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const showDrafts = process.env.NODE_ENV !== "production";

  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => /\.mdx?$/.test(file))
    .map(parse)
    .filter((post) => showDrafts || !post.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getPostsByTag(tag: string): Post[] {
  const wanted = tag.toLowerCase();
  return getAllPosts().filter((post) => post.tags.some((t) => t.toLowerCase() === wanted));
}

export const tagSlug = (tag: string) => tag.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export function formatDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  // Fixed table rather than Intl so the build host's ICU data can't change it.
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return `${months[month - 1]} ${day}, ${year}`;
}
