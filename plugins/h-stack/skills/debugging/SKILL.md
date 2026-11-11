---
name: debugging
description: Find the root cause of a failing test, error, crash, flaky or slow behaviour before changing code, then prove the fix.
when_to_use: Tests fail, stack traces, "why does X break", regressions, flaky tests, performance problems.
user-invocable: false
metadata:
  hstack:
    category: "06"
    short: root cause before any fix, then prove it
    intents: [bug, debug, regression, crash, flaky, slow, performance]
    keywords: ["\\btraceback\\b", "\\bstack ?trace\\b", "\\b(tests?|build|ci|it) (is |are )?(fail(s|ing|ed)?|broken|red)\\b", "\\bfail(s|ing|ed)? (with|on)\\b", "\\bwhy (does|is|did) .{0,40}(break|fail|crash|wrong|slow)", "\\bregression\\b", "\\bflaky\\b", "\\b(exception|segfault|panic|crash(es|ed)?)\\b", "\\b(too )?slow(er)?\\b", "\\bbug\\b", "\\bdoesn'?t work\\b", "\\berror\\b"]
    not_for: []
    events: [test_failed, build_failed]
    sizes: [light, full]
    modes: {default: guidance, full_on: []}
    explicit_only: false
    eval: evals/evals.json
    source:
      - {repo: obra/superpowers, path: skills/systematic-debugging, licence: MIT}
---

# Debugging

## Gate

Use for any failure or unexpected behaviour: test and build failures, production bugs, regressions, flaky tests, slowness. Simple bugs have root causes too, and a fix proposed before the cause is known sets the pattern for the rest of the session.

## Contract

No fix until there is a reproduction that fails for the right reason. A fix is done when the reproduction passes, the suite passes, and the new test is shown to fail without the fix.

## Phase 1: reproduce and investigate

1. **Read the error completely**: the whole stack trace, line numbers, paths, codes.
2. **Build a red loop.** One command, already run, that shows the user's exact symptom: deterministic, fast, runnable by you. No hypotheses before it exists. If you can't reproduce it, gather more data instead of guessing.
3. **Check recent changes**: `git log`, `git diff`, dependency and config changes, environment differences.
4. **Multi-component systems** (CI → build → deploy, API → service → DB): log what enters and leaves each boundary once, then read where the data goes wrong. Tag every debug line with one unique prefix so clean-up is one grep.
5. **Trace backwards** from the symptom to the first bad value: `references/root-cause-tracing.md`.

## Phase 2: compare

Find similar code in this codebase that works and list every difference from the broken path, however small. If you're applying a known pattern, read its reference implementation completely.

## Phase 3: hypotheses

Write 3–5 ranked, falsifiable hypotheses, each with what it predicts. Test the top one with the smallest change, one variable at a time. If it's refuted, form a new one; don't stack fixes. Mark each conclusion as measured, inferred or guessed. If you don't understand something, say so.

A retry needs a new signal: a new error, a test result, a measurement. When the user states the cause, treat it as a hypothesis and test it (`h-stack:core-rules`, premise check).

## Phase 4: fix and prove

1. Write the failing test first (`h-stack:tdd`); a one-off script is fine where there is no framework.
2. Make one change at the root cause. No bundled refactors.
3. Prove the fix is what made the test pass: `node ${CLAUDE_PLUGIN_ROOT}/skills/debugging/scripts/verify-fix.mjs -- <test command>` stashes the non-test changes, checks the test fails, restores them and checks it passes.
4. Run the whole suite.
5. Offer to keep a throwaway reproduction script as a regression test when it fails on the base commit and passes with the fix, matching the project's test conventions.

**Three strikes.** If three fixes have failed, stop: each fix revealing a new problem elsewhere points at the design, not the hypothesis. Record the attempts with `hs failed`, question the approach, and discuss it with the user before a fourth.

If investigation shows the cause is truly external or timing-dependent, document what you checked, handle it (retry, timeout, clear error) and add logging. Most "no root cause" findings are incomplete investigations.

## Supporting techniques

- `references/root-cause-tracing.md`: follow a bad value up the call chain to its source.
- `references/defense-in-depth.md`: after the fix, validate at each layer the data passes through.
- `references/condition-based-waiting.md`: replace sleeps in flaky tests with waits on the real condition.
- `references/performance.md`: baseline, one change per measured attempt, keep or revert.

## Before you finish

- The reproduction command and its before/after results are in the reply.
- verify-fix (or an equivalent stash-and-rerun) showed the test fails without the fix.
- Debug logging added during investigation is removed.
