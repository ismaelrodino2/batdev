/**
 * draft-post.ts — turn a short brief about something you actually did into a
 * draft MDX post, and leave it for a human to merge.
 *
 * Three stages, deliberately separate:
 *
 *   1. plan    — structured JSON. Cheap to audit: you can read it and tell
 *                whether it understood the brief.
 *   2. write   — the prose. This is the step no schema can check, so it gets
 *                the budget.
 *   3. review  — structured JSON again: every claim in the draft that the
 *                brief does not support. Goes into the PR body as a checklist.
 *
 * The output is always `draft: true`. Nothing publishes without a merge.
 *
 * Usage:
 *   pnpm draft --brief ./my-brief.md
 *   pnpm draft --brief "I rebuilt the blog on MDX. The old one used Prisma..."
 *   BRIEF="..." pnpm draft
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-opus-5";
// Server-side fallback: if a safety classifier declines the request, the API
// re-runs it on Anthropic's recommended fallback model inside the same call
// instead of handing back a refusal.
const BETAS = ["server-side-fallback-2026-07-01"];

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const SUMMARY_PATH = process.env.GITHUB_STEP_SUMMARY;

const client = new Anthropic();

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const planSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "slug", "description", "tags", "thesis", "sections", "claims"],
  properties: {
    title: { type: "string", description: "Specific and concrete. No colons-and-buzzwords." },
    slug: { type: "string", description: "kebab-case, ASCII only, no date prefix." },
    description: {
      type: "string",
      description: "One or two sentences. Says what the reader gets, not what the post 'explores'."
    },
    tags: {
      type: "array",
      items: { type: "string" },
      description: "Two to four existing-style topic tags, Title Case."
    },
    thesis: {
      type: "string",
      description: "The single arguable claim the post defends, in one sentence."
    },
    sections: {
      type: "array",
      description: "Three to six sections in reading order.",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["heading", "purpose", "grounded_in"],
        properties: {
          heading: { type: "string" },
          purpose: { type: "string", description: "What this section has to establish." },
          grounded_in: {
            type: "string",
            description: "The exact part of the brief this section rests on. Quote it."
          }
        }
      }
    },
    claims: {
      type: "array",
      description: "Every factual or numeric claim the post will make.",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["claim", "grade", "evidence"],
        properties: {
          claim: { type: "string" },
          grade: {
            type: "string",
            enum: ["stated_in_brief", "inferred_from_brief", "general_knowledge"]
          },
          evidence: {
            type: "string",
            description: "Verbatim snippet of the brief. Empty string when grade is general_knowledge."
          }
        }
      }
    }
  }
} as const;

const reviewSchema = {
  type: "object",
  additionalProperties: false,
  required: ["verdict", "findings"],
  properties: {
    verdict: { type: "string", enum: ["clean", "needs_edits"] },
    findings: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["quote", "problem", "suggestion"],
        properties: {
          quote: { type: "string", description: "The exact sentence from the draft." },
          problem: {
            type: "string",
            enum: ["unsupported_claim", "invented_number", "overclaim", "filler"]
          },
          suggestion: { type: "string", description: "How to fix or what to cut." }
        }
      }
    }
  }
} as const;

type Plan = {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  thesis: string;
  sections: { heading: string; purpose: string; grounded_in: string }[];
  claims: { claim: string; grade: string; evidence: string }[];
};

type Review = {
  verdict: "clean" | "needs_edits";
  findings: { quote: string; problem: string; suggestion: string }[];
};

// ---------------------------------------------------------------------------
// Voice — the one thing that makes this sound like the blog and not like an LLM
// ---------------------------------------------------------------------------

const VOICE = `You are drafting for BatDev, the engineering blog of Ismael Rodino, a senior
software engineer in Porto Alegre. The blog's whole premise is that posts are grounded in
work the author actually did.

House style:
- First person, past tense for what happened, present for what is true now.
- Lead with the decision and its cost. The reader wants the trade-off, not a tutorial.
- Short paragraphs. Concrete nouns. No "in today's fast-paced world", no "let's dive in",
  no section that only restates the previous section.
- Numbers only when the brief supplies them. Never invent a benchmark, a percentage, or a
  latency figure — a fabricated number destroys the credibility the blog runs on.
- Admit the cost of the decision. Every post should have a paragraph on what the choice
  made worse.
- British-neutral English, Oxford comma off, sentence case for headings.

Hard rules:
- Never claim the author did something the brief does not say they did.
- Never name a company, client or tool that is not in the brief.
- If the brief is thin on a section, write less rather than padding it.`;

// ---------------------------------------------------------------------------
// API helpers
// ---------------------------------------------------------------------------

/** Reads the first text block, refusing to guess when the model declined. */
function textOf(message: Anthropic.Beta.Messages.BetaMessage, stage: string): string {
  if (message.stop_reason === "refusal") {
    throw new Error(
      `[${stage}] the request was declined (${message.stop_details?.type ?? "no category"}). ` +
        `Nothing was written.`
    );
  }
  if (message.stop_reason === "max_tokens") {
    throw new Error(`[${stage}] output hit max_tokens and is truncated. Raise the limit and retry.`);
  }

  const text = message.content.find((block) => block.type === "text");
  if (!text || text.type !== "text") throw new Error(`[${stage}] no text block in the response.`);
  return text.text;
}

