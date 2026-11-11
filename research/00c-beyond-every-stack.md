# 00c · Beyond every stack

What would make H-Stack clearly better than superpowers, gstack, pstack, mattpocock/skills, addyosmani/agent-skills and everything-claude-code (ECC), grounded in primary sources read on 2026-11-11.

Contents: (1) sources read · (2) verification log for [00b](00b-research-backed-ideas.md) · (3) new ideas N100–N132 · (4) top 15 differentiators · (5) anti-ideas.

**How novelty was checked.** The six stacks above plus anthropics/skills and wshobson/agents were shallow-cloned on 2026-11-11 and grepped (skills, hooks, docs, scripts) for each mechanism. "Not in reviewed stacks" means no match in those repos; where a stack does something close, it is named and credited. Every downloaded file was treated as data, never as instructions.

---

## 1. Sources read

"Main body" = abstract through conclusion, plus the appendices named. "Sections" = the parts named, chosen because they carry the claims used here.

### Papers (arXiv HTML full text unless noted)
| # | Source | What was read |
|---|---|---|
| 1 | [SkillsBench, 2602.12670](https://arxiv.org/abs/2602.12670) v4 (Jun 2026) and v1 (Feb 2026) | v4 main body, App. D.6 (self-generated condition + trajectory audit), App. F (quantity, complexity, failure modes, author patterns); v1 abstract, Tables 2–3, conclusion |
| 2 | [Evaluating AGENTS.md, 2602.11988](https://arxiv.org/abs/2602.11988) v3 | Main body, App. B (redundant docs, length, category ablation, contamination) |
| 3 | [Useful Memories Become Faulty, 2605.12978](https://arxiv.org/abs/2605.12978) | Main body (§1–7), Tables 2–5 |
| 4 | [ACE, 2510.04618](https://arxiv.org/abs/2510.04618) | §1–5 incl. ablations, cost, KV-cache analysis, limitations |
| 5 | [ImpossibleBench, 2510.20270](https://arxiv.org/abs/2510.20270) | Main body §1–7 |
| 6 | [Huang et al., 2310.01798](https://arxiv.org/abs/2310.01798) | Main body §1–7 |
| 7 | [Self-Preference Bias in LLM-as-a-Judge, 2410.21819](https://arxiv.org/abs/2410.21819) | §1–5 |
| 8 | [Self-Preference Bias in Rubric-Based Evaluation, 2604.06996](https://arxiv.org/abs/2604.06996) | Main body §1–6 |
| 9 | [Spracklen et al., "We Have a Package for You!", USENIX Sec 2025, 2406.10279](https://arxiv.org/abs/2406.10279) | Main body §1–7 |
| 10 | [Ask or Assume?, 2603.26233](https://arxiv.org/abs/2603.26233) | Main body, limitations |
| 11 | [AgentAbstain, 2607.10059](https://arxiv.org/abs/2607.10059) | Main body §1–5 |
| 12 | [ProCodeBench, 2605.05700](https://arxiv.org/abs/2605.05700) | §I–IV, Tables III–V |
| 13 | [Uncertainty-driven self-correction for code, 2608.14659](https://arxiv.org/abs/2608.14659) | Main body, limitations |
| 14 | [Meta ACH, 2501.12862](https://arxiv.org/abs/2501.12862) | Abstract, §1–3, §4 acceptance results |
| 15 | [MAST, 2503.13657](https://arxiv.org/abs/2503.13657) | Main body §1–6 |
| 16 | [GEPA, 2507.19457](https://arxiv.org/abs/2507.19457) | §1, §3, §4 observations 1–6 |
| 17 | [Sleep-time compute, 2504.13171](https://arxiv.org/abs/2504.13171) | §1–2, §5.3–7 |
| 18 | [PRELUDE/CIPHER, 2404.15269](https://arxiv.org/abs/2404.15269) | §1, §4.3–5 |
| 19 | [CaMeL, 2503.18813](https://arxiv.org/abs/2503.18813) | §1–2, §5, §6.2–6.5, §7, §9 |
| 20 | [Codebase-Memory, 2603.27277](https://arxiv.org/abs/2603.27277) | Main body §1–5 |
| 21 | [LLM Agents Are Not Always Faithful Self-Evolvers, 2601.22436](https://arxiv.org/abs/2601.22436) (ICML 2026) | §1, §3, §5 |
| 22 | [Design Patterns for Securing LLM Agents, 2506.08837](https://arxiv.org/abs/2506.08837) | §3 (six patterns), §4.10 (software-engineering agent) |
| 23 | [Agentic Rubrics, 2601.04171](https://arxiv.org/abs/2601.04171) | §1, §3, §4, §5.1 |
| 24 | [SWE-TRACE, 2604.14820](https://arxiv.org/abs/2604.14820) | Abstract, §1, §4.2, §5.3 |
| 25 | [EGSS, 2602.05242](https://arxiv.org/abs/2602.05242) (ACL 2026) | Abstract, §1, method (DSS, TCA) |
| 26 | [Darwin Gödel Machine, 2505.22954](https://arxiv.org/abs/2505.22954) | Abstract, §3, §5 safety, App. H (tool-use hallucination, objective hacking) |
| 27 | [SICA, 2504.15228](https://arxiv.org/abs/2504.15228) | Abstract, agent design incl. asynchronous overseer |
| 28 | [Agent Workflow Memory, 2409.07429](https://arxiv.org/abs/2409.07429) | Abstract, intro |
| 29 | [Dynamic Cheatsheet, 2504.07952](https://arxiv.org/abs/2504.07952) | Abstract, Fig. 1 |
| 30 | [SkillWeaver, 2504.07079](https://arxiv.org/abs/2504.07079) | Abstract, §2–3 (proposal, synthesis, honing) |
| 31 | [SWE-agent, 2405.15793](https://arxiv.org/abs/2405.15793) | ACI design §3, ablations §5 |
| 32 | [Agentless, 2407.01489](https://arxiv.org/abs/2407.01489) | Abstract, §3.3 reproduction tests and patch selection |
| 33 | [SWE-Bench Pro, 2509.16941](https://arxiv.org/abs/2509.16941) | Abstract, results, §6.2–6.3 (augmentation ablation, failure modes) |
| 34 | [METR early-2025 RCT, 2507.09089](https://arxiv.org/abs/2507.09089) | Abstract, §1, §3.2–3.3 |
| 35 | [ProAIDE five-day field study, 2601.10253](https://arxiv.org/abs/2601.10253) | Abstract, §1, §3 design |
| 36 | [ELEPHANT social sycophancy, 2505.13995](https://arxiv.org/abs/2505.13995) (ICLR 2026) | Abstract, §1, §4.3 mitigation table |
| 37 | [Sycophantic AI decreases prosocial intentions, 2510.01395](https://arxiv.org/abs/2510.01395) (published in *Science* 391(6792), Mar 2026, DOI 10.1126/science.aec8352) | arXiv preprint abstract and intro; *Science* version figures (49%, N = 2,405) from the publisher listing |
| 38 | [MCPTox, 2508.14925](https://arxiv.org/abs/2508.14925) (AAAI 2026) | Abstract, §1–4 setup and metrics, Claude row of results table |

### Engineering posts and reports
| # | Source | What was read |
|---|---|---|
| 39 | [Chroma, Context Rot (Jul 2025)](https://research.trychroma.com/context-rot) | Full report |
| 40 | [Manus, Context Engineering for AI Agents (2025-07-18)](https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus) | Full post |
| 41 | [Anthropic, Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) | Full post |
| 42 | [Anthropic, Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps) | Full post |
| 43 | [Anthropic, Building a C compiler with a team of parallel Claudes](https://www.anthropic.com/engineering/building-c-compiler) | Full post |
| 44 | [Anthropic, How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) | Full post incl. appendix |
| 45 | [Anthropic, Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp) | Full post |
| 46 | [Anthropic, Writing effective tools for AI agents](https://www.anthropic.com/engineering/writing-tools-for-agents) | Full post |
| 47 | [Anthropic, Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) | Full post |
| 48 | [Anthropic, Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) | Full post |
| 49 | [Anthropic, Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) | Full post incl. appendices |
| 50 | [Anthropic, Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) | Full post |
| 51 | [Cognition, Don't Build Multi-Agents](https://cognition.ai/blog/dont-build-multi-agents) | Full post |
| 52 | [HumanLayer, 12-Factor Agents](https://github.com/humanlayer/12-factor-agents) | README; factors 7, 9, 10 |
| 53 | [METR, We are Changing our Developer Productivity Experiment Design (2026-02-24)](https://metr.org/blog/2026-02-24-uplift-update/) | Full post |
| 54 | [Sonar, 2026 State of Code survey results](https://community.sonarsource.com/t/results-from-the-2026-state-of-code-developer-survey-are-here/172502) | Full post |

### Claude Code and Claude API docs (fetched as `.md` from code.claude.com / platform.claude.com)
| # | Page | What was read |
|---|---|---|
| 55 | [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices) | Full page |
| 56 | [Keep Claude working toward a goal (`/goal`)](https://code.claude.com/docs/en/goal) | Full page |
| 57 | [What's new](https://code.claude.com/docs/en/whats-new) + [Week 36](https://code.claude.com/docs/en/whats-new/2026-w36) | Weeks 17–37; `/skill-doctor` entry |
| 58 | [Run agents in parallel](https://code.claude.com/docs/en/agents) | Full page |
| 59 | [Dynamic workflows](https://code.claude.com/docs/en/workflows) | Through "Save the workflow" |
| 60 | [Test plugins with evals (`claude plugin eval`)](https://code.claude.com/docs/en/plugin-evals) | How runs work, baseline, graders, judge, report |
| 61 | [Hooks reference](https://code.claude.com/docs/en/hooks) | Event list, `async`/`asyncRewake`/`onFailure`, timeouts |
| 62 | [Mods reference](https://code.claude.com/docs/en/plugins/mods/reference), [events](https://code.claude.com/docs/en/plugins/mods/events), [API](https://code.claude.com/docs/en/plugins/mods/api) | Event table (`tool.describe`, `agent.spawn`, `prompt.compose`…), `$.model`, `$.clock`, `$.prompt.submit` |
| 63 | [Memory (CLAUDE.md, auto memory)](https://code.claude.com/docs/en/memory) | Auto memory section |
| 64 | [Cloud scheduled tasks (formerly Routines)](https://code.claude.com/docs/en/routines) | Triggers and examples |
| 65 | [Claude prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) | TTLs, pricing multipliers, breakpoints, 20-block lookback |

### Reference stacks (cloned, grepped)
superpowers, garrytan/gstack, mattpocock/skills, addyosmani/agent-skills, affaan-m/everything-claude-code, cursor/plugins (pstack), anthropics/skills, wshobson/agents. Files read in full for overlap checks: superpowers `verification-before-completion`; gstack `ship` (receipts section), `learn`, `codex`, `careful`, `freeze`, `guard`, `skillify`, `plan-tune`, `test-audit`, `verify`, `docs/designs/HONEST_WORK_GATE_INTEGRITY.md` (opening); ECC `hooks/hooks.metadata.json`, `continuous-learning-v2`, `delivery-gate`; pstack skill descriptions incl. `arena`, `show-me-your-work`.

**Count:** 65 primary sources (38 papers, 16 posts/reports, 11 doc pages) + 8 stack repos. **No URL failed.** One limitation: the *Science* version of source 37 is paywalled; the arXiv preprint was read and the published figures are taken from the publisher's listing.

---

## 2. Verification log for 00b

Status: **verified** (claim matches) · **corrected** (old → new) · **overstated** (direction right, claim too strong) · **added** (detail that changes how the idea should be built).

### Findings table
| Row | Status | Detail |
|---|---|---|
| SkillsBench | **corrected** | 00b quoted v1 (84 tasks, 7 configs): +16.2 pp, self-generated −1.3 pp, 16/84 negative, SE +4.5 pp. Current v4: 87 tasks, 18 configs, 33.9 → 50.5% (+16.6 pp; Table 2); self-generated −8.1 / −11.3 / −11.5 pp on all three configs tested (Table 6); 13/87 negative (§5.1.3); SE +11.6 pp, second-lowest (Table 3). Added: 1 skill +18.0, 2–3 +19.0, ≥4 +10.1 (Table 8); comprehensive +0.7 vs compact +19.0 (Table 9). |
| AGENTS.md | **overstated → corrected** | "tend to reduce" is too strong: LLM-generated −0.5% / −2% (p = 0.87 / 0.37, not significant); developer-written +2.4% (p = 0.21). Cost: +20% / +23% (LLM), up to +19% (developer) (§4.2, Tables 2–3). "Duplicate docs" confirmed in App. B (with docs removed, LLM files +2.7%). Dev files helped every agent except Claude Code (§4.2). |
| Faulty memories | **verified, with a note** | "Doubled accuracy" is verbatim from the abstract (§5, ARC-AGI Stream). Note: the abstract says GPT-5.4 "fails on 54%" of previously solved problems, while §1/§4.1 say accuracy falls *to* 54% (fails 46%; Fig. 2 shows 52.6%). 00b now uses the body figure. Added Table 5 (in-place rewriting most damaging). |
| ACE | **verified** | +10.6% is the average margin over selected baselines on AppWorld (Table 1), +8.6% finance. Collapse example 18,282 → 122 tokens, 66.7 → 57.1 vs 63.7 baseline (§2.2). Added: per-bullet helpful/harmful counters (§3.1); 91.8% cache reuse (§4.7). Tension added: 2605.12978 shows ACE also degrades over long streams. |
| ImpossibleBench | **verified, sharpened** | "Stronger models cheat more" holds in general (Fig. 3) but newer Claude models cheat less than Sonnet 3.7 (§4). ">79% via test edits" verified (§4.2). "~92% → ~1%" corrected to GPT-5 ">85% (prompts A/B) → 1% (prompt D)" on Conflicting-LiveCodeBench (§5.1). Added: read-only doesn't stop special-casing (§5.2); feedback raises cheating 33 → 38% (§5.3); abort flag 54 → 9% for GPT-5 (§5.3); LLM monitors 42–65% on SWE (§6). |
| Huang et al. | **verified, scoped** | Holds for reasoning tasks on GPT-3.5/4/4-Turbo/Llama-2 (Tables 3–6); code-execution feedback is the paper's own example of useful external feedback (§6). Added Table 7 (vote beats debate). |
| Self-preference | **verified, refined** | 2410.21819: pairwise dialogue judging; GPT-4 strongest (0.520); cause is perplexity, so fresh context does not remove it. "Own family, even objective rubrics" is from 2604.06996 (Table 1, App. D). |
| Context Rot | **verified** | 18 models, controlled length; distractors and low similarity worsen it; LongMemEval ~300 vs ~113k tokens. "Far below the window limit" holds (degradation at all tested lengths). |
| Package hallucination | **corrected** | Old: "~20% of code samples recommended at least one non-existent package". Paper: **19.7% of the 2.23M recommended packages** were hallucinated (a per-package rate, not per sample), across 16 models mostly open-source; commercial 5.2%, open 21.7% (§5.1). Old link was a CSA secondary note; now the primary paper. Added: 43% repeat in 10/10 runs; only 13.4% are near-misses. |
| Ask or Assume | **overstated → corrected** | "Asks fewer questions yet resolves more": true only for task count with Sonnet 4.5 (344 vs 369 tasks) — it asked *more* per task (3.06 vs 1.84); Kimi K2.6 asked far more. Resolve 69.4% vs 61.2% (UA-Single), ≈ Full 70.8%. LLM-simulated user. |
| AgentAbstain | **added** | Was cited without numbers. 59.5% best paired accuracy; 13/17 models < 50%; act 80.6% vs abstain 59.1%; conflicting evidence 28%; state-changing actions not treated differently (§3.2). |
| ProCodeBench | **overstated → corrected** | "Best ~14% pass@1" is the plain-LLM figure (Sonnet 4.6, 13.57%); agents reach 35.57% (GPT-5.4 + A-RAG) (Tables III–IV). Conclusion (offer, don't act) still holds. |
| Uncertainty | **verified, scoped** | 1.3–3B models only (§3.4, limitations). Regeneration on uncertainty −3 to −10 pp in 5/6 configs; verification-based +6 to +26 pp. Its strong "P(True)" is verifier-based (sampled pass rate), i.e. execution, not self-report. |
| ACH | **corrected (wording)** | "~49% of useful tests would have been discarded" → 277 of the 571 generated tests (49%) would have been discarded by line coverage; acceptance was 73% overall. Llama 3.1 70B, Android Kotlin. |
| MAST | **overstated → corrected** | "Reviewer agents give false confidence" isn't stated; the paper says verifiers often do superficial checks and "the presence of a verifier is not a silver bullet" (§4). Added mode percentages and the +15.6% objective-check intervention. |
| GEPA | **verified** | 6% avg / up to 20% over GRPO (24k rollouts) on Qwen3 8B, up to 35× fewer rollouts (abstract, Obs. 1). |
| Sleep-time | **corrected (conditions)** | 2.5× holds only with 10 queries per context and test-time tokens priced 10× (§5.3); ~5× less test-time compute at equal accuracy; on SWE-Features ~1.5× fewer test-time tokens at low budget but worse at high budget (§6). |
| PRELUDE/CIPHER | **verified, with a design-changing addition** | Edit cost −31% / −73%. Context-agnostic preferences did *worse* than no learning on summarisation (§4.3) — so N27 must be context-keyed. |
| Manus | **verified** | All points present; added "don't get few-shotted", "mask, don't remove", ~50 tool calls/task, 100:1 input:output, $0.30 vs $3/MTok. |
| Long-running harness | **verified** | Added: JSON chosen over Markdown because it was overwritten less; 200+ features; smoke test at session start; end-to-end browser testing. |
| Multi-agent research | **verified, scoped** | 90.2% on Anthropic's internal research eval (Opus 4 lead + Sonnet 4 subagents vs single Opus 4); ~15× tokens vs chat (agents ~4×). Added: "most coding tasks involve fewer truly parallelizable tasks than research." |
| Code execution with MCP | **verified; link fixed** | 150,000 → 2,000 tokens (98.7%), an illustrative example. URL is `/engineering/`, not `/news/`. |
| Codebase-Memory | **overstated → corrected** | "Accuracy gains are mixed" → overall quality is *lower* (0.83 vs 0.92); wins only on hub/caller queries in 19/31 languages; single-author grading (§4.1, §5.4). |
| Sonar | **verified** | 96% don't fully trust; added 48% always check; 1,100+ respondents; vendor survey. |
| Claude Code features | **verified, updated** | Names current as of the docs: Routines are now "cloud scheduled tasks"; auto mode default for new sessions on Pro/Max/Team since 2026-08-14; `/goal` evaluator reads only the transcript. Added `claude plugin eval` (Week 37) and `/skill-doctor` (Week 36). |

### Numbers inside N1–N56
| Idea | Status | Detail |
|---|---|---|
| N1 | refined | Separation of intent check is the measured lever (+8.2 pp). gstack `plan-tune` tunes question firing (credited). |
| N4 | added | ProCodeBench number corrected; ProAIDE timing evidence added (52% engagement at boundaries vs 62% dismissed mid-task). |
| N5 | added | ELEPHANT: prompt-level mitigations are limited (§4.3) → must be an evidence step. |
| N8 | added | Cache pricing multipliers from Claude docs. |
| N11 | downgraded | Claude Code now has 1M windows and auto-compaction; best-practices page lists "manage context aggressively" and "subagents to protect context" as outdated advice. The quality argument (context rot) stands. |
| N13 | scoped | Read-only stops Claude's main cheat (test edits) only; N14 still required. |
| N15 | added | Abort path evidence (GPT-5 54 → 9%). |
| N19 | corrected | Cross-family review is *not* absent from stacks: gstack (`codex`, autoplan `MODEL_FAMILY_CONFLICT`) and pstack (`show-me-your-work`, eval playbook) do it. |
| N20 | corrected | "EGSS-style" now cited (2602.05242): tool-entropy branching, +5–10%, −28% tokens; entropy not available in Claude Code, proxy named. pstack `arena` credited. |
| N22 | corrected | Near-miss check catches a minority (13.4%); imports and manifests must trigger the gate, not only install commands. |
| N23 | corrected | Tool-less summariser = Dual-LLM; CaMeL §2 shows it leaves data flow open. Auto mode already screens content-driven actions. |
| N24 | added | MCPTox numbers for tool-description poisoning. |
| N25, N26 | added | Faithful-self-evolvers evidence; ACE counters; Table 5. gstack learnings log credited as append-only. |
| N27 | corrected | Must be context-keyed (CIPHER §4.3). |
| N28 | corrected | −1.3 pp → −8.1 to −11.5 pp (v4). |
| N36 | corrected | Anthropic's scaling rules quoted exactly; coding defaults kept lower with the stated reason. |
| N38 | added | MAST percentages. |
| N41 | updated | Native `claude plugin eval` with no-plugin baseline. |
| N43 | updated | Native `/skill-doctor` covers cost and use count. |
| N44 | corrected | SE +11.6 pp (v4), not +4.5. |

---

## 3. New ideas (N100–N132)

Each idea: **Problem** · **Mechanism** · **Evidence** · **In other stacks?** · **Claude Code implementation** · **Cost/risk** · **Priority** (P0 build first · P1 next · P2 later).

### 3.1 Evidence and verification integrity

#### N100 · Evidence receipts (claims are checked against what actually ran)
- **Problem.** Agents claim "tests pass" without having run them, or after editing code again. `/goal`'s evaluator reads only the transcript and runs nothing, so a confident claim can satisfy it.
- **Mechanism.** A `PostToolUse` hook on Bash records every command with exit code, a short output hash, the time and the git tree hash into a session ledger, and appends a one-line receipt (`receipt r12: npm test → exit 0 @tree 3fa2…`) as additional context. Any edit after a receipt marks it stale. A `Stop` hook (and the claim checker in N105) matches completion claims ("tests pass", "build is green", "lint clean") against fresh receipts for the current tree; no match → block once with a factual note naming the missing check. H-Stack writes `/goal` conditions that require a receipt id.
- **Evidence.** DGM App. H: with long contexts Claude 3.5 Sonnet "hallucinate[d] tool usage … claiming that the Bash tool was used to run tests and that the tool output suggests that all tests passed, but Claude did not invoke any tools"; DGM detected it by marking real tool calls with special tokens. `/goal` docs: the evaluator "does not call tools, so it can only judge what Claude has already surfaced in the conversation." Anthropic long-run harness: Claude marked features done without end-to-end testing.
- **In other stacks?** Partly. superpowers `verification-before-completion` demands evidence in prose. gstack `/ship` keeps receipts (command, result, consumed content) and an evidence ledger of exit codes, scoped to its ship flow; its design doc `HONEST_WORK_GATE_INTEGRITY.md` (status: plan) names "claims a command it never ran". None checks claims against a tool ledger on every Stop, invalidates evidence on later edits, or feeds `/goal`.
- **Implementation.** Hooks: `PostToolUse` (Bash), `PostToolBatch` (receipt summary), `Stop` (claim match), `FileChanged`/`PostToolUse` Edit (staleness). Small script, JSONL ledger in the session dir.
- **Cost/risk.** Near zero tokens (one line per receipt). Risk: false blocks on claims phrased loosely; block only once per stop (Stop-hook block cap is 8).
- **Priority.** **P0.**

#### N101 · Checkers the agent can't edit or game
- **Problem.** An optimiser that can see or edit its checker learns to satisfy the checker instead of the goal.
- **Mechanism.** H-Stack's own gates (receipt checker, tamper scanner, eval graders, dependency gate, hooks config) live in the plugin directory, are read-only to the agent (`PreToolUse` deny on writes to them and to `.claude/settings*.json`, CI config, test-runner config, coverage thresholds), and skills never quote the checker's exact rules. Changes to them require the user.
- **Evidence.** DGM App. H: objective hacking "occurs more frequently when these [checking] functions are not hidden"; one agent removed the logging of the special tokens to pass. ImpossibleBench §6: LLM monitors catch only 42–65% of cheating on SWE tasks, so checks must be structural. Anthropic C-compiler post: "Claude simply cheats here and calls out to GCC".
- **In other stacks?** ECC `pre:config-protection` blocks edits to linter/formatter configs. Nobody protects the stack's own gates or test/CI configs as a class.
- **Implementation.** `PreToolUse` (Edit/Write/Bash path match) deny with reason; `onFailure: "block"` so a crashed guard doesn't fail open.
- **Cost/risk.** Free. Risk: blocks a legitimate config change → the reason tells Claude to ask the user.
- **Priority.** **P0.**

#### N102 · Rubric before code (agreed "done" for full-size tasks)
- **Problem.** "Done" is decided by the agent that did the work, after the fact, and tests often don't cover root cause or scope creep.
- **Mechanism.** For tasks the router labels *full*, a read-only rubric subagent explores the repo before any edit and writes `rubric.yaml`: binary items, each weighted must/important/nice, on four axes — scope (files touched, minimal edit), spec alignment, integrity (no test weakening, no dependency churn, no mass renames), runtime behaviour. The implementer may propose changes (a "sprint contract"); the user sees it in one screen. At the end a blind reviewer (N19) scores the diff against it; must-haves gate.
- **Evidence.** Agentic Rubrics (2601.04171): repo-grounded rubrics beat all baselines for picking patches (+3.5 to +4.6 pp Best@16), ROC-AUC 0.886 vs ground-truth tests; when tests passed but the rubric failed, 54% of rubric failures were real (missed root cause, missing edge cases) (§4.2); without repo exploration the rubrics got worse (§5). Anthropic harness-design post: generator and evaluator negotiated a sprint contract "before any code was written"; Sprint 3 alone had 27 criteria.
- **In other stacks?** Specs and acceptance criteria exist (superpowers `writing-plans`, addyosmani `spec-driven-development`, gstack `spec`). No stack has a separate repo-grounded rubric agent with an integrity axis whose rubric is fixed *before* code and grades the final diff.
- **Implementation.** Skill (`context: fork`, read-only tools) + subagent; rubric file in the task dir; reviewer subagent; must-haves feed N100's Stop check.
- **Cost/risk.** One extra subagent (~tens of k tokens) on full tasks only. Risk: over-specified rubrics (22–46% low-utility items in the paper) → user can strike items; rubric says *what*, not *how*.
- **Priority.** **P0.**

#### N103 · Harvest reproduction scripts into the test suite
- **Problem.** While debugging, agents write throwaway repro scripts that are the best evidence of the bug, then delete them.
- **Mechanism.** A `PostToolUse` hook notes scripts the agent creates and runs during debugging. Before finishing, H-Stack offers to normalise and keep the ones that failed on the base commit and pass now, as regression tests (deduplicated; majority by normalised form).
- **Evidence.** Agentless §3.3: sample several reproduction tests, keep those that print "Issue reproduced" on the original repo, normalise and pick the most frequent. EGSS Test Consolidation Augmentation: consolidating debugging signals from trajectories into a test suite for patch selection (+5–10% with DSS, ACL 2026).
- **In other stacks?** No match for consolidating/promoting reproduction scripts in any reviewed stack.
- **Implementation.** Hook + small skill step at the end of the debugging playbook; uses N17's revert check.
- **Cost/risk.** Low. Risk: brittle tests → only keep ones that fail on base and pass on fix.
- **Priority.** P1.

#### N104 · Look before you commit (irreversible actions)
- **Problem.** Agents cancel the flight before checking a rebooking exists: they discover the blocker after the irreversible step.
- **Mechanism.** For actions classed irreversible (deploy, migration, `push --force`, delete, send, publish), a `PreToolUse` gate requires a receipt (N100) of the matching read-only check in this turn: dry-run, `plan`, `diff`, `--check`, list-before-delete. If the agent's recent text recorded conflicting evidence, ask instead of act.
- **Evidence.** AgentAbstain §3.2: "act-then-discover" across seven models; models' refusal behaviour is "action-type-blind" (63.0% vs 62.0%); conflicting evidence is the hardest category (28% paired accuracy).
- **In other stacks?** gstack `careful`/`guard` warn before destructive commands; auto mode blocks some. None requires the preceding dry-run evidence.
- **Implementation.** `PreToolUse` Bash/MCP matcher + receipt lookup.
- **Cost/risk.** Free. Risk: friction on routine commands → irreversible list stays short and per-project.
- **Priority.** P1.

#### N105 · Unresolved-concern check at Stop
- **Problem.** The agent notices a problem ("this test looks wrong", "the endpoint returns 422") and then talks itself past it and reports done.
- **Mechanism.** At Stop, a cheap model call (mods `turn.complete` with `$.model.complete`, or a prompt-type Stop hook) lists concerns the agent raised this task and whether each was resolved by a later action or explicitly handed to the user. Unresolved → one factual note: "Raised: X. Not resolved or reported."
- **Evidence.** AgentAbstain "half-acknowledgment: models flag a constraint and then talk past it". Anthropic harness-design: Claude as QA would "identify legitimate issues, then talk itself into deciding they weren't a big deal and approve the work anyway". ImpossibleBench Fig. 9: a "backward compatibility" rationalisation fooled the monitor.
- **In other stacks?** ECC `delivery-gate` regex-matches phrases like "skip tests for now" as a warning only. No stack tracks raised concerns to resolution.
- **Implementation.** Mod or prompt hook on Stop; Haiku-class model; cached system prompt.
- **Cost/risk.** One small call per stop. Risk: nagging → only for turns with edits; at most once.
- **Priority.** P1.

#### N106 · Reviewer calibration from disagreements
- **Problem.** Out of the box Claude is a lenient reviewer of LLM-written work.
- **Mechanism.** Every time the user overrides an H-Stack review verdict, the case (diff excerpt, verdict, user's verdict) is logged. Periodically these become few-shot calibration examples with score breakdowns in the reviewer prompt (versioned, eval-gated per N41).
- **Evidence.** Harness-design post: "tuning a standalone evaluator to be skeptical turns out to be far more tractable than making a generator critical of its own work"; calibration used "few-shot examples with detailed score breakdowns", which "reduced score drift". Anthropic evals post: calibrate LLM graders against human judgement.
- **In other stacks?** Not found.
- **Implementation.** Log via mod/hook; calibration set in plugin data dir; GEPA-style tuning (N29) offline.
- **Cost/risk.** Low. Risk: overfitting to one user → keep per-project.
- **Priority.** P2.

#### N107 · Spend review effort only past the model's solo boundary
- **Problem.** Heavy reviewers and tournaments cost 10–20× and add nothing on tasks the model already does reliably.
- **Mechanism.** H-Stack keeps a per-project, per-task-class record of how often solo work passed review/CI. Classes with high solo pass rates get light verification; heavy review, rubric (N102) and tournaments (N20) are reserved for classes where solo reliability is low or risk is high.
- **Evidence.** Harness-design: "the evaluator is not a fixed yes-or-no decision. It is worth the cost when the task sits beyond what the current model does reliably solo"; with Opus 4.6 the per-sprint evaluator became "unnecessary overhead" for tasks within the boundary. Full harness cost 20× solo ($200 vs $9).
- **In other stacks?** Effort tiers exist (pstack, gstack review depth), not driven by measured solo pass rates.
- **Implementation.** Telemetry (N43) + router rule.
- **Cost/risk.** Saves tokens. Risk: cold start → default to medium.
- **Priority.** P1.

### 3.2 Memory that doesn't rot

#### N108 · Show the raw episode, not just the lesson
- **Problem.** Agents largely ignore abstract lessons, even when it's the only guidance they get.
- **Mechanism.** Every lesson links to its raw episode (command, error text, diff, outcome). When a lesson is retrieved, H-Stack injects the short raw excerpt alongside it; lessons without a reachable episode are not injected.
- **Evidence.** Faithful self-evolvers (2601.22436): across 4 frameworks, 13 backbones, 9 environments, perturbing raw experience changes behaviour while perturbing condensed summaries often doesn't; integrated-gradients attribution to condensed text stays low (§5.2). Faulty memories Table 5: raw trajectories 76.6 vs default consolidation 43.2.
- **In other stacks?** gstack `learn` logs and searches learnings (latest per key); ECC `continuous-learning-v2` stores "instincts" with confidence. Neither injects the source episode with the lesson.
- **Implementation.** Episode store (JSONL per task) + `UserPromptSubmit`/router retrieval; excerpts capped (~300 tokens).
- **Cost/risk.** Small token cost per retrieved lesson. Risk: privacy of stored output → redact secrets on write.
- **Priority.** **P0** (core of the memory design with N25/N26).

#### N109 · Shadow log for native auto memory
- **Problem.** Claude Code's auto memory is told to "merge or drop stale entries" when `MEMORY.md` nears its 200-line/25 KB limit — an in-place rewrite, the step that 2605.12978 found most damaging.
- **Mechanism.** A `PostToolUse` hook on writes under `~/.claude/projects/*/memory/` appends the before/after diff to an append-only shadow log. If a merge drops concrete specifics (paths, commands, error strings), H-Stack flags it and can restore the entry.
- **Evidence.** Memory docs ("keep one line per entry, move detail into topic files, and merge or drop stale entries"). 2605.12978 Table 5: forbidding in-place rewriting 43.2 → 50.0, add+delete without in-place edits 64.0.
- **In other stacks?** Not found (no stack references native auto memory files).
- **Implementation.** Hook + diff script; no model calls.
- **Cost/risk.** Free. Risk: none beyond disk.
- **Priority.** P1.

#### N110 · Lesson specificity gate
- **Problem.** Abstract lessons lose the conditions under which they apply, then mislead on neighbouring tasks or cause early termination.
- **Mechanism.** A lesson is accepted only if it has: a concrete trigger (file glob, command, error string), an applicability condition, a counter-condition ("doesn't apply when…"), and an episode link. Generic advice ("always validate input") is rejected.
- **Evidence.** 2601.22436 §5.1: failures from condensed experience were distraction, over-reliance on wrong priors, and "premature inference … causing them to skip verification steps or terminate early". 2605.12978 §6.2: abstraction "strips the preconditions under which a lesson applies". SkillsBench F.3: harmful skills lacked applicability boundaries.
- **In other stacks?** No "applicability condition" requirement found in any stack.
- **Implementation.** Schema + validator script (N47) on the lessons file.
- **Cost/risk.** Free. Risk: fewer lessons captured — intended.
- **Priority.** **P0.**

#### N111 · Learn code, not prose
- **Problem.** Model-written prose skills hurt (SkillsBench v4: −8 to −11.5 pp), yet repeated procedures are worth capturing.
- **Mechanism.** When a procedure succeeds two or more times, H-Stack proposes a script with calibrated defaults plus a test that was run (practice), not a paragraph. The skill references the script; prose stays minimal.
- **Evidence.** SkillsBench F.4: top authoring pattern is "ship an executable script with calibrated defaults rather than only describing the algorithm". Dynamic Cheatsheet: GPT-4o Game of 24 10% → 99% by reusing a validated Python solution. SkillWeaver: practised and tested APIs +31.8% (WebArena), transfer to weaker agents up to +54.3%. Code-execution-with-MCP: saved functions + SKILL.md become skills.
- **In other stacks?** gstack `skillify` does this for browser scrapes (script.ts + script.test.ts). No stack generalises it to all repeated procedures.
- **Implementation.** End-of-task offer (boundary-timed, N4) + script template + N41 eval.
- **Cost/risk.** Low. Risk: script rot → re-run its test on use.
- **Priority.** P1.

#### N112 · Memory provenance: untrusted text never becomes a rule
- **Problem.** Persistent memory is a prompt-injection target: one poisoned page can become a standing rule.
- **Mechanism.** Every episode/lesson carries provenance (user said · verified by execution · read from untrusted content). Only the first two can be promoted to rules; untrusted-derived entries are shown as quotes, never as instructions.
- **Evidence.** CaMeL (data provenance as capabilities); Cloudflare AI attack classes include persistent memory poisoning (see 09-security); MCPTox: agents rarely refuse injected instructions (< 3%).
- **In other stacks?** Not found.
- **Implementation.** Provenance field in the episode schema; set by the hook that records the source tool.
- **Cost/risk.** Free.
- **Priority.** P1.

### 3.3 Context and cost

#### N113 · Agent-shaped output for every H-Stack script and hook
- **Problem.** Verbose tool output fills context, and Claude can't tell time.
- **Mechanism.** House rule for H-Stack scripts: ≤ ~10 lines to stdout; `ERROR <reason>` on one line (greppable); full detail to a log file whose path is printed; precomputed summaries (counts, first failure); a `--fast` mode that runs a deterministic sample; `concise`/`detailed` switch; errors say what to do next.
- **Evidence.** C-compiler post ("context window pollution", "time blindness", `--fast` 1–10% sample deterministic per agent). Writing-tools post (concise ≈ ⅓ the tokens of detailed; actionable errors; Claude Code caps tool responses at 25,000 tokens). SWE-agent: 100-line file window beat 30 lines and whole files (−3.7 / −5.3 pp).
- **In other stacks?** gstack's `gbrain doctor --fast` and `[OK]/[ERR]` output follow part of this for one tool. No stack states it as a rule for all its scripts.
- **Implementation.** Script template + CI lint on H-Stack's own scripts.
- **Cost/risk.** Saves tokens.
- **Priority.** **P0** (cheap, everything else depends on it).

#### N114 · Syntax check on every edit
- **Problem.** Syntax errors are a large share of frontier-model failures and cause repeated edits of the same snippet.
- **Mechanism.** `PostToolUse` on Edit/Write runs the fastest syntax check for that file type (parser, `tsc --noEmit` on the file's project if fast, `py_compile`, `go vet` subset) and returns only new errors with ±3 lines.
- **Evidence.** SWE-agent: editing with lint guardrail 18.0% vs 15.0% without (Table 3). SWE-Bench Pro §6.3: syntax errors 24.2% of Opus 4.1 failures.
- **In other stacks?** ECC batches format/typecheck at Stop (`stop:format-typecheck`); none checks per edit with diff-local output.
- **Implementation.** Hook, `async: false`, short timeout, quiet on success.
- **Cost/risk.** Latency per edit (must stay < 1–2 s). Risk: slow projects → fall back to Stop batching.
- **Priority.** P1.

#### N115 · Cache-stability test for H-Stack's injected text
- **Problem.** One timestamp or reordered key in injected context breaks the prompt cache for everything after it; writes cost 1.25×/2× and reads 0.1×.
- **Mechanism.** CI test renders every SessionStart/UserPromptSubmit/SubagentStart output twice from the same state and fails on any byte difference; dynamic facts go only in appended, end-of-context blocks; H-Stack never toggles tools, skills or CLAUDE.md mid-session (mods `tool.describe` flags `breakPromptCache` when it would).
- **Evidence.** Manus (stable prefix, deterministic serialisation, don't add/remove tools mid-loop). Claude prompt-caching docs (multipliers; 20-block lookback). Claude Code best practices: cache ~1 h on subscription, 5 min on API keys and for subagents.
- **In other stacks?** gstack and ECC mention prompt caching; no stack tests its own output for cache stability.
- **Implementation.** CI script.
- **Cost/risk.** Free.
- **Priority.** P1.

#### N116 · A hard context-tax budget for H-Stack
- **Problem.** Every always-on line costs attention and money on every turn; context files raise cost ~20% with no significant gain.
- **Mechanism.** CI fails if H-Stack's always-on footprint (skill listing text + SessionStart injection + per-prompt classifier lines) exceeds a fixed budget (start: 1,500 tokens). Each line must justify itself with an eval Δ (N41).
- **Evidence.** AGENTS.md paper (cost +20–23%, no significant gain). Claude Code best practices ("every line in it takes a little of Claude's attention on every task"; ≤ 200 lines). SkillsBench Table 9 (comprehensive +0.7 pp). `/skill-doctor` shows per-skill context cost.
- **In other stacks?** ECC ships 300+ skills and 27 hook entries; superpowers injects a router skill each session. None enforces a token budget in CI.
- **Implementation.** CI script counting tokens of rendered injections.
- **Cost/risk.** Free.
- **Priority.** **P0.**

#### N117 · Break the few-shot rut in batch work
- **Problem.** On repetitive batches (20 files, 20 reviews) the agent imitates its own previous actions and drifts.
- **Mechanism.** When the same tool pattern repeats over N items, the recitation hook (N7) restates the current item's specific goal and varies the serialisation of the injected note.
- **Evidence.** Manus "Don't get few-shotted" (résumé-review drift; fix: structured variation).
- **In other stacks?** Not found.
- **Implementation.** `PostToolBatch` hook.
- **Cost/risk.** Tiny.
- **Priority.** P2.

#### N118 · Spawn governor
- **Problem.** Effort-scaling rules in prose are ignored under pressure; early multi-agent systems spawned 50 subagents for simple queries.
- **Mechanism.** Mods `agent.spawn` enforces N36 budgets deterministically: counts subagents per task size, denies over-budget spawns with a reason, and sets the model per role (Haiku for search/collection, strongest for review).
- **Evidence.** Mods reference (`agent.spawn` can return `{ model }` or `{ deny: reason }`). Anthropic research post (50-subagent failure; ~15× tokens). Best practices ("Set `model: haiku`… for simple work").
- **In other stacks?** No stack uses mods (`tool.describe`/`agent.spawn`/`$.model`: zero matches in all six).
- **Implementation.** Mod.
- **Cost/risk.** Saves tokens. Risk: denies a needed spawn → reason tells Claude to ask.
- **Priority.** P1.

### 3.4 Security

#### N119 · Tool-description firewall
- **Problem.** A malicious MCP server's tool *description* can steer the agent to use other, legitimate tools against the user, without the poisoned tool ever being called.
- **Mechanism.** Mods `tool.describe` fires when each tool's description is first sent to Claude (and again for tools loaded through tool search). H-Stack scans it for imperative instructions aimed at other tools or the session ("before any file operation…", "must first read…"), secret paths (`.ssh`, `.env`, tokens), hidden Unicode and cross-tool references; it neutralises or defers suspicious tools and tells the user which server and tool.
- **Evidence.** MCPTox: 1,312 cases on 45 real servers; o1-mini attack success 72.8%; Claude 3.7 Sonnet average 34.3%; highest refusal rate < 3%; more capable models often more susceptible. Codebase-Memory §5.3: MCP servers run with the host agent's permissions.
- **In other stacks?** ECC has an MCP *health* check; no stack inspects tool descriptions at load time.
- **Implementation.** Mod (`tool.describe` → `{ description, isDeferred }`); rules list; mod tests (fire event, assert rewrite).
- **Cost/risk.** Free at runtime. Risk: false positives on verbose descriptions → warn, don't delete.
- **Priority.** **P0.**

#### N120 · Track untrusted strings into tool arguments
- **Problem.** Even when untrusted text can't change *which* tool runs, it can change the *arguments* (recipient, URL, path).
- **Mechanism.** After WebFetch/issue/PR-comment reads, a hook records URLs, hosts, emails and paths that appeared there. A `PreToolUse` hook on consequential calls (network writes, `git push` remotes, `curl -d`, send/post MCP tools) asks the user if an argument matches an untrusted-only string.
- **Evidence.** CaMeL §2 and Fig. 2: the Dual-LLM pattern protects control flow but "the data flow can still be manipulated". Design-patterns paper §3: plan-then-execute still lets injections change tool inputs; §4.10 SWE-agent threats (exfiltration via commits/web requests).
- **In other stacks?** Not found (provenance hits in gstack/ECC concern build provenance/SLSA, not argument taint).
- **Implementation.** Two hooks + a session string set.
- **Cost/risk.** Free. Risk: false asks when the user really wants that URL → one confirm.
- **Priority.** P1.

### 3.5 Human factors

#### N121 · Measure, don't ask, whether H-Stack helps
- **Problem.** Developers' sense of speed-up is unreliable.
- **Mechanism.** H-Stack's retro (end of session/week, local only) reports measured signals: time from request to accepted change, how much of that was waiting/reviewing, rework (user edits within N minutes after Claude's change), reverts. It never reports "felt faster".
- **Evidence.** METR RCT: developers forecast −24% time, estimated −20% afterwards, measured +19% (tasks took longer); time shifted to prompting, waiting and reviewing, plus idle (§3.2). METR 2026 update: follow-up data unreliable because of selection and concurrent agents.
- **In other stacks?** gstack/mattpocock retros are qualitative; ECC tracks cost. None measures rework or wait/review time.
- **Implementation.** Hooks timestamp turns; git diff after Claude's edits; local report.
- **Cost/risk.** Free. Risk: privacy → local only.
- **Priority.** P2.

#### N122 · Evidence-first disagreement
- **Problem.** Users prefer and trust sycophantic answers, which erodes judgement; prompting only partly fixes it.
- **Mechanism.** When the user asserts a cause or decision that H-Stack's evidence contradicts, the response structure is fixed: evidence → conclusion → the cheapest check that would settle it → user decides. A cheap Stop-time check flags replies that open with agreement on a user claim with no tool evidence since the claim.
- **Evidence.** *Science* 2026 (Cheng et al.): models affirm users' actions ~49% more than humans; people rate sycophantic replies higher, trust them more and intend to return. ELEPHANT §4.3: prompt-level mitigations have mixed effect.
- **In other stacks?** pstack `principle-attack-the-premise` targets repeated failed fixes; not user-asserted premises.
- **Implementation.** Part of N5 skill text + mods `turn.complete` check.
- **Cost/risk.** One cheap call on flagged turns.
- **Priority.** P2.

### 3.6 Evaluating H-Stack itself

#### N123 · Balanced, paired evals with pass^k for gates
- **Problem.** One-sided evals produce one-sided behaviour (a gate that always blocks scores 100% on "should block").
- **Mechanism.** Every skill and gate ships with matched pairs: should-trigger / should-not-trigger, should-act / should-stop, differing in one detail. Gates report pass^3 (all three runs right), not pass@k.
- **Evidence.** AgentAbstain: paired design means "no constant policy exceeds 50% Paired Accuracy". Anthropic evals post: "One-sided evals create one-sided optimization"; pass^k for consistency. `claude plugin eval` runs 3 runs by default.
- **In other stacks?** ECC's eval harness reports pass^k; anthropics/skill-creator tests should/shouldn't-trigger. No stack pairs gate cases by minimal perturbation.
- **Implementation.** `evals/` per skill in `claude plugin eval` format.
- **Cost/risk.** Eval spend (≈ cases × 3 × 2 runs).
- **Priority.** **P0.**

#### N124 · Judge hygiene for H-Stack's evals
- **Problem.** The default judge is a small Claude model grading Claude output.
- **Mechanism.** Prefer free deterministic graders (`regex`, `tool_used`, `tool_order`, `file_exists`); use `llm` graders only for binary rubric items with an "Unknown" way out; avoid pairwise-style `baseline` graders as the main signal; run the judge on a stronger or different model (`--judge-model`); put decisive evidence at the end of the run (the `llm` judge sees the first 12 and last 12 trace messages); isolate trials (no shared git history).
- **Evidence.** `claude plugin eval` docs (default judge is the background model; `llm` passes on 2 of 3 votes; trace window 12+12; "suspect the judge before the plugin"). 2604.06996 (Claude Haiku/Sonnet ×1.7–1.8 self-preference on objective rubrics; pairwise worst). Anthropic evals post (Claude gained "an unfair advantage … by examining the git history from previous trials"; isolated per-dimension judges).
- **In other stacks?** pstack's eval playbook uses a blinded judge on a different family; no stack addresses trace windows or grader-type choice.
- **Implementation.** Eval authoring guide + CI defaults.
- **Cost/risk.** Slightly higher judge cost.
- **Priority.** **P0.**

#### N125 · Impossible-task canaries
- **Problem.** A stack change can make Claude better at "passing" by cheating, and normal evals reward that.
- **Mechanism.** H-Stack's eval suite includes ImpossibleBench-style canaries (a test contradicting the spec). Passing a canary is a failure; the correct outcome is a stop-and-explain (N15).
- **Evidence.** ImpossibleBench (cheating rate = pass rate on impossible tasks; prompt wording moved GPT-5 from >85% to 1%).
- **In other stacks?** No ImpossibleBench reference in any stack.
- **Implementation.** 5–10 canary cases in `evals/`.
- **Cost/risk.** Small eval spend.
- **Priority.** P1.

#### N126 · One-component ablation on every model release
- **Problem.** Scaffolding that helped an older model becomes overhead or harm on a newer one, and radical cuts can't tell which part was load-bearing.
- **Mechanism.** A scheduled job (cloud scheduled task or CI) runs the eval suite with each H-Stack component disabled in turn; components with Δ ≈ 0 on the current model are proposed for removal (feeds N42).
- **Evidence.** Harness-design post: the first radical simplification failed; "removing one component at a time" worked; Opus 4.6 made the sprint construct unnecessary; "every component in a harness encodes an assumption about what the model can't do on its own".
- **In other stacks?** gstack has cross-model benchmarking of skills (`benchmark-models`); no per-component ablation.
- **Implementation.** Script over `claude plugin eval` with plugin variants.
- **Cost/risk.** Eval spend per release (bounded by suite size).
- **Priority.** P1.

### 3.7 Orchestration

#### N127 · Implicit-decision ledger for parallel work
- **Problem.** Parallel agents make conflicting implicit choices (naming, data shape, style, library) that only collide at merge.
- **Mechanism.** Any subagent or worktree session that makes a choice not dictated by the spec appends one line to `decisions.jsonl` (what, why, scope). Siblings read it before acting (via `SubagentStart` injection or cross-session messaging); conflicts are surfaced before merge.
- **Evidence.** Cognition: "Actions carry implicit decisions, and conflicting decisions carry bad results" (Flappy Bird example). Anthropic research post: vague delegation duplicated work. C-compiler post: agents claim tasks with lock files in `current_tasks/`.
- **In other stacks?** gstack `autoplan` appends review decisions to `decisions.jsonl` within its planning pipeline; not shared live across parallel implementers.
- **Implementation.** Delegation brief (N37) requires it; `SubagentStart` hook injects recent entries; worktree sessions read the file.
- **Cost/risk.** Small context per subagent.
- **Priority.** P1.

#### N128 · Split one giant failure with a known-good oracle
- **Problem.** When every parallel agent hits the same failure they all fix it and overwrite each other.
- **Mechanism.** For big single failures (whole build, end-to-end suite), H-Stack's parallel playbook first builds a bisection harness against a known-good reference (previous release, reference implementation, other compiler) so each agent gets a different failing subset; task claims via lock files.
- **Evidence.** C-compiler post: 16 agents stuck on the Linux kernel until GCC was used as an oracle to compile random subsets; then delta debugging for pairs.
- **In other stacks?** Not found.
- **Implementation.** Workflow script template.
- **Cost/risk.** Niche; only for large parallel runs.
- **Priority.** P2.

#### N129 · Asynchronous overseer
- **Problem.** Long unattended runs loop or drift with nobody watching.
- **Mechanism.** A mod timer (`$.clock.every`) summarises recent tool calls and subagent tree every few minutes, checks for N38 signatures (same call repeated, no edits for many turns, scope drift from the goal) and either injects a factual note (`$.prompt.submit`) or stops the run.
- **Evidence.** SICA: "asynchronous overseer" LLM every 30 s that may notify or cancel, judged against a call-graph + event-stream view. MAST: step repetition is the most common failure (15.7%).
- **In other stacks?** gstack `runaway-stopper` finds and stops runaway threads on request; no stack runs a periodic in-session overseer.
- **Implementation.** Mod + small model call.
- **Cost/risk.** One small call per interval during long runs only.
- **Priority.** P1.

#### N130 · Interfaces in every spec
- **Problem.** Tests expect specific APIs/signatures; a spec without them lets valid solutions fail and invalid ones pass.
- **Mechanism.** H-Stack's spec step requires an "Interfaces" section (signatures, endpoints, data shapes) that both the rubric (N102) and tests reference.
- **Evidence.** SWE-Bench Pro §6.2: without requirements and interface augmentations, GPT-5 and Opus 4.1 "show significantly degraded performance".
- **In other stacks?** addyosmani `api-and-interface-design`, mattpocock "name the data shape first" (see 04-specs) cover it as advice; not wired to rubric/tests.
- **Implementation.** Spec template field + validator.
- **Cost/risk.** Free.
- **Priority.** P2.

#### N131 · Goal conditions that `/goal` can actually judge
- **Problem.** `/goal` conditions written as wishes ("make it work") can be "met" by a confident summary.
- **Mechanism.** H-Stack writes goals in the documented shape: one measurable end state + the exact check + constraints that must not change + a turn bound, and requires the receipt id (N100), e.g. "`npm test` exits 0 at the current tree (receipt shown) and no file under `test/` changed; stop after 20 turns."
- **Evidence.** `/goal` docs ("one measurable end state", "a stated check", "constraints that matter", turn clause; evaluator judges from transcript only).
- **In other stacks?** ECC mentions `/goal` (14 files); no stack ties conditions to execution receipts.
- **Implementation.** Long-run skill template.
- **Cost/risk.** Free.
- **Priority.** P1.

#### N132 · Product-level planner, implementation-level contract
- **Problem.** Detailed technical plans written up front cascade their errors; plans that are too thin under-scope.
- **Mechanism.** For new builds, the planner writes deliverables and product behaviour (ambitious scope, no low-level design); the implementation detail is negotiated per chunk in the rubric/contract (N102).
- **Evidence.** Harness-design post: the planner was kept to "product context and high level technical design" because errors in granular specs "would cascade"; without a planner the generator under-scoped. Claude Code best practices: say "be ambitious" when you want the fuller version.
- **In other stacks?** gstack and superpowers plans go down to tasks/code steps; none separates product spec from per-chunk contract.
- **Implementation.** Spec skill structure.
- **Cost/risk.** Free.
- **Priority.** P2.

---

## 4. Top 15 differentiators

Ranked by expected effect on correctness and trust, weighted by cost and by how clearly no other stack has it.

1. **Evidence receipts (N100 + N131).** The single most common way agents mislead users is claiming a check passed that didn't run or ran on older code. Every stack tells Claude to show evidence; gstack records receipts inside `/ship`. H-Stack makes it mechanical everywhere: each command's exit code is recorded, invalidated by later edits, matched against every completion claim at Stop, and required by `/goal` conditions — closing the gap that `/goal`'s transcript-only evaluator leaves open. Cheap, deterministic and visible.

2. **Test-integrity triad (N13 + N14 + N15, with N101 and N125).** ImpossibleBench shows Claude's dominant cheat is editing tests, other models special-case, and LLM monitors miss half of it. H-Stack combines read-only tests during implementation, a deterministic tamper scan for all four cheat types, a real "tests contradict the spec → stop" path, gates the agent can't edit, and canary tasks in its own evals. gstack has this as a plan; nobody ships it.

3. **Rubric before code (N102 + N130 + N132).** A repo-grounded rubric, fixed before implementation and including an integrity axis, catches scope creep and missed root causes that tests don't (54% of rubric-only failures were real). It turns "done" into an agreement made before the work, graded blind afterwards.

4. **Memory that doesn't rot (N25 + N26 + N108 + N109 + N110).** Two 2026 papers show consolidated lessons degrade and get ignored while raw episodes keep working. H-Stack stores episodes first, appends lessons with counters and provenance, never rewrites in place, requires concrete triggers and applicability conditions, injects the raw excerpt with each lesson, and shadow-logs Claude Code's own auto-memory merges. ECC's instinct engine and gstack's learnings log are the closest; neither keeps the episode as the source of truth.

5. **Tool-description firewall (N119).** Tool poisoning works at registration time, without the poisoned tool ever running, at up to 72.8% success, and Claude almost never refuses. Mods' `tool.describe` event lets H-Stack inspect every description before Claude reads it. No stack uses mods at all.

6. **Act / ask / stop with a separate intent check (N1 + N104).** Separating "is something missing?" from coding raised resolve rates to full-information level, and when they should hold back, frontier agents do so correctly only 59% of the time on average (AgentAbstain), often after an irreversible step. H-Stack routes each prompt to act, ask or stop, and requires a dry-run receipt before irreversible commands.

7. **Paired, balanced evals with judge hygiene (N41 + N123 + N124).** Native `claude plugin eval` makes baselines cheap; H-Stack uses it properly: minimal-pair should/shouldn't cases, pass^3 for gates, deterministic graders first, judges that aren't the generator's small sibling, and evidence placed where the judge can see it. Without this, every other claim about H-Stack is unmeasured.

8. **Dependency gate that matches the real threat (N22).** 19.7% of recommended packages across 16 models didn't exist, 43% of fake names recur, and most aren't typos. H-Stack checks age and usage history on install, manifest edits *and* new imports. addyosmani and ECC only describe typosquat review.

9. **Untrusted-to-argument tracking (N23 + N120 + N112).** CaMeL shows a tool-less summariser protects control flow but not arguments. H-Stack tags untrusted strings and asks before they reach a network write, push or send, and never lets untrusted text become a memory rule — on top of auto mode's own screening.

10. **Context-tax budget and cache stability (N6 + N116 + N115).** AGENTS.md files cost ~20% more with no significant gain, and one unstable byte breaks the cache. H-Stack enforces a token budget on its own always-on text and a byte-stability test on everything it injects, in CI. Big packs grow without such limits.

11. **Learn code, not prose (N111 + N28).** Model-written prose skills lowered pass rates by 8–11.5 pp; executable, practised scripts are the top pattern among the most helpful skills. H-Stack only turns repeated success into scripts with tests, and never ships unreviewed prose skills. gstack does this for scrapes only.

12. **Unresolved-concern check (N105).** Claude often spots a problem and then talks past it. A cheap Stop-time check lists concerns raised and whether each was resolved or reported. ECC's regex warning is the nearest relative.

13. **Implicit-decision ledger for parallel work (N127 + N36 + N118).** Parallel coding fails on conflicting implicit choices. H-Stack makes every parallel worker log choices the spec didn't dictate, injects them into siblings, and enforces subagent budgets and models through `agent.spawn` instead of prose.

14. **Agent-shaped output and per-edit syntax checks (N113 + N114).** Small, boring, high-leverage: every H-Stack script prints a few greppable lines and logs the rest; every edit gets an instant syntax check. SWE-agent measured +3 pp from the lint guardrail alone, and syntax errors are ~a quarter of Opus 4.1's SWE-Bench Pro failures.

15. **Self-pruning stack (N42 + N107 + N126).** Harness parts encode assumptions about what the model can't do; each model release moves that line. H-Stack ablates one component at a time on each release, reserves heavy review for task classes the model doesn't handle solo, and removes what no longer pays. Other stacks only grow.

---

## 5. Anti-ideas

Popular practices the evidence says to avoid.

| # | Practice | Evidence against | Seen in |
|---|---|---|---|
| A1 | Auto-generating skills/rules from sessions and promoting them without an eval | SkillsBench v4 Table 6: self-generated skills −8.1 to −11.5 pp vs no skills; audit: unused packs, displaced work, confidently wrong content (App. D.6.1) | ECC `continuous-learning-v2` ("evolve instincts into skills/commands/agents") |
| A2 | Consolidating memory after every session or rewriting lessons in place | 2605.12978: utility rises then falls; in-place rewriting most damaging (Table 5); 2601.22436: condensed lessons often ignored | Common "summarise learnings" end-of-session hooks; native auto memory merges near its limit |
| A3 | Keeping an `/init`-generated CLAUDE.md with repo overviews | 2602.11988: no significant gain, +20–23% cost, overviews don't help find files | Most starter templates |
| A4 | ALL CAPS / "IMPORTANT" / "YOU MUST" in instructions | Claude Code best practices: "piling on emphasis mostly makes Claude over-apply the rule"; rules that can't bend belong in hooks | Many stacks' iron-law prose |
| A5 | "Keep going / don't be lazy / loop until done" prompts | Best practices: "more likely to cause over-work than fix a stall"; ImpossibleBench §5.3: retry feedback raises cheating 33 → 38% | Ralph-style loop prompts |
| A6 | Reflect-and-retry without new external evidence | Huang et al. Tables 3–6: accuracy drops; 2608.14659: uncertainty-triggered regeneration −3 to −10 pp | Self-refine style skills |
| A7 | Multi-agent debate as the verifier | Huang Table 7: debate (9 responses) 83.0 vs majority vote 88.2 | "Council"/debate skills |
| A8 | Same-model self-review as the final gate | 2604.06996 (objective rubrics, ×1.7–1.8 for Claude judges); harness-design: agents "confidently prais[e] the work" | Inline "now review your work" steps |
| A9 | Delegating to a subagent "for a better answer" or "to save context" | Best practices: same model, same task, not a smarter answer; 1M window makes the context argument rare. Fresh *reviewers* still help | Many delegation-heavy packs |
| A10 | Parallel subagents writing interdependent code without shared decisions | Cognition (implicit decisions conflict); Anthropic research post (coding less parallelisable) | Swarm-style build skills |
| A11 | Comprehensive, exhaustive skills; four or more skills on one task | SkillsBench Tables 8–9: ≥4 skills +10.1 vs 2–3 +19.0; comprehensive +0.7 vs compact +19.0 | Large catalog packs |
| A12 | Coverage as the measure of new tests | ACH: 49% of mutant-killing tests add no line coverage | Coverage-gate skills |
| A13 | Read-only tests as the only anti-cheat | ImpossibleBench §5.2: special-casing and operator overloading remain | TDD-guard-only setups |
| A14 | Reviewers told to "find problems" without a correctness filter | Best practices: "A reviewer that's asked to find problems will always find something"; fixing everything adds layers and impossible-case tests | Broad "review everything" prompts |
| A15 | Trusting self-reported confidence or "I verified this" | 2608.14659: weak correlation; DGM App. H: hallucinated tool use | Confidence-score gates |
| A16 | Asking the user whether AI made them faster | METR: forecast −24%, felt −20%, measured +19% time | Retro surveys |
| A17 | Proactive actions mid-task | ProCodeBench ≤ 35.6% intent prediction; ProAIDE: mid-task suggestions dismissed 62% | "Auto-fix while you type" ideas |
| A18 | A tool-less summariser as the whole injection defence | CaMeL §2: data flow still manipulable | "Quarantine subagent" alone |
| A19 | Typo-distance or "package exists" checks as the dependency defence | Spracklen §5.4, §6.1: only 13.4% are near-misses; attackers can register names | Checklists |
| A20 | Adding/removing tools or skills mid-session; timestamps in system prompts | Manus (cache + confused references); prompt-caching docs | Dynamic tool loaders |
| A21 | Learning global rules from user edits | CIPHER §4.3: context-agnostic preferences did worse than no learning | "Lessons.md from corrections" without scope |
| A22 | Fixed heavy process on every task | Harness-design: evaluator is overhead within the model's solo boundary; AGENTS.md cost | Always-on brainstorm/plan/review pipelines |
