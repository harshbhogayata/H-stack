# 04 · Specs & planning

Turning agreed intent into a spec, a plan and ordered tasks an agent can execute.

★ = GitHub stars, read from each repo page on 2026-11-11 (for a skill inside a pack, the whole repo's). Installs = skills.sh all-time installs (`s.sh`) or claude.com/plugins installs (`plugin`) on 2026-11-11; n/a = not listed. Last active = latest commit on the default branch. Score = rubric total out of 45; rubric, candidates and score sheets in [top10-method.md](top10-method.md).

| # | Name | Source | ★ | Installs | Licence | Last active | What it does | Score | Why it ranks here |
|---|---|---|---|---|---|---|---|---|---|
| 1 | writing-plans + executing-plans | [obra/superpowers](https://github.com/obra/superpowers/tree/HEAD/skills/writing-plans) | 316k | 300k s.sh | MIT | 2026-11-03 | 2–5 minute tasks with exact paths, code and checks; completion contract per task | 42/45 | Plans a context-free implementer can follow; eval-covered |
| 2 | to-spec + to-tickets + wayfinder | [mattpocock/skills](https://github.com/mattpocock/skills/tree/HEAD/skills/engineering/to-tickets) | 321k | 796k s.sh | MIT | 2026-10-31 | Spec from conversation; tracer-bullet tickets with blocking edges; multi-session map | 39/45 | Dependency-graphed tickets; ~800k installs each |
| 3 | Spec Kit | [github/spec-kit](https://github.com/github/spec-kit) | 149k | n/a | MIT | 2026-11-10 | constitution → specify → clarify → plan → tasks → analyze → implement | 38/45 | Most complete gated SDD flow; clarify and analyze steps are checkable. CLI plus 8–19 KB templates |
| 4 | ce-plan | [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin/tree/HEAD/skills/ce-plan) | 26k | 3.9k s.sh | MIT | 2026-11-11 | Research-backed plan with confidence check and mandatory document review | 38/45 | Strong completion contract; 8 KB cap with references |
| 5 | spec-driven-development + planning-and-task-breakdown | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/tree/HEAD/skills/spec-driven-development) | 115k | 76k s.sh | MIT | 2026-11-01 | Gated spec → plan → tasks with acceptance criteria and checkpoints | 35/45 | Clean and minimal; routing evals |
| 6 | beads | [gastownhall/beads](https://github.com/gastownhall/beads) | 29k | 2.2k s.sh | MIT | 2026-11-10 | Git-backed issue graph with dependencies for agents | 35/45 | Task graph as a tool instead of prose; 28.7k★ |
| 7 | OpenSpec | [Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec) | 75k | 4.9k s.sh | MIT | 2026-11-10 | Change proposals and spec deltas that live in the repo | 34/45 | Lighter than Spec Kit, fits brownfield; CLI telemetry on by default |
| 8 | BMAD-METHOD | [bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) | 55k | 17k s.sh | MIT | 2026-11-08 | Analyst → PM → architect → scrum master artifacts | 33/45 | Thorough, heavy |
| 9 | GSD Core | [open-gsd/gsd-core](https://github.com/open-gsd/gsd-core) | 11k | n/a | MIT | 2026-11-11 | Discuss → plan → execute → verify phases with requirement IDs | 33/45 | Replaces archived get-shit-done; heavy state |
| 10 | architect + multi-phase-plan (pstack) | [cursor/plugins](https://github.com/cursor/plugins/tree/HEAD/pstack/skills/architect) | 16k | 5.7k s.sh | MIT (pstack) | 2026-11-11 | Types and signatures first; phased or stacked plans | 33/45 | "Sketch the shape first"; 13 KB playbook |

**Also considered (11–15):** **/autoplan + /spec (gstack)** (32) — Multi-lens plan review; **ccpm** (31) — Issues as plan state; **Plannotator** (31) — Review UX, not planning method; **Built-in plan mode** (31) — Built-in; **create-prd (pm-skills)** (30) — Product-side spec.

## Ideas worth stealing
- **Tasks small enough to verify** (2–5 minutes each), each with its own check.
- **Tickets declare what blocks them**, so independent ones can run in parallel.
- **Name the data shape / types first** before any implementation.
- **Plans live in the repo** (versioned markdown), not in chat.
- **Outside review gate** on the plan before code (another model or a fresh-context agent).
- **Bounded clarification** (Spec Kit `clarify`: at most 5 targeted questions, answers written back into the spec) and a **read-only consistency pass** across spec, plan and tasks before implementing (`analyze`).
- **Spec deltas per change** (OpenSpec) fit existing codebases better than one big spec.
- **Task graph as a tool** (beads) instead of a markdown list: dependencies are queryable and survive sessions.
- **Confidence check and document review before hand-off** (Every `ce-plan`).
- Note: `gsd-build/get-shit-done` is archived; GSD continues as `open-gsd/gsd-core`.

## H-Stack decision
_Not decided yet._
