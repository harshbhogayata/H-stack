# 15 · Skill authoring & meta

Writing, testing and improving skills — the tools we'll use to build H-Stack itself.

★ = GitHub stars, read from each repo page on 2026-11-11 (for a skill inside a pack, the whole repo's). Installs = skills.sh all-time installs (`s.sh`) or claude.com/plugins installs (`plugin`) on 2026-11-11; n/a = not listed. Last active = latest commit on the default branch. Score = rubric total out of 45; rubric, candidates and score sheets in [top10-method.md](top10-method.md).

| # | Name | Source | ★ | Installs | Licence | Last active | What it does | Score | Why it ranks here |
|---|---|---|---|---|---|---|---|---|---|
| 1 | writing-skills | [obra/superpowers](https://github.com/obra/superpowers/tree/HEAD/skills/writing-skills) | 316k | 233k s.sh | MIT | 2026-11-03 | TDD for skills: pressure scenarios fail first, then write, close loopholes | 41/45 | Skill-as-code discipline; eval-covered |
| 2 | skill-creator | [anthropics/skills](https://github.com/anthropics/skills/tree/HEAD/skills/skill-creator) | 192k | 429k s.sh | Apache-2.0 | 2026-11-06 | Evals, with/without benchmark, blind A/B, description trigger tuning | 40/45 | Only tool that measures skills properly; 33 KB |
| 3 | authoring-a-skill + eval + create-verification-skill (pstack) | [cursor/plugins](https://github.com/cursor/plugins/tree/HEAD/pstack/skills/create-verification-skill) | 16k | 5.2k s.sh | MIT (pstack) | 2026-11-11 | Write a SKILL.md; blinded eval of skill changes; verification skills | 37/45 | Blinded evals |
| 4 | mcp-builder | [anthropics/skills](https://github.com/anthropics/skills/tree/HEAD/skills/mcp-builder) | 192k | 140k s.sh | Apache-2.0 | 2026-11-06 | Plan, build and evaluate MCP servers | 37/45 | Official; includes eval step |
| 5 | hookify (official) | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/HEAD/plugins/hookify) | 47k | 60k plugin | Apache-2.0 | 2026-11-10 | Create hooks from conversation patterns | 37/45 | Turns rules into enforcement |
| 6 | retro | [mattpocock/skills](https://github.com/mattpocock/skills/tree/HEAD/skills/engineering/retro) | 321k | 350k s.sh | MIT | 2026-10-31 | Post-session environment improvements: skills, docs, hooks | 36/45 | Retro loop |
| 7 | find-skills | [vercel-labs/skills](https://github.com/vercel-labs/skills/tree/HEAD/skills/find-skills) | 39k | 4.3M s.sh | MIT | 2026-11-10 | Search and install skills from skills.sh mid-session | 36/45 | Most-installed skill anywhere (4.3M); discovery not authoring |
| 8 | Built-in claude plugin validate / eval | [docs](https://code.claude.com/docs/en/plugins-reference) (built-in) | n/a | built-in | n/a (built-in) | built-in | Validates manifests; runs plugin evals | 36/45 | Built-in |
| 9 | plugin-dev (official) | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/HEAD/plugins/plugin-dev) | 47k | 68k plugin | Apache-2.0 | 2026-11-10 | Skills for hooks, MCP, commands, agents, settings, packaging | 35/45 | Official plugin how-to; 16–23 KB skills |
| 10 | writing-great-skills + writing-for-agents | [mattpocock/skills](https://github.com/mattpocock/skills/tree/HEAD/skills/productivity/writing-for-agents) | 321k | 307k s.sh | MIT | 2026-10-31 | Predictability first; model- vs user-invoked; description pruning; router skills | 35/45 | Clearest description/context-load trade-offs |

**Also considered (11–15):** **SkillSpector (NVIDIA)** (35) — Vet before install; **claude-code-setup (official)** (35) — Good onboarding step; **/write-skill (gstack)** (34) — Anti-bloat method; **correct + automate-me (pstack)** (34) — Learns from your sessions; **plugin-eval (wshobson)** (34) — Cheap CI lint.

## Ideas worth stealing
- **Description is the trigger.** Test should-trigger and should-not-trigger prompts.
- **Pressure scenarios that fail without the skill**, before writing it (superpowers `writing-skills`).
- **Benchmark with vs without the skill**; if the base model passes without it, delete the skill (`skill-creator`).
- **Blinded A/B of skill versions** (pstack eval playbook, skill-creator).
- **Model-invoked vs user-invoked is a context trade-off**: every description costs tokens every turn (mattpocock `writing-great-skills`).
- **Edit ladder:** fix the tool first; add nothing the model already does; edit a line instead of appending.
- **Size budget per skill** and a drift check that referenced commands still exist.
- **Lint and scan in CI:** agnix / plugin-eval static checks, SkillSpector or skill-scanner for injection.
- **Turn corrections into rules or hooks** (pstack `correct`, official `hookify`).
- **Progressive loading:** short SKILL.md, details in reference files loaded on demand.

## H-Stack decision
_Not decided yet._
