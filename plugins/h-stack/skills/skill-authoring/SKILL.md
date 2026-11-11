---
name: skill-authoring
description: Turn repeated procedures into tested scripts; report skill problems with approved drafts.
when_to_use: Automate this, skill fixes.
user-invocable: false
metadata:
  hstack:
    category: "15"
    short: repeated procedures into tested scripts; skill feedback
    intents: [skill, automate, script, feedback]
    keywords: ["\\b(make|turn) (this|it) (into )?(a )?(reusable )?(script|skill)\\b", "\\bwe keep doing this\\b", "\\b(make|turn) (this|it|that)( [a-z-]+){0,3} into (a )?(reusable )?(script|skill)\\b", "\\bmake (that|this|it) repeatable\\b", "\\bkeep (running|doing|typing) the same\\b", "\\bautomate (this|it)\\b", "\\bimprove (the|this) skill\\b", "\\bskill (misfired|is wrong|broke)\\b", "\\breport (this|the) skill\\b"]
    not_for: []
    events: []
    sizes: [light, full]
    modes: {default: guidance, full_on: []}
    explicit_only: false
    eval: evals/evals.json
    source: []
---

# Skill authoring: learn code, not prose

## Gate

When a procedure has succeeded at least twice and will recur, or a skill needs creating, improving or reporting. Scaffolding, `evals/evals.json`, with/without benchmarks, blind comparisons and description tuning belong to the official skill-creator (install `skill-creator@claude-plugins-official`); this skill decides what is worth keeping and in what form.

## Contract

Model-written prose skills score below no skill at all in SkillsBench (−8 to −11.5 points); scripts are the pattern that helps most. So:

1. **Prefer a script.** Capture the procedure as a script with the defaults that worked (paths, flags, thresholds), taken from the runs that succeeded, plus a test that ran. Put it where the project keeps tooling (`scripts/`, a Makefile target, package scripts).
2. **Prose only for judgment** a script can't hold, written from the project's own facts, and short.
3. **Benchmark before keeping.** A new skill or a change to one is kept only if skill-creator's benchmark (with vs without, on the project's real prompts and one held-out case) is at least as good. A human reviews the content before it ships.
4. **H-Stack's own shape** for anything inside H-Stack: `docs/adopt-and-adapt.md` (Gate, Contract, Retrieve, Before you finish; `user-invocable: false`; `metadata.hstack`; licence and THIRD_PARTY row for imports).

## Finding candidates

`node ${CLAUDE_SKILL_DIR}/scripts/repeated.mjs` lists command sequences that succeeded in two or more sessions of this project (from H-Stack's receipts), as starting points for a script.

## Reporting a skill problem

When a skill (H-Stack's or another) gave wrong guidance, draft an issue with `node ${CLAUDE_SKILL_DIR}/scripts/feedback-draft.mjs --skill <name> --section "<heading>" --expected "<...>" --actual "<...>"`. The draft strips paths, emails, tokens and repository names; show the exact text to the user and post only after they approve that text. Posting is a send action, so H-Stack asks first.

## Before you finish

- A new script ran successfully and has a test; a new or changed skill has benchmark numbers.
- Nothing was posted without the user approving the exact text.
