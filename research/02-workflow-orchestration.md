# 02 · Workflow orchestration

The end-to-end flow: one entry point that takes a task from idea to merged, calling the other skills in order.

★ = GitHub stars on 2026-11-11 (for a skill inside a pack, the stars are the whole repo's).

| # | Name | Source | ★ | License | What it does | Why it ranks here |
|---|---|---|---|---|---|---|
| 1 | superpowers | [obra/superpowers](https://github.com/obra/superpowers) | 316k | MIT | Brainstorm → worktree → plan → subagent build → TDD → review → finish | Skills fire automatically; most battle-tested methodology |
| 2 | Matt Pocock skills | [mattpocock/skills](https://github.com/mattpocock/skills) | 321k | MIT | grill-me → to-spec → to-tickets → implement (TDD + review) | Most-starred pack; strongest on alignment and design |
| 3 | agent-skills | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | 115k | MIT | /spec → /plan → /build → /test → /review → /ship, 25 skills | Clean lifecycle with Google-style engineering norms |
| 4 | gstack | [garrytan/gstack](https://github.com/garrytan/gstack) | 141k | MIT | Think → plan → build → review → test → ship → reflect, as team roles | Best product + design + QA coverage |
| 5 | pstack `poteto-mode` | [cursor/plugins › pstack](https://github.com/cursor/plugins/tree/main/pstack) | 16k (repo) | MIT | Router picks one of 23 playbooks, copies steps into todos | Best router design; sticky mode across turns |
| 6 | ECC | [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code) | 301k | MIT | plan → test → implement → review → verify → remember → improve | Most complete system, very heavy |
| 7 | oh-my-claudecode | [Yeachan-Heo/oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode) | 41k | MIT | Team-first multi-agent orchestration, 19 agents | Strong on parallel team patterns |
| 8 | feature-dev (official) | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | 47k | Apache-2.0 | 7 phases: requirements → explore → architect → build → test → review → docs | Anthropic's own reference workflow |
| 9 | BMAD-METHOD | [bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) | 55k | MIT | Agile phases with a role agent per phase | Strong role separation |
| 10 | SuperClaude | [SuperClaude-Org/SuperClaude_Framework](https://github.com/SuperClaude-Org/SuperClaude_Framework) | 24k | MIT | Commands plus cognitive personas | Persona idea, older design |

## Ideas worth stealing
- **Router + playbooks** (pstack): match the task to a playbook, copy its steps verbatim into the todo list so none get skipped.
- **Artifacts chain the steps** (gstack): each step writes a file (design doc, test plan) that the next step reads.
- **Auto-trigger** (superpowers): the agent checks for a relevant skill before every task; no need to remember commands.
- **A "which skill?" router** (mattpocock `ask-matt`, pstack `poteto-help`) for humans who don't know the catalog.
- **Size gate:** small tasks skip the ceremony; the full flow is only for multi-step work.

## H-Stack decision
_Not decided yet._
