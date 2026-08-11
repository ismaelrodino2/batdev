import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-card">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-12 text-center sm:px-8">
        <p className="text-xl font-extrabold tracking-tight">{SITE.name}</p>
        <p className="text-sm text-faint">
          {SITE.author.fullName} &middot;{" "}
          <a href={`mailto:${SITE.author.email}`} className="hover:text-accent">
            {SITE.author.email}
          </a>
        </p>
        <p className="text-xs text-faint">
          Written in Markdown, built with Next.js, deployed on Vercel. No trackers, no cookie
          banner. <a href="/rss.xml" className="hover:text-accent">RSS</a> &middot;{" "}
          <a
            href={SITE.repository}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent"
          >
            Source
          </a>
        </p>
      </div>
    </footer>
  );
}
