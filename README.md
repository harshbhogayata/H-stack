# H-Stack

A full, native-first Claude Code skill stack: the best existing skills adopted and adapted, every supporting layer built, and custom pieces wherever nothing good exists.

**North star:** get as much real capability out of the model as a harness can (reliability, autonomy horizon, learning over time, judgment, cost), checked with a small smoke test of real tasks. Details in [`CLAUDE.md`](CLAUDE.md#north-star).

## Install

In Claude Code (desktop app, CLI or web):

```
/plugin marketplace add harshbhogayata/h-stack
/plugin install h-stack@h-stack
```

No slash commands: H-Stack picks the right skill itself and shows what it picked. See [activation & experience](research/00-activation-and-experience.md). The repo is private, so the machine needs GitHub access to it.

To update after new commits: `/plugin` → Marketplaces → `h-stack` → update (or enable auto-update).

## What ships

One plugin, `h-stack`, with 15 skills (one per category, playbooks in `references/`), 4 agents, 19 command hooks and one mods module. Every skill sets `user-invocable: false`; H-Stack routes to them itself.

| Layer | What it does |
|---|---|
| Activation | SessionStart skill map, per-prompt classifier (`size=direct/light/full` + one relevant skill), event triggers, act/ask/stop check; "why that?" shows the matched rule |
| Guards | Evidence receipts and a Stop gate against false "done"; read-only tests outside the declared test-writing step; tamper scan; irreversible-action gate with dry-run receipts; dependency gate; MCP tool-description firewall; taint and fetch-destination checks; scope lock; step and spawn budgets |
| State and memory | Assumption and decision ledgers, wishlist, compaction checkpoints, committed path-scoped lessons with evidence, auto-memory shadow log, `hs retro` (local telemetry, 90-day retention) |
| Visibility | Spinner suffix and a one-line announcement of the skill used; optional side pane; finished pages, UIs and documents opened at the end of interactive turns, and visual tools used when brainstorming |
| Skills | core-rules, clarify, planning, tdd, debugging, review, qa, security-audit, design-ui, memory, writing, git-ship, long-run (only when asked), skill-authoring, research |

Imported skills keep their upstream licence; sources, commits and sha256 digests are in [`plugins/h-stack/THIRD_PARTY.md`](plugins/h-stack/THIRD_PARTY.md). Every backlog item's status is in [`BACKLOG.md`](BACKLOG.md).

Per-project switches in `.h-stack/config.json`: `concerns` (unresolved-concern check), `offers`, `show_results` (opens a finished page, UI or document at the end of an interactive turn; `false` turns it off), `pane`, `classifier.fallback`, plus budgets and guard lists ([ARCHITECTURE §4.2](ARCHITECTURE.md#42-h-stack--only-data-with-no-native-home)).

Optional project setup (shown before anything is written): `node plugins/h-stack/scripts/setup.mjs`. The `hs` command (assume, decide, wish, failed, stop, retro, status) is on Claude's PATH inside sessions.

## Results so far

**Per-skill benchmark.** Skill-creator layout; the with-skill arm can't see the eval answers; graders are blind and tool-less. The six skills that tied at the ceiling got 3 harder evals each and run at 3 runs per arm; the rest at 1 run. Full table: [`evals/results/skills/SUMMARY.md`](evals/results/skills/SUMMARY.md).

| Skill | With | Without | Skill | With | Without |
|---|---:|---:|---|---:|---:|
| memory | 0.78 | 0.44 | debugging | 1.00 | 0.93 |
| git-ship | 1.00 | 0.72 | planning | 0.93 | 0.87 |
| long-run | 1.00 | 0.72 | writing | 1.00 | 0.93 |
| skill-authoring | 1.00 | 0.72 | qa | 0.96 | 0.93 |
| tdd | 1.00 | 0.78 | research | 0.97 | 0.94 |
| clarify | 1.00 | 0.89 | review | 0.94 | 0.91 |
| core-rules | 0.89 | 0.78 | security-audit | 0.97 | 0.94 |
| | | | design-ui | 1.00 | 0.99 |

**Sameness check.** The same request ran in three very different projects, graded blind. Each skill fits the project better than no skill does: design-ui 0.93 vs 0.73, writing 0.92 vs 0.85, planning 0.97 vs 0.80. Cross-context similarity stays at or below 0.20.

**Activation.** In real `claude -p` sessions, seven eval-backed activation cases score 0.88 with the plugin vs 0.52 without (3 runs per arm, blind grading). They are better on 6 of 7 cases and worse on none, and Claude loaded the named skill in 18 of 21 runs (`evals/activation-bench.mjs --outcome --cases evals/activation-cases-hard.json`).

**Smoke test** (12 synthetic tasks, 1 run per arm, `evals/run-smoke.mjs`): pass 0.92 with and without. H-Stack made no false "done" claims across three runs (8% without in two), at 17–35% more tokens. The release gate passes; version 0.1.0.

## Checks

```bash
node plugins/h-stack/scripts/ci.mjs   # validate, index, budget, snapshots, hook contract, lint, THIRD_PARTY, egress, tests
claude plugin validate .
node evals/release-gate.mjs           # CI + a fresh smoke run on real tasks; required before a version bump
```

## How we build

Pick the top-ranked skill → import and adapt it → smoke-test → validate (`claude plugin validate .`) → commit. Rules for working on this repo are in [`CLAUDE.md`](CLAUDE.md).
