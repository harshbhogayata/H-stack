# Top-10 method (rebuilt 2026-11-11)

How the top-10 tables in `01`…`16` were built, so every rank can be re-derived. Reference only: H-Stack is written from scratch.

## Rubric

Each candidate is scored 0–5 on six dimensions. **Total = Substance×3 + Evidence×2 + Adoption + Maintenance + Fit + Context** (max 45). Rank by total; ties broken by Substance, then Evidence, then Adoption.

| Dimension | Weight | How it is scored |
|---|---|---|
| **Substance** (S) | ×3 | From reading the SKILL.md. 5 = gated procedure with checkable exit criteria; 4 = clear procedure with some checks; 3 = useful structured guidance; 2 = checklist or reference; 1 = generic advice. |
| **Evidence** (E) | ×2 | 5 = published behavioural evals/benchmarks **and** ≥100k adoption; 4 = published evals, or vendor production use with ≥100k adoption, or ≥1M installs; 3 = ≥50k installs/stars or credible production use; 2 = 1k–50k; 1 = <1k; 0 = none or suspect numbers. Matt Pocock skills: 4 if ≥1M installs, else 3. addyosmani skills capped at 3 (their evals test routing, not outcomes). |
| **Adoption** (A) | ×1 | log10(max(skill installs, repo ★)), min–max scaled to 0–5 **within the category**. Built-ins use anthropics/claude-code ★ as the proxy. |
| **Maintenance** (M) | ×1 | Days since last commit on 2026-11-11: ≤14 → 5, ≤45 → 4, ≤90 → 3, ≤180 → 2, ≤365 → 1, older → 0. Built-ins = 5. |
| **Fit + licence** (F) | ×1 | 5 = native Claude Code skill/plugin/hook, permissive licence; 4 = works but needs porting, a CLI/app, or default-on telemetry; 3 = no licence file, vendor account, or runtime-fetched instructions; 2 = copyleft or non-commercial (GPL, AGPL, CC BY-SA, NC-SA, ELv2, Commons Clause); 1 = proprietary or anti-AI-vendor rider. |
| **Context cost** (C) | ×1 | SKILL.md size: <4 KB → 5; 4–8 KB → 4; 8–15 KB → 3; 15–30 KB → 2; >30 KB → 1. Hooks, CLIs and external apps that add no prompt text → 5; MCP servers with many tool definitions → 2. |

Rows marked "not ranked" in the score sheets are kept for completeness: cross-listed (ranked in another category), duplicates, or excluded for suspect data.

## Data sources (all read 2026-11-11)

