# 06 · Debugging & performance

Finding the real cause before changing code, and making things measurably faster.

★ = GitHub stars on 2026-11-11 (for a skill inside a pack, the stars are the whole repo's).

| # | Name | Source | ★ | License | What it does | Why it ranks here |
|---|---|---|---|---|---|---|
| 1 | systematic-debugging | [obra/superpowers](https://github.com/obra/superpowers) | 316k | MIT | 4 phases; "no fixes without root cause"; rethink design after 3 failed fixes | The reference debugging skill |
| 2 | diagnosing-bugs | [mattpocock/skills](https://github.com/mattpocock/skills) | 321k | MIT | Build a check that goes red on this bug, minimise, then fix | Red-first loop is very concrete |
| 3 | bug-fix, runtime-forensics, trace-forensics | [cursor/plugins › pstack](https://github.com/cursor/plugins/tree/main/pstack) | 16k (repo) | MIT | Repro + root cause with runtime evidence; diagnose live symptoms or captured traces | Only stack with forensics playbooks |
| 4 | hillclimb + perf-issue | [cursor/plugins › pstack](https://github.com/cursor/plugins/tree/main/pstack) | 16k (repo) | MIT | Measured before/after loop, one commit per accepted win | Scientific perf method |
| 5 | debugging-and-error-recovery | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | 115k | MIT | Reproduce, localise, reduce, fix, guard; stop-the-line rule | Clean five-step triage |
| 6 | performance-optimization + /webperf | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | 115k | MIT | Measure first; Core Web Vitals; bundle analysis | Best web-perf guidance |
| 7 | Chrome DevTools MCP | [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) | 55k | Apache-2.0 | Performance traces, console, network from a real browser | Gives the agent real runtime data |
| 8 | systematic-debugging (Hermes) | [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) | 262k | MIT | Rigid, quality-rated debugging method | Rated #1 in one 15-skill comparison |
| 9 | autoresearch loop | [karpathy/autoresearch](https://github.com/karpathy/autoresearch) | 100k | MIT | Edit → fixed-budget run → keep only if metric improves | The cleanest hillclimb design |
| 10 | debugging-strategies | [wshobson/agents](https://github.com/wshobson/agents) | 42k | MIT | Profiling tools and root-cause techniques across stacks | Broad reference |

## Ideas worth stealing
- **Iron law:** no fix until there's a reproduction that fails for the right reason.
- **Three strikes:** after 3 failed fixes, stop patching and question the design.
- **Mark evidence** as measured / inferred / guessed in the report (pstack).
- **Perf work needs a baseline number** and one change per measured attempt.
- **Fixed budget + untouchable evaluator** (autoresearch) stops the agent gaming the metric.

## H-Stack decision
_Not decided yet._
