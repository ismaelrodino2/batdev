# 🦇 BatDev

The engineering blog of [Ismael Rodino](https://ismaelrodino.vercel.app). Posts live as MDX
files in this repository — there is no database, no CMS, and no login.

**Live:** https://batdev.vercel.app

## Stack

| Piece | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router) | Static generation, RSC, zero client JS on article pages |
| Content | MDX in `content/posts/` | Posts are diffs. Git is the history, the review tool and the backup |
| Styling | Tailwind CSS v4 | CSS-first config; the palette is CSS variables so light/dark is one class |
| Highlighting | Shiki via `rehype-pretty-code` | Build-time, so no highlighter ships to the browser |
| Hosting | Vercel | Push to `main` deploys |

## Writing a post

Create `content/posts/my-post.mdx`:

```mdx
---
title: "Why the application loop is not an agent"
slug: "why-the-loop-is-not-an-agent"
date: "2026-06-20"
description: "One or two sentences that say what the reader gets."
tags: ["AI Engineering", "Architecture"]
draft: false
---

Body starts here. No H1 — the title is rendered from the frontmatter.
```

- `title` and `date` are required; everything else has a default.
- `slug` defaults to the filename.
- `draft: true` keeps the post out of production builds, the RSS feed and the sitemap,
  while still showing it in `pnpm dev` with a badge.
- `<Callout>` is available inside any post; fenced blocks accept
  ` ```ts title="file.ts" ` and `{2-4}` line highlighting.

## Local development

```bash
pnpm install
pnpm dev
```

## The draft pipeline

`scripts/draft-post.ts` turns a brief about something you actually did into a draft post.
It is deliberately not a topic generator — it writes from your material, not from the
internet.

Three stages:

1. **plan** — structured JSON, so you can read it and tell whether it understood you. Every
   claim is graded `stated_in_brief` / `inferred_from_brief` / `general_knowledge`.
2. **write** — the prose. The step no schema can check, so it gets the budget.
3. **review** — structured JSON again: every sentence the brief doesn't support, with a
   suggested fix.

Locally:

```bash
export ANTHROPIC_API_KEY=sk-ant-...        # PowerShell: $env:ANTHROPIC_API_KEY = "sk-ant-..."
pnpm draft --brief ./brief.md              # or: pnpm draft --brief "a few sentences..."
```

The brief argument is a file path if the path exists, and literal text otherwise.

In CI: run the **Draft a post** workflow from the Actions tab, paste the brief, and it opens
a pull request with the review checklist in the body. `ANTHROPIC_API_KEY` needs to be a
repository secret.

The output is always `draft: true`. Nothing reaches the site without a human merge.
