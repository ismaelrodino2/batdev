import Link from "next/link";
import { getAllTags, tagSlug } from "@/lib/posts";
import { SITE } from "@/lib/site";

function Label({ children }: { children: string }) {
  return (
    <h2 className="flex h-11 items-center justify-center bg-accent text-[11px] font-extrabold uppercase tracking-label text-accent-ink">
      {children}
    </h2>
  );
}

const socials = [
  { href: SITE.author.github, label: "GitHub" },
  { href: SITE.author.linkedin, label: "LinkedIn" },
  { href: SITE.author.portfolio, label: "Portfolio" }
];

export default function Sidebar() {
  const tags = getAllTags();

  return (
    <aside className="flex flex-col gap-10 lg:sticky lg:top-24">
      <section>
        <Label>About me</Label>
        <p className="mt-5 text-sm leading-relaxed text-muted">
          I&rsquo;m {SITE.author.name}, a {SITE.author.role.toLowerCase()} in Porto Alegre, Brazil.
          I build production systems end to end &mdash; and write here about the decisions behind
          them.{" "}
          <Link href="/about" className="text-accent hover:underline">
            Read more
          </Link>
        </p>
      </section>

      {tags.length > 0 && (
        <section>
          <Label>Topics</Label>
          <ul className="mt-5 flex flex-wrap gap-2">
            {tags.map(({ tag, count }) => (
              <li key={tag}>
                <Link
                  href={`/tags/${tagSlug(tag)}`}
                  className="inline-flex items-center gap-1.5 rounded-md border border-line px-2 py-1 font-mono text-[11px] text-faint transition-colors hover:border-accent hover:text-accent"
                >
                  {tag}
                  <span className="text-[10px] opacity-70">{count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <Label>Elsewhere</Label>
        <ul className="mt-5 flex flex-col gap-2 text-sm">
          {socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted transition-colors hover:text-accent"
              >
                {social.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="/rss.xml"
              className="text-muted transition-colors hover:text-accent"
            >
              RSS feed
            </a>
          </li>
        </ul>
      </section>
    </aside>
  );
}
