# 14 · Autonomous loops & multi-agent

Long unattended runs and many agents working in parallel.

★ = GitHub stars, read from each repo page on 2026-11-11 (for a skill inside a pack, the whole repo's). Installs = skills.sh all-time installs (`s.sh`) or claude.com/plugins installs (`plugin`) on 2026-11-11; n/a = not listed. Last active = latest commit on the default branch. Score = rubric total out of 45; rubric, candidates and score sheets in [top10-method.md](top10-method.md).

| # | Name | Source | ★ | Installs | Licence | Last active | What it does | Score | Why it ranks here |
|---|---|---|---|---|---|---|---|---|---|
| 1 | dispatching-parallel-agents + subagent-driven-development | [obra/superpowers](https://github.com/obra/superpowers/tree/HEAD/skills/dispatching-parallel-agents) | 316k | 233k s.sh | MIT | 2026-11-03 | Split independent domains, focused prompts, dispatch, review and integrate | 41/45 | Small, proven parallel pattern |
| 2 | Built-in subagents, agent teams, worktrees, Workflows, /loop | [docs](https://code.claude.com/docs/en/sub-agents) (built-in) | n/a | built-in | n/a (built-in) | built-in | Parallel isolated agents, worktree isolation, scripted workflows | 39/45 | Native; no install |
| 3 | ralph-loop (official) | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/HEAD/plugins/ralph-loop) | 47k | 197k plugin | Apache-2.0 | 2026-11-10 | Stop hook re-feeds the prompt until a completion promise appears | 37/45 | Official Ralph; minimal and safe-by-limit (max iterations) |
| 4 | autoresearch | [karpathy/autoresearch](https://github.com/karpathy/autoresearch/blob/HEAD/program.md) | 100k | n/a | MIT | 2026-03-25 | Overnight keep-if-better experiment loop with fixed budget | 36/45 | Cleanest loop design; untouchable evaluator; idle since March |
| 5 | autonomous-run, orchestrate, autopilot, swarm, arena, show-me-your-work (pstack) | [cursor/plugins](https://github.com/cursor/plugins/tree/HEAD/pstack/skills/swarm) | 16k | 5.0k s.sh | MIT (pstack) | 2026-11-11 | Long runs, multi-day coordinator, PR queues, parallel workers, decision log | 36/45 | Most complete autonomy playbooks with audit trail |
| 6 | Orca | [stablyai/orca](https://github.com/stablyai/orca/tree/HEAD/skills/orchestration) | 122k | 358k s.sh | MIT | 2026-11-11 | Desktop app running many agents in worktrees; orchestration skill | 36/45 | 358k skill installs; the skill is a stub that loads instructions from the Orca binary at runtime |
| 7 | lfg (EveryInc) | [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin/tree/HEAD/skills/lfg) | 26k | 3.6k s.sh | MIT | 2026-11-11 | Autonomous plan → work → review → compound pipeline | 35/45 | Solid; small installs |
| 8 | Gas Town | [gastownhall/gastown](https://github.com/gastownhall/gastown) | 19k | 12 s.sh | MIT | 2026-11-10 | 20–30 agents, git-backed issues, merge queue, watchdogs | 34/45 | Scale patterns |
| 9 | ralph-claude-code | [frankbria/ralph-claude-code](https://github.com/frankbria/ralph-claude-code) | 9.7k | n/a | MIT | 2026-11-04 | Autonomous loop with exit detection, rate limits, circuit breaker | 34/45 | Knows when to stop |
| 10 | oh-my-claudecode (team, autopilot, ralph) | [Yeachan-Heo/oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode/tree/HEAD/skills/team) | 41k | 1.3k s.sh | MIT | 2026-11-11 | Team pipeline: plan → PRD → exec → verify → fix | 32/45 | Claude Code-native teams; 60 KB team skill |

**Also considered (11–15):** **Paradev (superset)** (32) — App; **Vibe Kanban** (32) — Good human-in-the-loop UI; **snarktank/ralph** (31) — Clear state-in-files Ralph; **runaway-stopper (gstack)** (31) — Spend guard idea; **ralph-orchestrator** (31) — Active, small.

## Ideas worth stealing
- **Ralph loop:** pick task → implement → validate → commit if pass → reset context → repeat; state lives in files.
- **Completion promise + max iterations** in a Stop hook (official `ralph-loop`) is the minimal safe loop.
- **Circuit breaker and rate limits** for unattended runs (ralph-claude-code).
- **Isolate by worktree, integrate by review** (superpowers `dispatching-parallel-agents`).
- **Decision log** (pstack show-me-your-work TSV) so you can audit an overnight run.
- **Never block on the human** for reversible steps; queue questions for the morning.
- **Spend guard:** stop runaway threads past a token or time budget (gstack runaway-stopper).
- **Fresh check on every patch change** before merge.
- **Reviewable instructions only:** Orca's skill is a stub that loads its real guide from the binary at run time.

## H-Stack decision
_Not decided yet._
