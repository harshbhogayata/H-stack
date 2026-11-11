---
name: core-rules
description: Prove every done, fixed or passing claim with a fresh command; keep changes small, simple and surgical.
when_to_use: Before claiming success, committing, or making any non-trivial edit.
user-invocable: false
metadata:
  hstack:
    category: "01"
    short: evidence before claims; small surgical changes
    intents: [verify, done, commit, assumption]
    keywords: ["\\b(is it|are we) (done|working|fixed)\\b", "\\bverify\\b", "\\bmake sure (it|this) works\\b", "\\bready to (commit|merge|ship)\\b", "\\b(the|its) (cause|problem|issue) is\\b", "\\bbecause of\\b"]
    not_for: []
    events: []
    sizes: [light, full]
    modes: {default: guidance, full_on: []}
    explicit_only: false
    eval: evals/evals.json
    source:
      - {repo: obra/superpowers, path: skills/verification-before-completion, licence: MIT}
      - {repo: multica-ai/andrej-karpathy-skills, path: CLAUDE.md, licence: MIT}
      - {repo: cursor/plugins, path: pstack/skills/principle-attack-the-premise, licence: MIT}
---

# Core rules

Rules for every change. H-Stack's Stop gate enforces the first one from receipts; this skill is the habit behind it.

## Gate

Applies to any change to code, config or docs. For a trivial one-line fix, use judgment on rules 2 to 4; rule 1 always applies.

## 1. Evidence before claims

Before saying work is done, fixed, passing or working:

1. Name the command that proves the claim: the project's own test, build, lint or a reproduction of the symptom.
2. Run it after the last edit, in full.
3. Read the output: exit code, number of failures.
4. State the result with its evidence, citing the receipt id H-Stack shows (`r-…`).

If you could not run it, say so on a line that starts `Not verified:` and name what is unchecked.

| Claim | Needs | Not enough |
|---|---|---|
| Tests pass | the test command's output, 0 failures | an earlier run, "should pass" |
| Build succeeds | the build command, exit 0 | lint passing, logs look fine |
| Bug fixed | the original symptom re-run and gone | code changed, assumed fixed |
| Regression test works | it failed without the fix and passes with it | it passes once |
| Subagent finished | the diff and a check you ran | its own success report |
| Requirements met | each requirement checked against the result | tests passing |

Words like "should", "probably" or "seems to" before a check has run are a sign the check is missing.

## 2. Think before coding

- State the assumptions you act on. Record each one with `hs assume "<assumption>" --check "<how to verify>"` and list them in the reply; resolve them before stopping.
- When a request has several readings, name them instead of picking one silently.
- When a simpler approach exists, say so.
- When something is unclear and you cannot look it up, name what is unclear and ask.

## 3. Simplicity

Write the least code that solves the stated problem: no unrequested features, no abstraction for a single use, no configurability nobody asked for, no handling for impossible cases. If 200 lines could be 50, rewrite.

## 4. Surgical changes

Every changed line traces to the request. Match the surrounding style. Don't reformat, refactor or "improve" neighbouring code; mention unrelated dead code instead of deleting it. Remove only the imports and helpers your own change orphaned.

## 5. Goal-driven execution

Turn the task into a check: "fix the bug" becomes "a test reproduces it, then passes"; "refactor X" becomes "the suite passes before and after". For multi-step work, write each step with its check: `1. <step> → verify: <command>`.

## 6. Signal rules

- Retry only when a new external signal arrived: a new error text, a test result, a measurement, the user's input. Re-reading your own reasoning is not a new signal.
- When independent checks disagree (the test passes but the user still sees the bug), verify more; don't settle it by confidence.
- After the same approach fails twice, record it with `hs failed "<what>" --because "<why>"` and change the approach or ask.

## 7. Premise check

A premise is a belief everything else rests on. Two cases:

- **The user states a cause** ("it's slow because of the cache"). Treat it as a hypothesis. Find the cheapest step that would settle it, run it, then reply in this order: the evidence, the conclusion, the check that would change it. The user decides.
- **Two fixes that share one premise have failed the same check.** Write the premise as one sentence and test it directly before the next fix: find an observation that would come out differently if it were false. If it is false, look for what the failures share that the premise didn't predict. If it holds, ask the next "why"; the earlier fixes may have treated a consequence.

## 8. Honest stop

If the tests contradict the spec, or the task can't be done as asked, don't bend the tests. Record `hs stop "<reason>"` and explain.

## Before you finish

- Each success claim cites a receipt, or a `Not verified:` line says what wasn't checked.
- Open assumptions are verified, refuted or handed to the user.
- The diff contains only lines the request needs.
