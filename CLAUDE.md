# H-Stack — working rules

H-Stack is a **distilled, native-first** Claude Code skill stack: it adopts and adapts the best existing skills (ranked in `research/01–16`), uses Claude Code's built-in systems (CLAUDE.md, `.claude/rules/`, auto memory, skills, hooks, `/goal`, Routines, Workflows, mods, skill-creator) wherever they exist, and builds custom pieces only where nothing exists. Keep it lean.

## North star
Get as much real capability out of the model as a harness can, and prove it with numbers. A skill stack cannot exceed the model's ceiling; it decides how much of that ceiling is reached. Every change must move a metric below or it is cut.

| Metric | Measured as |
|---|---|
| Reliability | Pass rate on the smoke-test tasks; false-"done" rate; test-tampering rate |
| Autonomy horizon | Steps / hours of work per human intervention; tasks finished unaided |
| Learning | Pass rate on repeat tasks over time, with no regressions |
| Judgment | Necessary vs unnecessary questions; wrong assumptions caught before acting |
| Cost | Tokens and wall-clock per solved task |

Rules that follow from it:
- **Lean smoke test, not a harness.** A small set (~10) of the user's real tasks with pass/fail checks, run with and without H-Stack using skill-creator's benchmark. Re-run after meaningful changes; drop anything that makes results worse. Grow the test set only when a real problem shows up.
- **Evidence over opinion.** Design choices cite a primary source or a measurement from our own evals.
- **Report honestly.** Results are reported with numbers, including regressions and failures.
- **Context over templates.** H-Stack must be the most flexible stack: output is derived from the project's own context (its code, brand, users, constraints), never from a house style. Skills teach how to *decide*, not what to produce; no fixed palettes, layouts, boilerplate or one-size checklists baked in. Evals include a sameness check: the same kind of task in different contexts must produce appropriately different results.

## Before doing anything
- Read first. Check this file, `README.md`, and the relevant `research/NN-*.md` before acting.
- Ask when the request is ambiguous instead of guessing and running.

## Research tool order
1. Built-in `WebSearch` / `WebFetch`.
2. Context.dev MCP (`web-search`, `web-scrape`, `submit-batch`) — use for GitHub pages and star counts.
3. Firecrawl — **last-resort fallback only**.

In cloud sessions `github.com` and `api.github.com` are blocked for repos not attached to the session; `raw.githubusercontent.com` works with `curl`.

## Building skills
- **No slash commands.** Every skill sets `user-invocable: false`; activation comes from the router, classifier and event triggers in `research/00-activation-and-experience.md`.
- Lead each `description` with the use case; trigger phrases go in `when_to_use`. Combined cap: 1,536 characters.
- Hook and classifier text is factual ("Relevant skill: X because Y"), never "YOU MUST".
- **Adopt and adapt.** Import the top-ranked skill for a job when its licence allows (MIT, Apache-2.0, BSD): keep the upstream licence and copyright notice in the skill folder, record source repo + commit in `plugins/h-stack/THIRD_PARTY.md`, and note changes. Read every imported file in full first (safety).
- **Adapt for context:** strip house styles, fixed templates, preset palettes/layouts and anything that forces the same output everywhere; set `user-invocable: false`; trim to keep context cost low.
- **Never import:** copyleft (GPL, AGPL, CC BY-SA), non-commercial (CC BY-NC), Commons Clause, ELv2 or anti-Anthropic-rider licences, or skills flagged in `research/top10-method.md` (remote rule fetching, cookie requests, default-on telemetry, hidden instructions). Take ideas only from those.
- One category at a time: pick → import/adapt → smoke-test → commit.
- Keep always-on context small. Rules that must never slip belong in hooks, not prose.

## Layout
```
.claude-plugin/marketplace.json   marketplace "h-stack"
plugins/h-stack/                  the plugin (skills/, agents/, hooks/)
research/                         top-10 per category + decisions
```
Skills are namespaced `h-stack:<skill>` but never shown in the `/` menu. Entry name and manifest name must both be `h-stack`.

## Validate
```bash
claude plugin validate .
```
