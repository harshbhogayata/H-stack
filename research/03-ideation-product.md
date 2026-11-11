# 03 · Ideation & product thinking

Challenging the idea and its framing before anything gets built.

★ = GitHub stars, read from each repo page on 2026-11-11 (for a skill inside a pack, the whole repo's). Installs = skills.sh all-time installs (`s.sh`) or claude.com/plugins installs (`plugin`) on 2026-11-11; n/a = not listed. Last active = latest commit on the default branch. Score = rubric total out of 45; rubric, candidates and score sheets in [top10-method.md](top10-method.md).

| # | Name | Source | ★ | Installs | Licence | Last active | What it does | Score | Why it ranks here |
|---|---|---|---|---|---|---|---|---|---|
| 1 | grilling / grill-me / grill-with-docs | [mattpocock/skills](https://github.com/mattpocock/skills/tree/HEAD/skills/productivity/grilling) | 321k | 1.5M s.sh | MIT | 2026-10-31 | Design-tree interview in rounds, each question with a recommended answer | 43/45 | Most-installed ideation skill (1.5M); 2 KB; explicit "frontier empty" exit condition |
| 2 | brainstorming | [obra/superpowers](https://github.com/obra/superpowers/tree/HEAD/skills/brainstorming) | 316k | 425k s.sh | MIT | 2026-11-03 | Reads project, asks one question at a time, writes design, gates build on approval | 41/45 | Hard gate before code plus written design; eval-covered; 15 KB |
| 3 | prototype | [mattpocock/skills](https://github.com/mattpocock/skills/tree/HEAD/skills/engineering/prototype) | 321k | 1.1M s.sh | MIT | 2026-10-31 | Throwaway prototype to answer one design question, then delete | 39/45 | Settles debates by building cheaply; 1.1M installs |
| 4 | idea-refine | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/tree/HEAD/skills/idea-refine) | 115k | 69k s.sh | MIT | 2026-11-01 | Diverge then converge; writes problem, direction, assumptions, MVP to docs/ideas | 35/45 | Structured output file; less adversarial than grilling |
| 5 | attack-the-premise, sharpen, in-your-own-words | [cursor/plugins](https://github.com/cursor/plugins/tree/HEAD/pstack/skills/principle-attack-the-premise) | 16k | 2.8k s.sh | MIT (pstack) | 2026-11-11 | Question the premise; restate the request back before work | 35/45 | Small, sharp principle-level tools |
| 6 | ce-brainstorm + ce-ideate | [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin/tree/HEAD/skills/ce-brainstorm) | 26k | 4.1k s.sh | MIT | 2026-11-11 | Defines WHAT before ce-plan defines HOW; writes a requirements doc | 35/45 | Clean WHAT/HOW split; small installs |
| 7 | interview-me | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/tree/HEAD/skills/interview-me) | 115k | 67k s.sh | MIT | 2026-11-01 | One question at a time with a guess attached, until ~95% confidence | 34/45 | Explicit confidence threshold and stop rule |
| 8 | to-questionnaire | [mattpocock/skills](https://github.com/mattpocock/skills/tree/HEAD/skills/productivity/to-questionnaire) | 321k | 569k s.sh | MIT | 2026-10-31 | Turns open decisions into a questionnaire for stakeholders | 34/45 | Async alternative to live grilling |
| 9 | strategy-red-team + pre-mortem | [phuryn/pm-skills](https://github.com/phuryn/pm-skills/tree/HEAD/pm-execution/skills/strategy-red-team) | 28k | 10k s.sh | MIT | 2026-11-08 | Finds load-bearing assumptions; ranks risks by cheapest test | 33/45 | Best assumption-testing method found |
| 10 | /office-hours | [garrytan/gstack](https://github.com/garrytan/gstack/tree/HEAD/office-hours) | 141k | 630 s.sh | MIT | 2026-11-10 | Six forcing questions, reframes the product, writes a design doc | 32/45 | Founder-grade pushback on framing; 44 KB with preamble binary |

**Also considered (11–15):** **/plan-ceo-review** (32) — Reusable scope-mode idea; **plan-design-review (gstack)** (32) — Useful lens; **deep-interview (oh-my-claudecode)** (32) — Ambiguity score is a good gate; **last30days** (31) — Real-world signal before building; **scientific-brainstorming (K-Dense)** (30) — Domain-specific.

## Ideas worth stealing
- **One question at a time**, each with a recommended answer, so the user can just say "yes".
- **Frontier rounds** (mattpocock `grilling`): ask every question whose prerequisites are settled in one numbered round, recompute, stop when the frontier is empty.
- **Facts are the agent's job, decisions are the user's**: look facts up (subagent with fresh context), never ask the user for something discoverable.
- **"Just build it" escape hatch**: compress to the 3 questions that most change the outcome, then build and list the assumptions at the top.
- **Confidence threshold with a stop rule** (addyosmani `interview-me`, ~95%).
- **Ask for rejection criteria**: "what would make you send this back?" surfaces hidden requirements.
- **Prototype to settle a question**, then delete it (mattpocock `prototype`).
- **Output a design doc** that later steps read, instead of leaving the decisions in chat.
- **Scope modes** (expand / hold / reduce) make the size decision explicit.
- **Rank assumptions by cheapest test** (pm-skills `strategy-red-team`).

## H-Stack decision
_Not decided yet._
