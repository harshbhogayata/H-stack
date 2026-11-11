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
| Visibility | Spinner suffix and a one-line announcement of the skill used; optional side pane |
| Skills | core-rules, clarify, planning, tdd, debugging, review, qa, security-audit, design-ui, memory, writing, git-ship, long-run (only when asked), skill-authoring, research |

Imported skills keep their upstream licence; sources, commits and sha256 digests are in [`plugins/h-stack/THIRD_PARTY.md`](plugins/h-stack/THIRD_PARTY.md). Every backlog item's status is in [`BACKLOG.md`](BACKLOG.md).

Optional project setup (shown before anything is written): `node plugins/h-stack/scripts/setup.mjs`. The `hs` command (assume, decide, wish, failed, stop, retro, status) is on Claude's PATH inside sessions.

## Results so far

Per-skill benchmark, skill-creator layout, 3 eval prompts per skill, **1 run per arm** (a delta under about 0.15 is within noise). Full table: [`evals/results/skills/SUMMARY.md`](evals/results/skills/SUMMARY.md).

| Skill | With | Without | Skill | With | Without |
|---|---:|---:|---|---:|---:|
| qa | 1.00 | 0.56 | clarify | 1.00 | 0.89 |
| memory | 0.78 | 0.44 | writing | 1.00 | 0.89 |
| git-ship | 1.00 | 0.72 | core-rules | 0.89 | 0.78 |
| long-run | 1.00 | 0.72 | tdd | 0.89 | 0.78 |
| skill-authoring | 1.00 | 0.72 | debugging, design-ui, research, review, security-audit | 1.00 | 1.00 (tie) |
| planning | 1.00 | 0.87 | | | |

The review import was worse than no skill on its first run (0.89 vs 1.00) and was fixed before keeping it. The five ties sit at the ceiling: their evals are too easy to show a gain (see the morning report).

**Activation is the main open problem.** H-Stack names the right skill, but the model often answers without loading it. In the latest plugin-eval run, the tdd skill loaded in 0 of 3 runs. Only planning differs from no-plugin (0.67 vs 0.33, 3 runs per arm).

**Not yet measured:** the whole-stack smoke test on ~10 of the user's real tasks (HS-001, M1 and M9). The runner and release gate are ready (`evals/run-smoke.mjs`, `evals/release-gate.mjs`); the tasks have to come from real work.

## Checks

```bash
node plugins/h-stack/scripts/ci.mjs   # validate, index, budget, snapshots, hook contract, lint, THIRD_PARTY, egress, tests
claude plugin validate .
node evals/release-gate.mjs           # CI + a fresh smoke run on real tasks; required before a version bump
```

## How we build

Pick the top-ranked skill → import and adapt it → smoke-test → validate (`claude plugin validate .`) → commit. Rules for working on this repo are in [`CLAUDE.md`](CLAUDE.md).
