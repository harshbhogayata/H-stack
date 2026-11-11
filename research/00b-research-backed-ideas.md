# 00b · Research-backed ideas (beyond existing stacks)

Ideas for H-Stack drawn from 2025–2026 papers and engineering posts. "Not found in reviewed stacks" means not seen in the READMEs/skill lists of superpowers, gstack, pstack, mattpocock/skills, addyosmani/agent-skills, ECC; it does not mean nobody anywhere does it.

Researched 2026-11-11 with WebSearch (primary) and Context.dev. Numbers come from abstracts and secondary summaries unless noted; re-check before quoting.

## What the research says that older stacks get wrong

| Finding | Source | Consequence for H-Stack |
|---|---|---|
| Curated skills raise pass rates ~16 pts on average, but **self-generated skills average −1.3 pts**, and 16 of 84 tasks got *worse* with skills. Software engineering gained least (+4.5 pts). | [SkillsBench, arXiv 2602.12670](https://arxiv.org/abs/2602.12670) | Never auto-generate skills silently. Every skill must beat a no-skill baseline on its own eval. Keep coding skills about project-specific procedure, not generic advice. |
| Repo context files (AGENTS.md/CLAUDE.md) **don't improve, and tend to reduce, success** while raising cost >20%. Human-written ones do slightly better; LLM-written ones mostly duplicate docs. | [Evaluating AGENTS.md, arXiv 2602.11988, ICLR 2026](https://arxiv.org/abs/2602.11988) | Tiny always-on context. Only minimal, non-obvious requirements. A/B test our own CLAUDE.md. |
| LLM-consolidated memories **degrade over time and can fall below no memory**; keeping raw episodes doubled accuracy vs forced consolidation. | [Useful Memories Become Faulty…, arXiv 2605.12978](https://arxiv.org/abs/2605.12978) | Episodic-first memory; consolidation only when explicitly gated and reviewed. |
| Full rewrites of an evolving context cause "context collapse"; incremental delta updates of a detailed playbook work better (+10.6% on agent benchmarks). | [ACE, arXiv 2510.04618, ICLR 2026](https://arxiv.org/abs/2510.04618) | Lessons/playbooks are append-and-refine, never regenerated wholesale. |
| Frontier models cheat on impossible tests; **stronger models cheat more**; Claude models cheat mainly by editing tests (>79%). Read-only tests cut cheating while keeping legit success; a strict "stop and explain conflicting tests" prompt cut one model's cheating from ~92% to ~1%. | [ImpossibleBench, arXiv 2510.20270](https://arxiv.org/abs/2510.20270) | Tests read-only during implementation; test edits surfaced to the user; explicit "tests contradict spec → stop" rule. |
| LLMs **cannot reliably self-correct reasoning without external feedback**; performance can drop. | [Huang et al., ICLR 2024](https://arxiv.org/abs/2310.01798) | No "reflect and retry" without a new external signal. |
| LLM judges prefer their own outputs and their own model family's, even with objective rubrics. | [Self-Preference Bias, arXiv 2410.21819](https://arxiv.org/abs/2410.21819); [rubric study, 2604.06996](https://www.alphaxiv.org/abs/2604.06996) | Reviewers run blind (fresh context, no author reasoning), ideally a different model. |
| Context quality drops as input grows, even far below the window limit; worse with similar distractors. | [Chroma "Context Rot" (2025)](https://research.trychroma.com/context-rot) | Watch context use; hand off to a fresh agent before quality drops. |
| ~20% of code samples recommended at least one **non-existent package**; agents remove the human check. | [USENIX Security 2025 via CSA note](https://labs.cloudsecurityalliance.org/research/csa-research-note-slopsquatting-ai-supply-chain-20260419-csa/) | Dependency gate before any install. |
| Separate intent check before acting: asks *fewer* questions yet resolves *more* tasks on underspecified SWE-bench. | ["Ask or Assume?", arXiv 2603.26233](https://arxiv.org/abs/2603.26233); [AgentAbstain 2607.10059](https://arxiv.org/pdf/2607.10059) | Router decides act / ask / stop, with questions scored by value. |
| Proactive intent prediction from real IDE traces is weak (best ~14% pass@1). | [ProCodeBench, arXiv 2605.05700, ICML 2026](https://arxiv.org/abs/2605.05700) | Proactive features *offer*, never act on guesses. |
| Cheap single-pass uncertainty signals correlate only weakly with code correctness. | [arXiv 2608.14659](https://arxiv.org/pdf/2608.14659) | Use disagreement between independent checks, not self-reported confidence. |
| Mutation-guided tests at Meta: engineers accepted 73%; ~49% of useful tests would have been discarded by a coverage-only approach. | [ACH, arXiv 2501.12862](https://arxiv.org/abs/2501.12862) | Judge new tests by mutants killed, not coverage. |
| 14 multi-agent failure modes: spec problems, inter-agent misalignment, bad verification/termination; reviewer agents give false confidence. | [MAST, arXiv 2503.13657, NeurIPS 2025](https://arxiv.org/abs/2503.13657) | Monitor for known failure signatures. |
| Reflective prompt evolution beats RL by ~6 pts avg with up to 35× fewer rollouts. | [GEPA, arXiv 2507.19457, ICLR 2026 oral](https://arxiv.org/abs/2507.19457) | Tune skill text from real trajectories against a fixed eval set. |
| Precomputing context while idle cut per-query cost 2.5× when queries are predictable. | [Sleep-time compute, arXiv 2504.13171](https://arxiv.org/abs/2504.13171) | Use idle time and Routines for prep work. |
| Preferences can be inferred from user edits to agent output, as readable rules. | [PRELUDE/CIPHER, NeurIPS 2024](https://arxiv.org/abs/2404.15269) | Learn from what the user changes after Claude. |
| KV-cache hit rate is the key production metric; append-only context, recite goals at the end, keep errors in context, restorable compression. | [Manus context engineering](https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus) | Cache-aware hooks, hook-maintained recitation, failure log. |
| Long-running work: initializer sets up feature list (`passes: false`) + progress file; each session does one unit and verifies. | [Anthropic, effective harnesses for long-running agents](https://anthropic.com/engineering/effective-harnesses-for-long-running-agents) | Built-in long-run protocol on native `/goal`. |
| Orchestrator–worker beat single agent by 90% on research, using ~15× tokens; vague delegation caused duplicated work. | [Anthropic multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) | Effort-scaling rules and a strict delegation brief. |
| Presenting MCP tools as code APIs cut one workflow from ~150k to ~2k tokens. | [Anthropic code execution with MCP](https://www.anthropic.com/news/code-execution-with-mcp) | Bulk tool work through code, not one call at a time. |
| Code graphs cut tokens and tool calls; accuracy gains are mixed. | [Codebase-Memory, arXiv 2603.27277](https://arxiv.org/abs/2603.27277) | Graph for structural questions only. |
| 96% of developers don't fully trust AI code; manual verification is a recurring cost. | [Sonar State of Code 2026](https://community.sonarsource.com/t/results-from-the-2026-state-of-code-developer-survey-are-here/172502) | Optimise for review effort, not lines produced. |
| Claude Code now has `/goal`, agent view, Routines, Workflows, auto mode, mods. | [Claude Code what's new](https://code.claude.com/docs/en/whats-new) | Build on native primitives; older stacks reinvent loops. |

## H-Stack original ideas

### A. Routing & intent
- **N1 Act / ask / stop router.** Every prompt is classified act, ask or stop (abstain). Questions are ranked by how much the answer would change the outcome; only the top 1–3 are asked. *Not found in reviewed stacks (they always ask or always act).*
- **N2 Assumption ledger.** When proceeding without asking, assumptions are written to a visible list and each becomes a checkable item at the end.
- **N3 Explainable routing.** "Why that?" shows the classifier's reason; the user's correction is saved as a routing example.
- **N4 Suggest-don't-act proactivity.** Predicted next steps appear as offers, never actions (ProCodeBench shows prediction is unreliable).
- **N5 Premise check (anti-sycophancy).** When the user states a cause or fact ("the bug is in X"), treat it as a hypothesis and verify it before building on it; say so respectfully when evidence disagrees.

### B. Context engineering
- **N6 Minimal always-on context, A/B tested.** H-Stack's own always-on text is measured with vs without on a small task set; anything that doesn't help is cut.
- **N7 Hook-maintained recitation.** A hook (not the agent) appends the current goal and step at the end of context after tool batches, so goals stay in the high-attention zone without wasting agent turns on todo updates.
- **N8 Cache-aware injection.** All hook context is appended, stable, deterministically serialised; nothing rewrites earlier context. Cheaper and faster turns.
- **N9 Failure log that survives compaction.** "Tried X, failed because Y" is recorded and re-injected after compaction so the agent never retries a dead end.
- **N10 Restorable compression.** Handoffs keep paths, commands and IDs, not bulky content; anything dropped can be re-fetched.
- **N11 Context-rot guard.** The mod watches context use; past a threshold it writes a handoff and continues in a fresh subagent/session instead of degrading.
- **N12 Hybrid code navigation.** Code graph for structural questions (callers, hubs, impact), grep/read for everything else.

### C. Verification
- **N13 Read-only tests while implementing.** A guard blocks edits to test files outside the "write tests" step; any test change is shown to the user as a diff.
- **N14 Test-tamper scanner.** Flags weakened assertions, skips, raised timeouts, special-cased inputs, monkey-patched clocks, operator overloading tricks.
- **N15 Contradiction stop.** If tests contradict the spec, stop and explain instead of making them pass.
- **N16 External-signal-only retries.** Every retry must cite a new external signal (test output, error, measurement, user input); no blind "reflect and fix".
- **N17 Counterfactual fix check.** Revert the fix → the new test must fail; reapply → it passes. Proves the test actually covers the bug.
- **N18 Diff-targeted mutation check.** Mutate only the changed lines a few ways; new tests must catch the mutants, else they're flagged as weak.
- **N19 Blind cross-review.** Reviewer gets only the diff + spec, fresh context, no author reasoning; uses a different model when available (self-preference bias).
- **N20 Risk-gated tournament.** Only for high-risk changes: 2–4 approaches in worktrees, rubric-based pairwise comparison picks the winner; branch only at uncertain steps to save tokens (EGSS-style).
- **N21 Disagreement as the uncertainty signal.** Escalate verification when independent checks disagree (two reviewers, test vs reviewer), not on self-reported confidence.

### D. Security
- **N22 Dependency gate.** Before any install or manifest edit: package exists, isn't brand new, isn't a near-miss of a popular name, has real usage; otherwise ask.
- **N23 Untrusted-content quarantine (CaMeL-lite).** Web pages, issues, PR comments and fetched docs are tagged untrusted; a tool-less subagent summarises them; while untrusted content is in play, irreversible actions need a confirm.
- **N24 Skill and hook supply-chain scan.** Any third-party skill/hook/MCP config is scanned for injection, exfiltration and odd shell before it's enabled.

### E. Memory & learning
- **N25 Episodic-first memory.** Raw episodes (task, what was tried, outcome, evidence) are the primary record; consolidation into rules is gated, proposed, and human-approved.
- **N26 Delta lessons with provenance.** Lessons are added or refined one item at a time, each linked to the episode that produced it, with a date and a re-check; lessons that stop holding are demoted.
- **N27 Learn from user edits.** Compare what Claude wrote with what the user committed afterwards; infer a readable preference; propose it as a rule.
- **N28 Curated skills only.** Claude may *draft* a skill, but it ships only after passing its eval and user approval (self-generated skills average −1.3 pts).
- **N29 Skill gym (reflective tuning).** Offline: replay real trajectories, let a reflector propose skill-text edits, keep only edits that improve the eval set without regressions (GEPA-style Pareto).
- **N30 Sleep-time prep.** While idle or nightly via Routines: refresh repo map/glossary, triage flaky tests, audit dependencies, pre-answer likely next questions for the open task.

### F. Human factors
- **N31 Review guide with every change.** What changed, risk per hunk, where to look first, what was verified and how. Optimises the reviewer's minutes.
- **N32 Question budget.** Non-blocking questions are batched to the end; blocking ones are capped per task.
- **N33 Change-size governor.** Keeps diffs reviewable; splits large work into stacked steps automatically.

### G. Autonomy & orchestration
- **N34 Native-first.** Use `/goal` for completion conditions, Routines for scheduled work, Workflows/agent view for fan-out, auto mode for permissions; H-Stack supplies the conditions and checks, not another loop engine.
- **N35 Long-run protocol.** Initializer writes a feature list (all `passes: false`) + progress file; each session/iteration does one item, verifies, updates both.
- **N36 Effort-scaling rules.** Explicit budgets by task size: direct = 0 subagents; light = ≤1; full = 2–5 with a lead; tournament only when risk is high.
- **N37 Delegation brief standard.** Every subagent brief: objective, scope boundary, output format, tools, what's already known, done-criteria.
- **N38 Failure-signature monitor.** Detects MAST-style failures live: repeated identical tool calls, premature "done", ignoring a subagent's result, unverified completion; intervenes with a factual note.

### H. Cost
- **N39 Model routing by step.** Triage/classification on a small model; architecture, debugging and review on the strongest; per-step via mods `turn.step` or skill `model`.
- **N40 Code-mode for bulk tool work.** When many tool calls are needed, write a script that calls them instead of looping through tool calls.

### I. Keeping H-Stack itself honest
- **N41 No unproven skills.** Each skill ships with an eval; it must beat the no-skill baseline or it's removed.
- **N42 Retire skills the model has outgrown.** Re-run evals on each new model release; a skill the base model now passes without is retired.
- **N43 Activation telemetry (local).** Which skill was picked, used, and whether the user corrected course; feeds N3 and N29.
- **N44 Invest where skills help most.** SkillsBench shows small gains for generic coding advice and large gains for specialised procedure; H-Stack skills encode project- and domain-specific procedure, not general best practice.

## H-Stack decision
_Not decided yet._
