# 14 · Autonomous loops & multi-agent

Long unattended runs and many agents working in parallel.

★ = GitHub stars on 2026-11-11 (for a skill inside a pack, the stars are the whole repo's).

| # | Name | Source | ★ | License | What it does | Why it ranks here |
|---|---|---|---|---|---|---|
| 1 | Built-in subagents, worktrees, `/batch`, Workflows | [Claude Code docs](https://code.claude.com/docs/en/agents) | — | — | Parallel isolated agents, 5–30 worktree subagents, scripted workflows | Native; no extra install |
| 2 | autoresearch | [karpathy/autoresearch](https://github.com/karpathy/autoresearch) | 100k | MIT | Overnight keep-if-better experiment loop | The cleanest loop design |
| 3 | ralph-loop (official) | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | 47k | Apache-2.0 | Self-referential iteration loop | Official Ralph pattern |
| 4 | ralph-claude-code | [frankbria/ralph-claude-code](https://github.com/frankbria/ralph-claude-code) | 9.7k | MIT | Autonomous loop with smart exit detection | Knows when to stop |
| 5 | autonomous-run, orchestrate, autopilot, swarm, arena | [cursor/plugins › pstack](https://github.com/cursor/plugins/tree/main/pstack) | 16k (repo) | MIT | Long runs; multi-day coordinator; PR queues; parallel workers | Most complete autonomy playbooks |
| 6 | Ruflo | [ruvnet/ruflo](https://github.com/ruvnet/ruflo) | 81k | MIT | Multi-agent swarms with a control plane | Largest swarm framework; heavy |
| 7 | oh-my-claudecode | [Yeachan-Heo/oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode) | 41k | MIT | Team-first orchestration | Claude Code-native teams |
| 8 | Vibe Kanban | [BloopAI/vibe-kanban](https://github.com/BloopAI/vibe-kanban) | 29k | Apache-2.0 | Kanban board driving agents in worktrees | Good human-in-the-loop UI |
| 9 | Gas Town | [gastownhall/gastown](https://github.com/steveyegge/gastown) | 19k | MIT | 20–30 agents, git-backed issues, merge queue, watchdogs | Scale patterns |
| 10 | Claude Squad | [smtg-ai/claude-squad](https://github.com/smtg-ai/claude-squad) | 8.8k | **AGPL-3.0** | Manage many terminal agents | Simple; copyleft, ideas only |

## Ideas worth stealing
- **Ralph loop:** pick task → implement → validate → commit if pass → reset context → repeat; state lives in files.
- **Decision log** (pstack show-me-your-work TSV) so you can audit an overnight run.
- **Never block on the human** for reversible steps; queue questions for the morning.
- **Spend guard:** stop runaway threads past a token or time budget (gstack runaway-stopper).
- **Fresh check on every patch change** before merge.

## H-Stack decision
_Not decided yet._
