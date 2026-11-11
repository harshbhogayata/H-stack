---
name: planning
description: Turn a spec or multi-step request into a plan of small, checkable tasks with exact interfaces, then execute it task by task.
when_to_use: A feature or change spanning several files or steps, a spec to implement, "plan this", "break this down".
user-invocable: false
metadata:
  hstack:
    category: "04"
    short: spec to checkable plan with interfaces, then execute
    intents: [plan, spec, feature, breakdown]
    keywords: ["\\bimplement (a |an |the )?(new )?(feature|endpoint|service|integration|page|screen)\\b", "\\bnew feature\\b", "\\b(write|make|draft|create) (a |an |the )?(implementation )?plan\\b", "\\bbreak (this|it) down\\b", "\\bspec\\b", "\\bimplement(ation)? plan\\b", "\\bstep[- ]by[- ]step plan\\b", "\\bexecute the plan\\b", "\\brubric\\b"]
    not_for: []
    events: []
    sizes: [light, full]
    modes: {default: guidance, full_on: ["\\bgo deep\\b", "\\brubric\\b"]}
    explicit_only: false
    eval: evals/evals.json
    source:
      - {repo: obra/superpowers, path: skills/writing-plans, licence: MIT}
      - {repo: obra/superpowers, path: skills/executing-plans, licence: MIT}
---

# Planning

## Gate

Use for work that spans several files or steps, or a spec to implement. A one-file fix doesn't need a plan; go straight to `h-stack:tdd` or `h-stack:debugging`. If the request is still ambiguous, clarify first (`h-stack:clarify`).

## Contract: what a plan is

A plan is the set of decisions an implementer could not make alone: which files, which names and signatures, which values from the spec, which tests prove each task. It is written for a capable engineer who has never seen this codebase. A plan longer than the code it describes has written the code instead; a line that decides nothing ("handle edge cases", "add validation", "TBD") is a gap.

Derive the plan's shape from the project, not from a template:
- **Where it lives:** follow the project's convention for design docs (look for `docs/plans`, `docs/design`, ADRs, an existing plans folder, or what CLAUDE.md says). If there is none, ask once or keep the plan in the conversation.
- **Commands:** use the project's own test, build and lint commands, found in its manifest, Makefile, CI config or README. Never invent a runner.
- **Structure:** follow the codebase's existing module layout; a plan may split an unwieldy file it touches, but doesn't restructure on its own initiative.

## Writing the plan

1. **Scope check.** If the spec covers several independent subsystems, propose one plan per subsystem; each plan should produce working, testable software.
2. **File map.** List the files to create or modify and what each is responsible for. One clear responsibility per file; files that change together live together.
3. **Header.** Goal (one sentence), approach (2–3 sentences), the spec's path, and:
   - **Global constraints:** version floors, dependency limits, naming and copy rules, copied verbatim from the spec, one line each.
   - **Interfaces:** every signature, endpoint and data shape that crosses a task boundary, with exact names and types. Later tasks consume these; this is how an implementer of task 5 learns what task 2 produced.
   - **Review focus:** up to five inputs or failure modes the spec implies but no task's tests exercise, most likely first. For each, add the pinning test to the task that owns the code.
4. **Tasks.** A task is the smallest unit with its own test cycle that a reviewer could reject on its own. Fold setup and docs into the task that needs them. Each task lists files (create / modify with line ranges / test), its Interfaces consumed and produced, and steps.
5. **Steps.** One action each, with a checkable result: write the failing test (its name and assertions with the spec's exact values), run it and see it fail (command plus expected failure), implement (exact signature and file; a body only for an algorithm the signature and tests don't determine), run and see it pass, commit.
6. **Self-review** against the spec: every requirement maps to a task; every step lets the implementer write exactly one reasonable thing; names and types agree across tasks; review focus items each have a test; the plan is not several times longer than the spec. Fix gaps inline.

Show the plan and ask the user to confirm it before implementing. Agreeing in conversation to "sounds good" is approval of the plan only when the plan itself was shown.

## Rubric (full tasks)

For `full`-size work, after the plan and before code, get a rubric from the `h-stack:rubric-writer` subagent and show it to the user to strike items. See `references/rubric.md`. Must-have items feed H-Stack's Stop gate.

## Executing

Run the plan yourself, task by task: see `references/executing.md`. Decide conflicts and plan defects yourself, recording each with `hs decide`; stop only for an irreversible or security-sensitive action, a side effect outside the workspace (merge, push to a shared branch, publish), or a plan so broken that every path is a guess.

## Before you finish

- Each completed task has a passing run of its tests after its last edit (cite the receipt).
- Every deviation from the plan is in `hs decide` with why and what it costs if wrong; list them in the final message under "Decisions I made".
- Deferred minor findings are listed, not silently fixed.
