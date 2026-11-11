# 15 · Skill authoring & meta

Writing, testing and improving skills — the tools we'll use to build H-Stack itself.

★ = GitHub stars on 2026-11-11 (for a skill inside a pack, the stars are the whole repo's).

| # | Name | Source | ★ | License | What it does | Why it ranks here |
|---|---|---|---|---|---|---|
| 1 | skill-creator | [anthropics/skills](https://github.com/anthropics/skills) | 192k | Apache-2.0 | Evals, with/without-skill benchmark, blind A/B, trigger tuning | Only one that measures skills properly |
| 2 | writing-skills | [obra/superpowers](https://github.com/obra/superpowers) | 316k | MIT | TDD for skills: pressure-test, then write | Skill-as-code discipline |
| 3 | /write-skill | [garrytan/gstack](https://github.com/garrytan/gstack) | 141k | MIT | Five-step edit ladder, size budget, drift check, before/after test | Anti-bloat method |
| 4 | plugin-dev (official) | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | 47k | Apache-2.0 | 7 skills: hooks, MCP, commands, agents, packaging | Official plugin how-to |
| 5 | authoring-a-skill + eval playbooks | [cursor/plugins › pstack](https://github.com/cursor/plugins/tree/main/pstack) | 16k (repo) | MIT | Write a SKILL.md; blinded eval of skill changes | Blinded evals |
| 6 | writing-for-agents + retro | [mattpocock/skills](https://github.com/mattpocock/skills) | 321k | MIT | How to write for agents; post-session environment improvements | Retro loop |
| 7 | correct + automate-me | [cursor/plugins › pstack](https://github.com/cursor/plugins/tree/main/pstack) | 16k (repo) | MIT | Turn a mistake into a rule; draft your own mode from transcripts | Learns from your sessions |
| 8 | hookify (official) | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | 47k | Apache-2.0 | Create hooks from conversation patterns | Turns rules into enforcement |
| 9 | claude-code-setup (official) | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | 47k | Apache-2.0 | Scans a repo, recommends hooks, skills, MCP, agents | Good onboarding step |
| 10 | plugin-eval | [wshobson/agents](https://github.com/wshobson/agents) | 42k | MIT | Static skill checks without model calls | Cheap CI lint for skills |

Also built in: `claude plugin validate` and `claude plugin eval`.

## Ideas worth stealing
- **Description is the trigger.** Test should-trigger and should-not-trigger prompts.
- **Benchmark with vs without the skill**; if the base model passes without it, delete the skill.
- **Edit ladder:** fix the tool first; add nothing the model already does; edit a line instead of appending.
- **Size budget per skill** and a drift check that referenced commands still exist.
- **Progressive loading:** short SKILL.md, details in reference files loaded on demand.

## H-Stack decision
_Not decided yet._
