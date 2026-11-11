# 01 · Core rules & principles

Always-on behaviour rules: what the agent must do on every task, regardless of which skill is running.

★ = GitHub stars on 2026-11-11 (for a skill inside a pack, the stars are the whole repo's).

| # | Name | Source | ★ | License | What it does | Why it ranks here |
|---|---|---|---|---|---|---|
| 1 | Karpathy 4 rules (CLAUDE.md) | [multica-ai/andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills) | 232k | MIT | Think first, simplicity, surgical changes, goal-driven execution | Tiny (~66 lines), targets the commonest agent failures |
| 2 | pstack principles (24 `principle-*` skills) | [cursor/plugins › pstack](https://github.com/cursor/plugins/tree/main/pstack) | 16k (repo) | MIT | Laziness protocol, prove it works, fix root causes, guard context… | Most complete principle set; every subagent reads it |
| 3 | verification-before-completion | [obra/superpowers](https://github.com/obra/superpowers) | 316k | MIT | No "done" claim without fresh evidence | Kills false completions, the top trust problem |
| 4 | caveman | [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) | 119k | Apache-2.0 | Terse replies, far fewer output tokens | Cheap win on cost and readability |
| 5 | writing-for-agents + codebase-design | [mattpocock/skills](https://github.com/mattpocock/skills) | 321k | MIT | How to write CLAUDE.md/skills; deep-module design vocabulary | Rules about rules; shared design language |
| 6 | using-agent-skills + context-engineering | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | 115k | MIT | Shared operating rules, context packing | Clean "meta" layer over a skill set |
| 7 | ECC rules (selective, per-language) | [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code) | 301k | MIT | Always-loaded standards you pick by language | Shows how to scope rules so they don't bloat |
| 8 | context-engineering-intro (CLAUDE.md + PRP templates) | [coleam00/context-engineering-intro](https://github.com/coleam00/context-engineering-intro) | 14k | MIT | Global rules plus product requirement prompt templates | Early, influential context-engineering template |
| 9 | Boris Cherny's CLAUDE.md pattern | [write-up](https://ailect.com/the-complete-guide-to-claude-md-best-practices-examples-and-templates/) | — | — | Plan first, subagents for context, lessons file after corrections | From Claude Code's creator; the "lessons loop" |
| 10 | context-engineering-kit | [NeoLabHQ/context-engineering-kit](https://github.com/NeoLabHQ/context-engineering-kit) | 1.8k | **GPL-3.0** | Quality-focused rules and skills | Good ideas; copyleft, so ideas only |

## Ideas worth stealing
- **Rules are guidance, hooks are enforcement.** Anything that must never slip (no destructive git, run tests before "done") goes in a hook.
- **Testable lines only.** "Write clean code" is useless; "never claim done without running the check" is checkable.
- **Lessons loop.** After a user correction, write the lesson into a rule file (pstack `correct`, Cherny's `lessons.md`).
- **Keep each rules file under ~200 lines**; scope extra rules by path so they only load when relevant.
- **Principles as separate small files** (pstack) so skills can cite exactly the one they need.

## H-Stack decision
_Not decided yet._
