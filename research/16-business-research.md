# 16 · Business, growth & research

Work beyond code: marketing, product management, SEO, market and scientific research.

★ = GitHub stars, read from each repo page on 2026-11-11 (for a skill inside a pack, the whole repo's). Installs = skills.sh all-time installs (`s.sh`) or claude.com/plugins installs (`plugin`) on 2026-11-11; n/a = not listed. Last active = latest commit on the default branch. Score = rubric total out of 45; rubric, candidates and score sheets in [top10-method.md](top10-method.md).

| # | Name | Source | ★ | Installs | Licence | Last active | What it does | Score | Why it ranks here |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Marketing Skills | [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | 60k | 252k s.sh | MIT | 2026-11-11 | CRO, copywriting, SEO audit, pricing, launch, email, ads (73 skills) | 36/45 | Top marketing pack (6.3M total installs); each skill has a diagnostic flow |
| 2 | financial-services (Anthropic) | [anthropics/financial-services](https://github.com/anthropics/financial-services) | 41k | 3.6k s.sh | Apache-2.0 | 2026-10-28 | DCF, comps, earnings analysis, pitch decks with Excel checks | 36/45 | Official finance plugins |
| 3 | knowledge-work-plugins (Anthropic) | [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins) | 35k | 14k s.sh | Apache-2.0 | 2026-11-10 | Official plugins for marketing, sales, PM, finance, legal, support | 36/45 | Anthropic-built role plugins (Cowork); 622k total installs |
| 4 | PM Skills | [phuryn/pm-skills](https://github.com/phuryn/pm-skills) | 28k | 11k s.sh | MIT | 2026-11-08 | 100+ PM skills: PRDs, pre-mortems, roadmaps, prioritisation | 35/45 | Most complete PM set; small focused files |
| 5 | research | [mattpocock/skills](https://github.com/mattpocock/skills/tree/HEAD/skills/engineering/research) | 321k | 793k s.sh | MIT | 2026-10-31 | Investigate against primary sources; write a cited file in the repo | 35/45 | Citation discipline in 0.8 KB |
| 6 | Scientific Agent Skills | [K-Dense-AI/scientific-agent-skills](https://github.com/K-Dense-AI/scientific-agent-skills) | 57k | 2.6k s.sh | MIT | 2026-11-09 | 232 research and data-science skills: literature review, stats, writing | 34/45 | Largest research library |
| 7 | Claude SEO | [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo/tree/HEAD/skills/seo) | 28k | 10k s.sh | MIT | 2026-11-10 | 33 sub-skills for technical SEO, GEO, local, schema, backlinks | 33/45 | Deepest SEO coverage; Snyk audit Warn |
| 8 | Firecrawl plugin | [firecrawl/firecrawl-claude-plugin](https://github.com/firecrawl/firecrawl-claude-plugin) | 258 | 39k plugin | MIT | 2026-11-06 | Scrape, crawl, search, extract web data | 31/45 | Data source; API key |
| 9 | claude-skills (alirezarezvani) | [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills) | 30k | 2.4k s.sh | MIT | 2026-11-11 | Marketing, product, C-level, engineering pods (430 skills) | 31/45 | Organised by team role |
| 10 | last30days | [mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill/tree/HEAD/skills/last30days) | 67k | 61k s.sh | MIT | 2026-11-11 | Research across Reddit, X, YouTube, HN, Polymarket for the last 30 days | 30/45 | Fresh market signal; wants X session cookies; skills.sh audit FAIL |

**Also considered (11–15):** **seo (web-quality-skills)** (29) — Concrete checks, narrow; **Exa plugin** (29) — Data source; **market-research / deep-research (ECC)** (29) — Generic; **agentic-awesome-skills (sickn33)** (28) — Breadth for cherry-picking; **startup/market-sizing (wshobson)** (28) — Reference.

## Ideas worth stealing
- **Cite sources** and name the gaps instead of filling them with guesses; trace every claim to a primary source (mattpocock `research`).
- **Rate each research dimension** (high / medium / low / insufficient data).
- **Write findings to a file in the repo** so they're reusable and reviewable.
- **A shared product-marketing context file** read before every marketing skill (marketingskills `.agents/product-marketing.md`).
- **Formulas over hard-coded values and a recalculation check** for spreadsheets (Anthropic financial-services DCF).
- **Role-based packs** (marketing, PM, sales) map well to plugins you enable per project.
- **Watch data access:** last30days asks for X session cookies (`AUTH_TOKEN`, `CT0`) and failed one skills.sh audit.
- **Install counts can be gamed:** several skills.sh entries show 0.5–1.4M installs on repos with under 500★.

## H-Stack decision
_Not decided yet._
