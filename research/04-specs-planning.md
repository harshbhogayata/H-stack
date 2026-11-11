# 04 · Specs & planning

Turning agreed intent into a spec, a plan and ordered tasks an agent can execute.

★ = GitHub stars on 2026-11-11 (for a skill inside a pack, the stars are the whole repo's).

| # | Name | Source | ★ | License | What it does | Why it ranks here |
|---|---|---|---|---|---|---|
| 1 | Spec Kit | [github/spec-kit](https://github.com/github/spec-kit) | 149k | MIT | Spec-driven development toolkit: constitution → spec → plan → tasks | De facto standard for spec-driven development |
| 2 | OpenSpec | [Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec) | 75k | MIT | Lightweight change proposals and specs that live in the repo | Lighter than Spec Kit, good for existing codebases |
| 3 | to-spec + to-tickets + wayfinder | [mattpocock/skills](https://github.com/mattpocock/skills) | 321k | MIT | Spec from the conversation; tracer-bullet tickets with blocking edges; multi-session maps | Ticket dependency graph is excellent |
| 4 | get-shit-done | [gsd-build/get-shit-done](https://github.com/gsd-build/get-shit-done) | 64k | MIT | Meta-prompting, context engineering, spec-driven development | Popular lightweight alternative |
| 5 | writing-plans | [obra/superpowers](https://github.com/obra/superpowers) | 316k | MIT | Tasks of 2–5 minutes with exact paths, code and checks | Plans a "junior with no context" can follow |
| 6 | spec-driven-development + planning-and-task-breakdown | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | 115k | MIT | PRD first; small verifiable tasks with acceptance criteria | Clean, minimal |
| 7 | BMAD-METHOD | [bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) | 55k | MIT | Analyst → PM → architect → scrum master agents | Thorough, heavy |
| 8 | /autoplan + /spec | [garrytan/gstack](https://github.com/garrytan/gstack) | 141k | MIT | CEO → design → DX → eng review of a plan; spec with outside-review gate | Multi-lens plan review |
| 9 | architect + multi-phase-plan | [cursor/plugins › pstack](https://github.com/cursor/plugins/tree/main/pstack) | 16k (repo) | MIT | Types and signatures before code; phased or stacked plans | "Sketch the shape first" |
| 10 | Taskmaster | [eyaltoledano/claude-task-master](https://github.com/eyaltoledano/claude-task-master) | 28k | Other | PRD → task graph with dependencies | Task graph tooling; check license |

## Ideas worth stealing
- **Tasks small enough to verify** (2–5 minutes each), each with its own check.
- **Tickets declare what blocks them**, so independent ones can run in parallel.
- **Name the data shape / types first** before any implementation.
- **Plans live in the repo** (versioned markdown), not in chat.
- **Outside review gate** on the plan before code (another model or a fresh-context agent).

## H-Stack decision
_Not decided yet._
