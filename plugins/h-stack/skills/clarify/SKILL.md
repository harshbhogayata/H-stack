---
name: clarify
description: Decide act, ask or stop on big or vague requests; few questions, each with a recommendation.
when_to_use: Vague or large asks, grill me, stress-test a plan.
user-invocable: false
metadata:
  hstack:
    category: "03"
    short: act, ask or stop; few questions, each with a recommendation
    intents: [clarify, ambiguous, requirements, grill]
    keywords: ["\\bgrill( me)?\\b", "\\bstress[- ]test (this|my|the) (plan|idea|design)\\b", "\\bnot sure (what|how|whether)\\b", "\\bwhat do you think\\b", "\\brequirements?\\b", "\\bunclear\\b", "\\bpoke holes\\b"]
    not_for: []
    events: []
    sizes: [light, full]
    modes: {default: guidance, full_on: ["\\bgrill( me)?\\b", "\\bstress[- ]test\\b"]}
    explicit_only: false
    eval: evals/evals.json
    source:
      - {repo: mattpocock/skills, path: skills/productivity/grilling, licence: MIT}
---

# Clarify: act, ask or stop

## Gate

Runs before the first edit on `full`-size or ambiguous requests (H-Stack's classifier suggests it). Small, clear requests skip it. If the user said "just do it", "skip the plan" or "no questions", proceed and record assumptions with `hs assume` instead of asking.

## Contract

One of three outcomes, decided before editing:

- **Act**: the request is clear enough, or the remaining gaps are low-stakes. Proceed; record the assumptions you made with `hs assume "<a>" --check "<how>"` and list them in the reply.
- **Ask**: 1–3 questions whose answers would change the outcome. Each has your recommended answer and one line on why it matters.
- **Stop**: the request can't be done as asked (contradictory, unsafe, or blocked on something only the user has). Explain and record `hs stop "<reason>"`, or park the need with `hs wish "<need>" --resume "<task>"`.

For a fresh, independent read of a large request, dispatch the `h-stack:intent-check` subagent (read-only) with the request; it returns `{decision, questions, assumptions}` as JSON.

## Rules

- **Facts are looked up, never asked.** Anything in the repo, its history, its docs or its tools is yours to find (dispatch an Explore subagent for wide searches). Only decisions go to the user.
- **Outcome-changing only.** Ask when the answers lead to different code: scope, behaviour at the edges, data shape, compatibility, irreversible choices. Don't ask about naming or style the codebase already settles.
- **Ask with AskUserQuestion**, recommended option first and labelled "(Recommended)", worded so accepting it is one click.
- **Batch.** Ask every independent question in one round; questions that depend on an unanswered one wait for the next round.
- **A skipped question is not permission**, and agreeing in conversation is not approval of a plan the user hasn't seen.
- **Questions come from this repo's real gaps**, not from a checklist.

## Full mode: grilling

When the user asks to be grilled or to stress-test a plan, interview until there is a shared understanding:

1. Map the subject as a design tree: each decision branches into the decisions that depend on it.
2. Work in rounds. The frontier is every decision whose prerequisites are settled; ask the whole frontier in one round, numbered, each with your recommended answer.
3. After each round, recompute the frontier and ask again. Look facts up yourself (in parallel, with a subagent) and don't block questions that don't depend on them.
4. Done when the frontier is empty. Summarise the decisions and don't act on them until the user confirms the summary.

## Before you finish

- The outcome (act, ask or stop) is stated.
- Assumptions acted on are in `hs assume` and listed in the reply.
