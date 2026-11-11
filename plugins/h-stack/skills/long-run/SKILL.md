---
name: long-run
description: Run /goal, scheduled or parallel work with checkable end states and declared effects.
when_to_use: Only when asked: overnight, unattended, fan-out.
user-invocable: false
metadata:
  hstack:
    category: "14"
    short: /goal, Routines and fan-out with checkable end states
    intents: [long-run, goal, schedule, parallel, overnight]
    keywords: ["\\bovernight\\b", "\\bunattended\\b", "\\blong[- ]run(ning)?\\b", "/goal\\b", "\\bkeep going until\\b", "\\b(run|do) (this|it) in parallel\\b", "\\bfan[- ]out\\b", "\\bschedul(e|ed) (task|run|job)\\b", "\\broutine\\b", "\\bevery (night|morning|day|hour)\\b"]
    explicit_only: true
    explicit_phrases: ["\\bovernight\\b", "\\bunattended\\b", "\\blong[- ]run\\b", "/goal\\b", "\\bkeep going until\\b", "\\bin parallel\\b", "\\bfan[- ]out\\b", "\\bschedul(e|ed)\\b", "\\broutine\\b", "\\bevery (night|morning|day|hour)\\b"]
    not_for: []
    events: []
    sizes: [light, full]
    modes: {default: guidance, full_on: []}
    eval: evals/evals.json
    source:
      - {repo: obra/superpowers, path: skills/dispatching-parallel-agents, licence: MIT}
---

# Long runs, schedules and fan-out

## Gate

Only when the user asked for unattended, looping, scheduled or parallel work (H-Stack's skill gate enforces this). Native features do the running: `/goal` (keeps working until a condition holds), Routines (schedule, GitHub-event and API triggers), Workflows, `/batch`, worktrees and subagents. This skill makes those runs checkable.

## /goal runs

1. **Feature list first.** From the spec, write `features.json` in the workspace: one entry per user-visible behaviour, each with the exact check that proves it and `"passes": false`. Keep a short `progress.md` beside it. Record the goal with `hs goal set "<goal>"` (add `--recite` on very long runs to have H-Stack restate it when it changes).
2. **Write the condition as one measurable end state**: the exact check command, what output means done, a receipt id to cite, the constraints (no force-push, no test edits), and a turn bound. A wish ("everything works") is met by a confident summary; a check is not.
3. **Workspace over memory.** Each round, read `features.json`, `progress.md`, `git log` and the receipts; flip `passes` only on a passing check run after the last edit.
4. **Blocked means persistent.** Call something blocked only after the same condition persisted for three rounds; then park it with `hs wish "<need>" --resume "<task>"` and move to the next feature.
5. H-Stack's overseer (opt-in: `long_run.overseer` in `.h-stack/config.json`) notes repeated commands, stalls and runs of failures during long runs.

## Fan-out to subagents

Use parallel subagents only for independent problems (different failures, different subsystems, no shared files). Coding that shares interfaces stays with one agent. H-Stack caps subagents per turn by task size. Each brief carries: objective, scope (files it may touch), output schema, tools, known facts, done-criteria, the untrusted-content rule, and its scratch directory. Subagents record implicit choices with `hs decide`; reconcile clashing decisions before merging. Details: `references/parallel.md`.

## Bulk tool work: write code, not calls

When a task means many similar tool calls (hundreds of API reads, mass renames, data pulls), write one script that makes the calls and prints a compact summary, instead of looping through tool calls that each land in context. Keep credentials in the environment or the tool's own config, not in the script.

## Splitting a big failure across agents

When one giant failure (a compiler, a port, a migration) would have every agent fixing the same thing, compare against a known-good oracle and give each agent a different failing subset: `node ${CLAUDE_SKILL_DIR}/scripts/oracle.mjs diff --oracle "<known-good cmd {}>" --candidate "<new cmd {}>" <inputs...>` lists inputs whose outputs differ; `oracle.mjs claim <id>` takes a lock file so two agents never work on the same item.

## Scheduled and unattended jobs

- **Declared effects.** Every Routine or Workflow H-Stack sets up gets a `task.yaml` (trigger, tools it reads with, effects it may have, budgets). While a job runs under it (`hs manifest start task.yaml`), H-Stack's Bash gate denies irreversible or write actions outside the declared effects. Format: `references/task-yaml.md`.
- **Sleep-time prep** (nightly flaky-test triage, dependency audit) only where many later sessions reuse the result; results are offered, never acted on.
- **CI watching** for an open PR: a Routine on the GitHub event with a notice and an offer; automatic fixes only with a per-PR opt-in; never merge.

## Before you finish

- `features.json` matches the receipts: every `passes: true` has a passing check after its last edit.
- Parked items are in the wishlist with what would unblock them.
