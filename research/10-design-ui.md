# 10 · Design & UI

Getting interfaces that look deliberate rather than generic AI output.

★ = GitHub stars, read from each repo page on 2026-11-11 (for a skill inside a pack, the whole repo's). Installs = skills.sh all-time installs (`s.sh`) or claude.com/plugins installs (`plugin`) on 2026-11-11; n/a = not listed. Last active = latest commit on the default branch. Score = rubric total out of 45; rubric, candidates and score sheets in [top10-method.md](top10-method.md).

| # | Name | Source | ★ | Installs | Licence | Last active | What it does | Score | Why it ranks here |
|---|---|---|---|---|---|---|---|---|---|
| 1 | web-design-guidelines (Vercel) | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/HEAD/skills/web-design-guidelines) | 34k | 849k s.sh | MIT | 2026-10-27 | Fetches Vercel’s interface guidelines, audits files, reports file:line | 37/45 | The correctness pass, file:line output; rules are fetched from a remote URL every run |
| 2 | Impeccable | [pbakaus/impeccable](https://github.com/pbakaus/impeccable/tree/HEAD/.claude/skills/impeccable) | 108k | 400k s.sh | Apache-2.0 | 2026-11-11 | 23 commands: critique, audit, polish, bolder, quieter, distill, typeset… | 37/45 | Best design vocabulary with audit/critique passes |
| 3 | Taste Skill | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill/tree/HEAD/skills/taste-skill) | 113k | 762k s.sh | MIT | 2026-11-07 | Art direction, real photos, browser checker and finish gate scripts | 36/45 | Only design skill with a scripted browser gate; 31 KB; older skills.sh listing failed one audit |
| 4 | Emil Kowalski skills | [emilkowalski/skills](https://github.com/emilkowalski/skills/tree/HEAD/skills/emil-design-eng) | 56k | 438k s.sh | MIT | 2026-11-09 | Design-engineering principles: motion, detail, animation review | 36/45 | Motion and craft depth nobody else has; 27 KB |
| 5 | ui-skills (ibelick) | [ibelick/ui-skills](https://github.com/ibelick/ui-skills/tree/HEAD/skills/baseline-ui) | 11k | 26k s.sh | MIT | 2026-11-11 | Baseline UI rules; fixing accessibility, motion performance, metadata | 36/45 | Small, checkable rules |
| 6 | design-consultation, -shotgun, -review, -html (gstack) | [garrytan/gstack](https://github.com/garrytan/gstack/tree/HEAD/design-review) | 141k | 592 s.sh | MIT | 2026-11-10 | DESIGN.md → 4–6 mockups → pick → production HTML → visual audit | 35/45 | Full design pipeline; 35–85 KB files |
| 7 | frontend-design | [anthropics/skills](https://github.com/anthropics/skills/tree/HEAD/skills/frontend-design) | 192k | 1.1M plugin | Apache-2.0 | 2026-11-06 | Commit to an aesthetic direction before code; bans generic fonts and layouts | 35/45 | Most-installed design skill (1.1M plugin + 1.1M skills.sh); guidance, no check |
| 8 | shadcn skill | [shadcn-ui/ui](https://github.com/shadcn-ui/ui) | 128k | 144k s.sh | MIT | 2026-11-11 | Correct shadcn/ui component usage and CLI | 35/45 | Official for the most-used component kit |
| 9 | web-artifacts-builder | [anthropics/skills](https://github.com/anthropics/skills/tree/HEAD/skills/web-artifacts-builder) | 192k | 118k s.sh | Apache-2.0 | 2026-11-06 | Production-grade HTML/React artifacts | 34/45 | Official, artifact-focused |
| 10 | UI UX Pro Max | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/HEAD/.claude/skills/ui-ux-pro-max) | 148k | 446k s.sh | MIT | 2026-11-10 | Searchable styles, palettes, font pairings, UX rules across stacks | 33/45 | Biggest reference library; lookup more than method |

**Also considered (11–15):** **accessibility (web-quality-skills)** (32) — Checkable accessibility pass; **frontend-ui-engineering** (32) — Engineering side of UI; **playground (official)** (32) — Fast exploration; **Figma plugin** (31) — Design-to-code bridge; **StyleSeed** (30) — Small adoption.

## Ideas worth stealing
- **Decide the direction before code:** purpose, tone, constraints, what makes it different.
- **DESIGN.md** as the single design-system file other tools can read (gstack, Google Stitch skills).
- **Separate correctness from taste:** an audit pass with `file:line` findings (Vercel guidelines, ibelick ui-skills) and a taste pass (Impeccable verbs).
- **Scripted finish gate in a real browser** (Taste Skill checker) rather than "looks good".
- **Generate several variants side by side**, let the user pick, iterate.
- **Named adjustment verbs** (bolder, quieter, distill, polish) make feedback precise.
- **Motion vocabulary and animation review** (Emil Kowalski skills).
- **Baseline UI rules small enough to always load** (ibelick `baseline-ui`, ~3 KB).
- **Check in a real browser** at mobile and desktop sizes before calling UI done.

## H-Stack decision
_Not decided yet._
