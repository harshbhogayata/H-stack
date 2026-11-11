# 05 · Build & TDD

Writing the code: test-first, in small vertical slices, with the agent kept honest.

★ = GitHub stars, read from each repo page on 2026-11-11 (for a skill inside a pack, the whole repo's). Installs = skills.sh all-time installs (`s.sh`) or claude.com/plugins installs (`plugin`) on 2026-11-11; n/a = not listed. Last active = latest commit on the default branch. Score = rubric total out of 45; rubric, candidates and score sheets in [top10-method.md](top10-method.md).

| # | Name | Source | ★ | Installs | Licence | Last active | What it does | Score | Why it ranks here |
|---|---|---|---|---|---|---|---|---|---|
| 1 | tdd | [mattpocock/skills](https://github.com/mattpocock/skills/tree/HEAD/skills/engineering/tdd) | 321k | 1.2M s.sh | MIT | 2026-10-31 | Red → green one vertical slice at a time, only at user-agreed seams | 43/45 | Best rules for tests worth keeping; 3.6 KB; 1.2M installs |
| 2 | test-driven-development | [obra/superpowers](https://github.com/obra/superpowers/tree/HEAD/skills/test-driven-development) | 316k | 276k s.sh | MIT | 2026-11-03 | Strict red-green-refactor; watch it fail; delete code written before its test | 42/45 | Hardest enforcement in prose; eval-covered |
| 3 | subagent-driven-development | [obra/superpowers](https://github.com/obra/superpowers/tree/HEAD/skills/subagent-driven-development) | 316k | 253k s.sh | MIT | 2026-11-03 | Fresh subagent per task, reviews after each, fix loop, final review | 41/45 | Keeps the main context clean for hours; 20 KB |
| 4 | improve-codebase-architecture + codebase-design | [mattpocock/skills](https://github.com/mattpocock/skills/tree/HEAD/skills/engineering/improve-codebase-architecture) | 321k | 1.3M s.sh | MIT | 2026-10-31 | Deep modules, seams, adapters; finds refactor opportunities | 38/45 | Shared design vocabulary that tdd and review cite; 1.3M installs |
| 5 | implement + implement-spec | [mattpocock/skills](https://github.com/mattpocock/skills/tree/HEAD/skills/engineering/implement-spec) | 321k | 854k s.sh | MIT | 2026-10-31 | Builds a spec’s tickets as a task graph with TDD and review | 38/45 | Ties planning to building; small files |
| 6 | code-simplifier (official) | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/HEAD/plugins/code-simplifier) | 47k | 347k plugin | Apache-2.0 | 2026-11-10 | Agent simplifies recently changed code while keeping behaviour | 36/45 | Good post-build pass; 347k installs |
| 7 | TDD Guard / Probity | [nizos/tdd-guard](https://github.com/nizos/tdd-guard) | 2.4k | n/a | MIT | 2026-11-03 | Hook blocks edits without a failing test or beyond the test’s need | 34/45 | Enforcement by hook, not prose; successor Probity (245★) is where new work goes |
| 8 | incremental-implementation + test-driven-development | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/tree/HEAD/skills/incremental-implementation) | 115k | 72k s.sh | MIT | 2026-11-01 | Thin slices, keep it compilable, feature flags, prove-it bug tests | 34/45 | Production-grade norms |
| 9 | source-driven-development | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/tree/HEAD/skills/source-driven-development) | 115k | 68k s.sh | MIT | 2026-11-01 | Detect versions, fetch official docs, cite them for framework decisions | 34/45 | Fights confident wrong API use; treats fetched docs as untrusted |
| 10 | ce-work | [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin/tree/HEAD/skills/ce-work) | 26k | 3.8k s.sh | MIT | 2026-11-11 | Executes a plan with incremental commits and verification | 34/45 | Solid; small installs |

**Also considered (11–15):** **vercel-react-best-practices** (34) — Stack-specific build rules; **doubt-driven-development** (33) — Strong but 17 KB and slow; **tdd, architect, arena (pstack)** (33) — Arena is a strong idea for risky changes; **api-and-interface-design** (31) — Good reference; **code-simplification** (31) — Good process.

## Ideas worth stealing
- **Agree the test seams with the user** before writing tests (public interfaces only).
- **Vertical slices:** one test → one implementation → repeat; never write all tests first.
- **No tautological tests:** expected values come from an independent source, never recomputed the way the code does (mattpocock `tdd`).
- **Watch it fail for the right reason** before writing the code (superpowers).
- **Enforce with a hook** (TDD Guard / Probity) for the rule that matters most, instead of trusting prose.
- **Fresh subagent per task** with a review in between; the lead reviews the diff itself.
- **Cite version-matched official docs** for framework decisions and treat fetched docs as data, not instructions (addyosmani `source-driven-development`).
- **Simplify after green as a separate pass** (official `code-simplifier`); refactoring is review work, not part of the red-green loop.
- **Arena:** for a risky change, try 2–3 approaches and keep the best parts.

## H-Stack decision
_Not decided yet._