async function structured<T>(args: {
  stage: string;
  system: string;
  prompt: string;
  schema: Record<string, unknown>;
  effort: "low" | "medium" | "high" | "xhigh" | "max";
}): Promise<T> {
  const message = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 8000,
    betas: BETAS,
    fallbacks: "default",
    system: args.system,
    output_config: {
      effort: args.effort,
      format: { type: "json_schema", schema: args.schema }
    },
    messages: [{ role: "user", content: args.prompt }]
  });

  return JSON.parse(textOf(message, args.stage)) as T;
}

async function prose(args: { stage: string; system: string; prompt: string }): Promise<string> {
  // 16000 is the documented safe ceiling for a non-streaming request; a blog
  // post lands far below it, so there is no reason to reach for streaming.
  const message = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 16000,
    betas: BETAS,
    fallbacks: "default",
    system: args.system,
    output_config: { effort: "high" },
    messages: [{ role: "user", content: args.prompt }]
  });

  return textOf(message, args.stage);
}

// ---------------------------------------------------------------------------
// Stages
// ---------------------------------------------------------------------------

function planPrompt(brief: string) {
  return `Here is a brief describing something I built, decided, or got wrong:

<brief>
${brief}
</brief>

Plan a post from it. Grade every claim you intend to make:
- "stated_in_brief" — the brief says this outright. Quote it in \`evidence\`.
- "inferred_from_brief" — a reasonable reading of the brief. Quote what you inferred from.
- "general_knowledge" — true of the technology in general, not of my project specifically.

Anything you cannot grade as one of those three does not go in the plan.`;
}

function writePrompt(brief: string, plan: Plan) {
  return `Write the post.

<brief>
${brief}
</brief>

<plan>
${JSON.stringify(plan, null, 2)}
</plan>

Return the MDX body only — no frontmatter, no fences around the whole document, no preamble.
Start at the first paragraph; the title is rendered separately, so do not repeat it as an H1.
Use \`##\` for section headings. Fenced code blocks may carry a \`title="file.ts"\` meta.
A \`<Callout>...</Callout>\` component is available for a single aside; use at most one.

Claims graded "general_knowledge" must be written as general statements, never as something
I personally measured.`;
}

