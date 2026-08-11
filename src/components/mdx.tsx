import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

const prettyCodeOptions: PrettyCodeOptions = {
  // Both palettes are emitted as CSS variables; globals.css picks one per theme.
  theme: { light: "github-light", dark: "github-dark-dimmed" },
  keepBackground: false,
  defaultLang: "text"
};

// Not `as const`: MDX's CompileOptions wants mutable Pluggable[] arrays.
export const mdxOptions: MDXRemoteProps["options"] = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, prettyCodeOptions],
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: { className: ["heading-anchor"], ariaHidden: true, tabIndex: -1 },
          content: { type: "text", value: "#" }
        }
      ]
    ]
  }
};

function Anchor({ href = "", children, ...rest }: ComponentProps<"a">) {
  const external = /^https?:\/\//.test(href);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}

/** `<Callout>` — usable directly inside any post. */
function Callout({ children, kind = "note" }: { children: ReactNode; kind?: "note" | "warn" }) {
  return (
    <aside
      className={`not-prose my-6 rounded-xl border-l-4 bg-card p-5 text-[0.95rem] leading-relaxed text-muted ${
        kind === "warn" ? "border-l-amber-500" : "border-l-accent"
      } border-y border-r border-line`}
    >
      {children}
    </aside>
  );
}

export const mdxComponents = {
  a: Anchor,
  Callout
};
