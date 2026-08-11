import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${SITE.author.fullName} and why BatDev exists.`,
  alternates: { canonical: "/about" }
};

const links = [
  { label: "Portfolio", href: SITE.author.portfolio },
  { label: "GitHub", href: SITE.author.github },
  { label: "LinkedIn", href: SITE.author.linkedin },
  { label: "Email", href: `mailto:${SITE.author.email}` }
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={SITE.author.fullName}
        lead={SITE.author.role}
        image="/batnoir.png"
      />

      <div className="prose-batdev prose prose-lg mx-auto max-w-2xl px-5 py-16 sm:px-8">
        <p>
          I&rsquo;m a senior software engineer in Porto Alegre, Brazil, with more than five years
          building production systems across frontend, backend, cloud and AI. I&rsquo;ve worked
          with teams in the US, Norway and Brazil, and I&rsquo;ve shipped products where there was
          nobody else to hand the hard part to.
        </p>

        <p>
          These days I split my time between <strong>Gudi</strong>, a cultural event marketplace I
          founded and built end to end, and <strong>WishApply</strong>, an AI career assistant that
          applies to jobs on the candidate&rsquo;s behalf. Both taught me more about architecture
          than any course did, mostly by being wrong first.
        </p>

        <h2>Why this blog exists</h2>

        <p>
          Most engineering writing describes what was built. The interesting part is almost always
          the decision underneath: why an automaton instead of an agent, why permissions live in
          the database instead of the client, why the cheap model plans and the expensive one
          writes. Those decisions have costs you can measure, and I try to bring the measurements
          along.
        </p>

        <p>
          So the rule here is simple: nothing gets published unless I can point at the code, the
          benchmark, or the incident behind it. If a post claims a number, that number came from
          somewhere I can show you.
        </p>

        <h2>What I&rsquo;m going deep on</h2>

        <ul>
          <li>
            <strong>Software architecture</strong> &mdash; boundaries, trade-off analysis, and
            knowing which decisions are expensive to reverse.
          </li>
          <li>
            <strong>AWS and cloud</strong> &mdash; moving past managed-platform defaults to owning
            the infrastructure, its observability and its cost.
          </li>
          <li>
            <strong>AI engineering</strong> &mdash; retrieval only where it compresses, agents only
            where a verifier gives them a stopping rule, cost measured against benchmarks instead
            of guessed at.
          </li>
        </ul>

        <h2>Elsewhere</h2>

        <ul>
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