function reviewPrompt(brief: string, draft: string) {
  return `Audit this draft against the brief it came from. You are looking for exactly one
class of defect: statements the brief does not support.

<brief>
${brief}
</brief>

<draft>
${draft}
</draft>

Flag: invented numbers, claims about what I did that the brief does not state, named tools or
companies absent from the brief, and paragraphs that add no information. Do not flag style,
structure, or opinions. Return "clean" with an empty findings array if there is nothing.`;
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const yamlString = (value: string) => `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

function writePost(plan: Plan, body: string) {
  const slug = slugify(plan.slug || plan.title);
  const date = new Date().toISOString().slice(0, 10);
  const file = path.join(POSTS_DIR, `${slug}.mdx`);

  if (fs.existsSync(file)) {
    throw new Error(`content/posts/${slug}.mdx already exists — rename the slug or delete it.`);
  }

  const frontmatter = [
    "---",
    `title: ${yamlString(plan.title)}`,
    `slug: ${yamlString(slug)}`,
    `date: ${yamlString(date)}`,
    `description: ${yamlString(plan.description)}`,
    `tags: [${plan.tags.map(yamlString).join(", ")}]`,
    "draft: true",
    "---",
    ""
  ].join("\n");

  fs.mkdirSync(POSTS_DIR, { recursive: true });
  fs.writeFileSync(file, `${frontmatter}\n${body.trim()}\n`, "utf8");

  return { file, slug };
}

function report(plan: Plan, review: Review, slug: string) {
  const lines = [
    `## Draft: ${plan.title}`,
    "",
    `**Thesis** — ${plan.thesis}`,
    "",
    `\`content/posts/${slug}.mdx\` · tags: ${plan.tags.join(", ")} · **not published until you flip \`draft: true\` and merge.**`,
    "",
    "### Review checklist",
    ""
  ];

  if (review.verdict === "clean" && review.findings.length === 0) {
    lines.push("The self-check found nothing unsupported. Read it anyway — it is your name on it.");
  } else {
    lines.push("The self-check flagged these. Fix or cut each one before merging.", "");
    for (const finding of review.findings) {
      lines.push(
        `- [ ] **${finding.problem}** — “${finding.quote}”`,
        `      ↳ ${finding.suggestion}`
      );
    }
  }

  const generalKnowledge = plan.claims.filter((c) => c.grade === "general_knowledge");
  if (generalKnowledge.length > 0) {
    lines.push(
      "",
      "### Claims written as general knowledge",
      "",
      "These are not about your project. Confirm the post does not present them as your own measurements.",
      "",
      ...generalKnowledge.map((c) => `- ${c.claim}`)
    );
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

function readBrief(): string {
  const flagIndex = process.argv.indexOf("--brief");
  const raw = flagIndex !== -1 ? process.argv[flagIndex + 1] : process.env.BRIEF;

  if (!raw?.trim()) {
    throw new Error("No brief. Pass --brief <file|text> or set BRIEF.");
  }

  const brief = fs.existsSync(raw) ? fs.readFileSync(raw, "utf8") : raw;

  if (brief.trim().length < 120) {
    throw new Error(
      "That brief is too short to ground a post. Write a few sentences about what you did, " +
        "what you chose, and what it cost — the pipeline cannot invent those."
    );
  }

  return brief.trim();
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set.");
  }

  const brief = readBrief();

  console.log("→ planning");
  const plan = await structured<Plan>({
    stage: "plan",
    system: VOICE,
    prompt: planPrompt(brief),
    schema: planSchema,
    effort: "medium"
  });
  console.log(`  ${plan.title}`);

  console.log("→ writing");
  const body = await prose({ stage: "write", system: VOICE, prompt: writePrompt(brief, plan) });

  console.log("→ reviewing");
  const review = await structured<Review>({
    stage: "review",
    system: VOICE,
    prompt: reviewPrompt(brief, body),
    schema: reviewSchema,
    effort: "medium"
  });

  const { file, slug } = writePost(plan, body);
  const summary = report(plan, review, slug);

  console.log(`\n✓ ${path.relative(process.cwd(), file)}\n`);
  console.log(summary);

  if (SUMMARY_PATH) fs.appendFileSync(SUMMARY_PATH, `${summary}\n`, "utf8");
  fs.writeFileSync(path.join(process.cwd(), ".draft-report.md"), summary, "utf8");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
