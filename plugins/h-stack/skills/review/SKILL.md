---
name: review
description: "Code review of a branch, diff or PR for real defects; verifies feedback before acting."
when_to_use: "Review my branch/PR before merging; address PR comments"
user-invocable: false
metadata:
  hstack:
    category: "07"
    short: evidence-backed review; verify feedback before acting
    intents: [review, feedback, pr-comments]
    keywords: ["\\breview (this|my|the) (diff|change|changes|pr|pull request|code|branch)\\b", "\\bcode review\\b", "\\b(review|pr) (comments?|feedback)\\b", "\\breviewer (said|says|asked|wants)\\b", "\\baddress (the )?(review|comments|feedback)\\b", "\\bbefore (I |we )?merge\\b", "\\breviewer (left|wrote|gave|posted)\\b", "\\b(comments|feedback|suggestions) (on|from|for) (my|the|a|our) (pr|pull request|review|reviewer)\\b", "\\bwhich (comments|suggestions) to accept\\b"]
    not_for: []
    events: [pre_push]
    sizes: [light, full]
    modes: {default: guidance, full_on: ["\\b(high[- ]risk|thorough|deep) review\\b", "\\breview lanes?\\b"]}
    explicit_only: false
    eval: evals/evals.json
    source:
      - {repo: obra/superpowers, path: skills/receiving-code-review, licence: MIT}
---

# Review

## Gate

Two jobs: reviewing a change (yours before a push, or someone else's), and acting on review feedback you received. Security audits of a whole codebase belong to `h-stack:security-audit`.

## Reviewing a change

**Native first.** For an ordinary diff, the built-in `code-review` skill (`/code-review`) or the official code-review plugin does the job; `/security-review` covers security-sensitive diffs. Use them, then apply the contract below to what they report.

**Contract for any finding:**
- It names a concrete failure: the input, state or sequence, and the wrong result. "Could be cleaner" is not a finding.
- It cites `file:line` and the exact text there.
- When a spec or doc defines the behaviour, check the claimed wrong result against that definition before reporting: behaviour the spec prescribes (rounding, floating-point results of the stated formula, edge cases it allows) is not a bug, however surprising.
- It carries a verdict: `confirmed` (shown or traced with certainty), `plausible` (a specific path not fully verified) or `rejected` (checked and does not hold).
- It carries a severity separate from the verdict: how likely the trigger is in this project's real use and how bad the result is. A confirmed edge case that real inputs rarely or never reach is `minor`, offered as optional, not called a bug. Verdict says how sure you are; severity says how much it matters.
- Rules come from this repository: its REVIEW.md, CLAUDE.md, lint and test config, and the spec or rubric, not from a generic checklist.
- No findings is a valid result when the `Cleared:` list shows what was checked.

**High-risk diffs** (auth, payments, data migrations, concurrency, public APIs, anything hard to roll back) get blind lanes: see `references/lanes.md`. Each lane is a fresh `h-stack:review-lane` subagent that sees only the diff command, one axis and the spec or rubric. H-Stack validates each lane's JSON mechanically and discards malformed or thin output for a fresh re-run. A same-model review is never the only gate before merge; the user decides.

**Coverage.** Split the diff into units (changed file × concern). Report `Cleared:` units with what was checked and `Not reviewed:` units honestly. Reserve about a third of the effort for verifying candidate findings before reporting them.

## Receiving feedback

Feedback is a claim to check against the codebase, not an instruction to obey or a compliment to return. See `references/receiving.md`. In short: read all of it, restate each item, verify it against the code, ask about every unclear item before implementing any, push back with technical reasoning when a suggestion is wrong for this codebase, then implement one item at a time with a test run each.

## Before you finish

- Each reported finding has file, line, quoted text, the failure and a verdict; rejected suspicions are listed so nobody re-checks them.
- The reply lists `Cleared:` and `Not reviewed:` units.
- For feedback: each item is implemented with a passing run, answered with reasoning, or waiting on a clarification you asked for.
