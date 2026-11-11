# 06 · Debugging & performance

Finding the real cause before changing code, and making things measurably faster.

★ = GitHub stars, read from each repo page on 2026-11-11 (for a skill inside a pack, the whole repo's). Installs = skills.sh all-time installs (`s.sh`) or claude.com/plugins installs (`plugin`) on 2026-11-11; n/a = not listed. Last active = latest commit on the default branch. Score = rubric total out of 45; rubric, candidates and score sheets in [top10-method.md](top10-method.md).

| # | Name | Source | ★ | Installs | Licence | Last active | What it does | Score | Why it ranks here |
|---|---|---|---|---|---|---|---|---|---|
| 1 | systematic-debugging | [obra/superpowers](https://github.com/obra/superpowers/tree/HEAD/skills/systematic-debugging) | 316k | 329k s.sh | MIT | 2026-11-03 | 4 phases; no fixes without root cause; question design after 3 failed fixes | 42/45 | Reference debugging skill; eval-covered |
| 2 | diagnosing-bugs | [mattpocock/skills](https://github.com/mattpocock/skills/tree/HEAD/skills/engineering/diagnosing-bugs) | 321k | 920k s.sh | MIT | 2026-10-31 | Build a red-capable loop, minimise, ranked falsifiable hypotheses, tagged probes | 39/45 | Most concrete exit criteria (one command already run, red-capable, deterministic); covers perf too |
| 3 | bug-fix, runtime- and trace-forensics (pstack) | [cursor/plugins](https://github.com/cursor/plugins/tree/HEAD/pstack/skills/poteto-mode/playbooks) | 16k | 5.1k s.sh | MIT (pstack) | 2026-11-11 | Repro on same surface, runtime evidence, measured/inferred/guessed labels | 37/45 | Only stack with forensics playbooks; small files |
| 4 | hillclimb + perf-issue + benchmark-checklist (pstack) | [cursor/plugins](https://github.com/cursor/plugins/tree/HEAD/pstack/skills/benchmark-checklist) | 16k | 2.0k s.sh | MIT (pstack) | 2026-11-11 | Baseline, one change per measured attempt, one commit per accepted win | 37/45 | Scientific perf loop with a checklist before reporting numbers |
| 5 | autoresearch | [karpathy/autoresearch](https://github.com/karpathy/autoresearch/blob/HEAD/program.md) | 100k | n/a | MIT | 2026-03-25 | Edit → fixed-budget run → keep only if the metric improves | 36/45 | Cleanest hillclimb design (untouchable evaluator); ML-specific; idle since March |
| 6 | ce-debug | [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin/tree/HEAD/skills/ce-debug) | 26k | 3.6k s.sh | MIT | 2026-11-11 | Hypothesis-driven debugging with reproduction gates | 36/45 | Rigorous; 19 KB; small installs |
| 7 | Chrome DevTools MCP + skills | [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) | 55k | 103k plugin | Apache-2.0 | 2026-11-11 | Real-browser traces, network, console; LCP and memory-leak skills | 36/45 | Gives the agent runtime evidence; MCP tool definitions cost context (CLI variant exists) |
| 8 | debugging-and-error-recovery | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/tree/HEAD/skills/debugging-and-error-recovery) | 115k | 73k s.sh | MIT | 2026-11-01 | Stop-the-line; reproduce, localise (bisect), reduce, fix root cause, guard | 35/45 | Clean five-step triage |
| 9 | performance-optimization | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/tree/HEAD/skills/performance-optimization) | 115k | 76k s.sh | MIT | 2026-11-01 | Measure, find bottleneck, fix, keep-or-revert, guard with budgets | 34/45 | Best general perf guide; 17 KB |
| 10 | /benchmark (gstack) | [garrytan/gstack](https://github.com/garrytan/gstack/tree/HEAD/benchmark) | 141k | 396 s.sh | MIT | 2026-11-10 | Baseline page load and Core Web Vitals, compare before/after | 32/45 | Concrete; 31 KB |

**Also considered (11–15):** **/investigate (gstack)** (32) — Good; **web-quality-skills (performance, core-web-vitals)** (32) — Concrete web metrics and thresholds; **CodSpeed plugin** (31) — Real measurement tooling; **vercel-optimize** (31) — Platform-specific; **Sentry plugin** (30) — Data source rather than method.

## Ideas worth stealing
- **Iron law:** no fix until there's a reproduction that fails for the right reason.
- **Phase 1 exit criterion** (mattpocock `diagnosing-bugs`): one command, already run, that is red-capable on the user's exact symptom, deterministic, fast and agent-runnable. No hypotheses before it exists.
- **3–5 ranked, falsifiable hypotheses**, each with its prediction; show them to the user before testing.
- **Tag every debug log** with a unique prefix so cleanup is one grep.
- **Three strikes:** after 3 failed fixes, stop patching and question the design.
- **Mark evidence** as measured / inferred / guessed in the report (pstack).
- **Benchmark checklist before reporting any number** (pstack `benchmark-checklist`).
- **Perf work needs a baseline number**, one change per measured attempt, keep or revert (addyosmani).
- **Fixed budget + untouchable evaluator** (autoresearch) stops the agent gaming the metric.

## H-Stack decision
_Not decided yet._