| Source | What it gave | How |
|---|---|---|
| GitHub repo pages (179 repos) | ★, licence shown, archived flag, canonical name after redirects | Context.dev `submit-batch`, JSON extraction (2 batches + 1 follow-up) |
| GitHub `/commits` pages | Date of latest commit | Context.dev batch |
| `raw.githubusercontent.com` | 740 files: every finalist SKILL.md / command / agent / playbook, READMEs, LICENSE files | `curl` (no auth) |
| [skills.sh](https://www.skills.sh) per-repo pages | All-time installs per skill for 176 repos (112 listed) | `curl` + HTML-to-text |
| skills.sh per-skill pages | Security audits (Gen Agent Trust Hub, Socket, Snyk) for 126 finalist skills | `curl` |
| skills.sh leaderboard + topic pages (design, agent-workflows, testing, marketing) | Discovery | Context.dev scrape / `curl` |
| [claude.com/plugins](https://claude.com/plugins) | Install counts for 305 plugins (embedded page data) | `curl` |
| [claude-plugins-official marketplace.json](https://raw.githubusercontent.com/anthropics/claude-plugins-official/main/.claude-plugin/marketplace.json) | 317 plugins incl. external | `curl` |
| awesome lists: hesreallyhim/awesome-claude-code, ComposioHQ/awesome-claude-skills, BehiSecc/awesome-claude-skills, VoltAgent/awesome-agent-skills, travisvn/awesome-claude-skills | Discovery | `curl` raw README |
| 2026 roundups (WebSearch) | Discovery cross-check | WebSearch |

**Installs** in the tables are the skill's own skills.sh count (`s.sh`) or the plugin's claude.com count (`plugin`). For pack-level rows the count is the pack's most-installed relevant skill. Packs installed by `git clone` (gstack, Cloudflare, Karpathy, TDD Guard) show low or no skills.sh counts; their adoption comes from ★.

**What was read.** Every top-10 entry had its SKILL.md (or command, agent or playbook files) downloaded and read; tools without a skill file (hooks, CLIs, MCP servers, apps such as TDD Guard, Gas Town, Vibe Kanban, GSD Core, BMAD) were judged from their README. Files over ~30 KB (gstack, Taste Skill, Humanizer, avoid-ai-writing, skill-creator, oh-my-claudecode team) were read for structure, gates and exit criteria rather than line by line. Candidates outside the top 15 were scored from their SKILL.md or README digest (description, headings, size, gate words). All downloads were scanned for injection-style text, pipe-to-shell installers, exfiltration endpoints and telemetry.

## Safety and data-quality flags

| Candidate | Finding |
|---|---|
| mvanhorn/last30days-skill | Optional env includes X session cookies (`AUTH_TOKEN`, `CT0`) plus a dozen API keys; skills.sh Gen Agent Trust Hub **FAIL**, Socket Warn. |
| stablyai/orca `orchestration` | Skill is a stub that loads its real instructions from the Orca binary at run time (not reviewable in the file); Gen Agent Trust Hub **FAIL**. |
| vercel-labs `web-design-guidelines`, `writing-guidelines` | Rules and output format fetched from a remote URL on every run; whoever controls that URL controls the prompt. |
| JuliusBrussee/caveman | Skill sends nothing, but the CLI sends usage stats incl. IP by default; optional cloud routing sends prompts. |
| thedotmack/claude-mem | Anonymous usage analytics on by default. |
| Fission-AI/OpenSpec | CLI telemetry on unless disabled. |
| kenryu42/cc-safety-net | README embeds a 1×1 sponsor tracking image (README only, not the hook). |
| tanweai/pua | Works through "corporate pressure" persuasion prompts rather than checks; not malicious. |
| Dicklesworthstone/mcp_agent_mail | Licence rider forbids use by OpenAI/Anthropic. |
| getsentry `security-review`, gstack `ship` | skills.sh Socket **FAIL**; reading found no malicious content (attack examples in the first, local binaries in the second). |
| Leonxlnx/taste-skill | Older `design-taste-frontend` listing failed Gen Agent Trust Hub; current `taste-skill` listing passes. |
| designed-by-ai/skills (1.4M installs, 30★, Snyk **FAIL**), lllllllama/RigorPilot-Skills (~495k installs per skill, 486★), flowkit-labs/skills (1.3M, 35★), several `*/superpowers` name-alikes (101-skills, magentosh, skills-shell…, ~1M installs, ~22★) | Install counts out of line with stars: treated as unreliable and excluded. The `*/superpowers` repos are unrelated to obra/superpowers. |
| NousResearch hermes-agent `systematic-debugging` | Derivative of superpowers systematic-debugging (same text); scored as a duplicate. |

Other finalists either passed all three skills.sh audits or got only Snyk/Socket **Warn** (typical for skills that run shell commands). No candidate contained instruction-override text, hidden exfiltration endpoints or pipe-to-shell in a SKILL.md; 31 READMEs use `curl | sh`-style installers for their CLIs.

## Not fetchable
Nothing material. The GitHub API and github.com are blocked from this sandbox, so file trees came from plugin manifests, READMEs and Context.dev page scrapes; `humanlayer/humanlayer`'s planning commands moved and could not be located, so it was not scored.


## 01 · Core rules & principles

File: [01-core-rules.md](01-core-rules.md). 27 candidates (27 ranked). Adoption scale: log10 2.21 → 0, 5.79 → 5.

### Changes vs previous list
- **Karpathy guidelines #1 → #7.** Still the best tiny rules file, but no commits since 2026-04-20 (maintenance 1/5) and no install data.
- **verification-before-completion #3 → #1.** Fully checkable gate, 3.6 KB, eval-covered.
- **Added:** claude-md-management (moved here from 11: it audits the rules file), git-guardrails-claude-code and CC Safety Net (rules enforced by hooks), constraint-driven-development (written quality bar).
- **Dropped:** writing-for-agents + codebase-design (re-filed under 12/15 and 05), context-engineering-intro (idle since March, #16), Boris Cherny pattern (secondary blog write-up, no artefact to verify), context-engineering-kit (GPL-3.0, below #15).

### Score sheet
| Rank | Candidate | Repo | ★ | Installs | Licence | Last commit | S×3 | E×2 | A | M | F | C | Total |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | verification-before-completion | obra/superpowers | 316k | 272k s.sh | MIT | 2026-11-03 | 5 | 5 | 5 | 5 | 5 | 5 | 45 |
| 2 | claude-md-management (official) | anthropics/claude-plugins-official | 47k | 287k plugin | Apache-2.0 | 2026-11-10 | 4 | 4 | 5 | 5 | 5 | 4 | 39 |
| 3 | git-guardrails-claude-code | mattpocock/skills | 321k | 553k s.sh | MIT | 2026-10-31 | 4 | 3 | 5 | 5 | 5 | 5 | 38 |
| 4 | constraint-driven-development | addyosmani/agent-skills | 115k | 43k s.sh | MIT | 2026-11-01 | 5 | 3 | 4 | 5 | 5 | 2 | 37 |
| 5 | pstack principle-* (24 principles) | cursor/plugins | 16k | 5.8k s.sh | MIT (pstack) | 2026-11-11 | 5 | 3 | 3 | 5 | 4 | 4 | 37 |
| 6 | CC Safety Net | kenryu42/cc-safety-net | 2.0k | 33 s.sh | MIT | 2026-11-11 | 5 | 2 | 2 | 5 | 5 | 5 | 36 |
| 7 | Karpathy guidelines (CLAUDE.md) | multica-ai/andrej-karpathy-skills | 232k | n/a | MIT | 2026-04-20 | 4 | 4 | 4 | 1 | 5 | 5 | 35 |
| 8 | using-agent-skills (operating behaviours) | addyosmani/agent-skills | 115k | 69k s.sh | MIT | 2026-11-01 | 4 | 3 | 4 | 5 | 5 | 3 | 35 |
| 9 | caveman | JuliusBrussee/caveman | 119k | 621k s.sh | Apache-2.0 | 2026-11-09 | 3 | 4 | 5 | 5 | 4 | 4 | 35 |
| 10 | ECC rules (per-language) | affaan-m/ECC | 301k | 7.1k s.sh | MIT | 2026-11-06 | 3 | 3 | 5 | 5 | 4 | 3 | 32 |
| 11 | Trail of Bits claude-code-config | trailofbits/claude-code-config | 2.1k | n/a | none | 2026-08-24 | 4 | 3 | 2 | 3 | 3 | 5 | 31 |
| 12 | claude-settings-audit (Sentry) | getsentry/skills | 1.1k | 4.7k s.sh | Apache-2.0 | 2026-11-05 | 4 | 2 | 2 | 5 | 5 | 3 | 31 |
| 13 | Confidence Check (SuperClaude) | SuperClaude-Org/SuperClaude_Framework | 24k | 319 s.sh | MIT | 2026-09-27 | 3 | 2 | 3 | 4 | 5 | 4 | 29 |
| 14 | agents-md (Sentry) | getsentry/skills | 1.1k | 7.6k s.sh | Apache-2.0 | 2026-11-05 | 3 | 2 | 2 | 5 | 5 | 4 | 29 |
| 15 | claude-code-infrastructure-showcase | diet103/claude-code-infrastructure-showcase | 10k | 67 s.sh | MIT | 2026-07-11 | 3 | 2 | 3 | 2 | 5 | 4 | 27 |
| 16 | context-engineering-intro | coleam00/context-engineering-intro | 14k | n/a | MIT | 2026-03-16 | 3 | 2 | 3 | 1 | 5 | 4 | 26 |
| 17 | agent-md-refactor | softaworks/agent-toolkit | 2.7k | 4.3k s.sh | MIT | 2026-03-05 | 3 | 2 | 2 | 1 | 5 | 4 | 25 |
| 18 | claude-style-patch | andrewroxby/claude-style-patch | 161 | n/a | CC0 | 2026-10-17 | 3 | 1 | 0 | 4 | 5 | 5 | 25 |
| 19 | my-claude-code-setup | centminmod/my-claude-code-setup | 2.7k | n/a | MIT | 2026-11-10 | 2 | 2 | 2 | 5 | 5 | 3 | 25 |
| 20 | fixing-smartass-opus-5 | disler/fixing-smartass-opus-5 | 367 | n/a | MIT | 2026-08-16 | 3 | 1 | 0 | 3 | 5 | 5 | 24 |
| 21 | claude-code-settings | feiskyer/claude-code-settings | 1.7k | n/a | MIT | 2026-11-05 | 2 | 2 | 1 | 5 | 5 | 3 | 24 |
| 22 | context-engineering-kit | NeoLabHQ/context-engineering-kit | 1.8k | 1.5k s.sh | GPL-3.0 | 2026-08-26 | 3 | 2 | 1 | 3 | 2 | 4 | 23 |
| 23 | pua | tanweai/pua | 20k | 2.9k s.sh | MIT | 2026-09-09 | 2 | 2 | 3 | 3 | 4 | 3 | 23 |
| 24 | 12-factor-agents | humanlayer/12-factor-agents | 27k | n/a | Apache-2.0 | 2025-09-21 | 2 | 3 | 3 | 0 | 4 | 3 | 22 |
| 25 | review-claudemd (claude-code-tips) | ykdojo/claude-code-tips | 10k | 239 s.sh | all rights reserved | 2026-09-25 | 2 | 2 | 3 | 3 | 1 | 4 | 21 |
| 26 | claude-code-showcase | ChrisWiles/claude-code-showcase | 6.1k | n/a | MIT | 2026-01-06 | 2 | 2 | 2 | 1 | 5 | 3 | 21 |
| 27 | Claude Code system prompts | Piebald-AI/claude-code-system-prompts | 13k | n/a | MIT | 2026-11-09 | 1 | 2 | 3 | 5 | 5 | 1 | 21 |

## 02 · Workflow orchestration

File: [02-workflow-orchestration.md](02-workflow-orchestration.md). 25 candidates (24 ranked). Adoption scale: log10 1.72 → 0, 6.00 → 5.

### Changes vs previous list
- **superpowers and Matt Pocock stay #1–2**, order swapped: superpowers has a behavioural eval harness and 1.0M plugin installs.
- **feature-dev #8 → #3** (official, 256k installs, lean). **gstack #4 → #9**: every skill is 20–85 KB with a shared preamble and a setup binary (context 1/5).
- **Added:** compound-engineering (Every), GSD Core (the get-shit-done repo was archived on 2026-05-31 and moved to open-gsd/gsd-core), Plannotator.
- **Dropped:** ECC (#13, context 1/5), oh-my-claudecode (#14, 60 KB team skill), SuperClaude (561 installs, older persona design).

### Score sheet
| Rank | Candidate | Repo | ★ | Installs | Licence | Last commit | S×3 | E×2 | A | M | F | C | Total |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | superpowers (full methodology) | obra/superpowers | 316k | 1.0M plugin | MIT | 2026-11-03 | 5 | 5 | 5 | 5 | 5 | 3 | 43 |
| 2 | Matt Pocock flow (ask-matt router) | mattpocock/skills | 321k | 840k s.sh | MIT | 2026-10-31 | 5 | 3 | 5 | 5 | 5 | 4 | 40 |
| 3 | feature-dev (official) | anthropics/claude-plugins-official | 47k | 256k plugin | Apache-2.0 | 2026-11-10 | 4 | 4 | 4 | 5 | 5 | 4 | 38 |
| 4 | compound-engineering (lfg, ce-*) | EveryInc/compound-engineering-plugin | 26k | 3.6k s.sh | MIT | 2026-11-11 | 5 | 3 | 3 | 5 | 5 | 3 | 37 |
| 5 | poteto-mode (pstack router) | cursor/plugins | 16k | 5.1k s.sh | MIT (pstack) | 2026-11-11 | 5 | 3 | 3 | 5 | 4 | 2 | 35 |
| 6 | agent-skills lifecycle | addyosmani/agent-skills | 115k | 69k s.sh | MIT | 2026-11-01 | 4 | 3 | 4 | 5 | 5 | 3 | 35 |
| 7 | BMAD-METHOD | bmad-code-org/BMAD-METHOD | 55k | 17k s.sh | MIT | 2026-11-08 | 4 | 3 | 4 | 5 | 5 | 2 | 34 |
| 8 | GSD Core | open-gsd/gsd-core | 11k | n/a | MIT | 2026-11-11 | 4 | 3 | 3 | 5 | 5 | 2 | 33 |
| 9 | gstack (sprint roles) | garrytan/gstack | 141k | 25k s.sh | MIT | 2026-11-10 | 4 | 3 | 4 | 5 | 4 | 1 | 32 |
| 10 | Plannotator | backnotprop/plannotator | 10k | 14k s.sh | Apache-2.0 | 2026-11-11 | 3 | 3 | 3 | 5 | 4 | 4 | 31 |
| 11 | wshobson full-stack-orchestration | wshobson/agents | 42k | n/a | MIT | 2026-11-08 | 3 | 3 | 3 | 5 | 5 | 3 | 31 |
| 12 | Built-in plan mode + todos | built-in | n/a | built-in | n/a (built-in) | built-in | 2 | 3 | 4 | 5 | 5 | 5 | 31 |
| 13 | ECC | affaan-m/ECC | 301k | 5.5k s.sh | MIT | 2026-11-06 | 3 | 3 | 4 | 5 | 4 | 1 | 29 |
| 14 | oh-my-claudecode | Yeachan-Heo/oh-my-claudecode | 41k | 1.1k s.sh | MIT | 2026-11-11 | 3 | 3 | 3 | 5 | 5 | 1 | 29 |
| 15 | Claude Code PM (ccpm) | automazeio/ccpm | 8.4k | n/a | MIT | 2026-11-04 | 3 | 2 | 3 | 5 | 5 | 3 | 29 |
| 16 | Claude Code Workflows (OneRedOak) | OneRedOak/claude-code-workflows | 3.9k | n/a | MIT | 2026-10-09 | 3 | 2 | 2 | 4 | 5 | 3 | 27 |
| 17 | agentsys | agent-sh/agentsys | 1.0k | 126 s.sh | MIT | 2026-11-09 | 3 | 1 | 2 | 5 | 5 | 3 | 26 |
| 18 | claude-code-harness | Chachamaru127/claude-code-harness | 3.2k | 49 s.sh | MIT | 2026-11-11 | 3 | 1 | 2 | 5 | 5 | 2 | 25 |
| 19 | AB Method | ayoubben18/ab-method | 193 | 56 s.sh | MIT | 2026-11-10 | 3 | 1 | 1 | 5 | 5 | 3 | 25 |
| 20 | TÂCHES resources | glittercowboy/taches-cc-resources | 2.0k | 507 s.sh | MIT | 2026-04-01 | 3 | 2 | 2 | 1 | 5 | 3 | 24 |
| 21 | Mycelium | haabe/mycelium | 52 | 7 s.sh | MIT | 2026-11-06 | 3 | 1 | 0 | 5 | 5 | 3 | 24 |
| 22 | SuperClaude | SuperClaude-Org/SuperClaude_Framework | 24k | 561 s.sh | MIT | 2026-09-27 | 2 | 2 | 3 | 4 | 5 | 2 | 24 |
| 23 | RIPER-5 | tony/claude-code-riper-5 | 96 | n/a | MIT | 2026-08-16 | 3 | 1 | 0 | 3 | 5 | 3 | 22 |
| 24 | qualitylayer (Claude CodePro) | maxritter/qualitylayer | 2.1k | 194 s.sh | proprietary | 2026-11-10 | 3 | 1 | 2 | 5 | 1 | 2 | 21 |
| – | pstack-claude (Claude Code port) | michael-denyer/pstack-claude | 4.2k | 1.3k s.sh | MIT | 2026-11-11 | 5 | 2 | 2 | 5 | 5 | 2 | not ranked: Part of poteto-mode entry: unofficial Claude Code port of the same design |

## 03 · Ideation & product thinking

File: [03-ideation-product.md](03-ideation-product.md). 25 candidates (24 ranked). Adoption scale: log10 0.90 → 0, 6.18 → 5.

### Changes vs previous list
- **grilling stays #1** (1.5M installs, 2 KB, explicit exit condition). **prototype #8 → #3.**
- **/office-hours #3 → #10** and **/plan-ceo-review out (#11)**: 44 KB and 61 KB files.
- **Added:** ce-brainstorm + ce-ideate, to-questionnaire.
- **Dropped:** last30days (moved to 16; skills.sh audit FAIL), borghei (MIT + Commons Clause).

### Score sheet
| Rank | Candidate | Repo | ★ | Installs | Licence | Last commit | S×3 | E×2 | A | M | F | C | Total |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | grilling / grill-me / grill-with-docs | mattpocock/skills | 321k | 1.5M s.sh | MIT | 2026-10-31 | 5 | 4 | 5 | 5 | 5 | 5 | 43 |
| 2 | brainstorming | obra/superpowers | 316k | 425k s.sh | MIT | 2026-11-03 | 5 | 5 | 4 | 5 | 5 | 2 | 41 |
| 3 | prototype | mattpocock/skills | 321k | 1.1M s.sh | MIT | 2026-10-31 | 4 | 4 | 5 | 5 | 5 | 4 | 39 |
| 4 | idea-refine | addyosmani/agent-skills | 115k | 69k s.sh | MIT | 2026-11-01 | 4 | 3 | 4 | 5 | 5 | 3 | 35 |
| 5 | attack-the-premise, sharpen, in-your-own-words | cursor/plugins | 16k | 2.8k s.sh | MIT (pstack) | 2026-11-11 | 4 | 3 | 3 | 5 | 4 | 5 | 35 |
| 6 | ce-brainstorm + ce-ideate | EveryInc/compound-engineering-plugin | 26k | 4.1k s.sh | MIT | 2026-11-11 | 4 | 3 | 3 | 5 | 5 | 4 | 35 |
| 7 | interview-me | addyosmani/agent-skills | 115k | 67k s.sh | MIT | 2026-11-01 | 4 | 3 | 4 | 5 | 5 | 2 | 34 |
| 8 | to-questionnaire | mattpocock/skills | 321k | 569k s.sh | MIT | 2026-10-31 | 3 | 3 | 5 | 5 | 5 | 4 | 34 |
| 9 | strategy-red-team + pre-mortem | phuryn/pm-skills | 28k | 10k s.sh | MIT | 2026-11-08 | 4 | 2 | 3 | 5 | 5 | 4 | 33 |
| 10 | /office-hours | garrytan/gstack | 141k | 630 s.sh | MIT | 2026-11-10 | 4 | 3 | 4 | 5 | 4 | 1 | 32 |
| 11 | /plan-ceo-review | garrytan/gstack | 141k | 524 s.sh | MIT | 2026-11-10 | 4 | 3 | 4 | 5 | 4 | 1 | 32 |
| 12 | plan-design-review (gstack) | garrytan/gstack | 141k | 518 s.sh | MIT | 2026-11-10 | 4 | 3 | 4 | 5 | 4 | 1 | 32 |
| 13 | deep-interview (oh-my-claudecode) | Yeachan-Heo/oh-my-claudecode | 41k | 1.1k s.sh | MIT | 2026-11-11 | 4 | 2 | 4 | 5 | 5 | 2 | 32 |
| 14 | last30days | mvanhorn/last30days-skill | 67k | 61k s.sh | MIT | 2026-11-11 | 4 | 3 | 4 | 5 | 3 | 1 | 31 |
| 15 | scientific-brainstorming (K-Dense) | K-Dense-AI/scientific-agent-skills | 57k | 2.5k s.sh | MIT | 2026-11-09 | 3 | 2 | 4 | 5 | 5 | 3 | 30 |
| 16 | cc-thinking-skills | tjboudreaux/cc-thinking-skills | 1.7k | 784 s.sh | MIT | 2026-08-07 | 3 | 3 | 2 | 2 | 5 | 5 | 29 |
| 17 | product-lens (ECC) | affaan-m/ECC | 301k | 5.6k s.sh | MIT | 2026-11-06 | 3 | 2 | 4 | 5 | 4 | 3 | 29 |
| 18 | Mycelium | haabe/mycelium | 52 | 7 s.sh | MIT | 2026-11-06 | 4 | 1 | 1 | 5 | 5 | 3 | 28 |
| 19 | critical-thinking / design-thinking | tronghieu/agent-skills | 105 | 64 s.sh | MIT | 2026-10-31 | 3 | 1 | 1 | 5 | 5 | 3 | 25 |
| 20 | Product-Manager-Skills discovery | deanpeters/Product-Manager-Skills | 8.0k | 3.3k s.sh | CC BY-NC-SA 4.0 | 2026-10-16 | 3 | 2 | 3 | 4 | 2 | 2 | 24 |
| 21 | swarmstorm (charrette) | Ovich/swarmstorm | 14 | n/a | MIT | 2026-11-07 | 3 | 1 | 0 | 5 | 5 | 3 | 24 |
| 22 | napkin-to-blueprint | tsmztech/napkin-to-blueprint | 8 | n/a | MIT | 2026-10-25 | 3 | 1 | 0 | 4 | 5 | 3 | 23 |
| 23 | brainstorm (SuperClaude) | SuperClaude-Org/SuperClaude_Framework | 24k | 48 s.sh | MIT | 2026-09-27 | 2 | 1 | 3 | 4 | 5 | 3 | 23 |
| 24 | brainstorm-ideas (borghei) | borghei/Claude-Skills | 1.1k | n/a | MIT + Commons Clause | 2026-11-08 | 2 | 2 | 2 | 5 | 2 | 3 | 22 |
| – | domain-modeling | mattpocock/skills | 321k | 966k s.sh | MIT | 2026-10-31 | 4 | 3 | 5 | 5 | 5 | 4 | not ranked: Ranked in 11 (with handoff): ideation output as durable project language |

## 04 · Specs & planning

File: [04-specs-planning.md](04-specs-planning.md). 25 candidates (25 ranked). Adoption scale: log10 1.98 → 0, 5.90 → 5.

### Changes vs previous list
- **writing-plans #5 → #1** (checkable 2–5 minute tasks, eval-covered). **Spec Kit #1 → #3** (heavy templates, CLI-driven; still the most complete gated flow).
- **Added:** ce-plan (Every), beads (task graph as a tool).
- **Changed source:** get-shit-done → GSD Core (old repo archived).
- **Dropped:** /autoplan (#11, 43 KB), Taskmaster (MIT + Commons Clause, last commit 2026-04-23).

### Score sheet
| Rank | Candidate | Repo | ★ | Installs | Licence | Last commit | S×3 | E×2 | A | M | F | C | Total |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | writing-plans + executing-plans | obra/superpowers | 316k | 300k s.sh | MIT | 2026-11-03 | 5 | 5 | 4 | 5 | 5 | 3 | 42 |
| 2 | to-spec + to-tickets + wayfinder | mattpocock/skills | 321k | 796k s.sh | MIT | 2026-10-31 | 5 | 3 | 5 | 5 | 5 | 3 | 39 |
| 3 | Spec Kit | github/spec-kit | 149k | n/a | MIT | 2026-11-10 | 5 | 4 | 4 | 5 | 4 | 2 | 38 |
| 4 | ce-plan | EveryInc/compound-engineering-plugin | 26k | 3.9k s.sh | MIT | 2026-11-11 | 5 | 3 | 3 | 5 | 5 | 4 | 38 |
| 5 | spec-driven-development + planning-and-task-breakdown | addyosmani/agent-skills | 115k | 76k s.sh | MIT | 2026-11-01 | 4 | 3 | 4 | 5 | 5 | 3 | 35 |
| 6 | beads | gastownhall/beads | 29k | 2.2k s.sh | MIT | 2026-11-10 | 4 | 3 | 3 | 5 | 5 | 4 | 35 |
| 7 | OpenSpec | Fission-AI/OpenSpec | 75k | 4.9k s.sh | MIT | 2026-11-10 | 4 | 3 | 4 | 5 | 4 | 3 | 34 |
| 8 | BMAD-METHOD | bmad-code-org/BMAD-METHOD | 55k | 17k s.sh | MIT | 2026-11-08 | 4 | 3 | 4 | 5 | 5 | 1 | 33 |
| 9 | GSD Core | open-gsd/gsd-core | 11k | n/a | MIT | 2026-11-11 | 4 | 3 | 3 | 5 | 5 | 2 | 33 |
| 10 | architect + multi-phase-plan (pstack) | cursor/plugins | 16k | 5.7k s.sh | MIT (pstack) | 2026-11-11 | 4 | 3 | 3 | 5 | 4 | 3 | 33 |
| 11 | /autoplan + /spec (gstack) | garrytan/gstack | 141k | 423 s.sh | MIT | 2026-11-10 | 4 | 3 | 4 | 5 | 4 | 1 | 32 |
| 12 | ccpm | automazeio/ccpm | 8.4k | n/a | MIT | 2026-11-04 | 4 | 2 | 2 | 5 | 5 | 3 | 31 |
| 13 | Plannotator | backnotprop/plannotator | 10k | 14k s.sh | Apache-2.0 | 2026-11-11 | 3 | 3 | 3 | 5 | 4 | 4 | 31 |
| 14 | Built-in plan mode | built-in | n/a | built-in | n/a (built-in) | built-in | 2 | 3 | 4 | 5 | 5 | 5 | 31 |
| 15 | create-prd (pm-skills) | phuryn/pm-skills | 28k | 11k s.sh | MIT | 2026-11-08 | 3 | 2 | 3 | 5 | 5 | 4 | 30 |
| 16 | cc-sdd | gotalab/cc-sdd | 3.8k | 31 s.sh | MIT | 2026-09-23 | 4 | 2 | 2 | 3 | 5 | 3 | 29 |
| 17 | blueprint (ECC) | affaan-m/ECC | 301k | 5.7k s.sh | MIT | 2026-11-06 | 3 | 2 | 4 | 5 | 4 | 3 | 29 |
| 18 | ralplan (oh-my-claudecode) | Yeachan-Heo/oh-my-claudecode | 41k | 1.3k s.sh | MIT | 2026-11-11 | 3 | 2 | 3 | 5 | 5 | 2 | 28 |
| 19 | Taskmaster | eyaltoledano/claude-task-master | 28k | n/a | MIT + Commons Clause | 2026-04-23 | 4 | 3 | 3 | 1 | 2 | 2 | 26 |
| 20 | kiro-skill / spec-kit-skill (feiskyer) | feiskyer/claude-code-settings | 1.7k | 665 s.sh | MIT | 2026-11-05 | 3 | 1 | 2 | 5 | 5 | 3 | 26 |
| 21 | AB Method | ayoubben18/ab-method | 193 | 56 s.sh | MIT | 2026-11-10 | 3 | 1 | 0 | 5 | 5 | 3 | 24 |
| 22 | claude-code-spec-workflow | Pimzino/claude-code-spec-workflow | 3.9k | n/a | MIT | 2025-09-07 | 3 | 2 | 2 | 0 | 5 | 3 | 23 |
| 23 | prd-development (deanpeters) | deanpeters/Product-Manager-Skills | 8.0k | 4.8k s.sh | CC BY-NC-SA 4.0 | 2026-10-16 | 3 | 2 | 2 | 4 | 2 | 1 | 22 |
| 24 | spec-workflow-mcp | Pimzino/spec-workflow-mcp | 4.3k | n/a | GPL-3.0 | 2026-07-03 | 3 | 2 | 2 | 2 | 2 | 3 | 22 |
| 25 | RIPER-5 | tony/claude-code-riper-5 | 96 | n/a | MIT | 2026-08-16 | 3 | 1 | 0 | 3 | 5 | 3 | 22 |

## 05 · Build & TDD

File: [05-build-tdd.md](05-build-tdd.md). 25 candidates (24 ranked). Adoption scale: log10 3.33 → 0, 6.11 → 5.

### Changes vs previous list
- **Top 3 unchanged** (mattpocock tdd, superpowers TDD, subagent-driven-development).
- **improve-codebase-architecture #9 → #4**, **code-simplifier #10 → #6**.
- **TDD Guard #6 → #7**; its README now points new projects to Probity (same author).
- **Added:** ce-work. **executing-plans** is counted in 04 with writing-plans.
- **Dropped:** pstack tdd/architect/arena (#13), doubt-driven-development (split from source-driven; #12).

### Score sheet
| Rank | Candidate | Repo | ★ | Installs | Licence | Last commit | S×3 | E×2 | A | M | F | C | Total |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | tdd | mattpocock/skills | 321k | 1.2M s.sh | MIT | 2026-10-31 | 5 | 4 | 5 | 5 | 5 | 5 | 43 |
| 2 | test-driven-development | obra/superpowers | 316k | 276k s.sh | MIT | 2026-11-03 | 5 | 5 | 4 | 5 | 5 | 3 | 42 |
| 3 | subagent-driven-development | obra/superpowers | 316k | 253k s.sh | MIT | 2026-11-03 | 5 | 5 | 4 | 5 | 5 | 2 | 41 |
| 4 | improve-codebase-architecture + codebase-design | mattpocock/skills | 321k | 1.3M s.sh | MIT | 2026-10-31 | 4 | 4 | 5 | 5 | 5 | 3 | 38 |
| 5 | implement + implement-spec | mattpocock/skills | 321k | 854k s.sh | MIT | 2026-10-31 | 4 | 3 | 5 | 5 | 5 | 5 | 38 |
| 6 | code-simplifier (official) | anthropics/claude-plugins-official | 47k | 347k plugin | Apache-2.0 | 2026-11-10 | 3 | 4 | 4 | 5 | 5 | 5 | 36 |
| 7 | TDD Guard / Probity | nizos/tdd-guard | 2.4k | n/a | MIT | 2026-11-03 | 5 | 2 | 0 | 5 | 5 | 5 | 34 |
| 8 | incremental-implementation + test-driven-development | addyosmani/agent-skills | 115k | 72k s.sh | MIT | 2026-11-01 | 4 | 3 | 3 | 5 | 5 | 3 | 34 |
| 9 | source-driven-development | addyosmani/agent-skills | 115k | 68k s.sh | MIT | 2026-11-01 | 4 | 3 | 3 | 5 | 5 | 3 | 34 |
| 10 | ce-work | EveryInc/compound-engineering-plugin | 26k | 3.8k s.sh | MIT | 2026-11-11 | 4 | 3 | 2 | 5 | 5 | 4 | 34 |
| 11 | vercel-react-best-practices | vercel-labs/agent-skills | 34k | 889k s.sh | MIT | 2026-10-27 | 3 | 4 | 5 | 4 | 5 | 3 | 34 |
| 12 | doubt-driven-development | addyosmani/agent-skills | 115k | 67k s.sh | MIT | 2026-11-01 | 4 | 3 | 3 | 5 | 5 | 2 | 33 |
| 13 | tdd, architect, arena (pstack) | cursor/plugins | 16k | 5.8k s.sh | MIT (pstack) | 2026-11-11 | 4 | 3 | 2 | 5 | 4 | 4 | 33 |
| 14 | api-and-interface-design | addyosmani/agent-skills | 115k | 74k s.sh | MIT | 2026-11-01 | 3 | 3 | 3 | 5 | 5 | 3 | 31 |
| 15 | code-simplification | addyosmani/agent-skills | 115k | 74k s.sh | MIT | 2026-11-01 | 3 | 3 | 3 | 5 | 5 | 3 | 31 |
| 16 | safe-refactor / surgical-patch (caveman) | JuliusBrussee/caveman | 119k | 123k s.sh | Apache-2.0 | 2026-11-09 | 3 | 3 | 3 | 5 | 4 | 4 | 31 |
| 17 | ce-simplify-code | EveryInc/compound-engineering-plugin | 26k | 3.6k s.sh | MIT | 2026-11-11 | 3 | 2 | 2 | 5 | 5 | 4 | 29 |
| 18 | tdd-workflow (ECC) | affaan-m/ECC | 301k | 6.5k s.sh | MIT | 2026-11-06 | 3 | 2 | 4 | 5 | 4 | 2 | 28 |
| 19 | typescript-best-practices (cursor-team-kit) | cursor/plugins | 16k | 10k s.sh | MIT (pstack) | 2026-11-11 | 3 | 2 | 2 | 5 | 4 | 4 | 28 |
| 20 | code-simplifier (Sentry) | getsentry/skills | 1.1k | 9.0k s.sh | Apache-2.0 | 2026-11-05 | 3 | 2 | 1 | 5 | 5 | 4 | 28 |
| 21 | Fullstack Dev Skills | Jeffallan/claude-skills | 12k | 24k s.sh | MIT | 2026-10-30 | 2 | 3 | 2 | 5 | 5 | 3 | 27 |
| 22 | python-testing-patterns (wshobson) | wshobson/agents | 42k | 40k s.sh | MIT | 2026-11-08 | 2 | 3 | 2 | 5 | 5 | 3 | 27 |
| 23 | ralph-orchestrator TDD skill | mikeyobrien/ralph-orchestrator | 3.2k | 34 s.sh | MIT | 2026-11-06 | 3 | 1 | 0 | 5 | 5 | 4 | 25 |
| 24 | qualitylayer TDD enforcement | maxritter/qualitylayer | 2.1k | 194 s.sh | proprietary | 2026-11-10 | 4 | 1 | 0 | 5 | 1 | 3 | 23 |
| – | executing-plans | obra/superpowers | 316k | 259k s.sh | MIT | 2026-11-03 | 4 | 5 | 4 | 5 | 5 | 2 | not ranked: Ranked in 04 (bundled with writing-plans): inline alternative to subagents |

## 06 · Debugging & performance

File: [06-debugging-performance.md](06-debugging-performance.md). 25 candidates (23 ranked). Adoption scale: log10 2.27 → 0, 5.96 → 5.

### Changes vs previous list
- **Top 2 unchanged.** **autoresearch #9 → #5** despite being idle since March (substance 5).
- **Added:** ce-debug, gstack /benchmark.
- **Dropped:** Hermes systematic-debugging: reading it showed it is a derivative of superpowers systematic-debugging (same "Iron Law" text), 523 installs. wshobson debugging-strategies: reference material without a procedure.

### Score sheet
| Rank | Candidate | Repo | ★ | Installs | Licence | Last commit | S×3 | E×2 | A | M | F | C | Total |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | systematic-debugging | obra/superpowers | 316k | 329k s.sh | MIT | 2026-11-03 | 5 | 5 | 4 | 5 | 5 | 3 | 42 |
| 2 | diagnosing-bugs | mattpocock/skills | 321k | 920k s.sh | MIT | 2026-10-31 | 5 | 3 | 5 | 5 | 5 | 3 | 39 |
| 3 | bug-fix, runtime- and trace-forensics (pstack) | cursor/plugins | 16k | 5.1k s.sh | MIT (pstack) | 2026-11-11 | 5 | 3 | 3 | 5 | 4 | 4 | 37 |
| 4 | hillclimb + perf-issue + benchmark-checklist (pstack) | cursor/plugins | 16k | 2.0k s.sh | MIT (pstack) | 2026-11-11 | 5 | 3 | 3 | 5 | 4 | 4 | 37 |
| 5 | autoresearch | karpathy/autoresearch | 100k | n/a | MIT | 2026-03-25 | 5 | 4 | 4 | 1 | 4 | 4 | 36 |
| 6 | ce-debug | EveryInc/compound-engineering-plugin | 26k | 3.6k s.sh | MIT | 2026-11-11 | 5 | 3 | 3 | 5 | 5 | 2 | 36 |
| 7 | Chrome DevTools MCP + skills | ChromeDevTools/chrome-devtools-mcp | 55k | 103k plugin | Apache-2.0 | 2026-11-11 | 4 | 4 | 4 | 5 | 5 | 2 | 36 |
| 8 | debugging-and-error-recovery | addyosmani/agent-skills | 115k | 73k s.sh | MIT | 2026-11-01 | 4 | 3 | 4 | 5 | 5 | 3 | 35 |
| 9 | performance-optimization | addyosmani/agent-skills | 115k | 76k s.sh | MIT | 2026-11-01 | 4 | 3 | 4 | 5 | 5 | 2 | 34 |
| 10 | /benchmark (gstack) | garrytan/gstack | 141k | 396 s.sh | MIT | 2026-11-10 | 4 | 3 | 4 | 5 | 4 | 1 | 32 |
| 11 | /investigate (gstack) | garrytan/gstack | 141k | 455 s.sh | MIT | 2026-11-10 | 4 | 3 | 4 | 5 | 4 | 1 | 32 |
| 12 | web-quality-skills (performance, core-web-vitals) | addyosmani/web-quality-skills | 3.1k | 44k s.sh | MIT | 2026-08-24 | 4 | 3 | 3 | 3 | 5 | 3 | 32 |
| 13 | CodSpeed plugin | CodSpeedHQ/codspeed | 392 | 902 plugin | Apache-2.0 | 2026-11-09 | 4 | 2 | 1 | 5 | 5 | 4 | 31 |
| 14 | vercel-optimize | vercel-labs/agent-skills | 34k | 128k s.sh | MIT | 2026-10-27 | 3 | 3 | 4 | 4 | 5 | 3 | 31 |
| 15 | Sentry plugin | getsentry/skills | 1.1k | 39k plugin | Apache-2.0 | 2026-11-05 | 3 | 3 | 3 | 5 | 4 | 3 | 30 |
| 16 | investigate-first (caveman) | JuliusBrussee/caveman | 119k | n/a | Apache-2.0 | 2026-11-09 | 3 | 2 | 4 | 5 | 4 | 4 | 30 |
| 17 | find-bugs (Sentry) | getsentry/skills | 1.1k | 7.4k s.sh | Apache-2.0 | 2026-11-05 | 3 | 2 | 2 | 5 | 5 | 5 | 30 |
| 18 | debugging-strategies (wshobson) | wshobson/agents | 42k | 14k s.sh | MIT | 2026-11-08 | 2 | 3 | 3 | 5 | 5 | 4 | 29 |
| 19 | python-performance-optimization (wshobson) | wshobson/agents | 42k | 38k s.sh | MIT | 2026-11-08 | 2 | 3 | 3 | 5 | 5 | 3 | 28 |
| 20 | agent-introspection-debugging (ECC) | affaan-m/ECC | 301k | 5.8k s.sh | MIT | 2026-11-06 | 2 | 2 | 4 | 5 | 4 | 3 | 26 |
| 21 | memory-forensics (wshobson) | wshobson/agents | 42k | 12k s.sh | MIT | 2026-11-08 | 2 | 2 | 3 | 5 | 5 | 3 | 26 |
| 22 | browser-debugger-cli | szymdzum/browser-debugger-cli | 185 | n/a | MIT | 2026-11-11 | 3 | 1 | 0 | 5 | 5 | 4 | 25 |
| 23 | debug-like-expert (TÂCHES) | glittercowboy/taches-cc-resources | 2.0k | 177 s.sh | MIT | 2026-04-01 | 3 | 1 | 1 | 1 | 5 | 3 | 21 |
| – | systematic-debugging (Hermes) | NousResearch/hermes-agent | 263k | 523 s.sh | MIT | 2026-11-11 | 4 | 3 | 4 | 5 | 3 | 3 | not ranked: Duplicate: derivative of superpowers systematic-debugging (same Iron Law text); 523 installs |
| – | safe-debug (RigorPilot) | lllllllama/RigorPilot-Skills | 486 | 354k s.sh | MIT | 2026-09-23 | 2 | 0 | 4 | 3 | 5 | 3 | not ranked: Excluded: 354k installs vs 486★ looks inflated |

## 07 · Code review & quality

File: [07-code-review.md](07-code-review.md). 25 candidates (23 ranked). Adoption scale: log10 2.58 → 0, 5.94 → 5.

### Changes vs previous list
- **Official code-review stays #1.** **Matt Pocock code-review #4 → #2.** **Built-in /code-review #8 → #4.**
- **Added:** ce-code-review (Every), thermo-nuclear-code-quality-review (cursor-team-kit, 24k installs).
- **Dropped:** awesome-skills code-review-skill (4.4k installs, generic), HAMY "9 parallel agents" (blog post, nothing installable).

### Score sheet
| Rank | Candidate | Repo | ★ | Installs | Licence | Last commit | S×3 | E×2 | A | M | F | C | Total |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | code-review (official) | anthropics/claude-plugins-official | 47k | 439k plugin | Apache-2.0 | 2026-11-10 | 5 | 4 | 5 | 5 | 5 | 4 | 42 |
| 2 | code-review (Standards × Spec) | mattpocock/skills | 321k | 880k s.sh | MIT | 2026-10-31 | 5 | 3 | 5 | 5 | 5 | 4 | 40 |
| 3 | requesting- + receiving-code-review | obra/superpowers | 316k | 278k s.sh | MIT | 2026-11-03 | 4 | 5 | 4 | 5 | 5 | 4 | 40 |
| 4 | Built-in /code-review | built-in | n/a | built-in | n/a (built-in) | built-in | 4 | 4 | 4 | 5 | 5 | 5 | 39 |
| 5 | ce-code-review | EveryInc/compound-engineering-plugin | 26k | 4.0k s.sh | MIT | 2026-11-11 | 5 | 3 | 3 | 5 | 5 | 4 | 38 |
| 6 | pr-review-toolkit (official) | anthropics/claude-plugins-official | 47k | 115k plugin | Apache-2.0 | 2026-11-10 | 4 | 4 | 4 | 5 | 5 | 3 | 37 |
| 7 | /review (gstack) | garrytan/gstack | 141k | 497 s.sh | MIT | 2026-11-10 | 5 | 3 | 4 | 5 | 4 | 1 | 35 |
| 8 | code-review-and-quality | addyosmani/agent-skills | 115k | 85k s.sh | MIT | 2026-11-01 | 4 | 3 | 4 | 5 | 5 | 2 | 34 |
| 9 | thermo-nuclear-code-quality-review | cursor/plugins | 16k | 24k s.sh | MIT (pstack) | 2026-11-11 | 4 | 3 | 3 | 5 | 5 | 3 | 34 |
| 10 | interrogate + no-comments (pstack) | cursor/plugins | 16k | 5.4k s.sh | MIT (pstack) | 2026-11-11 | 4 | 3 | 2 | 5 | 4 | 4 | 33 |
| 11 | code-simplification (addy) | addyosmani/agent-skills | 115k | 74k s.sh | MIT | 2026-11-01 | 3 | 3 | 4 | 5 | 5 | 3 | 32 |
| 12 | Greptile (greploop) | greptileai/skills | 435 | 57k plugin | MIT | 2026-11-03 | 3 | 3 | 3 | 5 | 4 | 5 | 32 |
| 13 | CodeRabbit skills | coderabbitai/skills | 215 | 32k plugin | MIT | 2026-11-11 | 3 | 3 | 3 | 5 | 4 | 4 | 31 |
| 14 | claude-code-action | anthropics/claude-code-action | 9.9k | n/a | MIT | 2026-11-10 | 2 | 4 | 2 | 5 | 5 | 5 | 31 |
| 15 | caveman-review | JuliusBrussee/caveman | 119k | 429k s.sh | Apache-2.0 | 2026-11-09 | 2 | 3 | 5 | 5 | 4 | 5 | 31 |
| 16 | code-review + find-bugs (Sentry) | getsentry/skills | 1.1k | 5.7k s.sh | Apache-2.0 | 2026-11-05 | 3 | 2 | 2 | 5 | 5 | 5 | 30 |
| 17 | deslop (cursor-team-kit) | cursor/plugins | 16k | 10k s.sh | MIT (pstack) | 2026-11-11 | 3 | 2 | 2 | 5 | 5 | 5 | 30 |
| 18 | security-review / code-reviewer (ECC) | affaan-m/ECC | 301k | 7.7k s.sh | MIT | 2026-11-06 | 3 | 2 | 4 | 5 | 4 | 3 | 29 |
| 19 | code-review-excellence (wshobson) | wshobson/agents | 42k | 31k s.sh | MIT | 2026-11-08 | 2 | 3 | 3 | 5 | 5 | 4 | 29 |
| 20 | Qodo skills | qodo-ai/qodo-skills | 60 | 12k plugin | MIT | 2026-11-11 | 3 | 2 | 2 | 5 | 4 | 4 | 28 |
| 21 | Claude Code Workflows (OneRedOak) | OneRedOak/claude-code-workflows | 3.9k | n/a | MIT | 2026-10-09 | 3 | 2 | 2 | 4 | 5 | 3 | 27 |
| 22 | code-review-skill (awesome-skills) | awesome-skills/code-review-skill | 2.2k | 4.4k s.sh | MIT | 2026-09-08 | 3 | 2 | 2 | 3 | 5 | 3 | 26 |
| 23 | open-code-review | spencermarx/open-code-review | 384 | 34 s.sh | Apache-2.0 | 2026-11-11 | 3 | 1 | 0 | 5 | 5 | 3 | 24 |
| – | constraint-driven-development (diff bar) | addyosmani/agent-skills | 115k | 43k s.sh | MIT | 2026-11-01 | 5 | 3 | 4 | 5 | 5 | 2 | not ranked: Ranked in 01; gate-integrity check overlaps |
| – | differential-review (Trail of Bits) | trailofbits/skills | 8.1k | 10k s.sh | CC BY-SA 4.0 | 2026-11-06 | 5 | 3 | 2 | 5 | 2 | 4 | not ranked: Ranked in 09; CC BY-SA |

## 08 · Testing & QA

File: [08-testing-qa.md](08-testing-qa.md). 25 candidates (24 ranked). Adoption scale: log10 2.63 → 0, 6.18 → 5.

### Changes vs previous list
- **agent-browser #4 → #1** (1.5M installs, 3 KB CLI skill). **webapp-testing #1 → #2.**
- **Added:** playwright-cli (Microsoft), dev-browser, browser-use.
- **Dropped:** lackeyjb playwright-skill (#23), superpowers condition-based-waiting (no longer a standalone skill; moved into systematic-debugging as a reference file), qaskills "playwright-e2e-testing" (source never found; replaced by currents-dev playwright-best-practices, which scored #20 on adoption).

### Score sheet
| Rank | Candidate | Repo | ★ | Installs | Licence | Last commit | S×3 | E×2 | A | M | F | C | Total |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | agent-browser | vercel-labs/agent-browser | 50k | 1.5M s.sh | Apache-2.0 | 2026-11-11 | 4 | 4 | 5 | 5 | 5 | 5 | 40 |
| 2 | webapp-testing | anthropics/skills | 192k | 202k s.sh | Apache-2.0 | 2026-11-06 | 4 | 4 | 4 | 5 | 5 | 5 | 39 |
| 3 | playwright-cli skill | microsoft/playwright-cli | 15k | 214k s.sh | Apache-2.0 | 2026-11-10 | 4 | 4 | 4 | 5 | 5 | 2 | 36 |
| 4 | /qa, /qa-only, /browse (gstack) | garrytan/gstack | 141k | 493 s.sh | MIT | 2026-11-10 | 5 | 3 | 4 | 5 | 4 | 1 | 35 |
| 5 | dev-browser | SawyerHood/dev-browser | 6.7k | n/a | MIT | 2026-11-03 | 4 | 3 | 2 | 5 | 5 | 5 | 35 |
| 6 | browser-testing-with-devtools | addyosmani/agent-skills | 115k | 69k s.sh | MIT | 2026-11-01 | 4 | 3 | 3 | 5 | 5 | 3 | 34 |
| 7 | Playwright MCP (official plugin) | microsoft/playwright-mcp | 39k | 320k plugin | Apache-2.0 | 2026-11-10 | 3 | 4 | 4 | 5 | 5 | 2 | 33 |
| 8 | browser-use | browser-use/browser-use | 121k | 100k s.sh | MIT | 2026-11-11 | 3 | 4 | 3 | 5 | 4 | 4 | 33 |
| 9 | visual-parity (pstack) | cursor/plugins | 16k | n/a | MIT (pstack) | 2026-11-11 | 4 | 2 | 2 | 5 | 4 | 5 | 32 |
| 10 | Chrome DevTools MCP | ChromeDevTools/chrome-devtools-mcp | 55k | 103k plugin | Apache-2.0 | 2026-11-11 | 3 | 4 | 3 | 5 | 5 | 2 | 32 |
| 11 | property-based-testing (Trail of Bits) | trailofbits/skills | 8.1k | 7.8k s.sh | CC BY-SA 4.0 | 2026-11-06 | 4 | 3 | 2 | 5 | 2 | 4 | 31 |
| 12 | test-audit (gstack) | garrytan/gstack | 141k | 40 s.sh | MIT | 2026-11-10 | 4 | 2 | 4 | 5 | 4 | 2 | 31 |
| 13 | Stagehand | browserbase/stagehand | 26k | 34 s.sh | MIT | 2026-11-10 | 3 | 3 | 3 | 5 | 4 | 4 | 31 |
| 14 | mutation-testing (Trail of Bits) | trailofbits/skills | 8.1k | n/a | CC BY-SA 4.0 | 2026-11-06 | 4 | 2 | 2 | 5 | 2 | 4 | 29 |
| 15 | browser-qa (ECC) | affaan-m/ECC | 301k | 6.1k s.sh | MIT | 2026-11-06 | 3 | 2 | 4 | 5 | 4 | 3 | 29 |
| 16 | e2e-testing (ECC) | affaan-m/ECC | 301k | 6.5k s.sh | MIT | 2026-11-06 | 3 | 2 | 4 | 5 | 4 | 3 | 29 |
| 17 | ultraqa (oh-my-claudecode) | Yeachan-Heo/oh-my-claudecode | 41k | 902 s.sh | MIT | 2026-11-11 | 3 | 2 | 3 | 5 | 5 | 3 | 29 |
| 18 | run-smoke-tests / verify-this (cursor-team-kit) | cursor/plugins | 16k | 2.6k s.sh | MIT (pstack) | 2026-11-11 | 3 | 2 | 2 | 5 | 4 | 5 | 29 |
| 19 | e2e-testing-patterns (wshobson) | wshobson/agents | 42k | 25k s.sh | MIT | 2026-11-08 | 2 | 3 | 3 | 5 | 5 | 4 | 29 |
| 20 | playwright-best-practices | currents-dev/playwright-best-practices-skill | 423 | n/a | MIT | 2026-11-08 | 4 | 2 | 0 | 5 | 5 | 2 | 28 |
| 21 | python-testing-patterns (wshobson) | wshobson/agents | 42k | 40k s.sh | MIT | 2026-11-08 | 2 | 3 | 3 | 5 | 5 | 3 | 28 |
| 22 | testing-strategy (knowledge-work) | anthropics/knowledge-work-plugins | 35k | 6.7k s.sh | Apache-2.0 | 2026-11-10 | 2 | 3 | 3 | 5 | 5 | 3 | 28 |
| 23 | playwright-skill (lackeyjb) | lackeyjb/playwright-skill | 3.3k | n/a | MIT | 2026-08-14 | 3 | 2 | 1 | 3 | 5 | 4 | 26 |
| 24 | qa-test-planner (softaworks) | softaworks/agent-toolkit | 2.7k | 4.4k s.sh | MIT | 2026-03-05 | 3 | 2 | 1 | 1 | 5 | 3 | 23 |
| – | webapp-testing clone in snyk/agent-scan | snyk/agent-scan | 3.2k | 97 s.sh | Apache-2.0 | 2026-11-09 | 0 | 0 | 1 | 5 | 0 | 0 | not ranked: Not a real candidate; scanner test data republished on skills.sh |

## 09 · Security

File: [09-security.md](09-security.md). 25 candidates (22 ranked). Adoption scale: log10 1.65 → 0, 5.48 → 5.

### Changes vs previous list
- **claude-security #2 → #1**, **security-guidance #4 → #2**, **Cloudflare #1 → #3**: Cloudflare's method is still the most rigorous (substance 5) but its last commit is 2026-09-14 and it publishes no install data. The deep-dive section is unchanged.
- **Added:** SkillSpector (NVIDIA), Sentry security-review, snyk agent-scan.
- **Dropped:** AgentShield (#13), addyosmani security-and-hardening (#11), VulnHunter (8 installs).

### Score sheet
| Rank | Candidate | Repo | ★ | Installs | Licence | Last commit | S×3 | E×2 | A | M | F | C | Total |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | claude-security (official) | anthropics/claude-plugins-official | 47k | 8.6k plugin | Apache-2.0 | 2026-11-10 | 5 | 4 | 4 | 5 | 5 | 3 | 40 |
| 2 | security-guidance (official) | anthropics/claude-plugins-official | 47k | 242k plugin | Apache-2.0 | 2026-11-10 | 4 | 4 | 5 | 5 | 5 | 5 | 40 |
| 3 | security-audit-skill (Cloudflare) | cloudflare/security-audit-skill | 70k | n/a | MIT | 2026-09-14 | 5 | 4 | 4 | 3 | 5 | 2 | 37 |
| 4 | Built-in /security-review | built-in | n/a | built-in | n/a (built-in) | built-in | 3 | 4 | 5 | 5 | 5 | 5 | 37 |
| 5 | Trail of Bits skills | trailofbits/skills | 8.1k | 10k s.sh | CC BY-SA 4.0 | 2026-11-06 | 5 | 4 | 3 | 5 | 2 | 3 | 36 |
| 6 | SkillSpector (NVIDIA) | NVIDIA/SkillSpector | 25k | 1.7k s.sh | Apache-2.0 | 2026-11-11 | 4 | 3 | 4 | 5 | 5 | 4 | 36 |
| 7 | mantis (Google) | google/mantis | 2.8k | 1.9k s.sh | Apache-2.0 | 2026-11-10 | 5 | 3 | 2 | 5 | 5 | 2 | 35 |
| 8 | security-review (Sentry) | getsentry/skills | 1.1k | 23k s.sh | Apache-2.0 | 2026-11-05 | 4 | 3 | 4 | 5 | 5 | 3 | 35 |
| 9 | snyk agent-scan | snyk/agent-scan | 3.2k | n/a | Apache-2.0 | 2026-11-09 | 4 | 3 | 2 | 5 | 5 | 5 | 35 |
| 10 | /cso (gstack) | garrytan/gstack | 141k | 446 s.sh | MIT | 2026-11-10 | 4 | 3 | 5 | 5 | 4 | 2 | 34 |
| 11 | security-and-hardening | addyosmani/agent-skills | 115k | 82k s.sh | MIT | 2026-11-01 | 4 | 3 | 4 | 5 | 5 | 2 | 34 |
| 12 | stride-analysis-patterns (wshobson) | wshobson/agents | 42k | 22k s.sh | MIT | 2026-11-08 | 3 | 3 | 4 | 5 | 5 | 5 | 34 |
| 13 | AgentShield | affaan-m/agentshield | 1.4k | n/a | MIT | 2026-09-10 | 4 | 3 | 2 | 3 | 5 | 5 | 33 |
| 14 | skill-scanner (Sentry) | getsentry/skills | 1.1k | 4.1k s.sh | Apache-2.0 | 2026-11-05 | 4 | 2 | 3 | 5 | 5 | 3 | 32 |
| 15 | claude-code-security-review (Action) | anthropics/claude-code-security-review | 6.8k | n/a | MIT | 2026-02-11 | 3 | 4 | 3 | 1 | 5 | 5 | 31 |
| 16 | Semgrep plugin | semgrep/guardian | 21 | 20k plugin | none | 2026-11-05 | 3 | 3 | 3 | 5 | 3 | 4 | 30 |
| 17 | security-review (ECC) | affaan-m/ECC | 301k | 7.7k s.sh | MIT | 2026-11-06 | 3 | 2 | 5 | 5 | 4 | 3 | 30 |
| 18 | VulnHunter (Capital One) | capitalone/VulnHunter | 1.2k | 8 s.sh | Apache-2.0 | 2026-10-07 | 4 | 2 | 2 | 4 | 5 | 2 | 29 |
| 19 | Aikido plugin | AikidoSec/aikido-claude-plugin | 15 | 7.3k plugin | none | 2026-11-05 | 3 | 2 | 3 | 5 | 3 | 4 | 28 |
| 20 | gryph | safedep/gryph | 182 | n/a | Apache-2.0 | 2026-11-10 | 3 | 1 | 1 | 5 | 5 | 5 | 27 |
| 21 | api-security-best-practices (sickn33) | sickn33/agentic-awesome-skills | 50k | 8.9k s.sh | MIT | 2026-11-11 | 2 | 2 | 4 | 5 | 5 | 3 | 27 |
| 22 | parry-guard | vaporif/parry-guard | 45 | n/a | MIT | 2026-10-20 | 3 | 1 | 0 | 4 | 5 | 5 | 25 |
| – | CC Safety Net | kenryu42/cc-safety-net | 2.0k | 33 s.sh | MIT | 2026-11-11 | 5 | 2 | 2 | 5 | 5 | 5 | not ranked: Ranked in 01 |
| – | supply-chain-risk-auditor (Trail of Bits) | trailofbits/skills | 8.1k | 9.1k s.sh | CC BY-SA 4.0 | 2026-11-06 | 5 | 3 | 3 | 5 | 2 | 4 | not ranked: Counted under Trail of Bits |
| – | Trail of Bits claude-code-config | trailofbits/claude-code-config | 2.1k | n/a | none | 2026-08-24 | 4 | 3 | 2 | 3 | 3 | 5 | not ranked: Ranked in 01 |

## 10 · Design & UI

File: [10-design-ui.md](10-design-ui.md). 25 candidates (24 ranked). Adoption scale: log10 2.45 → 0, 6.15 → 5.

### Changes vs previous list
- **frontend-design #1 → #7**: most installed, but guidance without a check.
- **Verified:** web-design-guidelines (previously "?") is MIT, 849k installs; it fetches its rules from a remote URL every run (fit 3/5).
- **Added:** Emil Kowalski skills, ibelick ui-skills, shadcn skill.
- **Dropped:** Superdesign (978★), addyosmani frontend-ui-engineering (#12), playground (#13).

### Score sheet
| Rank | Candidate | Repo | ★ | Installs | Licence | Last commit | S×3 | E×2 | A | M | F | C | Total |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | web-design-guidelines (Vercel) | vercel-labs/agent-skills | 34k | 849k s.sh | MIT | 2026-10-27 | 4 | 4 | 5 | 4 | 3 | 5 | 37 |
| 2 | Impeccable | pbakaus/impeccable | 108k | 400k s.sh | Apache-2.0 | 2026-11-11 | 4 | 4 | 4 | 5 | 5 | 3 | 37 |
| 3 | Taste Skill | Leonxlnx/taste-skill | 113k | 762k s.sh | MIT | 2026-11-07 | 5 | 3 | 5 | 5 | 4 | 1 | 36 |
| 4 | Emil Kowalski skills | emilkowalski/skills | 56k | 438k s.sh | MIT | 2026-11-09 | 4 | 4 | 4 | 5 | 5 | 2 | 36 |
| 5 | ui-skills (ibelick) | ibelick/ui-skills | 11k | 26k s.sh | MIT | 2026-11-11 | 4 | 3 | 3 | 5 | 5 | 5 | 36 |
| 6 | design-consultation, -shotgun, -review, -html (gstack) | garrytan/gstack | 141k | 592 s.sh | MIT | 2026-11-10 | 5 | 3 | 4 | 5 | 4 | 1 | 35 |
| 7 | frontend-design | anthropics/skills | 192k | 1.1M plugin | Apache-2.0 | 2026-11-06 | 3 | 4 | 5 | 5 | 5 | 3 | 35 |
| 8 | web-artifacts-builder | anthropics/skills | 192k | 118k s.sh | Apache-2.0 | 2026-11-06 | 3 | 3 | 4 | 5 | 5 | 5 | 34 |
| 9 | UI UX Pro Max | nextlevelbuilder/ui-ux-pro-max-skill | 148k | 446k s.sh | MIT | 2026-11-10 | 3 | 4 | 4 | 5 | 5 | 2 | 33 |
| 10 | shadcn skill | shadcn-ui/ui | 128k | 144k s.sh | MIT | 2026-11-11 | 3 | 4 | 4 | 5 | 5 | 2 | 33 |
| 11 | accessibility (web-quality-skills) | addyosmani/web-quality-skills | 3.1k | 69k s.sh | MIT | 2026-08-24 | 4 | 3 | 3 | 3 | 5 | 3 | 32 |
| 12 | frontend-ui-engineering | addyosmani/agent-skills | 115k | 79k s.sh | MIT | 2026-11-01 | 3 | 3 | 4 | 5 | 5 | 3 | 32 |
| 13 | playground (official) | anthropics/claude-plugins-official | 47k | 64k plugin | Apache-2.0 | 2026-11-10 | 3 | 3 | 3 | 5 | 5 | 4 | 32 |
| 14 | Figma plugin | figma/mcp-server-guide | 2.2k | 168k plugin | none | 2026-11-09 | 3 | 4 | 4 | 5 | 3 | 2 | 31 |
| 15 | StyleSeed | bitjaru/styleseed | 1.0k | 864 s.sh | MIT | 2026-11-11 | 4 | 2 | 1 | 5 | 5 | 3 | 30 |
| 16 | visual-explainer | nicobailon/visual-explainer | 11k | n/a | MIT | 2026-11-05 | 3 | 3 | 2 | 5 | 5 | 3 | 30 |
| 17 | stitch-skills (design-md) | google-labs-code/stitch-skills | 8.7k | 66k s.sh | Apache-2.0 | 2026-08-17 | 3 | 3 | 3 | 3 | 5 | 3 | 29 |
| 18 | make-interfaces-feel-better (ECC) | affaan-m/ECC | 301k | 5.8k s.sh | MIT | 2026-11-06 | 3 | 2 | 4 | 5 | 4 | 3 | 29 |
| 19 | canvas-design / theme-factory / brand-guidelines | anthropics/skills | 192k | 131k s.sh | Apache-2.0 | 2026-11-06 | 2 | 3 | 4 | 5 | 5 | 3 | 29 |
| 20 | interface-design | Dammyjay93/interface-design | 6.0k | 33k s.sh | MIT | 2026-06-20 | 4 | 2 | 3 | 2 | 5 | 2 | 28 |
| 21 | ui-craft | educlopez/ui-craft | 450 | 1.6k s.sh | MIT | 2026-11-06 | 4 | 2 | 1 | 5 | 5 | 1 | 28 |
| 22 | tailwind-design-system (wshobson) | wshobson/agents | 42k | 73k s.sh | MIT | 2026-11-08 | 2 | 3 | 3 | 5 | 5 | 3 | 28 |
| 23 | extract-design-system | arvindrk/extract-design-system | 284 | n/a | MIT | 2026-06-19 | 3 | 1 | 0 | 2 | 5 | 5 | 23 |
| 24 | Superdesign | superdesigndev/superdesign-skill | 978 | n/a | MIT | 2026-08-21 | 3 | 1 | 1 | 3 | 5 | 2 | 22 |
| – | design-mobile-apps (designed-by-ai) | designed-by-ai/skills | 30 | 1.4M s.sh | MIT | 2026-10-05 | 1 | 0 | 5 | 4 | 5 | 3 | not ranked: Excluded: 1.4M installs on a 30★ repo and Snyk FAIL audit |

## 11 · Memory & context

File: [11-memory-context.md](11-memory-context.md). 25 candidates (22 ranked). Adoption scale: log10 3.31 → 0, 6.04 → 5.

### Changes vs previous list
- **Built-in memory #1 → #7** (no procedure of its own). **handoff + domain-modeling #8 → #1.**
- **Added:** MemPalace, beads, context-mode.
- **claude-mem #2 → #9**: 116k★ but 9.3k skills.sh installs and anonymous analytics on by default.
- **Dropped:** Supermemory (#17), claude-md-management (moved to 01), Basic Memory (AGPL-3.0).

### Score sheet
| Rank | Candidate | Repo | ★ | Installs | Licence | Last commit | S×3 | E×2 | A | M | F | C | Total |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | handoff + domain-modeling (GLOSSARY, ADRs) | mattpocock/skills | 321k | 1.1M s.sh | MIT | 2026-10-31 | 4 | 4 | 5 | 5 | 5 | 5 | 40 |
| 2 | Context7 | upstash/context7 | 65k | 418k plugin | MIT | 2026-11-11 | 4 | 4 | 4 | 5 | 5 | 4 | 38 |
| 3 | MemPalace | MemPalace/mempalace | 61k | 2.3k s.sh | MIT | 2026-11-11 | 4 | 4 | 3 | 5 | 5 | 3 | 36 |
| 4 | Hindsight | vectorize-io/hindsight | 60k | 9.6k s.sh | MIT | 2026-11-11 | 4 | 4 | 3 | 5 | 4 | 3 | 35 |
| 5 | agentmemory | rohitg00/agentmemory | 30k | 15k s.sh | Apache-2.0 | 2026-11-11 | 4 | 4 | 2 | 5 | 5 | 3 | 35 |
| 6 | beads | gastownhall/beads | 29k | 2.2k s.sh | MIT | 2026-11-10 | 4 | 3 | 2 | 5 | 5 | 4 | 34 |
| 7 | Built-in CLAUDE.md + auto memory | built-in | n/a | built-in | n/a (built-in) | built-in | 3 | 4 | 3 | 5 | 5 | 4 | 34 |
| 8 | context-mode | mksglu/context-mode | 34k | 3.0k s.sh | ELv2 | 2026-11-11 | 4 | 4 | 2 | 5 | 2 | 4 | 33 |
| 9 | claude-mem | thedotmack/claude-mem | 116k | 9.3k s.sh | Apache-2.0 | 2026-11-11 | 4 | 3 | 3 | 5 | 4 | 3 | 33 |
| 10 | Mem0 | mem0ai/mem0 | 69k | 2.3k s.sh | Apache-2.0 | 2026-11-06 | 3 | 4 | 3 | 5 | 4 | 3 | 32 |
| 11 | obsidian-skills (kepano) | kepano/obsidian-skills | 52k | 96k s.sh | MIT | 2026-09-15 | 3 | 4 | 3 | 3 | 5 | 4 | 32 |
| 12 | caveman-compress | JuliusBrussee/caveman | 119k | 431k s.sh | Apache-2.0 | 2026-11-09 | 3 | 3 | 4 | 5 | 4 | 4 | 32 |
| 13 | context-engineering (addy) | addyosmani/agent-skills | 115k | 72k s.sh | MIT | 2026-11-01 | 3 | 3 | 3 | 5 | 5 | 3 | 31 |
| 14 | strategic-compact / context-budget (ECC) | affaan-m/ECC | 301k | 6.2k s.sh | MIT | 2026-11-06 | 3 | 2 | 4 | 5 | 4 | 4 | 30 |
| 15 | Serena | oraios/serena | 31k | 89k plugin | GPL-3.0+ (core) | 2026-11-09 | 3 | 4 | 3 | 5 | 2 | 2 | 29 |
| 16 | claude-remember | Digital-Process-Tools/claude-remember | 209 | 51k plugin | DPT Community | 2026-11-07 | 3 | 3 | 3 | 5 | 2 | 4 | 29 |
| 17 | Supermemory | supermemoryai/supermemory | 32k | n/a | MIT | 2026-11-11 | 3 | 3 | 2 | 5 | 4 | 3 | 29 |
| 18 | claude-context (Zilliz) | zilliztech/claude-context | 13k | n/a | MIT | 2026-11-11 | 3 | 3 | 1 | 5 | 4 | 4 | 29 |
| 19 | claude-code-tools (session-search, recover-context) | pchalasani/claude-code-tools | 2.0k | 49 s.sh | MIT | 2026-11-10 | 3 | 2 | 0 | 5 | 5 | 4 | 27 |
| 20 | Basic Memory | basicmachines-co/basic-memory | 4.5k | 1.5k s.sh | AGPL-3.0 | 2026-11-11 | 3 | 2 | 1 | 5 | 2 | 3 | 24 |
| 21 | session-handoff (softaworks) | softaworks/agent-toolkit | 2.7k | 4.2k s.sh | MIT | 2026-03-05 | 3 | 2 | 1 | 1 | 5 | 4 | 24 |
| 22 | mcp_agent_mail | Dicklesworthstone/mcp_agent_mail | 2.2k | n/a | MIT + anti-AI-vendor rider | 2026-11-01 | 3 | 2 | 0 | 5 | 1 | 3 | 22 |
| – | claude-md-management (official) | anthropics/claude-plugins-official | 47k | 287k plugin | Apache-2.0 | 2026-11-10 | 4 | 4 | 4 | 5 | 5 | 4 | not ranked: Ranked in 01 |
| – | mem0 plugin skills | mem0ai/mem0 | 69k | 819 s.sh | Apache-2.0 | 2026-11-06 | 3 | 2 | 3 | 5 | 4 | 3 | not ranked: Duplicate of Mem0 entry |
| – | hindsight-docs skill | vectorize-io/hindsight | 60k | 9.6k s.sh | MIT | 2026-11-11 | 2 | 2 | 3 | 5 | 4 | 4 | not ranked: Duplicate |

## 12 · Docs & writing

File: [12-docs-writing.md](12-docs-writing.md). 25 candidates (25 ranked). Adoption scale: log10 1.70 → 0, 5.74 → 5.

### Changes vs previous list
- **docx/pdf/pptx/xlsx #3 → #1.** **Humanizer #1 → #9** (32 KB; 12.7k skills.sh installs vs 67.8k★).
- **Added:** avoid-ai-writing (only writing skill with dated eval calibration), copy-editing, writing-beats, Vercel writing-guidelines.
- **Dropped:** declauding, humanizer-skill, better-writing (all under 400★ and 15–39 KB), /make-pdf + /diagram (#14).

### Score sheet
| Rank | Candidate | Repo | ★ | Installs | Licence | Last commit | S×3 | E×2 | A | M | F | C | Total |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | docx / pdf / pptx / xlsx | anthropics/skills | 192k | 253k s.sh | Apache-2.0 | 2026-11-06 | 4 | 4 | 5 | 5 | 5 | 2 | 37 |
| 2 | writing-for-agents | mattpocock/skills | 321k | 546k s.sh | MIT | 2026-10-31 | 4 | 3 | 5 | 5 | 5 | 3 | 36 |
| 3 | avoid-ai-writing | conorbronsdon/avoid-ai-writing | 5.6k | 5.1k s.sh | MIT | 2026-11-05 | 5 | 3 | 3 | 5 | 5 | 1 | 35 |
| 4 | unslop + technical-writing (pstack) | cursor/plugins | 16k | 35k s.sh | MIT (pstack) | 2026-11-11 | 4 | 3 | 4 | 5 | 4 | 4 | 35 |
| 5 | doc-coauthoring | anthropics/skills | 192k | 100k s.sh | Apache-2.0 | 2026-11-06 | 4 | 3 | 4 | 5 | 5 | 2 | 34 |
| 6 | copy-editing (marketingskills) | coreyhaines31/marketingskills | 60k | 160k s.sh | MIT | 2026-11-11 | 3 | 4 | 4 | 5 | 5 | 3 | 34 |
| 7 | writing-beats / writing-shape (mattpocock) | mattpocock/skills | 321k | 535k s.sh | MIT | 2026-10-31 | 3 | 3 | 5 | 5 | 5 | 4 | 34 |
| 8 | /document-release + /document-generate (gstack) | garrytan/gstack | 141k | 414 s.sh | MIT | 2026-11-10 | 4 | 3 | 4 | 5 | 4 | 2 | 33 |
| 9 | Humanizer | blader/humanizer | 68k | 13k s.sh | MIT | 2026-11-09 | 4 | 3 | 4 | 5 | 5 | 1 | 33 |
| 10 | writing-guidelines (Vercel) | vercel-labs/agent-skills | 34k | 124k s.sh | MIT | 2026-10-27 | 3 | 4 | 4 | 4 | 3 | 5 | 33 |
| 11 | documentation-and-adrs | addyosmani/agent-skills | 115k | 74k s.sh | MIT | 2026-11-01 | 3 | 3 | 4 | 5 | 5 | 3 | 32 |
| 12 | visual-explainer | nicobailon/visual-explainer | 11k | n/a | MIT | 2026-11-05 | 3 | 3 | 3 | 5 | 5 | 3 | 31 |
| 13 | internal-comms | anthropics/skills | 192k | n/a | Apache-2.0 | 2026-11-06 | 2 | 3 | 4 | 5 | 5 | 5 | 31 |
| 14 | make-pdf + diagram (gstack) | garrytan/gstack | 141k | 344 s.sh | MIT | 2026-11-10 | 3 | 3 | 4 | 5 | 4 | 2 | 30 |
| 15 | Mintlify plugin | mintlify/mintlify-claude-plugin | 7 | 6.9k plugin | MIT | 2026-11-07 | 3 | 2 | 3 | 5 | 5 | 4 | 30 |
| 16 | stop-slop | hardikpandya/stop-slop | 19k | n/a | MIT | 2026-03-18 | 3 | 3 | 3 | 1 | 5 | 5 | 29 |
| 17 | declauding | oaustegard/claude-skills | 313 | n/a | MIT | 2026-11-11 | 4 | 1 | 1 | 5 | 5 | 2 | 27 |
| 18 | article-writing (ECC) | affaan-m/ECC | 301k | 6.4k s.sh | MIT | 2026-11-06 | 2 | 2 | 5 | 5 | 4 | 3 | 27 |
| 19 | crafting-effective-readmes | softaworks/agent-toolkit | 2.7k | 4.2k s.sh | MIT | 2026-03-05 | 3 | 2 | 2 | 1 | 5 | 5 | 26 |
| 20 | diataxis-writer | tronghieu/agent-skills | 105 | 120 s.sh | MIT | 2026-10-31 | 3 | 1 | 0 | 5 | 5 | 3 | 24 |
| 21 | sciwrite (scientific-writing-skills) | dvdsosa/scientific-writing-skills | 33 | 50 s.sh | MIT | 2026-11-08 | 3 | 1 | 0 | 5 | 5 | 3 | 24 |
| 22 | humanizer (softaworks) | softaworks/agent-toolkit | 2.7k | 4.5k s.sh | MIT | 2026-03-05 | 3 | 2 | 2 | 1 | 5 | 2 | 23 |
| 23 | better-writing | forjd/better-writing | 56 | n/a | MIT | 2026-11-01 | 3 | 1 | 0 | 5 | 5 | 2 | 23 |
| 24 | humanizer-skill (Aboudjem) | Aboudjem/humanizer-skill | 307 | n/a | MIT | 2026-09-06 | 3 | 1 | 1 | 3 | 5 | 1 | 21 |
| 25 | elements-of-style | obra/the-elements-of-style | 624 | n/a | Public domain | 2026-08-12 | 2 | 2 | 1 | 2 | 5 | 2 | 20 |

## 13 · Git, PR & shipping

File: [13-git-ship.md](13-git-ship.md). 25 candidates (24 ranked). Adoption scale: log10 3.64 → 0, 5.74 → 5.

### Changes vs previous list
- **gstack /ship #1 → #5** (61 KB). **superpowers finishing-a-development-branch #3 → #1.**
- **Added:** resolving-merge-conflicts (551k installs), shipping-and-launch, ce-commit-push-pr, deploy-to-vercel, GitHub MCP.
- **Verified:** changelog-generator source is ComposioHQ/awesome-claude-skills (scored #19).
- **Dropped:** /canary (#12), /modernize (#15), worktree-cleanup (#16).

### Score sheet
| Rank | Candidate | Repo | ★ | Installs | Licence | Last commit | S×3 | E×2 | A | M | F | C | Total |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | finishing-a-development-branch + using-git-worktrees | obra/superpowers | 316k | 229k s.sh | MIT | 2026-11-03 | 4 | 5 | 4 | 5 | 5 | 3 | 39 |
| 2 | resolving-merge-conflicts | mattpocock/skills | 321k | 551k s.sh | MIT | 2026-10-31 | 4 | 3 | 5 | 5 | 5 | 5 | 38 |
| 3 | pr | mattpocock/skills | 321k | 240k s.sh | MIT | 2026-10-31 | 4 | 3 | 4 | 5 | 5 | 4 | 36 |
| 4 | commit-commands (official) | anthropics/claude-plugins-official | 47k | 171k plugin | Apache-2.0 | 2026-11-10 | 3 | 4 | 4 | 5 | 5 | 5 | 36 |
| 5 | /ship + /land-and-deploy (gstack) | garrytan/gstack | 141k | 440 s.sh | MIT | 2026-11-10 | 5 | 3 | 4 | 5 | 4 | 1 | 35 |
| 6 | opening-a-pr, babysit, shipping (pstack) | cursor/plugins | 16k | 5.1k s.sh | MIT (pstack) | 2026-11-11 | 5 | 3 | 1 | 5 | 4 | 3 | 34 |
| 7 | shipping-and-launch | addyosmani/agent-skills | 115k | 68k s.sh | MIT | 2026-11-01 | 4 | 3 | 3 | 5 | 5 | 3 | 34 |
| 8 | ce-commit-push-pr | EveryInc/compound-engineering-plugin | 26k | 3.5k s.sh | MIT | 2026-11-11 | 4 | 3 | 2 | 5 | 5 | 4 | 34 |
| 9 | deploy-to-vercel | vercel-labs/agent-skills | 34k | 189k s.sh | MIT | 2026-10-27 | 3 | 4 | 4 | 4 | 5 | 4 | 34 |
| 10 | GitHub MCP (official plugin) | github/github-mcp-server | 34k | 319k plugin | MIT | 2026-11-09 | 3 | 4 | 4 | 5 | 5 | 2 | 33 |
| 11 | claude-code-action | anthropics/claude-code-action | 9.9k | n/a | MIT | 2026-11-10 | 3 | 4 | 1 | 5 | 5 | 5 | 33 |
| 12 | /canary (gstack) | garrytan/gstack | 141k | 392 s.sh | MIT | 2026-11-10 | 4 | 3 | 4 | 5 | 4 | 1 | 32 |
| 13 | iterate-pr + commit + pr-writer (Sentry) | getsentry/skills | 1.1k | 4.7k s.sh | Apache-2.0 | 2026-11-05 | 4 | 3 | 0 | 5 | 5 | 4 | 32 |
| 14 | /modernize (gstack) | garrytan/gstack | 141k | 19 s.sh | MIT | 2026-11-10 | 4 | 2 | 4 | 5 | 4 | 3 | 32 |
| 15 | loop-on-ci / fix-ci (cursor-team-kit) | cursor/plugins | 16k | 2.3k s.sh | MIT (pstack) | 2026-11-11 | 4 | 2 | 1 | 5 | 5 | 5 | 32 |
| 16 | worktree-cleanup (pstack) | cursor/plugins | 16k | n/a | MIT (pstack) | 2026-11-11 | 4 | 2 | 1 | 5 | 4 | 5 | 31 |
| 17 | git-workflow-and-versioning + ci-cd-and-automation | addyosmani/agent-skills | 115k | 70k s.sh | MIT | 2026-11-01 | 3 | 3 | 3 | 5 | 5 | 3 | 31 |
| 18 | caveman-commit | JuliusBrussee/caveman | 119k | 433k s.sh | Apache-2.0 | 2026-11-09 | 2 | 3 | 5 | 5 | 4 | 5 | 31 |
| 19 | changelog-generator | ComposioHQ/awesome-claude-skills | 79k | 7.7k s.sh | Apache-2.0 | 2026-07-24 | 3 | 2 | 3 | 2 | 5 | 5 | 28 |
| 20 | changelog-automation (wshobson) | wshobson/agents | 42k | 14k s.sh | MIT | 2026-11-08 | 2 | 3 | 2 | 5 | 5 | 3 | 27 |
| 21 | git-advanced-workflows (wshobson) | wshobson/agents | 42k | 20k s.sh | MIT | 2026-11-08 | 2 | 3 | 2 | 5 | 5 | 3 | 27 |
| 22 | github-ops (ECC) | affaan-m/ECC | 301k | 5.7k s.sh | MIT | 2026-11-06 | 2 | 2 | 4 | 5 | 4 | 3 | 26 |
| 23 | release (oh-my-claudecode) | Yeachan-Heo/oh-my-claudecode | 41k | 888 s.sh | MIT | 2026-11-11 | 2 | 2 | 2 | 5 | 5 | 3 | 25 |
| 24 | create-branch (Sentry) | getsentry/skills | 1.1k | 4.4k s.sh | Apache-2.0 | 2026-11-05 | 2 | 2 | 0 | 5 | 5 | 5 | 25 |
| – | git-guardrails-claude-code | mattpocock/skills | 321k | 553k s.sh | MIT | 2026-10-31 | 4 | 3 | 5 | 5 | 5 | 5 | not ranked: Ranked in 01 |

## 14 · Autonomous loops & multi-agent

File: [14-autonomous-multiagent.md](14-autonomous-multiagent.md). 25 candidates (25 ranked). Adoption scale: log10 2.75 → 0, 5.55 → 5.

### Changes vs previous list
- **Built-in #1 → #2**; **superpowers dispatching-parallel-agents + subagent-driven-development** is new at #1.
- **Added:** Orca, lfg (Every).
- **Dropped:** Ruflo (#17, 289 skills, context 1/5), Vibe Kanban (#12), Claude Squad (AGPL-3.0), Gas Town now #8.

### Score sheet
| Rank | Candidate | Repo | ★ | Installs | Licence | Last commit | S×3 | E×2 | A | M | F | C | Total |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | dispatching-parallel-agents + subagent-driven-development | obra/superpowers | 316k | 233k s.sh | MIT | 2026-11-03 | 4 | 5 | 5 | 5 | 5 | 4 | 41 |
| 2 | Built-in subagents, agent teams, worktrees, Workflows, /loop | built-in | n/a | built-in | n/a (built-in) | built-in | 4 | 4 | 4 | 5 | 5 | 5 | 39 |
| 3 | ralph-loop (official) | anthropics/claude-plugins-official | 47k | 197k plugin | Apache-2.0 | 2026-11-10 | 3 | 4 | 5 | 5 | 5 | 5 | 37 |
| 4 | autoresearch | karpathy/autoresearch | 100k | n/a | MIT | 2026-03-25 | 5 | 4 | 4 | 1 | 4 | 4 | 36 |
| 5 | autonomous-run, orchestrate, autopilot, swarm, arena, show-me-your-work (pstack) | cursor/plugins | 16k | 5.0k s.sh | MIT (pstack) | 2026-11-11 | 5 | 3 | 3 | 5 | 4 | 3 | 36 |
| 6 | Orca | stablyai/orca | 122k | 358k s.sh | MIT | 2026-11-11 | 3 | 4 | 5 | 5 | 4 | 5 | 36 |
| 7 | lfg (EveryInc) | EveryInc/compound-engineering-plugin | 26k | 3.6k s.sh | MIT | 2026-11-11 | 4 | 3 | 3 | 5 | 5 | 4 | 35 |
| 8 | Gas Town | gastownhall/gastown | 19k | 12 s.sh | MIT | 2026-11-10 | 4 | 3 | 3 | 5 | 5 | 3 | 34 |
| 9 | ralph-claude-code | frankbria/ralph-claude-code | 9.7k | n/a | MIT | 2026-11-04 | 4 | 3 | 2 | 5 | 5 | 4 | 34 |
| 10 | oh-my-claudecode (team, autopilot, ralph) | Yeachan-Heo/oh-my-claudecode | 41k | 1.3k s.sh | MIT | 2026-11-11 | 4 | 3 | 3 | 5 | 5 | 1 | 32 |
| 11 | Paradev (superset) | ParadevAI/Paradev | 16k | 13 s.sh | MIT | 2026-11-11 | 3 | 3 | 3 | 5 | 4 | 5 | 32 |
| 12 | Vibe Kanban | BloopAI/vibe-kanban | 29k | n/a | Apache-2.0 | 2026-11-11 | 3 | 3 | 3 | 5 | 4 | 5 | 32 |
| 13 | snarktank/ralph | snarktank/ralph | 22k | 1.5k s.sh | MIT | 2026-02-02 | 4 | 3 | 3 | 1 | 5 | 4 | 31 |
| 14 | runaway-stopper (gstack) | garrytan/gstack | 141k | 10 s.sh | MIT | 2026-11-10 | 4 | 2 | 4 | 5 | 4 | 2 | 31 |
| 15 | ralph-orchestrator | mikeyobrien/ralph-orchestrator | 3.2k | 154 s.sh | MIT | 2026-11-06 | 4 | 2 | 1 | 5 | 5 | 4 | 31 |
| 16 | wshobson agent-teams | wshobson/agents | 42k | n/a | MIT | 2026-11-08 | 3 | 3 | 3 | 5 | 5 | 3 | 31 |
| 17 | Ruflo | ruvnet/ruflo | 81k | 745 s.sh | MIT | 2026-11-11 | 3 | 3 | 4 | 5 | 5 | 1 | 30 |
| 18 | autonomous-loops / continuous-agent-loop (ECC) | affaan-m/ECC | 301k | 5.7k s.sh | MIT | 2026-11-06 | 3 | 2 | 5 | 5 | 4 | 3 | 30 |
| 19 | ralph-tui | subsy/ralph-tui | 2.5k | 1.3k s.sh | MIT | 2026-11-04 | 3 | 2 | 1 | 5 | 5 | 3 | 27 |
| 20 | mcp_agent_mail | Dicklesworthstone/mcp_agent_mail | 2.2k | n/a | MIT + anti-AI-vendor rider | 2026-11-01 | 4 | 2 | 1 | 5 | 1 | 3 | 26 |
| 21 | The Ralph Playbook | ClaytonFarr/ralph-playbook | 1.0k | n/a | MIT | 2026-03-06 | 4 | 2 | 0 | 1 | 5 | 4 | 26 |
| 22 | how-to-ralph-wiggum | ghuntley/how-to-ralph-wiggum | 1.8k | n/a | none | 2026-01-11 | 3 | 3 | 1 | 1 | 2 | 5 | 24 |
| 23 | claude-code-harness (breezing) | Chachamaru127/claude-code-harness | 3.2k | 39 s.sh | MIT | 2026-11-11 | 3 | 1 | 1 | 5 | 5 | 2 | 24 |
| 24 | Claude Squad | smtg-ai/claude-squad | 8.8k | n/a | AGPL-3.0 | 2026-08-20 | 2 | 3 | 2 | 3 | 2 | 5 | 24 |
| 25 | multiclaude | dlorenc/multiclaude | 567 | n/a | MIT | 2026-01-28 | 3 | 1 | 0 | 1 | 5 | 5 | 22 |

## 15 · Skill authoring & meta

File: [15-skill-authoring.md](15-skill-authoring.md). 28 candidates (28 ranked). Adoption scale: log10 1.26 → 0, 6.63 → 5.

### Changes vs previous list
- **writing-skills #2 → #1** and **skill-creator #1 → #2** (both substance 5 / evidence 5; skill-creator loses on its 33 KB size).
- **Added:** mcp-builder, retro, find-skills, built-in plugin validate/eval, writing-great-skills.
- **Dropped:** /write-skill (#13), claude-code-setup (#12), plugin-eval (#15).

### Score sheet
| Rank | Candidate | Repo | ★ | Installs | Licence | Last commit | S×3 | E×2 | A | M | F | C | Total |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | writing-skills | obra/superpowers | 316k | 233k s.sh | MIT | 2026-11-03 | 5 | 5 | 4 | 5 | 5 | 2 | 41 |
| 2 | skill-creator | anthropics/skills | 192k | 429k s.sh | Apache-2.0 | 2026-11-06 | 5 | 5 | 4 | 5 | 5 | 1 | 40 |
| 3 | authoring-a-skill + eval + create-verification-skill (pstack) | cursor/plugins | 16k | 5.2k s.sh | MIT (pstack) | 2026-11-11 | 5 | 3 | 3 | 5 | 4 | 4 | 37 |
| 4 | mcp-builder | anthropics/skills | 192k | 140k s.sh | Apache-2.0 | 2026-11-06 | 4 | 4 | 4 | 5 | 5 | 3 | 37 |
| 5 | hookify (official) | anthropics/claude-plugins-official | 47k | 60k plugin | Apache-2.0 | 2026-11-10 | 4 | 4 | 3 | 5 | 5 | 4 | 37 |
| 6 | retro | mattpocock/skills | 321k | 350k s.sh | MIT | 2026-10-31 | 4 | 3 | 4 | 5 | 5 | 4 | 36 |
| 7 | find-skills | vercel-labs/skills | 39k | 4.3M s.sh | MIT | 2026-11-10 | 3 | 4 | 5 | 5 | 5 | 4 | 36 |
| 8 | Built-in claude plugin validate / eval | built-in | n/a | built-in | n/a (built-in) | built-in | 3 | 4 | 4 | 5 | 5 | 5 | 36 |
| 9 | plugin-dev (official) | anthropics/claude-plugins-official | 47k | 68k plugin | Apache-2.0 | 2026-11-10 | 4 | 4 | 3 | 5 | 5 | 2 | 35 |
| 10 | writing-great-skills + writing-for-agents | mattpocock/skills | 321k | 307k s.sh | MIT | 2026-10-31 | 4 | 3 | 4 | 5 | 5 | 3 | 35 |
| 11 | SkillSpector (NVIDIA) | NVIDIA/SkillSpector | 25k | 1.7k s.sh | Apache-2.0 | 2026-11-11 | 4 | 3 | 3 | 5 | 5 | 4 | 35 |
| 12 | claude-code-setup (official) | anthropics/claude-plugins-official | 47k | 195k plugin | Apache-2.0 | 2026-11-10 | 3 | 4 | 4 | 5 | 5 | 4 | 35 |
| 13 | /write-skill (gstack) | garrytan/gstack | 141k | 18 s.sh | MIT | 2026-11-10 | 4 | 3 | 4 | 5 | 4 | 3 | 34 |
| 14 | correct + automate-me (pstack) | cursor/plugins | 16k | 4.3k s.sh | MIT (pstack) | 2026-11-11 | 4 | 3 | 3 | 5 | 4 | 4 | 34 |
| 15 | plugin-eval (wshobson) | wshobson/agents | 42k | n/a | MIT | 2026-11-08 | 4 | 2 | 3 | 5 | 5 | 5 | 34 |
| 16 | agnix | agent-sh/agnix | 477 | n/a | Apache-2.0 | 2026-11-11 | 4 | 2 | 1 | 5 | 5 | 5 | 32 |
| 17 | mcp-server-dev (official) | anthropics/claude-plugins-official | 47k | 34k plugin | Apache-2.0 | 2026-11-10 | 3 | 3 | 3 | 5 | 5 | 4 | 32 |
| 18 | session-report (official) | anthropics/claude-plugins-official | 47k | 12k plugin | Apache-2.0 | 2026-11-10 | 3 | 3 | 3 | 5 | 5 | 4 | 32 |
| 19 | skill-scanner (Sentry) | getsentry/skills | 1.1k | 4.1k s.sh | Apache-2.0 | 2026-11-05 | 4 | 2 | 2 | 5 | 5 | 3 | 31 |
| 20 | Skill_Seekers | yusufkaraaslan/Skill_Seekers | 15k | 498 s.sh | MIT | 2026-09-30 | 3 | 3 | 3 | 4 | 5 | 4 | 31 |
| 21 | skillify (gstack) | garrytan/gstack | 141k | 321 s.sh | MIT | 2026-11-10 | 3 | 3 | 4 | 5 | 4 | 2 | 30 |
| 22 | skill-developer + auto-activation hook (diet103) | diet103/claude-code-infrastructure-showcase | 10k | 52 s.sh | MIT | 2026-07-11 | 4 | 2 | 3 | 2 | 5 | 3 | 29 |
| 23 | skill-stocktake / skill-comply (ECC) | affaan-m/ECC | 301k | 5.6k s.sh | MIT | 2026-11-06 | 3 | 2 | 4 | 5 | 4 | 3 | 29 |
| 24 | create-agent-skills (TÂCHES) | glittercowboy/taches-cc-resources | 2.0k | 507 s.sh | MIT | 2026-04-01 | 3 | 2 | 2 | 1 | 5 | 4 | 25 |
| 25 | SkillCheck-Free | olgasafonova/SkillCheck-Free | 42 | n/a | MIT | 2026-10-11 | 3 | 1 | 0 | 4 | 5 | 5 | 25 |
| 26 | schliff | Zandereins/schliff | 18 | n/a | MIT | 2026-10-21 | 3 | 1 | 0 | 4 | 5 | 5 | 25 |
| 27 | agent-skill-creator | FrancyJGLisboa/agent-skills-platform | 2.4k | 629 s.sh | MIT | 2026-09-15 | 3 | 2 | 2 | 3 | 5 | 1 | 24 |
| 28 | skill-judge (softaworks) | softaworks/agent-toolkit | 2.7k | 4.3k s.sh | MIT | 2026-03-05 | 3 | 2 | 2 | 1 | 5 | 1 | 22 |

## 16 · Business, growth & research

File: [16-business-research.md](16-business-research.md). 25 candidates (23 ranked). Adoption scale: log10 2.59 → 0, 5.90 → 5.

### Changes vs previous list
- **Marketing Skills stays #1.** **last30days #2 → #10**: asks for X session cookies, skills.sh Gen Agent Trust Hub audit FAIL, 32 KB.
- **Added:** Anthropic financial-services and knowledge-work-plugins, Firecrawl plugin.
- **Dropped:** agentic-awesome-skills and Composio list (catalogues, not methods), borghei (Commons Clause).

### Score sheet
| Rank | Candidate | Repo | ★ | Installs | Licence | Last commit | S×3 | E×2 | A | M | F | C | Total |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Marketing Skills | coreyhaines31/marketingskills | 60k | 252k s.sh | MIT | 2026-11-11 | 4 | 4 | 4 | 5 | 5 | 2 | 36 |
| 2 | financial-services (Anthropic) | anthropics/financial-services | 41k | 3.6k s.sh | Apache-2.0 | 2026-10-28 | 4 | 4 | 3 | 5 | 5 | 3 | 36 |
| 3 | knowledge-work-plugins (Anthropic) | anthropics/knowledge-work-plugins | 35k | 14k s.sh | Apache-2.0 | 2026-11-10 | 4 | 4 | 3 | 5 | 5 | 3 | 36 |
| 4 | PM Skills | phuryn/pm-skills | 28k | 11k s.sh | MIT | 2026-11-08 | 4 | 3 | 3 | 5 | 5 | 4 | 35 |
| 5 | research | mattpocock/skills | 321k | 793k s.sh | MIT | 2026-10-31 | 3 | 3 | 5 | 5 | 5 | 5 | 35 |
| 6 | Scientific Agent Skills | K-Dense-AI/scientific-agent-skills | 57k | 2.6k s.sh | MIT | 2026-11-09 | 4 | 3 | 3 | 5 | 5 | 3 | 34 |
| 7 | Claude SEO | AgriciDaniel/claude-seo | 28k | 10k s.sh | MIT | 2026-11-10 | 4 | 3 | 3 | 5 | 5 | 2 | 33 |
| 8 | Firecrawl plugin | firecrawl/firecrawl-claude-plugin | 258 | 39k plugin | MIT | 2026-11-06 | 3 | 3 | 3 | 5 | 4 | 4 | 31 |
| 9 | claude-skills (alirezarezvani) | alirezarezvani/claude-skills | 30k | 2.4k s.sh | MIT | 2026-11-11 | 3 | 3 | 3 | 5 | 5 | 3 | 31 |
| 10 | last30days | mvanhorn/last30days-skill | 67k | 61k s.sh | MIT | 2026-11-11 | 4 | 3 | 3 | 5 | 3 | 1 | 30 |
| 11 | seo (web-quality-skills) | addyosmani/web-quality-skills | 3.1k | 55k s.sh | MIT | 2026-08-24 | 3 | 3 | 3 | 3 | 5 | 3 | 29 |
| 12 | Exa plugin | exa-labs/exa-mcp-server | 5.2k | 5.3k plugin | MIT | 2026-11-03 | 3 | 3 | 2 | 5 | 4 | 3 | 29 |
| 13 | market-research / deep-research (ECC) | affaan-m/ECC | 301k | 7.0k s.sh | MIT | 2026-11-06 | 3 | 2 | 4 | 5 | 4 | 3 | 29 |
| 14 | agentic-awesome-skills (sickn33) | sickn33/agentic-awesome-skills | 50k | 27k s.sh | MIT | 2026-11-11 | 2 | 3 | 3 | 5 | 5 | 3 | 28 |
| 15 | startup/market-sizing (wshobson) | wshobson/agents | 42k | 12k s.sh | MIT | 2026-11-08 | 2 | 3 | 3 | 5 | 5 | 3 | 28 |
| 16 | Product-Manager-Skills (deanpeters) | deanpeters/Product-Manager-Skills | 8.0k | 4.8k s.sh | CC BY-NC-SA 4.0 | 2026-10-16 | 4 | 3 | 2 | 4 | 2 | 1 | 27 |
| 17 | claude-deep-research-skill | 199-biotechnologies/claude-deep-research-skill | 1.2k | n/a | MIT | 2026-04-11 | 4 | 2 | 1 | 1 | 5 | 4 | 27 |
| 18 | geo-seo-claude | zubair-trabzada/geo-seo-claude | 12k | 1.4k s.sh | MIT | 2026-10-05 | 3 | 2 | 2 | 4 | 5 | 3 | 27 |
| 19 | Tavily skills | tavily-ai/skills | 490 | 403 plugin | MIT | 2026-11-09 | 3 | 2 | 0 | 5 | 4 | 4 | 26 |
| 20 | Deep-Research-skills (Weizhena) | Weizhena/Deep-Research-skills | 2.5k | 948 s.sh | MIT | 2026-08-23 | 3 | 2 | 1 | 3 | 5 | 3 | 25 |
| 21 | Awesome Claude Skills (Composio) | ComposioHQ/awesome-claude-skills | 79k | 10k s.sh | Apache-2.0 | 2026-07-24 | 2 | 3 | 3 | 2 | 5 | 3 | 25 |
| 22 | superseo-skills | inhouseseo/superseo-skills | 393 | 165 s.sh | Apache-2.0 | 2026-09-03 | 3 | 1 | 0 | 3 | 5 | 3 | 22 |
| 23 | Claude-Skills (borghei) | borghei/Claude-Skills | 1.1k | 4.9k s.sh | MIT + Commons Clause | 2026-11-08 | 2 | 2 | 2 | 5 | 2 | 3 | 22 |
| – | RigorPilot-Skills | lllllllama/RigorPilot-Skills | 486 | 495k s.sh | MIT | 2026-09-23 | 2 | 0 | 5 | 3 | 5 | 3 | not ranked: Excluded: ~495k installs per skill on a 486★ repo looks inflated |
| – | content-creation (knowledge-work marketing) | anthropics/knowledge-work-plugins | 35k | n/a | Apache-2.0 | 2026-11-10 | 3 | 3 | 3 | 5 | 5 | 3 | not ranked: Part of knowledge-work entry |
