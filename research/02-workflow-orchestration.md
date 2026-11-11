# 02 · Workflow orchestration

The end-to-end flow: one entry point that takes a task from idea to merged, calling the other skills in order.

★ = GitHub stars, read from each repo page on 2026-11-11 (for a skill inside a pack, the whole repo's). Installs = skills.sh all-time installs (`s.sh`) or claude.com/plugins installs (`plugin`) on 2026-11-11; n/a = not listed. Last active = latest commit on the default branch. Score = rubric total out of 45; rubric, candidates and score sheets in [top10-method.md](top10-method.md).

| # | Name | Source | ★ | Installs | Licence | Last active | What it does | Score | Why it ranks here |
|---|---|---|---|---|---|---|---|---|---|
| 1 | superpowers (full methodology) | [obra/superpowers](https://github.com/obra/superpowers) | 316k | 1.0M plugin | MIT | 2026-11-03 | Brainstorm → worktree → plan → subagent build with TDD → review → finish | 43/45 | Skills auto-fire via SessionStart hook; behavioural eval harness; 1.0M plugin installs |
| 2 | Matt Pocock flow (ask-matt router) | [mattpocock/skills](https://github.com/mattpocock/skills/tree/HEAD/skills/engineering/ask-matt) | 321k | 840k s.sh | MIT | 2026-10-31 | grill → to-spec → to-tickets → implement, with a router that picks the skill | 40/45 | Small composable skills with explicit hand-offs; biggest install base; no published evals |
| 3 | feature-dev (official) | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/HEAD/plugins/feature-dev) | 47k | 256k plugin | Apache-2.0 | 2026-11-10 | 7 phases: discovery, explore, clarify, architect, implement, review, summary | 38/45 | Anthropic reference workflow; explorer/architect/reviewer agents; 256k installs |
| 4 | compound-engineering (lfg, ce-*) | [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin/tree/HEAD/skills/lfg) | 26k | 3.6k s.sh | MIT | 2026-11-11 | brainstorm → plan → work → review → compound learnings into docs | 37/45 | Hard 8 KB SKILL.md cap with references; "compound" step writes lessons; Every’s production use |
| 5 | poteto-mode (pstack router) | [cursor/plugins](https://github.com/cursor/plugins/tree/HEAD/pstack/skills/poteto-mode) | 16k | 5.1k s.sh | MIT (pstack) | 2026-11-11 | Router maps task to one of 23 playbooks; principles cited per decision | 35/45 | Best router and playbook design; Cursor-native, ported to Claude Code by pstack-claude |
| 6 | agent-skills lifecycle | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/tree/HEAD/skills/using-agent-skills) | 115k | 69k s.sh | MIT | 2026-11-01 | spec → plan → build → test → review → ship across 25 skills | 35/45 | Clean lifecycle with routing evals in repo; skills average 13 KB |
| 7 | BMAD-METHOD | [bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) | 55k | 17k s.sh | MIT | 2026-11-08 | Agile phases with analyst, PM, architect, dev, QA role agents | 34/45 | Strong role separation and artifacts; heavy ceremony |
| 8 | GSD Core | [open-gsd/gsd-core](https://github.com/open-gsd/gsd-core) | 11k | n/a | MIT | 2026-11-11 | Phase-based discuss → plan → execute → verify with state files | 33/45 | Successor to archived get-shit-done (64k★); very active |
| 9 | gstack (sprint roles) | [garrytan/gstack](https://github.com/garrytan/gstack) | 141k | 25k s.sh | MIT | 2026-11-10 | Role skills for every sprint step, from office hours to ship and retro | 32/45 | Broadest coverage, artifacts chain steps; skills 20–85 KB and a setup binary |
| 10 | Plannotator | [backnotprop/plannotator](https://github.com/backnotprop/plannotator) | 10k | 14k s.sh | Apache-2.0 | 2026-11-11 | Hook intercepts ExitPlanMode for visual plan annotation and review | 31/45 | Human-in-the-loop plan review UI; app dependency |

**Also considered (11–15):** **wshobson full-stack-orchestration** (31) — Agent catalogue more than a method; **Built-in plan mode + todos** (31) — Built-in; **ECC** (29) — Most complete, very heavy; **oh-my-claudecode** (29) — Claude Code-native teams; **Claude Code PM (ccpm)** (29) — Issues as source of truth.

## Ideas worth stealing
- **Router + playbooks** (pstack): match the task to a playbook, copy its steps verbatim into the todo list so none get skipped.
- **Artifacts chain the steps** (gstack, Every): each step writes a file (design doc, plan, test plan) that the next step reads.
- **Auto-trigger** (superpowers): a SessionStart hook loads a short "check for a relevant skill first" rule; no need to remember commands.
- **A "which skill?" router** (mattpocock `ask-matt`, pstack `poteto-help`) for humans who don't know the catalog.
- **Size gate:** small tasks skip the ceremony; the full flow is only for multi-step work.
- **Hard size cap per SKILL.md** (Every compound-engineering keeps each near 8 KB and moves detail to `references/`).
- **Completion contract:** a step is not done until its exit condition is met and the next action was offered or taken (Every `ce-plan`).
- **Compound step:** after each unit of work, write what was learned into docs so the next run starts smarter (Every `ce-compound`).
- **Clarifying questions before architecture** as an explicit phase with a stop (official `feature-dev`).

## H-Stack decision
_Not decided yet._
