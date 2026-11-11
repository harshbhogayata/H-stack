# Research

Top 10 existing skills/plugins for each H-Stack category. Reference only: H-Stack is written from scratch.

## Method
- **Sources:** web search (built-in + Context.dev), each stack's own README read from `raw.githubusercontent.com`, and 2026 roundups (linked in each file).
- **Stars:** read from each GitHub page via Context.dev on **2026-11-11**. For a skill inside a pack, the number is the whole repo's.
- **Ranking:** substance first (what the skill makes the agent do), popularity second. A skill-level entry beats a whole pack when one skill is the standout.
- **Not verified:** entries marked `?` (source repo or star count not confirmed).
- **Licenses:** GPL / AGPL / CC BY-SA entries are marked in bold. Ideas only from those; no text.

## Categories
| # | Category | File |
|---|---|---|
| 00 | Activation & experience | [00-activation-and-experience.md](00-activation-and-experience.md) |
| 00b | Research-backed ideas (papers, 2025–2026) | [00b-research-backed-ideas.md](00b-research-backed-ideas.md) |
| 00c | Beyond every stack: sources, 00b verification log, ideas N100+, top 15, anti-ideas | [00c-beyond-every-stack.md](00c-beyond-every-stack.md) |
| 01 | Core rules & principles | [01-core-rules.md](01-core-rules.md) |
| 02 | Workflow orchestration | [02-workflow-orchestration.md](02-workflow-orchestration.md) |
| 03 | Ideation & product thinking | [03-ideation-product.md](03-ideation-product.md) |
| 04 | Specs & planning | [04-specs-planning.md](04-specs-planning.md) |
| 05 | Build & TDD | [05-build-tdd.md](05-build-tdd.md) |
| 06 | Debugging & performance | [06-debugging-performance.md](06-debugging-performance.md) |
| 07 | Code review & quality | [07-code-review.md](07-code-review.md) |
| 08 | Testing & QA | [08-testing-qa.md](08-testing-qa.md) |
| 09 | Security | [09-security.md](09-security.md) |
| 10 | Design & UI | [10-design-ui.md](10-design-ui.md) |
| 11 | Memory & context | [11-memory-context.md](11-memory-context.md) |
| 12 | Docs & writing | [12-docs-writing.md](12-docs-writing.md) |
| 13 | Git, PR & shipping | [13-git-ship.md](13-git-ship.md) |
| 14 | Autonomous loops & multi-agent | [14-autonomous-multiagent.md](14-autonomous-multiagent.md) |
| 15 | Skill authoring & meta | [15-skill-authoring.md](15-skill-authoring.md) |
| 16 | Business, growth & research | [16-business-research.md](16-business-research.md) |

## Big packs at a glance (★ on 2026-11-11)
| Pack | ★ | License | Shape |
|---|---|---|---|
| [mattpocock/skills](https://github.com/mattpocock/skills) | 321k | MIT | Alignment-first: grill → spec → tickets → implement |
| [obra/superpowers](https://github.com/obra/superpowers) | 316k | MIT | Auto-triggering methodology |
| [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code) | 301k | MIT | Full harness: 71 agents, 314 skills, memory, AgentShield |
| [anthropics/skills](https://github.com/anthropics/skills) | 192k | Apache-2.0 | Official examples + document skills + skill-creator |
| [garrytan/gstack](https://github.com/garrytan/gstack) | 141k | MIT | Team roles in sprint order |
| [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | 115k | MIT | Lifecycle: define → plan → build → verify → review → ship |
| [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | 47k | Apache-2.0 | Official marketplace (317 plugins) |
| [wshobson/agents](https://github.com/wshobson/agents) | 42k | MIT | 94 plugins, 202 agents, 185 skills |
| [cursor/plugins › pstack](https://github.com/cursor/plugins/tree/main/pstack) | 16k (repo) | MIT | Router + 23 playbooks + 24 principles |

## Directories (for finding more)
[awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) (58k) · [Composio awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) (79k) · [agentic-awesome-skills](https://github.com/sickn33/antigravity-awesome-skills) (50k) · [claude-code-templates](https://github.com/davila7/claude-code-templates) (33k) · [VoltAgent subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) (26k) · [BehiSecc awesome-claude-skills](https://github.com/BehiSecc/awesome-claude-skills) (10k)

## Safety note
Snyk's research found prompt injection in 36% of third-party skills it tested. Every file we take ideas from gets read in full first.
