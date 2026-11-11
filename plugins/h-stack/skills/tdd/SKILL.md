---
name: tdd
description: Build features or fix bugs test-first in vertical red-green slices, with tests at public seams that survive refactors.
when_to_use: Adding behaviour or fixing a bug where a test can come first, "TDD", "red-green", "write tests for", migrations that must not lose items.
user-invocable: false
metadata:
  hstack:
    category: "05"
    short: test-first in vertical red-green slices
    intents: [tdd, test-first, feature, migration]
    keywords: ["\\btdd\\b", "\\bred[- ]green\\b", "\\btest[- ]first\\b", "\\bwrite (a |the )?(failing |unit |integration )?tests? (for|first)\\b", "\\badd (a )?regression test\\b", "\\bmigrat(e|ion)\\b"]
    not_for: []
    events: []
    sizes: [light, full]
    modes: {default: guidance, full_on: []}
    explicit_only: false
    eval: evals/evals.json
    source:
      - {repo: mattpocock/skills, path: skills/engineering/tdd, licence: MIT}
---

# Test-driven development

## Gate

Use when behaviour is being added or a bug fixed and a test can come first. For finding the cause of an existing failure, start with `h-stack:debugging`; for UI checks in a browser, `h-stack:qa`.

## Contract

- **Red before green.** Write one failing test, run it and watch it fail for the expected reason, then write only enough code to pass it. A test that passes before the implementation exists is a finding about the test.
- **One slice at a time.** One seam, one test, one minimal implementation per cycle. Don't write all the tests first: bulk tests check imagined behaviour and lock in structure before you understand it.
- **Tests at seams.** A seam is the public boundary where behaviour is observable. Test there, never against internals. A good test reads like a specification ("user can check out with a valid cart") and survives refactors.
- **Independent expected values.** Expected values come from a known-good literal, a worked example or the spec, never recomputed the way the code computes them.
- **Refactor outside the loop.** Clean-up comes after green, in its own step (the official code-simplifier plugin helps if installed), with the suite green before and after.

## Retrieve: fit the project

- Find the project's test runner, file layout and naming from its manifest, config and existing tests, and match them. Read `GLOSSARY.md` or domain docs if they exist so test names use the project's terms; respect ADRs in the area.
- Agree the seams under test before writing tests: name each with one line on what it catches and misses. If the user said to proceed without questions, pick the seams yourself and record them with `hs assume`.
- What a good test looks like: `references/tests.md`. When and how to mock: `references/mocking.md`.

## The test-writing step

H-Stack treats existing test files as read-only during implementation (the main way agents cheat is by editing tests). Creating new test files is always fine. To change an existing test file as part of red-green, open the step first:

1. `hs phase test` before any implementation edit in this turn.
2. Write or change the tests, run them, watch them fail.
3. The step ends automatically at your first non-test edit.

If the tests turn out to contradict the spec, don't edit them to pass; record `hs stop "<reason>"` and explain.

## Migrations: account for every item

When moving data, config or code from one shape to another, every source item maps to a target or to a "not migrated: reason" row. Count items per stage (source, transformed, written) and stop on any mismatch instead of continuing.

## Before you finish

- Each new test was seen failing, then passing (cite both runs, or the receipt of the passing run after the last edit).
- The whole suite passes after the last edit.
- No existing assertion was weakened, skipped or special-cased to pass.
