# Adopt and adapt: the import procedure and skill standard (HS-081)

Every H-Stack skill is either an adapted import of the top-ranked permissive skill for its job (from `research/01–16`) or, where nothing qualifies, written by hand from the research. Skill content is never generated unsupervised: self-generated skills scored 8–11.5 points *below* no skill in SkillsBench v4. `scripts/lint.mjs` checks the mechanical parts of this procedure in CI.

## The procedure

1. **Pick** the top-ranked skill for the job in the research file. Licence must be MIT, Apache-2.0, BSD or ISC. Never copyleft, non-commercial, Commons Clause, ELv2, anti-Anthropic riders, or anything flagged in `research/top10-method.md` (remote rule fetching, cookie requests, default-on telemetry, hidden instructions). Take ideas only from those.
2. **Read every file in full** at a pinned commit (`git clone --depth 1`, record `git rev-parse HEAD`). Look for remote fetches, hidden instructions, telemetry and anything that runs on install.
3. **Keep the licence.** Copy the upstream LICENSE text and copyright notice into the skill folder as `LICENSE`. When a skill combines several upstreams, `LICENSE` holds each notice in turn.
4. **Record it** in `plugins/h-stack/third-party.json` (repo, path, commit, licence, copyright, files with upstream SHA-256, changes), then run `node plugins/h-stack/scripts/third-party.mjs --write`. CI fails when a shipped file no longer matches its recorded digest.
5. **Strip house styles and templates.** No fixed palettes, fonts, layouts, boilerplate, code templates or one-size checklists. The skill teaches how to decide from the project's own code, brand, users and constraints. The sameness check in the smoke test measures this.
6. **Reshape** into four parts:
   - **Gate**: when this applies and when it doesn't (name the sibling skills it is not for).
   - **Contract**: what done looks like, as checks the project can run.
   - **Retrieve**: where to look in this project and which upstream docs to read; route to docs instead of copying them.
   - **Before you finish**: the evidence to show (receipts, "Not verified:" lines).
7. **Triggers** go in `when_to_use`; `description` leads with the use case. Combined cap 1,536 characters; in practice keep each listing near 60 tokens (the whole listing budget is 900).
8. **Route, don't copy.** Long playbooks go in `references/` and load on demand. Copied code in references rots (Cloudflare's `check-reference-code-blocks.py`); fenced blocks over 40 lines need a `<!-- tested: ... -->` note.
9. **Encode procedure, not advice.** Generic advice ("write clean code") is cut. Keep the steps, checks and decision rules.
10. **Plain statements, no all-caps imperatives** (A4). Rules that must never slip become hooks; the skill explains the habit.
11. **Frontmatter.** `user-invocable: false` (no slash commands), never `disable-model-invocation` (it would make the skill unreachable), and `metadata.hstack` with `category`, `short`, `intents`, `keywords`, `not_for`, `events`, `sizes`, `modes`, `explicit_only`, `source`.
12. **Evals.** `evals/evals.json` in skill-creator's format with at least three realistic prompts and objectively checkable expectations. Run the light benchmark (`node evals/skill-bench.mjs --skill <name>`: one run with the skill, one without, per prompt). An import that does worse than no skill is dropped, and the reason recorded in `third-party.json` under `dropped`.

## Skill shape

```yaml
---
name: debugging
description: Find the root cause of a failing test, error or regression before changing code.
when_to_use: >
  Tests fail, stack traces, "why does X break", regressions. Not for performance (h-stack:perf).
user-invocable: false
metadata:
  hstack:
    category: "06"
    short: root cause before any fix
    intents: [bug, regression]
    keywords: ["\\btraceback\\b"]
    not_for: []
    events: [test_failed]
    sizes: [light, full]
    modes: {default: guidance, full_on: []}
    explicit_only: false
    source: [{repo: obra/superpowers, path: skills/systematic-debugging, licence: MIT}]
---
```

## What skill-creator is used for

Scaffolding, `evals/evals.json`, the with/without benchmark, blind comparison of versions and description tuning. Not for writing skill content unsupervised (K20).
