# 05 · Build & TDD

Writing the code: test-first, in small vertical slices, with the agent kept honest.

★ = GitHub stars on 2026-11-11 (for a skill inside a pack, the stars are the whole repo's).

| # | Name | Source | ★ | License | What it does | Why it ranks here |
|---|---|---|---|---|---|---|
| 1 | tdd | [mattpocock/skills](https://github.com/mattpocock/skills) | 321k | MIT | Red → green one vertical slice at a time, at agreed "seams" | Best take on tests worth keeping |
| 2 | test-driven-development | [obra/superpowers](https://github.com/obra/superpowers) | 316k | MIT | Strict red-green-refactor; deletes code written before its test | Hardest enforcement in prose |
| 3 | subagent-driven-development | [obra/superpowers](https://github.com/obra/superpowers) | 316k | MIT | Fresh subagent per task, two-stage review after each | Keeps the main context clean for hours |
| 4 | incremental-implementation + test-driven-development | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | 115k | MIT | Thin slices, feature flags, test pyramid, DAMP over DRY | Production-grade norms |
| 5 | implement / implement-spec | [mattpocock/skills](https://github.com/mattpocock/skills) | 321k | MIT | Builds a spec's tickets as a task graph, TDD at seams, review before commit | Ties planning to building |
| 6 | TDD Guard | [nizos/tdd-guard](https://github.com/nizos/tdd-guard) | 2.4k | MIT | Hook that blocks code edits without a failing test | Enforcement by hook, not by asking |
| 7 | source-driven + doubt-driven development | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | 115k | MIT | Cite official docs for framework decisions; adversarial self-check | Fights confident wrong API use |
| 8 | tdd, architect, arena | [cursor/plugins › pstack](https://github.com/cursor/plugins/tree/main/pstack) | 16k (repo) | MIT | Test-first when cheap; types first; several attempts, merge the best | "Arena" is a strong idea for hard changes |
| 9 | codebase-design + improve-codebase-architecture | [mattpocock/skills](https://github.com/mattpocock/skills) | 321k | MIT | Deep modules, clean seams; HTML report of refactor opportunities | Fights the "ball of mud" |
| 10 | code-simplifier (official) | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | 47k | Apache-2.0 | Simplifies code while keeping behaviour | Good post-build pass |

## Ideas worth stealing
- **Agree the test seams with the user** before writing tests (public interfaces only).
- **Vertical slices:** one test → one implementation → repeat; never write all tests first.
- **Enforce with a hook** (TDD Guard) for the rule that matters most, instead of trusting prose.
- **Fresh subagent per task** with a review in between; the lead reviews the diff itself.
- **Arena:** for a risky change, try 2–3 approaches and keep the best parts.

## H-Stack decision
_Not decided yet._
