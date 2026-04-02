---
title: "Six Months of Building at Scorecard"
date: "2026-03-27"
description: "121 PRs, 29,850 lines added, 6 repos — a data-driven look at six months of building tracing infrastructure and shipping product at an early-stage AI startup."
tags: ["work", "engineering", "startup", "retrospective"]
---

I joined [Scorecard](https://scorecard.io) in October 2025 as one of a handful of engineers building an AI evaluation platform. Six months and 121 merged PRs later, here's what that actually looked like — by the numbers, by the code, and by the lessons.

## The Numbers

| | |
|---|---|
| **Merged PRs** | 121 |
| **Lines added** | 29,850 |
| **Lines deleted** | 9,799 |
| **Net lines shipped** | +20,051 |
| **Files changed** | 517 |
| **Repos contributed to** | 6 |

### Repos Touched

| Repo | PRs | What it is |
|---|---|---|
| `scorecard` | 101 | Main product monorepo (Next.js frontend + Node.js backend) |
| `docs` | 13 | Mintlify documentation site |
| `scorecard-node` | 3 | TypeScript SDK |
| `symphony` | 2 | Internal workflow tooling |
| `scorecard-collector` | 1 | OpenTelemetry collector fork |
| `scorecard-python` | 1 | Python SDK |

### Velocity Over Time

| Month | PRs | Additions | Deletions |
|---|---|---|---|
| Oct 2025 | 4 | 57 | 22 |
| Nov 2025 | 14 | 2,814 | 1,568 |
| Dec 2025 | 12 | 5,029 | 1,286 |
| Jan 2026 | 24 | 8,627 | 2,898 |
| Feb 2026 | 36 | 7,087 | 2,435 |
| Mar 2026 | 31 | 6,236 | 1,590 |

4 PRs in October. 36 in February. That ramp tells the story of going from onboarding to ownership.

## What I Actually Built

I categorized every PR by what it was really about. Here's where the code went.

### Tracing Infrastructure — 30+ PRs

This was the core of my work. Scorecard's tracing system ingests OpenTelemetry traces from AI agents and renders them so teams can see exactly what their agents did. I touched nearly every layer.

**Trace visualization:**
- Redesigned the trace details page twice — first a general UI overhaul ([#228](https://github.com/scorecard-ai/scorecard/pull/228), [#233](https://github.com/scorecard-ai/scorecard/pull/233) — 3,005 lines), then purpose-built views for Claude Code traces ([#263](https://github.com/scorecard-ai/scorecard/pull/263) — 2,312 lines)
- Built a **conversation view** that turns raw span trees into readable chat interfaces ([#324](https://github.com/scorecard-ai/scorecard/pull/324) — 690 lines), with deduplication logic ([#362](https://github.com/scorecard-ai/scorecard/pull/362)), dark mode fixes ([#530](https://github.com/scorecard-ai/scorecard/pull/530)), and cross-navigation from timeline/span views ([#447](https://github.com/scorecard-ai/scorecard/pull/447))
- Added a **trace dashboard** with cost calculations and metadata ([#244](https://github.com/scorecard-ai/scorecard/pull/244))

**Trace classification:**
- Refactored the entire trace classification system ([#315](https://github.com/scorecard-ai/scorecard/pull/315) — 4,931 lines, my largest PR) — rewrote how we detect span types, tool calls, and agent patterns
- Built a **Langchain/Traceloop adapter** ([#319](https://github.com/scorecard-ai/scorecard/pull/319)) so traces from different frameworks render correctly
- Added a **ToolSearch adapter** for Claude Code ([#349](https://github.com/scorecard-ai/scorecard/pull/349))
- Eventually moved all adapter logic to a shared `@scorecard/schemas` package ([#459](https://github.com/scorecard-ai/scorecard/pull/459) — 4,230 lines, second largest PR)

**Trace correctness & reliability:**
- Built a **daily trace integrity check** via Temporal workflow ([#578](https://github.com/scorecard-ai/scorecard/pull/578) — 514 lines) to catch data inconsistencies before customers do
- Fixed the trace poller watermark to use insertion time instead of span start time ([#569](https://github.com/scorecard-ai/scorecard/pull/569)) — a subtle bug where late-arriving spans were missed

**Trace details polish:**
- Tool call outputs in conversation view ([#328](https://github.com/scorecard-ai/scorecard/pull/328))
- Span search across attributes ([#330](https://github.com/scorecard-ai/scorecard/pull/330))
- Local timezone display for timestamps ([#332](https://github.com/scorecard-ai/scorecard/pull/332))
- Model name inheritance across spans for cost calculation ([#415](https://github.com/scorecard-ai/scorecard/pull/415))
- Tool badge rendering for spans missing attributes ([#535](https://github.com/scorecard-ai/scorecard/pull/535))
- Handling truncated Edit tool results ([#579](https://github.com/scorecard-ai/scorecard/pull/579))

### Records Page & SDK Integration — 15+ PRs

Records are the core evaluation data in Scorecard. I built the system that connects traces to records and made the records page actually usable.

- Designed and shipped the **slide-out record details panel** with integrated scoring ([#333](https://github.com/scorecard-ai/scorecard/pull/333) — 2,437 lines)
- Built **trace recognition** on the record details page ([#265](https://github.com/scorecard-ai/scorecard/pull/265) — 1,510 lines)
- Added **SDK inputs/outputs display** in records table ([#563](https://github.com/scorecard-ai/scorecard/pull/563)), side panel ([#565](https://github.com/scorecard-ai/scorecard/pull/565)), and a shared component with markdown rendering ([#566](https://github.com/scorecard-ai/scorecard/pull/566))
- Built **otel_link_id deduplication** end-to-end — database column ([#552](https://github.com/scorecard-ai/scorecard/pull/552)), SDK-side dedup ([#553](https://github.com/scorecard-ai/scorecard/pull/553)), trace-side dedup ([#554](https://github.com/scorecard-ai/scorecard/pull/554)), plus matching changes in the [Node SDK](https://github.com/scorecard-ai/scorecard-node/pull/39) and [Python SDK](https://github.com/scorecard-ai/scorecard-python/pull/28)
- Atomic preservation of SDK data during trace merge ([#562](https://github.com/scorecard-ai/scorecard/pull/562))
- Filter persistence ([#353](https://github.com/scorecard-ai/scorecard/pull/353)), timestamp fixes ([#365](https://github.com/scorecard-ai/scorecard/pull/365)), scoring UI ([#345](https://github.com/scorecard-ai/scorecard/pull/345))

### Search — 6 PRs in 2 Days

A customer needed better trace search. I shipped a full-text search system in a two-day sprint:

1. Added `search_text` column to the database ([#520](https://github.com/scorecard-ai/scorecard/pull/520))
2. Built `generateSearchText` helper and backfill logic ([#513](https://github.com/scorecard-ai/scorecard/pull/513))
3. Populated on record create/update with tsvector search ([#521](https://github.com/scorecard-ai/scorecard/pull/521))
4. Auto-scoped free-text search to last 30 days for performance ([#523](https://github.com/scorecard-ai/scorecard/pull/523))
5. Skipped ILIKE fallback within the backfilled window ([#528](https://github.com/scorecard-ai/scorecard/pull/528))
6. Used MATERIALIZED CTE to force GIN index usage ([#529](https://github.com/scorecard-ai/scorecard/pull/529))

From "search is broken" to production full-text search with proper indexing in 48 hours.

### Observability — 8 PRs

After we had a tracing correctness incident, I built out our internal observability stack:

- Sentry release tracking with SDK version bumps ([#537](https://github.com/scorecard-ai/scorecard/pull/537) — 455 lines)
- DB pool health and slow query detection metrics ([#538](https://github.com/scorecard-ai/scorecard/pull/538))
- Temporal worker crash reporting ([#539](https://github.com/scorecard-ai/scorecard/pull/539))
- Trace ingestion and scoring pipeline metrics ([#540](https://github.com/scorecard-ai/scorecard/pull/540))
- Health check latency baselines ([#541](https://github.com/scorecard-ai/scorecard/pull/541))
- Commit association with Sentry releases on deploy ([#548](https://github.com/scorecard-ai/scorecard/pull/548))
- Sentry feedback widget ([#204](https://github.com/scorecard-ai/scorecard/pull/204))

### Monitoring System — 5 PRs

The automated pipeline that processes traces into evaluation records:

- Auto-create monitoring configs for new projects ([#219](https://github.com/scorecard-ai/scorecard/pull/219))
- Updated extract IO logic for all trace types, not just AI spans ([#218](https://github.com/scorecard-ai/scorecard/pull/218))
- Database backfill migration for existing projects ([#235](https://github.com/scorecard-ai/scorecard/pull/235))
- Fixed project ID scoping for traces without explicit project IDs ([#216](https://github.com/scorecard-ai/scorecard/pull/216))

### Playground — 4 PRs

- Built **Playground V2** for new users ([#191](https://github.com/scorecard-ai/scorecard/pull/191) — 2,558 lines)
- Added **metrics and scores** to the playground ([#203](https://github.com/scorecard-ai/scorecard/pull/203) — 1,494 lines)
- Async parallel result processing ([#205](https://github.com/scorecard-ai/scorecard/pull/205))
- Gemini 3 Flash model support ([#220](https://github.com/scorecard-ai/scorecard/pull/220))

### AI Chat & Model Selection — 4 PRs

- Built an **AI chat tab** for trace analysis — ask questions about any trace ([#448](https://github.com/scorecard-ai/scorecard/pull/448) — 324 lines)
- Added model selector to the chat tab ([#534](https://github.com/scorecard-ai/scorecard/pull/534))
- Improved system prompts to prevent raw JSON responses ([#457](https://github.com/scorecard-ai/scorecard/pull/457))

### Customer-Driven Fixes

Some of my best PRs came directly from customer feedback sessions:

- **Casetext:** Linked span details from conversation view ([#394](https://github.com/scorecard-ai/scorecard/pull/394)), fixed file path truncation ([#393](https://github.com/scorecard-ai/scorecard/pull/393)), improved dashboard button hierarchy ([#396](https://github.com/scorecard-ai/scorecard/pull/396))
- **Orca:** Episode-aware conversation view ([#423](https://github.com/scorecard-ai/scorecard/pull/423))
- **TR:** Annotation export from records page and trace dashboard ([#485](https://github.com/scorecard-ai/scorecard/pull/485))
- **Large uploads:** Fixed chunking for large JSON testcase uploads ([#582](https://github.com/scorecard-ai/scorecard/pull/582) — 358 lines)

### Documentation — 13 PRs

- Claude SDK quickstart guide ([docs#85](https://github.com/scorecard-ai/docs/pull/85))
- Full monitor/trace to records docs refactor ([docs#87](https://github.com/scorecard-ai/docs/pull/87) — 43 files changed)
- SDK + Tracing combined docs ([docs#105](https://github.com/scorecard-ai/docs/pull/105), [docs#106](https://github.com/scorecard-ai/docs/pull/106))
- Metrics quickstart with updated screenshots ([docs#97](https://github.com/scorecard-ai/docs/pull/97))
- Traceloop project_id integration docs ([docs#89](https://github.com/scorecard-ai/docs/pull/89))

### Developer Experience & Code Health

- Two Next.js version upgrades ([#198](https://github.com/scorecard-ai/scorecard/pull/198), [#214](https://github.com/scorecard-ai/scorecard/pull/214))
- Scorecard tracing on our own PR status checks ([#375](https://github.com/scorecard-ai/scorecard/pull/375))
- Built a code-review skill for Claude Code ([#427](https://github.com/scorecard-ai/scorecard/pull/427))
- ClickHouse migration runner for the collector ([scorecard-collector#9](https://github.com/scorecard-ai/scorecard-collector/pull/9))
- Conventional commit conventions for Symphony workflows ([symphony#1](https://github.com/scorecard-ai/symphony/pull/1))

## Top 10 Largest PRs

| # | Lines | PR | What |
|---|---|---|---|
| 1 | 4,931 | [#315](https://github.com/scorecard-ai/scorecard/pull/315) | Trace classification refactor |
| 2 | 4,230 | [#459](https://github.com/scorecard-ai/scorecard/pull/459) | Move adapters to shared schemas package |
| 3 | 3,005 | [#233](https://github.com/scorecard-ai/scorecard/pull/233) | Trace details page overhaul |
| 4 | 2,558 | [#191](https://github.com/scorecard-ai/scorecard/pull/191) | Playground V2 |
| 5 | 2,437 | [#333](https://github.com/scorecard-ai/scorecard/pull/333) | Record details slide-out panel |
| 6 | 2,312 | [#263](https://github.com/scorecard-ai/scorecard/pull/263) | Claude Code trace frontend |
| 7 | 1,510 | [#265](https://github.com/scorecard-ai/scorecard/pull/265) | Trace recognition on records |
| 8 | 1,494 | [#203](https://github.com/scorecard-ai/scorecard/pull/203) | Metrics in playground |
| 9 | 1,237 | [#108](https://github.com/scorecard-ai/scorecard/pull/108) | Metrics UI overhaul |
| 10 | 736 | [#176](https://github.com/scorecard-ai/scorecard/pull/176) | Monitor page removal |

## What I Learned

**Ramp fast by shipping small.** My first PR was 2 lines — fixing a redirect URL. My second was 1 line — swapping an icon. By week three I was shipping 900-line UI overhauls. Small PRs build context and trust. Big PRs follow naturally.

**Refactors earn their keep.** My two largest PRs ([#315](https://github.com/scorecard-ai/scorecard/pull/315) and [#459](https://github.com/scorecard-ai/scorecard/pull/459)) were refactors — 9,161 lines combined. They weren't features. But after the trace classification refactor, adding Langchain support took a single 537-line PR instead of what would have been a rewrite. The shared schemas package made SDK dedup a clean 3-PR sequence across repos instead of duplicated logic.

**Customer bugs are the best features.** The full-text search sprint (6 PRs, 2 days) happened because a customer said "finding traces is painful." The Casetext UI fixes came from a Thursday SME demo. The episode-aware conversation view came from Orca's tracing needs. The best code I wrote this half-year was the code someone was waiting for.

**Instrument everything, especially yourself.** I built Sentry observability for Scorecard's infrastructure. Then I caught a tracing correctness bug through the integrity checks before any customer noticed. The 8 observability PRs were maybe 800 lines total — and they've prevented more incidents than any feature I've shipped.

**At a startup, you are the stack.** In a single week I might write a Temporal workflow, a React slide-out panel, a Postgres migration, a ClickHouse schema change, SDK changes in two languages, and a docs page. 517 files across 6 repos in 6 months. That's the job, and it's the best way to understand a product end-to-end.
