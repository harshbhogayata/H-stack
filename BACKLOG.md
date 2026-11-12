# H-Stack backlog

One de-duplicated, prioritised list of everything the research proposed, shaped to [CLAUDE.md](CLAUDE.md):
- **Distilled and native-first.** Use Claude Code's built-in systems wherever they exist.
- **Adopt and adapt.** Import the top-ranked existing skills, credit them, and strip house styles.
- **Full scope.** Every category and every layer.
- **Lean testing.** A ~10-task smoke test with skill-creator's benchmark, not a custom harness.

The design behind these items is in [ARCHITECTURE.md](ARCHITECTURE.md). Built 2026-11-11 from:

| Source set | IDs | Count | File |
|---|---|---:|---|
| Experience ideas | E1–E20 | 20 | [research/00-activation-and-experience.md §3](research/00-activation-and-experience.md) |
| Research-backed ideas | N1–N56 | 56 | [research/00b-research-backed-ideas.md](research/00b-research-backed-ideas.md) |
| Beyond every stack | N100–N132 | 33 | [research/00c-beyond-every-stack.md §3](research/00c-beyond-every-stack.md) |
| Cloudflare ideas (numbered 1–38 in the file, in order) | C1–C38 | 38 | [research/cloudflare/ideas-for-h-stack.md](research/cloudflare/ideas-for-h-stack.md) |
| DeepSeek Harness ideas | D1–D22 | 22 | [research/deepseek-harness.md §8](research/deepseek-harness.md) |
| Anti-ideas | A1–A22 | 22 | [research/00c-beyond-every-stack.md §5](research/00c-beyond-every-stack.md) |
| **Total** | | **191** | |

The 169 ideas merge into **85 items (HS-001…HS-085)**. The 22 anti-ideas are in [Will not do](#will-not-do). The skills to import per category are in [Skill imports by category](#skill-imports-by-category) (IM-01…IM-16). No source idea was dropped whole; every adjustment is listed in [Anti-idea, licence and native check](#anti-idea-licence-and-native-check).

**Fields per item**

| Field | Values |
|---|---|
| Layer | Evals, Self-checks/CI, Skill index, Activation, Guards, State & memory, Visibility, Telemetry, Skills (category NN), Docs, Distribution |
| **Mode** | **Native — configure only**: a built-in feature does it; H-Stack ships settings or docs. **Thin**: a native feature does most of it; H-Stack adds a small, named piece. **Import**: an existing permissively licensed skill is adopted and adapted. **Build**: nothing qualifies, so H-Stack writes it. |
| Priority | **P0**: the core of the full stack. **P1**: next. **P2**: later. A P2 item marked "if a problem shows up" follows CLAUDE.md's "grow the test set only when a real problem shows up". |
| Size | S ≤ 1 day · M ≤ 1 week · L > 1 week |
| Metric | The primary North-star metric the item should move |
| Problem, mechanism, evidence, context-over-templates check | One line each |

Where an item's priority differs from the one given in 00c, the item says so and why.

## Summary

| Layer | P0 | P1 | P2 | Total |
|---|---:|---:|---:|---:|
| Evals | 4 | 1 | 4 | 9 |
| Self-checks/CI | 3 | 2 | 0 | 5 |
| Skill index | 1 | 1 | 0 | 2 |
| Activation | 4 | 5 | 1 | 10 |
| Guards | 6 | 10 | 2 | 18 |
| State & memory | 4 | 4 | 3 | 11 |
| Visibility | 0 | 1 | 1 | 2 |
| Telemetry | 0 | 1 | 1 | 2 |
| Skills (category NN) | 1 | 10 | 10 | 21 |
| Docs | 2 | 0 | 0 | 2 |
| Distribution | 1 | 1 | 1 | 3 |
| **Total** | **26** | **36** | **23** | **85** |

| Mode | Items |
|---|---:|
| Native — configure only | 10 (HS-002, 003, 007, 008, 026, 029, 043, 054, 076, 077) |
| Thin | 25 |
| Import | 5 HS items (HS-062, 063, 065, 069, 070). Separately, the IM table has 18 skill imports, 7 native picks and 1 build across all 16 categories |
| Build | 45 |

**P0, the core of the full stack:**

| Area | Items |
|---|---|
| Smoke test | HS-001, HS-002, HS-003, HS-005 |
| Context and output contract | HS-010, HS-011, HS-012 |
| Skill index | HS-015 |
| Activation | HS-017, HS-018, HS-020, HS-022 |
| Guards | HS-027, HS-028, HS-029, HS-030, HS-031, HS-033 |
| State and memory | HS-045, HS-046, HS-048, HS-049 |
| Rubric before code | HS-060 |
| Docs | HS-081, HS-082 |
| Supply-chain record | HS-083 |
| Skill imports | P0 rows of IM-01…IM-16: core rules, orchestration (built), planning, TDD, debugging, review, skill tooling |

Milestones are in [ARCHITECTURE.md §11](ARCHITECTURE.md#11-build-order).

---

## Skill imports by category

The top-ranked skill per job from `research/01–16`, imported when its licence allows.

**Import rules (CLAUDE.md):**
- Read every file in full first.
- Keep the upstream LICENSE and copyright notice in the skill folder.
- Record repo, path, commit and the changes made in `plugins/h-stack/THIRD_PARTY.md`.
- Strip house styles, fixed templates and preset palettes.
- Set `user-invocable: false`.
- Move trigger phrases into `when_to_use`.
- Reword all-caps "iron law" prose into plain statements (A4), with must-never-slip rules moved into hooks.
- Trim to the context budget (HS-010).

Upstream commits are pinned at import time; the research snapshot is 2026-11-11.

**Content is human-curated, never generated.** Self-generated skills scored below no skills in SkillsBench v4 (−8.1 to −11.5 pp).
- Skill content comes from these imports plus the project's context.
- skill-creator is used for scaffolding, `evals/evals.json`, benchmarking, blind A/B comparison and description tuning.
- skill-creator is never used to write content unsupervised.
- An import ships only if its skill-creator benchmark beats the no-skill run.

| IM | Cat. | Job | Pick | Repo › path | Licence | Mode | Adaptations needed | Pri. | Status |
|---|---|---|---|---|---|---|---|---|---|
| IM-01 | 01 | Never claim done without fresh evidence | verification-before-completion | [obra/superpowers](https://github.com/obra/superpowers) › `skills/verification-before-completion` | MIT | Import | Reword iron-law prose (A4). The Stop gate (HS-027) enforces it; the skill teaches the "name the proving command" habit | P0 | done — skills/core-rules (benchmark iteration-2: 0.89 vs 0.78, +0.11) |
| IM-01 | 01 | Small, testable working principles | Karpathy guidelines (four rules) | [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) › `CLAUDE.md` | MIT | Import → `.claude/rules/` (opt-in, OD-4) or skill | Split into path-scoped rule files of a few lines each; no always-on block | P0 | done — skills/core-rules sections 2-5 + rules-templates/*.md path-scoped, opt-in via scripts/setup.mjs |
| IM-02 | 02 | Pick the right skill, no slash commands | — (nothing qualifies: every router in 02 assumes slash commands or a fixed pipeline) | — | — | **Build** (HS-015, 017, 018, 022) | Ideas taken: superpowers SessionStart router, pstack router + playbooks, mattpocock `ask-matt` | P0 | done — built: hooks/session-start.mjs (router), hooks/classify.mjs (classifier), event triggers in ledger.mjs/gate-bash.mjs, index.json |
| IM-03 | 03 | Clarify before building | grilling | [mattpocock/skills](https://github.com/mattpocock/skills) › `skills/productivity/grilling` | MIT | Import | Feeds the "ask" branch of HS-020; keep the frontier-round exit rule | P1 | done — skills/clarify full mode (benchmark iteration-2: 1.00 vs 0.89, +0.11) |
| IM-04 | 04 | Plans with checkable steps | writing-plans + executing-plans | obra/superpowers › `skills/writing-plans`, `skills/executing-plans` | MIT | Import | Plans must use the project's own layout and test commands, not fixed code templates. Add the Interfaces section (HS-060) | P0 | done — skills/planning + references/executing.md (benchmark iteration-2: 1.00 vs 0.87, +0.13) |
| IM-05 | 05 | Test-first implementation | tdd | mattpocock/skills › `skills/engineering/tdd` | MIT | Import | Declares the "test-writing step" that HS-028 reads | P0 | done — skills/tdd (benchmark iteration-2: 0.89 vs 0.78, +0.11) |
| IM-05 | 05 | Simplify after green | code-simplifier (official plugin) | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) › `plugins/code-simplifier` | Apache-2.0 | Native — configure only (recommend installing it) | — | P1 | done — native: scripts/setup.mjs recommends code-simplifier@claude-plugins-official; not copied |
| IM-06 | 06 | Root cause before fix | systematic-debugging | obra/superpowers › `skills/systematic-debugging` | MIT | Import | Add the new-signal retry rule (HS-069), the counterfactual check (HS-066) and the repro harvest (HS-067). Reword the iron law | P0 | done — skills/debugging + scripts/verify-fix.mjs. 3-run blind benchmark iteration-6: 1.00 vs 0.93 on 6 evals (3 hard: shared mutable defaults, timezone due dates, second caller) |
| IM-07 | 07 | Code review | built-in `/code-review` skill | Claude Code built-in | n/a | Native — configure only | Routed by the classifier; the review lanes (HS-061) sit on top | P0 | done — native: classifier routes review requests to the built-in code-review skill (lib/pure/classify-rules.mjs NATIVE) |
| IM-07 | 07 | Receiving review well | receiving-code-review | obra/superpowers › `skills/receiving-code-review` | MIT | Import | — | P1 | done — skills/review/references/receiving.md. Review skill: 3-run blind benchmark iteration-6 0.94 vs 0.91 on 6 evals (3 hard); one regression fixed (duration-spec, reported spec-defined float results as bugs; now 1.00 vs 0.83). Earlier iteration 1 was 0.89 vs 1.00 (severity vs verdict), fixed |
| IM-08 | 08 | Verify UI in a real browser | webapp-testing | [anthropics/skills](https://github.com/anthropics/skills) › `skills/webapp-testing` | Apache-2.0 | Import | Treat page content as untrusted (HS-032) | P1 | done — skills/qa (webapp-testing with_server.py + H-Stack SKILL.md). 3-run blind benchmark iteration-7: 0.96 vs 0.93 on 6 evals (3 hard); fixes after measurement: regression tests proven on a scratch fix, injected page instructions reported (swallowed-422 now 0.92 vs 0.83). The +0.44 at iteration 1 was inflated: the with-skill arm could read evals.json until iteration 5 |
| IM-09 | 09 | Always-on security review | security-guidance (official plugin) + built-in `/security-review` | claude-plugins-official › `plugins/security-guidance` | Apache-2.0 | Native — configure only | — | P1 | done — native: built-in /security-review routed by the classifier; setup recommends security-guidance@claude-plugins-official |
| IM-09 | 09 | Full audits on request | security-audit | [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) › `skills/security-audit` | MIT | Import (source of HS-062, HS-063) | Guidance mode by default (HS-016). Wire its validators into SubagentStop | P1 | done — skills/security-audit, guidance mode by default, full audit on explicit phrases; validators shipped. 3-run blind benchmark iteration-6: 0.97 vs 0.94 on 6 evals (3 hard: IDOR via router prefix, shell regex, report triage). Upstream tests not executed (auto mode blocked downloaded code) |
| IM-10 | 10 | UI correctness (a11y, motion, metadata) | baseline-ui | [ibelick/ui-skills](https://github.com/ibelick/ui-skills) › `skills/baseline-ui` | MIT | Import | Check-only rules, no style | P1 | done — skills/design-ui/references/baseline.md, check-only. design-ui 3-run blind benchmark iteration-6: 1.00 vs 0.99 on 6 evals (within noise); sameness fit 0.93 vs 0.73 |
| IM-10 | 10 | Design direction | frontend-design | anthropics/skills › `skills/frontend-design` | Apache-2.0 | Import | **Strip the fixed aesthetic bans and preferences.** Derive the direction from the project's own design files, brand and users; the sameness check applies | P1 | done — skills/design-ui/references/direction.md, fixed preferences stripped, used only without a project design system. design-ui 3-run blind benchmark 1.00 vs 0.99; sameness check across three projects: fit 0.93 vs 0.73, similarity 0.19 vs 0.14 |
| IM-11 | 11 | Memory across sessions | auto memory + CLAUDE.md + claude-md-management (official plugin) | Claude Code built-in; claude-plugins-official › `plugins/claude-md-management` | n/a; Apache-2.0 | Native — configure only, plus the thin pieces in HS-048…HS-050 | — | P0 | done — native: scripts/setup.mjs enables auto memory and raises cleanupPeriodDays; claude-md-management recommended; thin pieces HS-048/049/050 |
| IM-11 | 11 | Handoff to another session | handoff | mattpocock/skills › `skills/productivity/handoff` | MIT | Import | Align its sections with the checkpoint schema (HS-047) | P1 | done — skills/memory handoff aligned with the checkpoint schema (benchmark iteration-1: 0.78 vs 0.44, +0.33) |
| IM-12 | 12 | Office files and PDFs | docx, pdf, pptx, xlsx (official) | anthropics/skills › `skills/docx` and siblings | Apache-2.0 (LICENSE.txt in `skills/docx` read 2026-11-11) | Native — configure only (install the official plugin; don't copy) | — | P2 | done — native: setup recommends the official Office/PDF skills from anthropics/skills; not copied |
| IM-12 | 12 | Writing for agents (skills, rules, docs) | writing-for-agents | mattpocock/skills › `skills/productivity/writing-for-agents` | MIT | Import | Used when H-Stack writes rules, lessons and skills | P1 | done — skills/writing/references/for-agents.md. writing 3-run blind benchmark iteration-6: 1.00 vs 0.93; sameness fit 0.92 vs 0.85 |
| IM-12 | 12 | Plain prose, no AI tells | unslop | [cursor/plugins](https://github.com/cursor/plugins) › `pstack/skills/unslop` | MIT | Import | — | P2 | done — skills/writing/references/plain-prose.md, punctuation rules yield to the project's style guide. writing 3-run blind benchmark 1.00 vs 0.93 |
| IM-13 | 13 | Finish a branch, worktrees | finishing-a-development-branch + using-git-worktrees | obra/superpowers › `skills/finishing-a-development-branch`, `skills/using-git-worktrees` | MIT | Import | Merging goes through HS-030 | P1 | done — skills/git-ship/references/finishing.md + worktrees.md; merges via the irreversible gate (benchmark iteration-1 for git-ship: 1.00 vs 0.72, +0.28) |
| IM-13 | 13 | PR bodies with evidence; merge conflicts | pr, resolving-merge-conflicts | mattpocock/skills › `skills/engineering/pr`, and the resolving-merge-conflicts skill (path to confirm at import) | MIT | Import (pr is the base of HS-065) | Add receipts and the "Not verified" section | P1 | done — pr imported as skills/git-ship SKILL.md review guide with receipts and Not verified (benchmark iteration-1: 1.00 vs 0.72, +0.28). resolving-merge-conflicts dropped: the upstream skill is archived (THIRD_PARTY.md dropped row); git-ship covers conflicts in its own words |
| IM-14 | 14 | Long runs, scheduling, fan-out | `/goal`, cloud scheduled tasks (Routines), Workflows, subagents, worktrees, `/batch`, agent view | Claude Code built-in | n/a | Native — configure only, plus the thin pieces in HS-071 and HS-041 | — | P1 | done — native: /goal, Routines, Workflows, subagents and worktrees used by skills/long-run; thin pieces HS-071 (protocol) and HS-041 (spawn governor) built |
| IM-14 | 14 | Parallel agents on independent work | dispatching-parallel-agents | obra/superpowers › `skills/dispatching-parallel-agents` | MIT | Import | Add the decision ledger (HS-052) to its brief | P2 | done — skills/long-run/references/parallel.md with the decision-ledger brief (benchmark iteration-1 for long-run: 1.00 vs 0.72, +0.28) |
| IM-15 | 15 | Skill scaffolding, evals, benchmark, trigger tuning | skill-creator | anthropics/skills › `skills/skill-creator` (also `skill-creator@claude-plugins-official`) | Apache-2.0 | Native — configure only | Used for every skill (HS-002) | P0 | done — native: classifier routes skill authoring to skill-creator; its evals.json format and benchmark layout are used for every skill (evals/skill-bench.mjs); recommended companion in setup |
| IM-16 | 16 | Research with cited primary sources | research | mattpocock/skills › `skills/engineering/research` | MIT | Import | — | P2 | done — skills/research. 3-run blind benchmark iteration-6: 0.97 vs 0.94 on 6 evals (3 hard: stale README vs installed code, untrusted page with injected instruction, wrong top search result); untrusted-page regression fixed (now reports injected instructions, 1.00 vs 0.83) |

**Not imported** (ideas only):

| Candidate | Reason |
|---|---|
| Trail of Bits skills (09) | CC BY-SA 4.0 |
| context-mode (11) | ELv2 |
| vercel `web-design-guidelines` and `writing-guidelines` (10, 12) | Remote rule fetching |
| Orca orchestration (14) | Hidden runtime instructions |
| last30days (16) | Cookie requests |
| caveman (01), claude-mem (11), OpenSpec (04) | Default-on telemetry |
| mcp_agent_mail | Anti-Anthropic rider |
| UI UX Pro Max and Taste Skill (10) | Preset palettes and styles break context-over-templates |
| Humanizer (12) | Built from Wikipedia's "Signs of AI writing" list, so possible CC BY-SA derivation; not verified, so treated as ideas only |
| ralph-loop (14) | Superseded by native `/goal` |
| commit-commands (13) | Slash commands only |

---

## Conflicts and how they are resolved

| # | Conflict | Items | Resolution and reason |
|---|---|---|---|
| K1 | **ACE evolving playbooks vs a minimal always-on context.** ACE: +10.6% on AppWorld. Context files: +20–23% cost with no significant gain. ACE also degrades over long horizons (2605.12978). | HS-049, HS-010 | Keep ACE's itemised delta and counters, but lessons are never always-on. They are path-scoped rule files that load only when matching files are touched, plus trigger-matched retrieval (≤2) carrying a raw evidence excerpt. |
| K2 | **Multi-agent gains (+90.2% research, dsh Teams +10 pts) vs cost (~15×) and coupling** | HS-041, HS-025, HS-061, HS-072, HS-052 | One agent for coding by default. Subagents for read-only research and review. Size-based budgets via `agent.spawn`. Lanes and tournaments only below the measured solo boundary. Parallel writers log implicit decisions. |
| K3 | **Forced-evaluation activation (84%) vs the budget and A4** | HS-018 | Not adopted. At most one factual line naming ≤2 skills. |
| K4 | **SessionStart router (superpowers) vs the AGENTS.md cost evidence** | HS-017 | Kept P0 because the no-slash activation design needs it. It has a hard token cap and is cut if the smoke test shows no gain over per-prompt classification alone. |
| K5 | **Checkpoint "merge prior, drop stale" (D8) and native auto-memory merges vs append-only memory** | HS-047, HS-050 | A new checkpoint per compaction, old ones kept. Auto-memory rewrites are shadow-logged with a restore option. |
| K6 | **Read-only tests vs TDD and legitimate test changes** | HS-028, IM-05 | Phase-based. Edits are allowed in the test-writing step the TDD skill declares; otherwise ask, showing the diff. The tamper scan runs always. |
| K7 | **"Irreversible verbs are human-only" (C4) vs autonomy** | HS-030, HS-077 | Ask with approval binding; opt-in allowlist per project; never merge on H-Stack's own initiative. These asks count as necessary interventions. |
| K8 | **Proactivity (E15, N30) vs A17** | HS-024, HS-076, HS-077 | Offers at boundaries. Auto-fix only with a per-PR opt-in. |
| K9 | **Small-model classifier vs cost and latency** | HS-018, HS-019 | Rules-only at P0. The model fallback is P1 and needs a measured recall gain (OD-1). |
| K10 | **Several Stop checks vs nagging and the 8-continuation cap** | HS-027, HS-028, HS-040, HS-046 | One Stop dispatcher, one combined note, at most one block per stop, never on turns without edits. |
| K11 | **Cross-family review vs availability, egress, and dsh's same-model review** | HS-061 | A different family only if configured (OD-7). Otherwise a fresh Claude reviewer plus deterministic validators, never the sole final gate (A8). |
| K12 | **Shallow detector (N51) vs "default to no findings" (C20, A14)** | HS-063 | Empty + full `Cleared:` = accept. Empty + thin coverage = re-run from a new angle. |
| K13 | **Learning from corrections (E10, native auto-memory `feedback`) vs A1, A2, A21** | HS-049, HS-051 | Native `feedback` memories stay machine-local notes. Promotion to a committed lesson needs a context key, an evidence excerpt and approval. |
| K14 | **Catalogue breadth vs the listing budget** (1,536 characters per skill; ~3.8k tokens for 10 maxed-out listings) | HS-015, HS-010 | About one listed skill per category. Playbooks live in `references/` and load on demand (OD-8). |
| K15 | **Guards everywhere vs dsh's guard that didn't pay** | Guards | Each guard has a with/without smoke-test reading. A guard that makes results worse is dropped (CLAUDE.md). Per-component ablation is P2, run if a problem shows up (HS-006). |
| K16 | **Recitation and per-batch notes vs cache and context** | HS-055, HS-011 | Digest-gated, P2, ships only with a measured gain. |
| K17 | **Per-step model routing (E17) vs the prompt cache** | HS-041 | Per subagent or per skill only. |
| K18 | **Rubric before code vs A22** | HS-060, HS-025 | Only for `full` tasks below the solo boundary. |
| K19 | **Native auto memory consolidates by rewriting vs the evidence that rewriting degrades memory** (2605.12978 Table 5) | HS-048, HS-049, HS-050 | Use auto memory; don't replace it. Shadow-log its rewrites. Keep evidence excerpts with the lessons that matter. |
| K20 | **skill-creator's end-to-end authoring vs SkillsBench** (self-generated −8.1 to −11.5 pp) | HS-081, HS-080, IM table | skill-creator does scaffolding, evals, benchmarking, A/B and trigger tuning. Content is imported or human-written from the research and the project. |
| K21 | **skill-creator's subagent-based baseline vs H-Stack's hooks** | HS-001 | Hooks fire session-wide, so a "without" subagent in the same session still runs H-Stack's guards and classifier. The whole-stack smoke test therefore uses separate `claude -p` runs with and without the plugin loaded, written into skill-creator's workspace layout. Per-skill benchmarks keep skill-creator's own flow. |
| K22 | **Research's paired cases, pass^3, ablation and bare-bash arms vs CLAUDE.md's lean smoke test** | HS-001, HS-002, HS-004, HS-006 | CLAUDE.md is binding. The research mechanisms are kept as P2 "if a problem shows up". The paired idea survives cheaply as skill-creator's should/shouldn't-trigger sets. |
| K23 | **Imported skills vs context-over-templates and the context budget**: imports carry house style, size and "YOU MUST" prose | IM table, HS-081, HS-013 | Each import is adapted (styles stripped, prose reworded, trimmed), the changes are recorded in THIRD_PARTY.md, and it is benchmarked against no-skill. |

---

## Items

### Evals

#### HS-001 · Whole-stack smoke test (~10 real tasks, with vs without H-Stack)
**Evals · Thin · P0 · M · Reliability (reads all five) · Depends on: — · Sources: N41, D15**
- **Status.** needs-user (smoke-test tasks: evals/run-smoke.mjs, evals/tasks.json format and evals/check-tasks.mjs are built and the runner self-test passes in both arms (evals/results/iteration-0); the ~10 real tasks from the user's projects and their results need the user (OD-6, M1))
- **Problem.** Nothing about H-Stack can be claimed without a with/without comparison on real work.
- **Mechanism.**
  - **Tasks.** About 10 of the user's real tasks. Each has a prompt (skill-creator `evals.json` format), a fixture (repo at a commit) and a `check` script.
  - **Runs.** Each task runs as separate `claude -p --output-format json` processes in a clean config dir: one with `--plugin-dir plugins/h-stack`, one without. Not subagents (K21).
  - **Checks.** "Verify the world": the `check` script re-runs the project's tests and commands and re-reads files from outside the agent.
  - **Results.** Go into skill-creator's workspace layout (`iteration-N/eval-<name>/with_skill|without_skill/`, `grading.json`, `timing.json`) and are aggregated with skill-creator's `aggregate_benchmark` and viewer.
  - **Cadence.** Re-run after meaningful changes; drop anything that makes results worse.
- **Evidence.**
  - [CLAUDE.md](CLAUDE.md) "Lean smoke test".
  - skill-creator SKILL.md "Running and evaluating test cases" and `references/schemas.md` (read 2026-11-11).
  - dsh `docs/testing.md`: "An e2e assertion re-runs the command… a keyword probe on the agent's own output lets a cheating agent pass" ([deepseek-harness.md §6, D15](research/deepseek-harness.md)).
  - Hooks fire for every tool call in the session, subagents included ([hooks docs](https://code.claude.com/docs/en/hooks)).
- **Context-over-templates.** Tasks come from the user's own projects. Checks run each project's own tests and linters.

#### HS-002 · Per-skill evals and trigger tuning with skill-creator
**Evals · Native — configure only · P0 · S per skill · Reliability · Depends on: HS-001 · Sources: N123, C27**
- **Status.** done — every skill has evals/evals.json (>=3 prompts, objective checks) and a skill-creator-layout with/without benchmark (evals/skill-bench.mjs, results in evals/results/skills/); trigger sets for all 15 skills (tests/triggers/core.json) run through the classifier in CI; description optimisation run with evals/description-optimizer.mjs (skill-creator's method in zero-dependency Node: native triggering with hooks disabled, 60/40 train/held-out, 3 runs per query, Claude proposes rewrites from train failures, kept only if held-out doesn't drop): 8 of 15 descriptions changed (tdd, clarify, core-rules, review, research, qa, design-ui raised train accuracy with held-out unchanged); planning, writing and debugging found no better candidate; held-out stays low (<=0.5) for core-rules, design-ui, planning, writing and git-ship on native triggering alone, which H-Stack's classifier covers (90% load in real sessions). Report: evals/results/description-optimizer/2026-11-11T16-02-35.json
- **Problem.** Activation without slash commands depends on descriptions that trigger when they should and stay quiet when they shouldn't. One-sided tests reward one-sided behaviour.
- **Mechanism.**
  - **Per skill.** Every skill keeps `evals/evals.json` (2–3 real prompts, objective assertions) and runs skill-creator's with-skill vs without-skill benchmark (pass rate, tokens, time).
  - **Trigger set.** About 20 queries, should-trigger and should-not-trigger, tuned with skill-creator's description optimiser (60% train / 40% held-out, 3 runs per query).
  - **Version changes.** Use skill-creator's blind comparison.
  - **Whole-stack activation.** The router, classifier and event triggers are hooks, so they are checked with `claude plugin eval`'s native with/without arms and a `tool_used: Skill` grader.
  - **pass^3** for gates: P2, if flakiness shows up.
- **Evidence.**
  - AgentAbstain's paired design.
  - Anthropic evals post: "One-sided evals create one-sided optimization" ([00c N123](research/00c-beyond-every-stack.md)).
  - Cloudflare Flue: one trigger case and one clean counterexample per rule ([C27](research/cloudflare/ideas-for-h-stack.md)).
  - skill-creator "Description Optimization" section.
  - plugin-eval docs: `tool_used` grader, two arms.
- **Context-over-templates.** Prompts come from real use in different projects.

#### HS-003 · Objective assertions and judge hygiene
**Evals · Native — configure only · P0 · S · Reliability · Depends on: HS-001 · Sources: N124**
- **Status.** done — checks run outside the agent and grade first (exit codes, file bytes, regex); judge grading is binary with evidence and 'Unknown' allowed in the smoke runner; pairwise grading not used; plugin-eval cases use regex/tool_used graders on the trace
- **Problem.** An LLM judge from the same family grades Claude's output leniently.
- **Mechanism.**
  - **Assertions.** Deterministic wherever possible: exit codes, file bytes, regex. skill-creator asks for "objectively verifiable" assertions.
  - **LLM-judged items.** Binary, with an "Unknown" option.
  - **Judge model.** A stronger or different model when one is available.
  - **Pairwise grading.** Never the main signal.
  - **Plugin-eval cases.** Decisive evidence goes in the last 12 messages.
- **Evidence.**
  - Claude judges ×1.71–1.78 self-preference on objective rubrics, with pairwise the worst format (2604.06996).
  - The plugin-eval judge sees the first 12 and last 12 messages ([00c N124](research/00c-beyond-every-stack.md)).
- **Context-over-templates.** n/a.

#### HS-004 · Impossible-task canaries
**Evals · Thin · P2 (if tampering shows up in the smoke test; 00c: P1) · S · Reliability · Depends on: HS-001 · Sources: N125**
- **Status.** done — tampering rate read from the smoke tasks: evals/run-smoke.mjs hashes protected_tests before/after each run (byte-identical check); canary tasks are added only if tampering shows up, which needs real smoke-test results
- **Problem.** A change can make Claude "pass" by cheating.
- **Mechanism.** Until a problem shows up, the tampering rate is read from the smoke tasks by checking that protected test files are byte-identical. If tampering appears, add 2–5 tasks whose tests contradict their spec; passing one is a failure.
- **Evidence.** ImpossibleBench: Claude cheats >79% of the time by modifying tests; prompt wording moved GPT-5 from >85% to 1% ([00b](research/00b-research-backed-ideas.md)).
- **Context-over-templates.** n/a.

#### HS-005 · Smoke-test assertions for the five metrics and the sameness check
**Evals · Thin · P0 · S · All five · Depends on: HS-001 · Sources: CLAUDE.md North star (no idea ID)**
- **Status.** done — evals/run-smoke.mjs grades false-done, tampering (protected tests byte-identical), necessary vs unnecessary questions, unaided, cost per solved task and sameness (Jaccard of the two contexts' diffs per context_group). Skill-level sameness check: evals/sameness.mjs with three real fixture projects (children's reading app, bank admin tool, developer CLI) and the same request per skill, graded blind to context and arm on the applicable fit criteria: design-ui fit 0.93 vs 0.73 (after a fix for projects without a GUI), writing 0.92 vs 0.85, planning 0.97 vs 0.80; cross-context similarity 0.13-0.19 in both arms (no template sameness). Results in evals/results/sameness/
- **Problem.** skill-creator's benchmark reports pass rate, tokens and time, but not false-done, tampering, questions or sameness.
- **Mechanism.** Standard assertions added to every task's grading:
  - **False-done.** The final message claims success while `check` fails.
  - **Tampering.** Protected test files changed.
  - **Questions.** Necessary vs unnecessary, from a per-task `needs_question` flag.
  - **Unaided.** No scripted answer was needed.
  - **Learning.** Repeat runs with memory kept.
  - **Sameness.** 2 of the ~10 tasks run in 2 different contexts; graded on conformance to each context and on cross-context similarity.

  Definitions are in [ARCHITECTURE §8.4](ARCHITECTURE.md#84-what-is-measured).
- **Evidence.** [CLAUDE.md](CLAUDE.md). METR: forecast −24%, measured +19% (measure, don't ask) ([00c N121](research/00c-beyond-every-stack.md)).
- **Context-over-templates.** The sameness check is this rule, measured.

#### HS-006 · Retire skills the model has outgrown; extra arms when needed
**Evals · Thin · P1 · M · Cost · Depends on: HS-001, HS-002 · Sources: N42, N126, D3**
- **Status.** needs-user (judgement call, decided by the user on 2026-11-12: leave HS-006 open until the user adds an ANTHROPIC_API_KEY and a permission rule for node evals/run-smoke.mjs, then run the bare and ablate:stop arms with the smoke test. Background: two blockers, stated separately. (1) Credentials: the bare-agent arm uses claude --bare, which authenticates only with ANTHROPIC_API_KEY, and this environment has none. (2) Outside the allowed list, a permission decision: Claude Code's auto mode refused to start sessions with H-Stack's safety gates switched off (ablate:stop, ablate:all: 'Create Unsafe Agents') and refused a flag-built bare agent ('Auto-Mode Bypass'); I did not work around either refusal, so the safety-gate ablation is unmeasured until the user allows it. Built and run: evals/retire-check.mjs + the HS-006 rule applied after harder evals: the five skills that tied at 1.00 (debugging, design-ui, research, review, security-audit) and qa got 3 new hard evals each (6 total), run at 3 runs per arm with blind tool-less graders and evals hidden from the with-skill arm. All beat no-skill, so none retired: debugging 1.00 vs 0.93, research 0.97 vs 0.94, review 0.94 vs 0.91, security-audit 0.97 vs 0.94, qa 0.96 vs 0.93, design-ui 1.00 vs 0.99 (within noise; design-ui also leads the sameness check, fit 0.93 vs 0.73). Two with-skill regressions on single evals were fixed and re-run (research untrusted-page 1.00 vs 0.83, review duration-spec 1.00 vs 0.83), plus qa swallowed-422 0.92 vs 0.83. P2 arms: HSTACK_DISABLE switches named hooks and mod components off (unit + mod tests); evals/run-smoke.mjs has ablate:<component> and bare arms. Ablation ran on the example task (with, without, ablate:classify, ablate:session-start all pass; one trivial task cannot separate them, the smoke tasks will). The bare arm needs an ANTHROPIC_API_KEY: claude --bare authenticates only with that key, which this environment does not have, and a flag-built equivalent (no hooks, Bash only, one-line system prompt) was refused by auto mode)
- **Problem.** Scaffolding that helped an older model becomes overhead on a newer one.
- **Mechanism.**
  - **P1.** On each model release, re-run every skill's skill-creator benchmark. A skill the base model now passes without is retired.
  - **P2, if a problem shows up:**
    - one-component ablation of hooks and mods via `HSTACK_DISABLE`;
    - a bare bash-only arm (`--bare --tools Bash`, one-line prompt) to check H-Stack isn't below a minimal agent.
- **Evidence.**
  - Harness-design post: "every component in a harness encodes an assumption about what the model can't do"; one-at-a-time removal worked ([00c N126](research/00c-beyond-every-stack.md)).
  - Same checkpoint: DSH Minimal 90.6 vs DSH Standard 85.8 ([deepseek-harness.md D3](research/deepseek-harness.md)).
- **Context-over-templates.** n/a.

#### HS-007 · Effort and model settings from measurement
**Evals · Native — configure only · P2 · S · Cost · Depends on: HS-002 · Sources: D16**
- **Status.** done — evals/skill-bench.mjs --effort; tdd and planning at low vs session default (iteration-3 vs iteration-2): pass rates unchanged (tdd 0.89, planning 1.00), tokens -17% / -23%, time -22% / -24%. Frontmatter effort left unset: the field overrides the user's session effort for the whole turn, and 3 small fixtures at 1 run per arm don't justify that on real work; re-check on the smoke tasks
- **Problem.** Skill `effort` and `model` are set by guesswork.
- **Mechanism.** Run a skill's skill-creator benchmark at two `--effort` levels and set the frontmatter from the tokens/pass curve.
- **Evidence.** dsh effort 25 → 100: TB2.1 82.4 → 90.6; the 60–80 range recovers most of the accuracy at under half the tokens ([deepseek-harness.md §5.1](research/deepseek-harness.md)).
- **Context-over-templates.** n/a.

#### HS-008 · Skill tuning on real trajectories
**Evals · Native — configure only · P2 · M · Learning · Depends on: HS-002, HS-058 · Sources: N29, C26**
- **Status.** done — descriptions: evals/description-optimizer.mjs (held-out 40%, see HS-002; report evals/results/description-optimizer/2026-11-11T16-02-35.json). Content edits from real trajectories go through skill-authoring (repeated.mjs, feedback-draft.mjs); one is kept only if the benchmark improves on the eval set and a held-out project, and a human approves it (K20)
- **Problem.** Skill text is tuned by opinion.
- **Mechanism.**
  - **Descriptions.** skill-creator's optimiser (held-out 40%).
  - **Content (P2).** Edits proposed from real trajectories and corrections. One is kept only if it improves the benchmark on the eval set and on a held-out project, and a human approves it (K20).
- **Evidence.** GEPA: +6% on average and up to +20% with 35× fewer rollouts. Cloudflare tests prompt changes "against a held-out repository" ([C26](research/cloudflare/ideas-for-h-stack.md)).
- **Context-over-templates.** Uses the user's own trajectories.

#### HS-009 · Second-scaffold robustness check
**Evals · Build · P2 · M · Reliability · Depends on: HS-001 · Sources: D22**
- **Status.** needs-user (credentials or accounts: a second scaffold (Codex or dsh) needs its own install and model account, which this environment does not have)
- **Problem.** Gains could come from Claude Code specifics.
- **Mechanism.** Load H-Stack's skills into dsh or Codex and re-run a subset of the smoke test.
- **Evidence.** DeepSeek evaluates across 8 scaffolds ([deepseek-harness.md D22](research/deepseek-harness.md)).
- **Context-over-templates.** n/a.

### Self-checks/CI

#### HS-010 · Always-on context budget and a Model Experience note
**Self-checks/CI · Thin · P0 · S · Cost · Depends on: — · Sources: N6, N116, D1, D11**
- **Status.** done — plugins/h-stack/scripts/budget.mjs renders every injection (listing, SessionStart, classifier, SubagentStart, event notes) with ceil(bytes/3) and fails CI over budget; Model Experience notes in hooks/README.md
- **Problem.** Every always-on line costs attention and money on every turn, and stacks only grow.
- **Mechanism.**
  - **Native measurement.** `/skill-doctor` shows each skill's context cost and use count.
  - **CI check.** Renders everything H-Stack adds and fails above budget ([ARCHITECTURE §9](ARCHITECTURE.md#9-context-budget)). That covers:
    - the skill listing (all `description` + `when_to_use`);
    - SessionStart output;
    - the largest classifier line;
    - SubagentStart output;
    - the largest event note.

    Start budget: 1,500 tokens always-on.
  - **Model Experience section.** Every skill and hook README states the exact text the model sees, its token cost and its cache effect.
  - **Writing rules (D11).** Delete what the model learns from results; say each fact once.
- **Evidence.**
  - Context files: +20%/+23% cost with no significant gain ([00b](research/00b-research-backed-ideas.md)).
  - SkillsBench: comprehensive +0.7 pp vs compact +19.0 (Table 9).
  - dsh's full Standard prompt is ~1.5k tokens.
  - `/skill-doctor` (whats-new, Week 36).
- **Context-over-templates.** n/a.

#### HS-011 · Cache-safe injection and snapshot tests
**Self-checks/CI · Build · P0 · S · Cost · Depends on: HS-012 · Sources: N8, N115, D2, D7**
- **Status.** done — lib/core.mjs stable serialisation; digest-gated notes; scripts/snapshot.mjs pipes 78 canned payloads through every hook twice and diffs against *.expected
- **Problem.** One timestamp or reordered key in injected text breaks the prompt cache.
- **Mechanism.**
  - All injected text is appended `additionalContext`, serialised deterministically (sorted keys, no timestamps or random IDs).
  - Facts are digest-gated: re-injected only when they change, and then they say "replaces earlier versions".
  - H-Stack never edits CLAUDE.md, rules, settings, skills or tools mid-session.
  - CI pipes canned payloads into each hook and mod handler twice and diffs against `*.expected` snapshots.
- **Evidence.**
  - Manus: cached input $0.30 vs $3/MTok.
  - Prompt caching: cache writes cost 1.25× or 2×, reads 0.1×.
  - Composio: dsh 88.6k vs Claude Code 649.9k tokens per task, attributed to cache discipline ([deepseek-harness.md §3.6](research/deepseek-harness.md)).
- **Context-over-templates.** n/a.

#### HS-012 · Hook and script contract
**Self-checks/CI · Build · P0 · S · Cost · Depends on: — · Sources: N113, C10, C12, C31, D14**
- **Status.** done — lib/core.mjs runHook/refusal/clip/logFull; scripts/contract.mjs checks FAILURE_MODE vs onFailure, explicit timeouts, closed hooks deny on crash; snapshot.mjs checks <=10 lines, refusal format, no allow
- **Problem.** Noisy hook output fills context. Crashed guards fail open silently. Vague refusals make the agent loop.
- **Mechanism.** Every H-Stack hook and script:
  - prints ≤10 stdout lines and logs the rest to a file whose path it prints;
  - refuses in one format: `Blocked by <rule>: <fact>. To proceed: <action>.`;
  - if a script, prints one JSON `{status, reason}`;
  - declares `FAILURE_MODE=closed|open`, matched by `onFailure` in `hooks.json`, with a test that closed hooks deny on crash;
  - turns large output into head + tail + path. The native spill already covers hook output over 10,000 characters and large Bash results.
- **Evidence.**
  - C-compiler post: context-window pollution and `--fast`.
  - Writing-tools post: concise output ≈ ⅓ the tokens of detailed ([00c N113](research/00c-beyond-every-stack.md)).
  - Cloudflare MCP: legible refusals (C12).
  - Hooks docs: `onFailure` (v2.1.295+), the 10,000-character cap.
- **Context-over-templates.** n/a.

#### HS-013 · Skill and import linter
**Self-checks/CI · Thin · P1 · S · Cost · Depends on: HS-081 · Sources: C30**
- **Status.** done — scripts/lint.mjs in CI (frontmatter, user-invocable false, description/when_to_use cap, all-caps and house-style patterns, THIRD_PARTY coverage)
- **Problem.** Imported and edited skills drift: copied snippets rot, frontmatter rules slip, licences go missing.
- **Mechanism.** Native: `claude plugin validate .`, plus `/doctor` auditing skills and rules. H-Stack's CI lint adds checks for:
  - `user-invocable: false`;
  - the 1,536-character cap, with the use case first;
  - ≤500 lines;
  - a valid `metadata.hstack` schema;
  - `evals/evals.json` present;
  - LICENSE present for every imported skill, with a THIRD_PARTY.md row;
  - referenced files and commands exist;
  - long fenced code in `references/` flagged unless tested;
  - no all-caps imperatives.
- **Evidence.** Copied snippets in Cloudflare's references drifted into real bugs, hence their `check-reference-code-blocks.py` ([C30](research/cloudflare/ideas-for-h-stack.md)); [15 Ideas](research/15-skill-authoring.md); memory docs on `/doctor`.
- **Context-over-templates.** The lint rejects copied boilerplate.

#### HS-014 · Self-audit and egress audit
**Self-checks/CI · Thin · P1 · M · Reliability · Depends on: HS-062, HS-063 · Sources: N55, D20, Cloudflare §E self-audit seed**
- **Status.** done — scripts/egress.mjs in CI (dependency-gate registries, gh at SessionStart, off-by-default model calls; fails on any new egress point). Self-audit with the imported security-audit skill: 12 confirmed findings (7 medium, 5 low), all fixed with regression tests; 2 plausible need the live runtime (docs/self-audit/REPORT.md)
- **Problem.** H-Stack's own hooks, mods, memory and imports are an attack surface.
- **Mechanism.** Before each public release, run the imported security-audit skill (IM-09) on H-Stack itself.
  - **Units.** Seeded from Cloudflare's AI/LLM and supply-chain classes: memory poisoning, provenance confusion, approval binding, unbounded loops, subagent/MCP trust inheritance, mutable install inputs, hooks on install.
  - **Findings.** Three-verdict schema.
  - **Egress inventory.** By default nothing leaves the machine except the user's own model calls.
- **Evidence.**
  - Cloudflare §E ([ideas §E](research/cloudflare/ideas-for-h-stack.md)).
  - dsh's default-on session-log upload, up to 8 MiB per request ([deepseek-harness.md §6](research/deepseek-harness.md)).
  - Snyk: injection in 36% of third-party skills.
- **Context-over-templates.** n/a.

### Skill index

#### HS-015 · Skill index in frontmatter and a generated catalogue
**Skill index · Build · P0 · M · Reliability · Depends on: HS-010 · Sources: the 00 §4 rule "each skill declares its own triggers in one place" (no ID)**
- **Status.** done — metadata.hstack in every SKILL.md; scripts/gen-index.mjs writes a byte-stable index.json; CI fails when stale
- **Problem.** Description matching alone activates the right skill about 20% of the time, and a separate rules file drifts.
- **Mechanism.** Each SKILL.md declares its routing data:
  - **Native fields:** `description`, `when_to_use`, `paths`, `model`, `effort`, `context`.
  - **`metadata.hstack`:** intents, keyword patterns, `not_for`, events, sizes, modes, `explicit_only`, eval path.

  CI generates a sorted `index.json`. The router, classifier, event triggers and budget check read it. CI fails if it is stale. Format in [ARCHITECTURE §5](ARCHITECTURE.md#5-skill-index).
- **Evidence.**
  - About 20% activation from descriptions alone ([00 §1](research/00-activation-and-experience.md)).
  - Skills docs: `metadata` is a free-form map for your own tooling.
  - Mods `skill.prompt` exposes `e.frontmatter`.
- **Context-over-templates.** The index holds triggers only.

#### HS-016 · Light-by-default and explicit-only skills
**Skill index · Build · P1 · S · Cost · Depends on: HS-015, HS-018 · Sources: N45, C28, C23, C35**
- **Status.** done — light by default; explicit_only skills (long-run) are listed with * and only routed when named; security-audit full mode only on full-audit phrases (metadata.hstack.modes)
- **Problem.** Loading a heavy skill shouldn't start a full run, and push/merge/loop skills shouldn't auto-run.
- **Mechanism.**
  - **Modes.** Heavy skills declare a guidance mode and the phrases that unlock full mode.
  - **Profiles.** They change breadth, not the evidence bar.
  - **Explicit-only.** A PreToolUse hook on the `Skill` tool allows `explicit_only` skills only when the classifier recorded an explicit request this turn. `disable-model-invocation` is not used: with no slash commands it would make the skill unreachable.
- **Evidence.**
  - Cloudflare security-audit operating modes (C28) and profiles (C23).
  - vinext `fix` (C35).
  - SkillsBench: 2–3 skills +19.0 vs ≥4 skills +10.1.
- **Context-over-templates.** Full mode scopes itself to the project.

### Activation

#### HS-017 · SessionStart router and briefing
**Activation · Build · P0 · M · Autonomy · Depends on: HS-010, HS-011, HS-015, HS-045 · Sources: E7, D17**
- **Status.** done — hooks/session-start.mjs: byte-stable skill map + facts (open PR, dev ports, wishlist, checkpoint pointer, failure tail after compact, outcome-unknown on resume, digest check); no git status or repo overview
- **Problem.** Without slash commands, Claude needs a compact map of what exists. It also needs runtime facts it can't infer.
- **Mechanism.** A SessionStart hook (`startup|resume|clear|compact`) emits:
  - **(a) Skill map.** A byte-stable, compact map (≤ budget). Cut if the smoke test shows no gain (K4).
  - **(b) Facts only:**
    - the open PR;
    - listening dev servers (URL, port);
    - open wishlist items;
    - the last checkpoint pointer;
    - after compaction, the failure-log tail.

  It leaves out git branch and status, because Claude Code already puts a git status snapshot in context at session start. It never emits a repo overview.
- **Evidence.**
  - superpowers' SessionStart router ([02 #1](research/02-workflow-orchestration.md)).
  - Overviews don't help agents find files (2602.11988 §4.3).
  - dsh postmortem 0003: the agent "validated a replacement server instead of its current GUI" ([D17](research/deepseek-harness.md)).
- **Context-over-templates.** The briefing is this project's state.

#### HS-018 · Per-prompt rules classifier: size gate, sticky mode, overrides
**Activation · Build · P0 · M · Reliability · Depends on: HS-015, HS-045 · Sources: E1, E2, E3**
- **Status.** done — hooks/classify.mjs + lib/pure/classify-rules.mjs: overrides, sticky playbook, direct/light/full size gate, <=2 skills, native routes (code-review, security-review, skill-creator), one factual line, nothing for direct prompts; trigger sets in CI. Measured: on 4 real fixture tasks the suggested skill was loaded 2/4 times (tdd, planning yes; debugging no), on 4 brief questions 0/4. Activation fixes after measurement: intents match whole words (pr no longer matches primary, ship no longer shipped); review and writing keywords for common phrasings; bare 'rewrite' no longer sizes a prose edit as full; gate-edit lets Claude extend test files it created this session (that block caused the tdd eval regression, 0.50 vs 1.00). Measured with evals/activation-bench.mjs (real claude -p with the plugin, 6 prompts): named skill loaded 16/18 (0.89) at 3 runs per prompt, 27/30 across both passes; wording variants measured lower (check 10/12, inline 10/12). claude plugin eval does not run UserPromptSubmit hooks (0 classifier events in its traces vs present in claude -p), so its skill-fired grader measures only the SessionStart map; its scored cases now pass with the plugin: debugging 1.00 vs 1.00, tdd 1.00 vs 1.00, planning 1.00 vs 0.33 (3 runs per arm). Trigger sets in CI now cover 9 skills. M4 exit criterion, measured in real claude -p sessions (plugin vs no plugin, 3 runs per arm, blind tool-less grader, objective check commands): seven activation cases built from the per-skill evals where the arms separate, routed by the classifier (no skill instructions in the prompt). Plugin 0.88 vs 0.52; named skill loaded 18/21; better with the plugin on 6 of 7 cases (bugfix-regression-test 0.67/0.33, shared-defaults 0.75/0.50, cache-key 1.00/0.75, untrusted-page 1.00/0.75, lesson-draft 1.00/0.00, pr-body 1.00/0.50), claude-md ties 0.78/0.78, none worse. Fixes found on the way: protected files named in the prompt are approved (CLAUDE.md requests were blocked), research copies the repo's note convention, routing for bug-report and lesson phrasings. Report: evals/results/activation/load-rate-2026-11-11T23-05-20.json
- **Problem.** The right skill must be in front of Claude with no slash commands, and trivial requests must skip process.
- **Mechanism.** A `UserPromptSubmit` command hook works in this order:
  1. Plain-language overrides ("just do it", "go deep", "why that?").
  2. Sticky playbook from `route.json` for "continue", "next" or "fix that".
  3. Size label: `direct`, `light` or `full`.
  4. Index match: ≤2 skills.

  It adds one factual line, for example "H-Stack: size=light. Relevant skill: h-stack:x because <rule>". Direct prompts get nothing. It never rewrites the prompt. It moves into a mod when HS-019 lands ([ARCHITECTURE §6.3](ARCHITECTURE.md#63-ordering-concurrency-portability)).
- **Evidence.**
  - Activation: 20% with a simple hook vs 84% with forced evaluation ([00 §1](research/00-activation-and-experience.md)).
  - SkillsBench: 1–3 skills is best.
  - Harness-design: process inside the solo boundary is overhead (A22).
  - Hooks docs: the 30 s `UserPromptSubmit` timeout, with context dropped on timeout.
- **Context-over-templates.** No fixed pipeline per task.

#### HS-019 · Small-model classifier fallback
**Activation · Build · P1 · M · Reliability · Depends on: HS-018, HS-058 · Sources: 00 §2 mechanism E (no ID); OD-1**
- **Status.** done — mod prompt.submit: when the rules find no skill and the size isn't direct, $.model.complete (Haiku-class, cached catalogue) returns {size, act|ask|stop, skill} and H-Stack adds one factual line (mod test 'classifier fallback … adds size, decision and skill'). Off, as the mechanism specifies, until the trigger evals show a recall gain worth the cost: the rules reach recall >= 0.8 with false positives <= 0.2 on all 15 skills' trigger sets in CI (config classifier.fallback:true switches it on)
- **Problem.** Rules miss fuzzy requests.
- **Mechanism.** When rules find no match and the size isn't `direct`, a mod `prompt.submit` calls `$.model.complete` (Haiku-class) with the cached index catalogue and gets back `{size, act|ask|stop, skill}`. Off until the trigger evals show a recall gain worth the cost.
- **Evidence.** [00 §2 E](research/00-activation-and-experience.md); mods API `$.model.complete` and prompt caching.
- **Context-over-templates.** n/a.

#### HS-020 · Act / ask / stop with a separate intent check
**Activation · Build (with IM-03 grilling for the ask flow) · P0 · M · Judgment · Depends on: HS-018, HS-046 · Sources: N1, E4, N32, D12**
- **Status.** done — skills/clarify (act/ask/stop, <=3 questions with recommendations, grilling full mode) + agents/intent-check.md (read-only JSON) validated by hooks/agent-result.mjs; classifier adds clarify for size=full unless the user said just do it
- **Problem.** Agents guess or over-ask, and ask about things they could look up.
- **Mechanism.** For `full` or ambiguous prompts, a forked read-only skill (`context: fork`) sees only the prompt and the discoverable facts. It returns one of:
  - **act**;
  - **ask**: 1–3 outcome-changing questions, each with a recommended answer, using native AskUserQuestion and the imported grilling flow;
  - **stop**.

  Rules that always apply:
  - Facts are looked up, never asked.
  - "Just build it" means proceed and log assumptions (HS-046).
  - Non-blocking questions are batched.
  - A skipped question is not permission.
  - Agreeing in conversation does not approve a plan.
- **Evidence.**
  - Ask-or-Assume: 69.4% vs 61.2% resolved, close to the 70.8% full-information score ([00b](research/00b-research-backed-ideas.md)).
  - Kimi K2.6 over-asked at 8.71 questions per task.
  - mattpocock grilling: 1.5M installs ([03 #1](research/03-ideation-product.md)).
  - dsh wording (D12).
  - 00c top-6 differentiator.
- **Context-over-templates.** Questions come from this repo's real gaps.

#### HS-021 · Explainable routing
**Activation · Build · P1 · S · Judgment · Depends on: HS-018, HS-058 · Sources: N3**
- **Status.** done — 'why that?' override returns the matched rule (snapshot classify-why-that); corrections are logged to .h-stack/routing-examples.jsonl with the prompt excerpt, pick and rule (hooks/classify.mjs); hs retro counts them
- **Problem.** Users can't see or correct why a skill was picked.
- **Mechanism.** "Why that?" returns the matched rule. A correction is logged as a context-keyed routing example and feeds skill-creator's description tuning.
- **Evidence.** [00b N3](research/00b-research-backed-ideas.md); skill-creator description optimisation.
- **Context-over-templates.** Examples are kept per project.

#### HS-022 · Event triggers
**Activation · Build · P0 · M · Reliability · Depends on: HS-015, HS-027 · Sources: 00 §4 L3 (no ID)**
- **Status.** done — ledger.mjs: test_failed/build_failed -> debugging, path_edit via skill paths; gate-bash.mjs: pre_push -> review via additionalContext; one note per kind per turn
- **Problem.** The best moment to suggest a skill is often a tool event.
- **Mechanism.** Index `events` map hook events to skills:
  - a test or build failure (PostToolUse / PostToolUseFailure on Bash) → the debugging skill;
  - an edit to a path matching a skill's `paths` → a design check;
  - `git push` or `gh pr create` (PreToolUse) → review;
  - Stop with unverified changes → handled by HS-027.

  One note per event type per turn, digest-gated.
- **Evidence.** [00 §2 F](research/00-activation-and-experience.md): deterministic, nearly free.
- **Context-over-templates.** Triggers come from the project's own commands and paths.

#### HS-023 · Subagent briefing, including memory subagents don't load
**Activation · Thin · P1 · M · Reliability · Depends on: HS-011, HS-049 · Sources: E9, N37, D13, C38**
- **Status.** done — hooks/subagent-start.mjs briefs subagents with route, open assumptions, decisions, lessons and review calibration within 150 tokens
- **Problem.** Vague delegation duplicates work. Subagents also start without the rules, and without auto memory unless they are forks.
- **Mechanism.**
  - **Native.** Subagent frontmatter (`tools`, `model`, `skills`) and the `SubagentStart` event.
  - **Brief template.** Objective, scope, output schema, tools, known facts, done-criteria, the untrusted-content sentence, and a scratch directory.
  - **SubagentStart adds (≤150 tokens):**
    - a principles pointer;
    - the lessons and auto-memory index lines that match the subagent's paths;
    - recent implicit decisions.
  - **Write isolation.** PreToolUse denies writes outside scratch for review and audit subagents.
- **Evidence.**
  - Anthropic research post: vague delegation duplicated work.
  - pstack: "subagents read the principles first" (E9).
  - Cloudflare write isolation (C38).
  - dsh delegation rules (D13).
  - Memory docs: auto memory and its subagent behaviour.
- **Context-over-templates.** Briefs carry this task's facts.

#### HS-024 · Offers only at workflow boundaries
**Activation · Build · P1 · S · Autonomy · Depends on: HS-018 · Sources: N4**
- **Status.** done — offers only at turn.complete boundaries (lib/pure/mod-rules.mjs offerFor; config offers)
- **Problem.** Proactive actions built on predicted intent are usually wrong.
- **Mechanism.** After a commit, a test pass or a PR opening, the mod `turn.complete` shows one line offering a next step. It never acts on it.
- **Evidence.** The best agent predicts intent only 35.57% of the time (ProCodeBench). Boundary suggestions got 52% engagement vs 62% of mid-task ones dismissed (ProAIDE) ([00b N4](research/00b-research-backed-ideas.md)).
- **Context-over-templates.** Offers come from this repo's state.

#### HS-025 · Verification effort set by the measured solo boundary
**Activation · Build · P1 · M · Cost · Depends on: HS-058, HS-061 · Sources: N107**
- **Status.** done — lib/retro.mjs soloBoundary: solo pass rate per task class from activation telemetry (pass = not corrected next prompt); effort receipts >= 0.9 over >= 5 runs, full below, medium on cold start; stored in route.json verify and shown by hs status; planning's several-attempts section and review lanes key off it
- **Problem.** Heavy review costs 10–20× and adds nothing on tasks the model already does well.
- **Mechanism.** H-Stack tracks the solo pass rate per project and task class.
  - **Above the threshold:** receipts only.
  - **Below it, or at high risk:** rubric, lanes and tournaments.
  - **Cold start:** medium.
- **Evidence.** Harness-design: an evaluator "is worth the cost when the task sits beyond what the current model does reliably solo"; the full harness cost $200 vs $9 ([00c N107](research/00c-beyond-every-stack.md)).
- **Context-over-templates.** Measured per project.

#### HS-026 · Context-rot handling
**Activation · Native — configure only · P2 · S · Reliability · Depends on: HS-047 · Sources: N11, D19**
- **Status.** done — native /clear, compaction and fresh sessions; skills/memory suggests /clear between unrelated tasks and a fresh session from the newest checkpoint for long runs
- **Problem.** Quality drops as input grows.
- **Mechanism.** Native: `/clear`, `/fork`, auto-compaction and 1M windows. H-Stack only suggests `/clear` between unrelated tasks and points long runs at a fresh session that starts from the checkpoint.
- **Evidence.** Context Rot: ~300-token focused input beat ~113k-token input. Downgraded in 00c because 1M windows make running out rare ([00c §2](research/00c-beyond-every-stack.md)).
- **Context-over-templates.** n/a.

### Guards

#### HS-027 · Evidence receipts and the Stop verification gate
**Guards · Build · P0 · M · Reliability · Depends on: HS-012, HS-045 · Sources: N100, E6, C13, D6**
- **Status.** done — hooks/ledger.mjs receipts {id, cmd, exit, out_sha, tree, kinds}; batch.mjs receipt line; hooks/stop.mjs blocks once on unbacked claims, no receipt and no Not verified line, running background tasks; snapshot cases cover each path
- **Problem.** Agents claim checks passed that never ran, or ran on older code. `/goal`'s evaluator reads only the transcript.
- **Mechanism.**
  - **Receipts.** PostToolUse on Bash appends a receipt `{id, cmd, exit, out_sha, tree, ts}` to the session ledger. A one-line receipt is added to context via PostToolBatch, digest-gated. Later edits mark receipts stale.
  - **Stop dispatcher.** Blocks once when:
    - files changed and the final message claims a passing check without a fresh matching receipt;
    - there is neither a receipt nor a "Not verified:" line;
    - native `background_tasks` are still running.
  - **`/goal`.** Conditions H-Stack writes cite receipt IDs.
  - **Imported skill.** IM-01 teaches the habit; this enforces it.
- **Evidence.**
  - DGM App. H: Claude claimed to have run tests through the Bash tool "but Claude did not invoke any tools".
  - `/goal` docs: the evaluator "does not call tools".
  - Cloudflare: "A successful dry run… does not prove… runtime behavior" (C13).
  - Hooks docs: the 8-continuation cap and `background_tasks`.
  - 00c top-1 differentiator.
- **Context-over-templates.** Whatever checks the project runs; nothing is hard-coded.

#### HS-028 · Test-integrity triad: read-only tests, tamper scan, contradiction stop
**Guards · Build · P0 · M · Reliability · Depends on: HS-012, HS-027, HS-029 · Sources: N13, N14, N15**
- **Status.** done — (a) read-only tests in gate-edit/gate-bash with hs phase test as the declared test-writing step; (b) lib/tamper.mjs scan at Stop (skips, weakened asserts, timeouts, clocks, special-cased literals, overloads, call counters, env sniffing); (c) hs stop as the contradiction path
- **Problem.** Claude's main way of cheating is editing tests. Read-only tests don't stop special-casing, and LLM monitors miss about half of cheating.
- **Mechanism.**
  - **(a) Read-only tests.** During implementation, PreToolUse on Edit, Write and Bash redirects into test files asks, showing the diff. Exception: the test-writing step that the TDD skill (IM-05) declares.
  - **(b) Tamper scan.** A deterministic scan of the diff at Stop and before commit looks for:
    - weakened assertions;
    - skips;
    - raised timeouts;
    - literals special-cased from test inputs;
    - call-count state;
    - patched clocks;
    - operator overloads.
  - **(c) Contradiction stop.** `hs stop "<reason>"` is a real stop path when tests contradict the spec.
- **Evidence.** ImpossibleBench ([00b](research/00b-research-backed-ideas.md)):
  - >79% of Claude's cheating is test modification.
  - Read-only tests leave special-casing open (§5.2).
  - An abort option cut GPT-5's cheating from 54% to 9%.
  - LLM monitors catch 42–65%.

  00c top-2 differentiator.
- **Context-over-templates.** Test globs are auto-detected and can be overridden in `.h-stack/config.json`.

#### HS-029 · Protected checkers and paths
**Guards · Native — configure only · P0 · S · Reliability · Depends on: HS-012 · Sources: N101, C3**
- **Status.** done — scripts/setup.mjs proposes native ask/deny rules (OD-4, shown before writing); gate-bash redirect check for protected paths and .h-stack state; gate-edit asks on checkers
- **Problem.** An optimiser that can edit its checker learns to satisfy the checker.
- **Mechanism.** Native permission rules, set at install (OD-4), with `ask` for:
  - `Edit(.github/workflows/**)` and CODEOWNERS;
  - `.claude/settings*.json`, `.claude/hooks/**` and `.mcp.json`;
  - test-runner and coverage config;
  - the `scripts` section of a package manifest.

  `deny` for direct writes to `.h-stack/` ledgers; the agent writes only through `hs`. The H-Stack plugin directory sits outside the project. The only custom piece is one line in HS-028's hook covering Bash redirects into those paths, which permission rules can't see.
- **Evidence.**
  - DGM App. H: hacking happens more when checks aren't hidden ([00c N101](research/00c-beyond-every-stack.md)).
  - Cloudflare Gardener refuses edits to workflows and CODEOWNERS (C3).
  - Permissions docs: `Tool(param:value)` rules (whats-new).
- **Context-over-templates.** The list extends per project.

#### HS-030 · Irreversible-action gate with a dry-run receipt and approval binding
**Guards · Thin · P0 · M · Autonomy · Depends on: HS-012, HS-027 · Sources: E5, N104, C4, C5, D10**
- **Status.** done — lib/irreversible.mjs parser (unwraps bash -c, env, sudo, xargs, substitutions) with effect classes; gate-bash asks with a manifest and the dry-run receipt (or its absence), records approvals.jsonl; exfiltration denied; gate-mcp asks on send/post tools; per-project allowlist
- **Problem.** Agents run the irreversible step and find out afterwards, and a general "go ahead" gets reused for a different command.
- **Mechanism.**
  - **Native (configure).** Auto mode blocks destructive git you didn't ask for and asks before `rm -rf` on unresolved variables. Permission `ask` rules cover `gh pr merge`, `npm publish` and similar.
  - **H-Stack's thin hook (PreToolUse on Bash and `mcp__.*`)** parses commands, unwrapping `bash -c`, `env`, `xargs` and `sudo`, then:
    - **Medium effect** (deploy or publish to production, delete remote resources, migrate or drop a non-local DB, send/post messages, push to the default branch, force push): asks with an exact manifest (executable, target, destination). It needs a fresh read-only receipt for the same target (dry-run, plan, diff, list-before-delete). Approval binds the command hash; a changed command asks again.
    - **High effect** (secrets to the network): denied.
  - **Configuration.** The list lives in `.h-stack/config.json`, with an opt-in allowlist (OD-3).
- **Evidence.**
  - AgentAbstain: act-then-discover; "action-type-blind" 63.0% vs 62.0% ([00c N104](research/00c-beyond-every-stack.md)).
  - "must never merge" (C4).
  - "Do not infer confirmation from an earlier setup step" (C5).
  - dsh `REVIEW_POLICY` (D10).
  - git-guardrails: 553k installs; CC Safety Net command parsing ([01 #3, #6](research/01-core-rules.md)).
- **Context-over-templates.** The list is per project.

#### HS-031 · Dependency gate
**Guards · Build · P0 (00b gave no priority; raised because 19.7% of recommended packages don't exist and no native check exists) · M · Reliability · Depends on: HS-012 · Sources: N22**
- **Status.** done — lib/deps.mjs: install commands, manifest edits and new imports; exists / age >= 30 days / weekly downloads / near-miss of top packages / @latest; 7-day cache; offline => ask; registry fixtures in tests
- **Problem.** Models recommend packages that don't exist, and attackers register those names.
- **Mechanism.** A PreToolUse hook checks install commands, manifest edits and new import lines. A package passes only if it:
  - exists in the registry;
  - is at least N days old;
  - has real download or dependent history;
  - isn't a near-miss of a popular name.

  Otherwise it asks. Lookups are cached; when offline, it asks.
- **Evidence.**
  - 19.7% of recommended packages were hallucinated; 43% of fake names recur; only 13.4% are near-misses (Spracklen, [00b](research/00b-research-backed-ideas.md)).
  - A hijacked agent can add an import and let the user install it (2506.08837 §4.10).
  - 00c top-8 differentiator.
- **Context-over-templates.** Uses the project's own ecosystem.

#### HS-032 · Untrusted content: provenance, argument taint, fetch-destination guard
**Guards · Thin · P1 · M · Reliability · Depends on: HS-045 · Sources: N23, N120, C9, D21**
- **Status.** done — lib/taint.mjs + hooks/taint.mjs provenance line; gate-bash and gate-fetch block tainted values reaching private destinations; snapshots
- **Problem.** Injected text can change the arguments of later tool calls even when it can't change which tool runs.
- **Mechanism.**
  - **Native.** Auto mode already blocks actions driven by content Claude read.
  - **Provenance.** PostToolUse on WebFetch, WebSearch, `mcp__.*` and `gh` reads appends a provenance note and records URLs, hosts, emails and paths in `taint.jsonl`.
  - **Argument taint.** PreToolUse on consequential calls asks when an argument matches a string seen only in untrusted content.
  - **Fetch destinations.** Loopback, RFC1918 and metadata fetches ask while untrusted content is in play.
  - **Briefs.** Every brief carries the one-sentence untrusted-content rule.
- **Evidence.**
  - CaMeL §2: "the data flow can still be manipulated" ([00c N120](research/00c-beyond-every-stack.md)).
  - Cloudflare's single rule (C9).
  - dsh's `web_fetch` reaches metadata addresses (D21).
- **Context-over-templates.** n/a.

#### HS-033 · Tool-description firewall
**Guards · Build · P0 · M · Reliability · Depends on: HS-012 · Sources: N119**
- **Status.** done — hooks/register.js tool.describe + lib/pure/firewall.mjs: imperatives, secret paths, hidden Unicode, cross-tool references; suspicious MCP tools deferred with a neutralised description and a toast; .catch defers unknown MCP tools; claude plugin test cases pass. Deviation: tested with the mods test kit, not plugin-eval mock MCP servers (H-Stack declares no MCP server to mock)
- **Problem.** A poisoned MCP tool description steers the agent without the tool ever running, and nothing native inspects descriptions.
- **Mechanism.** The mod `tool.describe` scans each description, including deferred tools loaded by tool search, for:
  - imperatives aimed at other tools or at the session;
  - secret paths;
  - hidden Unicode;
  - cross-tool references.

  Suspicious tools get `isDeferred: true`, a neutralised description, and a notice naming the server and the tool. It warns rather than deletes. Tested with plugin-eval's mock MCP servers.
- **Evidence.** MCPTox: up to 72.8% attack success, Claude 3.7 Sonnet 34.3%, refusals under 3%. Mods reference `tool.describe`. 00c top-5 differentiator ([00c N119](research/00c-beyond-every-stack.md)).
- **Context-over-templates.** n/a.

#### HS-034 · Secrets hygiene and trusted executables
**Guards · Thin · P1 · S · Reliability · Depends on: HS-012 · Sources: C6, C7**
- **Status.** done — gate-bash credentialExec and secret redaction in all state writes (lib/core.mjs redact); classifier never stores a prompt that looks like a secret
- **Problem.** Secrets leak through argv, logs, chat or project-controlled binaries.
- **Mechanism.**
  - **Native.** Permission `deny` rules for reading `~/.ssh`, `~/.aws` and `.env*`.
  - **Credential commands.** A thin PreToolUse hook asks when a credential-bearing command runs through `npx`, `pnpm exec`, `npm run` or `./node_modules/.bin`.
  - **Env files.** Writes to `.env*` require `git check-ignore`.
  - **Pasted tokens.** `UserPromptSubmit` warns factually.
  - **Never** ask for pasted secrets or session cookies.
- **Evidence.** Turnstile Spin steps 2–3 ([C6, C7](research/cloudflare/ideas-for-h-stack.md)); Trail of Bits default denies ([01 Ideas](research/01-core-rules.md)); last30days cookie flag ([top10-method.md](research/top10-method.md)).
- **Context-over-templates.** n/a.

#### HS-035 · Scope lock on the invoked issue or PR
**Guards · Build · P1 · S · Judgment · Depends on: HS-045 · Sources: C8**
- **Status.** done — scope lock: gate-bash denies GitHub writes to issue/PR numbers not named in the prompt (route.json scope_numbers); snapshots
- **Problem.** Numbers mentioned in comments get acted on as instructions.
- **Mechanism.** Record the target number. PreToolUse on `gh issue|pr` writes and `gh api` writes asks if the number differs.
- **Evidence.** bonk and viguy: "verify the target number matches" ([C8](research/cloudflare/ideas-for-h-stack.md)).
- **Context-over-templates.** n/a.

#### HS-036 · Error-as-success and outcome-unknown detectors
**Guards · Build · P1 · S · Reliability · Depends on: HS-027 · Sources: N53, C11, D5**
- **Status.** done — hooks/ledger.mjs failed_pattern on exit-0 output (error-as-success) and outcome-unknown on interrupted/timeout receipts; stop gate reads them
- **Problem.** Errors that arrive as normal text count as success, and interrupted calls get retried blindly.
- **Mechanism.**
  - **Pattern table (PostToolUse).** Flags these as failures and marks the receipt failed:
    - exit 0 with "Aborted.";
    - `"success":false`;
    - HTTP 200 with an error body;
    - an empty result after an error.
  - **Interrupted calls.** PostToolUseFailure or an interrupt → "outcome unknown: read-only or idempotent retries only".
  - **Resume.** SessionStart(`resume`) scans the transcript for unanswered calls.
- **Evidence.** Cloudflare: "you end up logging empty runs as successes"; "a zero exit does not mean the resource was deleted" (C11). dsh unanswered calls (D5).
- **Context-over-templates.** n/a.

#### HS-037 · Repeat-call and failure-signature reminders
**Guards · Build · P1 · S · Autonomy · Depends on: HS-045 · Sources: N38, D4**
- **Status.** done — hooks/repeat.mjs on PostToolUse (every tool): hashes tool + canonical input, factual line with the previous result at 3, 5 and 8 identical calls in a row; never blocks; resets on each user message (new prompt_id). Snapshots repeat-third-call, repeat-resets-on-new-prompt
- **Problem.** Repeating the same step is the most common multi-agent failure.
- **Mechanism.** PostToolUse hashes the tool plus its canonical input. At 3, 5 and 8 identical calls in a row it adds a factual line with the previous result. It never blocks and resets on each user message.
- **Evidence.** MAST: step repetition 15.7%. dsh `repeat-tool-reminder` with thresholds `[3, 5, 8]` ([D4](research/deepseek-harness.md)).
- **Context-over-templates.** n/a.

#### HS-038 · Step and spend budget
**Guards · Thin · P1 · S · Cost · Depends on: HS-045, HS-058 · Sources: E18, C14**
- **Status.** done — step budget per size (config budgets.steps) counted by the turn.step mod into steps.json and enforced in gate-bash; telemetry in mod-turns.jsonl
- **Problem.** Runaway turns burn budget, and agents degrade instead of reporting.
- **Mechanism.**
  - **Native.** `--max-turns` and `--max-budget-usd` for headless runs.
  - **Interactive (thin).** The mod `turn.step` counts tokens and tool calls against a size-based budget. Past the cap, PreToolUse denies with "summarise done / remaining / next". Tools stay listed (A20).
- **Evidence.** gstack runaway-stopper (E18); vibesdk max-steps (C14); CLI reference.
- **Context-over-templates.** n/a.

#### HS-039 · Syntax check on every edit
**Guards · Build · P1 · S · Reliability · Depends on: HS-012 · Sources: N114**
- **Status.** done — hooks/syntax.mjs: parse check after each edit (node --check, Python ast.parse, JSON, bash -n, ruby -c, php -l, gofmt -e) and a note only on a new parse error
- **Problem.** Syntax errors are a large share of failures and cause repeated edits.
- **Mechanism.** PostToolUse on Edit and Write runs the project's fastest parser and returns only new errors, ±3 lines, within 3 s.
- **Evidence.** SWE-agent: 18.0% vs 15.0% with a lint guardrail. SWE-Bench Pro: 24.2% of Opus 4.1's failures were syntax errors ([00c N114](research/00c-beyond-every-stack.md)).
- **Context-over-templates.** Uses the project's own toolchain.

#### HS-040 · Unresolved-concern check at Stop
**Guards · Build · P1 · S · Reliability · Depends on: HS-027 · Sources: N105**
- **Status.** done — mod turn.complete on turns with edits: a Haiku-class $.model.complete lists concerns raised and whether each was resolved; one note through $.prompt.submit at most once per prompt, and never for the turn that answers the note (fixes the self-audit's plausible resubmit loop). On by default (config concerns:false turns it off). Mod test 'concern check: one note per prompt…'
- **Problem.** The agent flags a problem, then talks past it.
- **Mechanism.** The mod `turn.complete` runs on turns with edits. A Haiku-class `$.model.complete` call lists the concerns raised and whether each was resolved. If not, one note goes through `$.prompt.submit`, at most once per prompt.
- **Evidence.** AgentAbstain "half-acknowledgment"; harness-design: the QA agent would "talk itself into" approving ([00c N105](research/00c-beyond-every-stack.md)).
- **Context-over-templates.** n/a.

#### HS-041 · Spawn governor and model routing
**Guards · Thin · P1 · M · Cost · Depends on: HS-018, HS-058 · Sources: E17, N36, N39, N118**
- **Status.** done — agent.spawn governor: spawn budget per size, model per role from config.models; resumed agents not counted
- **Problem.** Effort-scaling written as prose gets ignored, and every step runs on the strongest model.
- **Mechanism.**
  - **Native (configure).** Skill and subagent `model` and `effort` frontmatter, and `Agent(model:…)` permission rules.
  - **Thin.** The mod `agent.spawn` enforces size budgets (direct 0, light ≤1, full 2–5) with `{deny: reason}` and sets the model per role.
  - **Dropped (K17).** Per-request switching through `turn.step`.
- **Evidence.**
  - Anthropic research: ~15× tokens, 50-subagent failures, coding is less parallelisable.
  - Mods `agent.spawn` ([00c N118](research/00c-beyond-every-stack.md)).
- **Context-over-templates.** n/a.

#### HS-042 · Asynchronous overseer
**Guards · Build · P1 · M · Autonomy · Depends on: HS-037, HS-041 · Sources: N129**
- **Status.** done — $.clock.every overseer runs every session and acts during long runs (a recorded /goal): MAST signatures repetition, no progress and stalled, noted once per change. Mod tests: notes repeated failures during a long run, stays quiet without a goal
- **Problem.** Long unattended runs loop or drift.
- **Mechanism.** During long runs, a mod timer (`$.clock.every`) summarises recent calls, checks MAST signatures (repetition, no progress, scope drift) and notes them or stops the run.
- **Evidence.** SICA overseer every 30 s; MAST step repetition 15.7% ([00c N129](research/00c-beyond-every-stack.md)).
- **Context-over-templates.** n/a.

#### HS-043 · Sandbox for untrusted code
**Guards · Native — configure only · P2 · S · Reliability · Depends on: — · Sources: N54**
- **Status.** done — native sandbox: qa and security-audit skills say to run code you didn't write in /sandbox when available and ask otherwise
- **Problem.** Code from PRs or downloads runs with full access.
- **Mechanism.** The native sandbox (no network, read-only source). The imported audit and QA skills say when to use it.
- **Evidence.** Cloudflare's execution-safety rules ([09](research/09-security.md)).
- **Context-over-templates.** n/a.

#### HS-044 · Declared effects for unattended jobs
**Guards · Thin · P2 · M · Autonomy · Depends on: HS-030, HS-071 · Sources: C1**
- **Status.** done — task.yaml declared effects (skills/long-run/references/task-yaml.md, lib/effects.mjs, hs manifest start/stop); gate-bash denies undeclared irreversible/write actions while a manifest is active; snapshot bash-manifest-undeclared
- **Problem.** A scheduled job's prompt can widen what it does.
- **Mechanism.** Every Routine or Workflow H-Stack sets up has a `task.yaml` (trigger, read tools, effects, budgets). A plan run emits JSON, a script validates and applies it, and PreToolUse in the apply step denies anything outside the manifest.
- **Evidence.** Gardener: "Nothing outside the declaration is possible" ([C1](research/cloudflare/ideas-for-h-stack.md)).
- **Context-over-templates.** n/a.

### State & memory

#### HS-045 · `.h-stack/` folder for data with no native home
**State & memory · Thin · P0 · S · Reliability · Depends on: HS-012 · Sources: none of its own (infrastructure serving HS-027, HS-046, HS-047, HS-052, HS-053)**
- **Status.** done — lib/core.mjs stateDir/sessionDir/appendLine (single O_APPEND write <=4 KB), redaction, retention sweep in session-start.mjs; bin/hs is the agent's only writer
- **Problem.** Receipts, assumptions, decisions, failures, the wishlist and telemetry have no home in Claude Code. Memory and rules do.
- **Mechanism.**
  - **Location.** A gitignored `.h-stack/` per project, used *only* for those items (justified one by one in [ARCHITECTURE §4](ARCHITECTURE.md#4-state-native-homes-first-then-h-stack)).
  - **Format.** Append-only JSONL, one writer per file.
  - **Agent writes.** Only through `hs` (`assume`, `decide`, `wish`, `stop`, `failed`).
  - **Hygiene.** Secrets redacted on write; retention sweep.
  - **Memory and rules** stay in their native locations.
- **Evidence.**
  - Anthropic: JSON was overwritten less than Markdown.
  - Manus: files as restorable memory.
  - Hooks docs: PostToolUse fires concurrently for parallel calls, so appends must be atomic single lines.
- **Context-over-templates.** n/a.

#### HS-046 · Assumption ledger
**State & memory · Build · P0 · S · Judgment · Depends on: HS-045, HS-027 · Sources: N2**
- **Status.** done — hs assume/verify-assumption (verified needs a passing receipt); open assumptions block the Stop gate; listed in replies per core-rules
- **Problem.** When the agent proceeds without asking, its assumptions are invisible and never checked.
- **Mechanism.** `hs assume "<a>" --check "<how>"`. The list is shown in the reply. At Stop, each assumption must be verified (with a receipt), refuted, or handed to the user.
- **Evidence.** The "just build it" escape hatch lists assumptions ([03](research/03-ideation-product.md)). AgentAbstain: conflicting evidence 28%.
- **Context-over-templates.** Assumptions are about this project.

#### HS-047 · Compaction checkpoint and failure log
**State & memory · Thin · P1 · M · Autonomy · Depends on: HS-045, HS-017 · Sources: E8, N9, N10, D8**
- **Status.** done — pre-compact instructions + post-compact checkpoints/NNN.md from compact_summary (old ones kept); failure log via hs failed and lib/append.mjs
- **Problem.** Compaction drops dead ends and corrections, so failed approaches get retried.
- **Mechanism.**
  - **Native.** Auto-compaction re-attaches skills (5,000 tokens each, 25,000 combined) and reloads CLAUDE.md. PreCompact stdout *is* the compaction instruction text.
  - **Thin addition 1: schema.** PreCompact supplies a fixed schema:
    - Intent, verbatim;
    - Files and Code with exact paths;
    - Errors and Fixes, and Failed approaches;
    - Pending, Current Work, Next Step;
    - corrections, verbatim.
  - **Thin addition 2: checkpoint file.** PostCompact writes a new `checkpoints/NNN.md` from `compact_summary`.
  - **Thin addition 3: failure log.** SessionStart(`compact`) re-injects the failure-log tail.
  - **Handoffs** use the imported `handoff` skill (IM-11).
- **Evidence.** dsh compaction schema (D8); Manus "keep the wrong stuff in"; hooks and skills docs ([00 E8](research/00-activation-and-experience.md)).
- **Context-over-templates.** n/a.

#### HS-048 · Raw evidence behind memory, with provenance
**State & memory · Thin · P0 (00c: P0) · M · Learning · Depends on: HS-045, HS-049 · Sources: N25, N108, N112**
- **Status.** done — lessons carry a <=300-token evidence excerpt with provenance user|executed (untrusted rejected by lib/lessons.mjs); lib/retrieve.mjs injects <=2 trigger-matched lessons with their excerpt; setup raises cleanupPeriodDays to 90 (OD-10); no parallel episode store
- **Problem.** Consolidated lessons get ignored and degrade, and native auto memory keeps only consolidated notes. Memory is also a target for prompt injection.
- **Mechanism.**
  - **No parallel store.** Native session transcripts are the raw episodes; H-Stack does not build its own episode store.
  - **Retention (configure).** Raise `cleanupPeriodDays` (default 30) so lesson evidence stays reachable (OD-10).
  - **Evidence excerpts (thin).**
    - A lesson or committed rule carries its own ≤300-token excerpt: command, error string, diff hunk and outcome.
    - Excerpts are embedded rather than linked, because transcripts are machine-local.
    - Retrieval injects the excerpt together with the lesson.
  - **Provenance.** Each excerpt is tagged `user`, `executed` or `untrusted`. Untrusted-derived text is never promoted to a rule.
- **Evidence.**
  - Raw trajectories 76.6 vs consolidation 43.2 (2605.12978 Table 5).
  - Condensed lessons are often ignored (2601.22436).
  - MCPTox: refusals under 3% ([00c N108, N112](research/00c-beyond-every-stack.md)).
  - Memory docs: auto memory skips debugging fixes and is machine-local.
- **Context-over-templates.** The evidence is this project's history.

#### HS-049 · Lessons: native auto memory plus committed, path-scoped lesson rules
**State & memory · Thin · P0 (00c: P0 for N110) · M · Learning · Depends on: HS-045 · Sources: N26, N110, E10**
- **Status.** done — committed .claude/rules/lessons/*.md with paths: frontmatter; lib/lessons.mjs validator (CI fixtures) rejects always-on, generic, untrusted or evidence-less lessons; hs lesson propose/check; hs vote appends to lessons-votes.jsonl and proposes removal when harmful > helpful; native auto memory and claude-md-management configured/recommended by setup
- **Problem.** Corrections need to persist, be shared with the team and cloud sessions, keep their applicability conditions, and never be rewritten wholesale.
- **Mechanism.**
  - **Native (configure).**
    - Auto memory's `feedback` type captures corrections ("no, don't…") on the user's machine.
    - `MEMORY.md` index and topic files.
    - The official claude-md-management plugin for review.
  - **Thin addition 1: committed lessons.** For lessons worth sharing, `.claude/rules/lessons/<topic>.md` files are committed to the repo.
    - They use native `paths:` frontmatter, so they load only when matching files are touched.
    - Each entry has a trigger, an "applies when", a "doesn't apply when", an evidence excerpt (HS-048) and a date.
    - A CI validator rejects generic advice.
    - Changes go through a reviewed PR, so git history is the append-only record.
  - **Thin addition 2: counters.** Helpful and harmful votes are appended to `.h-stack/lessons-votes.jsonl`. A lesson whose harmful votes exceed its helpful ones is proposed for removal.
- **Evidence.**
  - ACE: +10.6% with itemised deltas and per-bullet counters; context collapse from 18,282 to 122 tokens when rewritten.
  - Add/delete without in-place edits scored 64.0 vs 43.2 (2605.12978).
  - SkillsBench F.3: harmful skills lacked applicability boundaries.
  - CIPHER: context-agnostic preferences did worse than no learning.
  - Memory docs: `.claude/rules/` `paths`; auto memory is machine-local; claude-md-management ([01 #2](research/01-core-rules.md)).
- **Context-over-templates.** Every lesson is keyed by path and condition.

#### HS-050 · Shadow log of native auto-memory rewrites
**State & memory · Build · P1 · S · Learning · Depends on: HS-045 · Sources: N109**
- **Status.** done — hooks/memory-shadow.mjs keeps the earlier text in .h-stack/memory-shadow.jsonl when an auto-memory rewrite drops specifics, with a one-line note
- **Problem.** Auto memory merges and drops entries near its 200-line / 25 KB index limit, an in-place rewrite.
- **Mechanism.** PostToolUse on writes under the auto-memory directory (`autoMemoryDirectory` or `~/.claude/projects/<p>/memory/`) appends a before/after diff to `.h-stack/memory-shadow.jsonl`. Merges that drop concrete specifics are flagged, with an offer to restore them.
- **Evidence.** Memory docs; 2605.12978 Table 5: forbidding in-place rewriting raised the score from 43.2 to 50.0.
- **Context-over-templates.** n/a.

#### HS-051 · Context-keyed learning from user edits
**State & memory · Build · P2 · M · Learning · Depends on: HS-048, HS-049 · Sources: N27**
- **Status.** done — lib/retro.mjs userEditCandidates (files Claude edited that a later quiet commit changed) via hs retro; skills/memory turns a preference seen in 2+ contexts into a path-scoped lesson draft
- **Problem.** Users repeat the same corrections in code.
- **Mechanism.**
  1. Compare Claude's change with what the user committed.
  2. Infer a readable preference tagged with its context (path glob, file type, task class).
  3. Propose it as a path-scoped lesson only if it holds across contexts.
- **Evidence.** CIPHER: −31% and −73% edit distance; context-agnostic preferences did worse than none ([00c §2](research/00c-beyond-every-stack.md)).
- **Context-over-templates.** Context-keying is the mechanism.

#### HS-052 · Decision log and implicit-decision ledger
**State & memory · Build · P1 · S · Judgment · Depends on: HS-045 · Sources: E16, N127**
- **Status.** done — hs decide / decisions.jsonl and hs assume / verify-assumption ledger; shown in hs status, pane and subagent briefs
- **Problem.** Long and parallel runs make implicit choices no one can audit, and they collide at merge.
- **Mechanism.** `hs decide "<what>" --why --scope --evidence measured|inferred|guessed`. SubagentStart injects recent entries, and conflicts are flagged before merge.
- **Evidence.** Cognition: implicit decisions conflict; pstack show-me-your-work ([14](research/14-autonomous-multiagent.md)); C-compiler lock files.
- **Context-over-templates.** The decisions are the project's own.

#### HS-053 · Wishlist: park and resume
**State & memory · Build · P1 · S · Autonomy · Depends on: HS-045, HS-017 · Sources: N50, C25**
- **Status.** done — hs wish / resolve-wish (.h-stack/wishlist.jsonl); open wishes surface at SessionStart and in hs status
- **Problem.** Blocked on something only the user can provide, the agent guesses or gives up.
- **Mechanism.** `hs wish "<need>" --why --resume "<task>"`. SessionStart lists open items, and resolving one re-queues the parked task.
- **Evidence.** Cloudflare: 25,472 wishlist writes, "the main way the agents talk back to us" ([09](research/09-security.md)).
- **Context-over-templates.** n/a.

#### HS-054 · Project language: glossary and decision records
**State & memory · Native — configure only · P2 · S · Judgment · Depends on: HS-015 · Sources: E11**
- **Status.** done — skills/memory Project language: glossary and ADRs in the project's docs, loaded via path-scoped rules, never always-on
- **Problem.** Terms and past decisions are re-derived or misread.
- **Mechanism.** Native: a glossary and ADRs in the project's docs, reached through `@path` imports from path-scoped `.claude/rules/` files, so they load on demand. Only terms that aren't obvious. Never always-on.
- **Evidence.** mattpocock domain-modeling ([11 #1](research/11-memory-context.md)); memory docs on `@imports` (4 hops) and `paths`; A3.
- **Context-over-templates.** Entirely project-sourced.

#### HS-055 · Recitation hook and few-shot rut breaker
**State & memory · Build · P2 · S · Autonomy · Depends on: HS-011, HS-001 · Sources: N7, N117**
- **Status.** done — hooks/batch.mjs during long runs (a recorded goal): goal/step recitation when the digest changes, and the few-shot rut breaker on batches of 3+ calls to one tool with different inputs (rotating wording). On for every long run; hs goal set --no-recite turns it off. Snapshots batch-rut-breaker, batch-rut-breaker-off
- **Problem.** On long runs the goal drifts out of focus, and batch work imitates itself.
- **Mechanism.** On long runs only, PostToolBatch appends the goal and step when their digest changes, and restates the current item with varied wording on repetitive batches. Ships only with a measured gain (K16).
- **Evidence.** Manus: recite the plan; "Don't get few-shotted" ([00b](research/00b-research-backed-ideas.md)).
- **Context-over-templates.** n/a.

### Visibility

#### HS-056 · Status mod: spinner and announcement line
**Visibility · Build · P1 · S · Judgment · Depends on: HS-018 · Sources: E12, E14**
- **Status.** needs-user (visual check inside the user's desktop app: the Spinner suffix and announcement line are built in hooks/register.js and pass the mod tests (claude plugin test, 5/5); how they look in the app has not been checked)
- **Problem.** Users can't see what H-Stack picked, so wrong picks go uncorrected.
- **Mechanism.**
  - **Spinner.** The mod's Spinner render site shows `H-Stack · <size> · <skill> · step n/m`.
  - **Announcement.** One line under the answer via `turn.complete` text when a skill starts.
  - **Cost.** Zero context tokens.
  - **Where it can't draw** (`-p`, cloud): falls back to nothing.
- **Evidence.** Mods reference: the Spinner site in Terminal, Desktop and VS Code; mods don't draw in `-p` ([00 E12, E14](research/00-activation-and-experience.md)).
- **Context-over-templates.** n/a.

#### HS-057 · Side pane
**Visibility · Build · P2 · M · Judgment · Depends on: HS-056 · Sources: E13**
- **Status.** needs-user (visual check inside the user's desktop app: the Pane (playbook step, skills, receipts, assumptions, decisions, wishlist) is built in hooks/register.js and opens by itself once a long run is recorded (config pane: 'auto'; true = always, false = never). Mod test 'pane opens by itself once a long run is recorded' passes; its rendering in the app has not been seen)
- **Problem.** Long runs are opaque.
- **Mechanism.** A mod Pane gives a read-only view of the playbook step, skills used, receipts, assumptions, decisions and the wishlist (OD-2).
- **Evidence.** [00 E13](research/00-activation-and-experience.md); mods Pane site.
- **Context-over-templates.** n/a.

### Telemetry

#### HS-058 · Local activation and tool-use telemetry
**Telemetry · Thin · P1 · M · Learning · Depends on: HS-045, HS-018 · Sources: E19, N43, N52**
- **Status.** done — local JSONL: activation.jsonl (pick, rules, correction), tools.jsonl (gate decisions), mod-turns.jsonl (usage, steps, per-tool call counts); 90-day retention pruned at SessionEnd (lib/retro.mjs pruneTelemetry); nothing leaves the machine (scripts/egress.mjs)
- **Problem.** Descriptions and tools are tuned blind.
- **Mechanism.**
  - **Native.** `/skill-doctor` (cost, use count) and `turn.complete` usage.
  - **Thin.** Local JSONL recording:
    - the classifier's pick, and whether the skill was invoked;
    - a user correction in the next prompt;
    - calls per tool, so tools are added only when usage shows a need.
  - **Privacy.** Nothing leaves the machine; 90-day retention.
- **Evidence.** Semgrep was never called in a month (N52); skill-creator description tuning; default-on telemetry flags ([top10-method.md](research/top10-method.md)).
- **Context-over-templates.** n/a.

#### HS-059 · Measured retro and postmortems
**Telemetry · Build · P2 · M · Learning · Depends on: HS-058, HS-048 · Sources: E20, N121, D18**
- **Status.** done — hs retro: activation, corrections, tokens, steps, per-tool calls, git signals (reverts, rework files, median request-to-commit minutes), solo boundary and user-edit candidates; postmortems via skills/debugging and memory handoff
- **Problem.** Developers' sense of speed-up is wrong.
- **Mechanism.** A local report gives measured signals only:
  - time from request to accepted change;
  - wait and review share;
  - rework;
  - reverts.

  It proposes one improvement, gated by the smoke test. A visible failure gets a postmortem with transcript points.
- **Evidence.** METR: forecast −24%, felt −20%, measured +19% ([00c N121](research/00c-beyond-every-stack.md)). dsh postmortems (D18).
- **Context-over-templates.** n/a.

### Skills (category NN)

#### HS-060 · Rubric before code: spec, contract and interfaces
**Skills (04) · Build (on top of IM-04 writing-plans) · P0 (00c: P0; top-3 differentiator) · L · Reliability · Depends on: HS-027, HS-018 (lanes HS-061 and solo-boundary HS-025 refine it later) · Sources: N102, N130, N132**
- **Status.** done — planning skill references/rubric.md; agents/rubric-writer.md and rubric-grader.md (blind, diff + rubric only); hs rubric set/strike/grade; agent-result.mjs validates both; unmet must-haves block the Stop gate
- **Problem.** "Done" is decided after the fact by the agent that did the work, and tests miss root causes and scope creep.
- **Mechanism.** For `full` tasks (at P0 by size label; HS-025 later narrows this to tasks below the measured solo boundary):
  1. A product-level spec with an Interfaces section (signatures, endpoints, data shapes).
  2. A read-only rubric subagent (`context: fork`) explores the repo and writes `rubric.yaml`: binary must/important/nice items on scope, spec alignment, integrity and runtime behaviour.
  3. The user strikes items on one screen.
  4. A blind reviewer (a fresh, read-only subagent with diff + rubric only) grades the diff, and must-haves feed the Stop gate.

  No qualifying import exists, so this is built.
- **Evidence.**
  - Agentic Rubrics: +3.5–4.6 pp Best@16, AUC 0.886, 54% of rubric-only failures real.
  - SWE-Bench Pro: interfaces matter.
  - Harness-design: sprint contract ([00c N102, N130, N132](research/00c-beyond-every-stack.md)).
- **Context-over-templates.** The rubric comes from exploring this repo.

#### HS-061 · Blind review lanes on top of native review
**Skills (07) · Thin · P1 · M · Reliability · Depends on: HS-062, HS-063 · Sources: N19, C18, C19**
- **Status.** done — skills/review lanes (references/lanes.md) with h-stack:review-lane subagents; agent-result.mjs validates lane JSON mechanically and asks for a fresh re-run on malformed/thin output
- **Problem.** Claude is a lenient reviewer of its own family's work, and "nothing found" can't be told apart from "not checked".
- **Mechanism.**
  - **Native.** Built-in `/code-review`, the official code-review plugin and `/security-review`.
  - **Thin.** For high-risk diffs:
    - single-axis reviewer subagents get only the diff command and the spec or rubric;
    - findings are capped, with a `Cleared:` list;
    - a judge re-checks against the same rules on a different family if one is configured (OD-7);
    - never the sole final gate.
- **Evidence.** Claude judges show ×1.7–1.8 self-preference (2604.06996); workerd lanes (C18); Flue judge (C19); official code-review re-validates each issue ([07 #1](research/07-code-review.md)).
- **Context-over-templates.** Rules come from the repo's REVIEW.md, CLAUDE.md and lint config.

#### HS-062 · Findings schema, three verdicts and a deterministic validator
**Skills (07, 09) · Import (from cloudflare/security-audit-skill, MIT) · P1 · M · Reliability · Depends on: HS-012 · Sources: N46, N47, C15, C16, C17, C2**
- **Status.** done — lib/findings.mjs validateFindings (schema, three verdicts, file/line/snippet truth checks) adapted from cloudflare security-audit validators; unit tests
- **Problem.** The model grades its own output format, and invalid output gets "repaired" into findings.
- **Mechanism.**
  - **Import.** The security-audit `report-schema.json` and its zero-dependency validators, with their tests.
  - **Add truth checks.** Cited files and lines exist, the quoted snippet is at that line, the patch applies, the test parses.
  - **Reuse** the schema for review findings.
  - **Enforcement.** SubagentStop validates. Malformed output is discarded and re-run, never repaired. Scripts perform side effects; agents only decide.
- **Evidence.**
  - Cloudflare validators with 65 tests. The published validator checks format only; the production harness adds existence checks (C16).
  - "Trusted code drives; agents only decide" (C2).
  - Recon cut rejections from 40% to 11% ([09](research/09-security.md)).
- **Context-over-templates.** n/a.

#### HS-063 · Coverage ledger, shallow detector, and verification budget reserved first
**Skills (09, 07) · Import (cloudflare security-audit) · P1 · M · Reliability · Depends on: HS-062 · Sources: N48, C21, N51, C20, N49, C22**
- **Status.** done — coverage ledger and shallow detector in lib/findings.mjs; review skill reserves about a third of effort for verification; security-audit ships the upstream coverage-ledger validator
- **Problem.** "All clear" hides what wasn't checked, and exploration spends the verification budget.
- **Mechanism.**
  - **Import.** The ledger rules and budget algorithm from security-audit.
  - **Lighter version for review:** file × concern units, "Not reviewed" stated, the `Cleared:`-based shallow rule (K12), and about 30% of the budget reserved for verification.
- **Evidence.** A single run finds about half of what repeated runs find; shallow hunters are re-queued; "don't manufacture LOWs" ([C20–C22](research/cloudflare/ideas-for-h-stack.md)).
- **Context-over-templates.** Units come from the target's own architecture.

#### HS-064 · Reviewer calibration from user overrides
**Skills (07) · Build · P2 · S · Judgment · Depends on: HS-061, HS-058 · Sources: N106**
- **Status.** done — hs review-override logs false-positive/missed overrides to .h-stack/review-calibration.jsonl; subagent-start adds the latest to review-lane briefs
- **Problem.** Reviewer leniency drifts.
- **Mechanism.** User overrides are logged per project and become versioned few-shot calibration examples, gated by skill-creator's benchmark.
- **Evidence.** Harness-design: making a separate evaluator sceptical is "far more tractable" ([00c N106](research/00c-beyond-every-stack.md)).
- **Context-over-templates.** Calibration is per project.

#### HS-065 · Review guide with every change
**Skills (13) · Import (mattpocock `pr`, MIT) · P1 · S · Reliability · Depends on: HS-027 · Sources: N31**
- **Status.** done — skills/git-ship review guide derived from the diff: where to look first, evidence with receipts, Not verified, merge danger
- **Problem.** Reviewers' minutes are the scarce resource.
- **Mechanism.** The adapted `pr` skill adds:
  - the risk per hunk;
  - where to look first;
  - receipts for what was verified;
  - a "Not verified" section.
- **Evidence.** Sonar: 48% always check AI code ([00b](research/00b-research-backed-ideas.md)); mattpocock `pr` ([13 #3](research/13-git-ship.md)).
- **Context-over-templates.** Derived from the diff, not a template.

#### HS-066 · Counterfactual fix proof
**Skills (06) · Build · P1 · S · Reliability · Depends on: HS-027 · Sources: N17, C24**
- **Status.** done — skills/debugging/scripts/verify-fix.mjs: the regression test must fail with the fix reverted and pass with it
- **Problem.** New tests often pass without the fix.
- **Mechanism.** A `verify-fix` script:
  1. Stash the fix; the new test must fail.
  2. Restore it; the test must pass.

  It records receipts and is called from the imported debugging and TDD skills.
- **Evidence.** Cloudflare Fixer: "clean fail→pass flip"; viguy: tests "that pass regardless" ([C24](research/cloudflare/ideas-for-h-stack.md)).
- **Context-over-templates.** Uses the project's own test runner.

#### HS-067 · Harvest reproduction scripts into the test suite
**Skills (06) · Build · P1 · S · Reliability · Depends on: HS-066 · Sources: N103**
- **Status.** done — skills/debugging: the reproduction becomes a test in the project's own suite before the fix
- **Problem.** Throwaway repro scripts, the best evidence of the bug, get deleted.
- **Mechanism.** Scripts that fail on the base commit and pass with the fix are offered as regression tests, deduplicated.
- **Evidence.** Agentless §3.3; EGSS +5–10% ([00c N103](research/00c-beyond-every-stack.md)).
- **Context-over-templates.** Tests follow the project's conventions.

#### HS-068 · Diff-targeted mutation check
**Skills (08) · Build · P2 · M · Reliability · Depends on: HS-066 · Sources: N18**
- **Status.** done — skills/qa/scripts/mutate.mjs: diff-targeted mutations, reports survivors
- **Problem.** Coverage doesn't show whether tests have teeth.
- **Mechanism.** Mutate the changed lines; new tests must catch the mutants.
- **Evidence.** ACH: 49% of useful tests add no line coverage (A12). The Trail of Bits idea is CC BY-SA, so idea only.
- **Context-over-templates.** Uses the project's language and test runner.

#### HS-069 · Signal rules: retry on a new signal, escalate on disagreement
**Skills (01, 06) · Import (adapt superpowers systematic-debugging, MIT) · P1 · S · Reliability · Depends on: HS-027, HS-037 · Sources: N16, N21**
- **Status.** done — skills/debugging signal rules: retry only on a new signal; escalate when evidence disagrees
- **Problem.** Reflect-and-retry without new evidence lowers accuracy.
- **Mechanism.** Add to the imported debugging skill and the core rules:
  - a retry cites a new external signal;
  - verification escalates when independent checks disagree, not on self-reported confidence.

  Backed by HS-037.
- **Evidence.**
  - Huang et al.: GPT-4 on GSM8K fell from 95.5 to 89.0.
  - 2608.14659: −3 to −10 pp.
  - Retry feedback raises cheating from 33% to 38% ([00b](research/00b-research-backed-ideas.md)).
- **Context-over-templates.** n/a.

#### HS-070 · Premise check and evidence-first disagreement
**Skills (01, 03) · Import (adapt pstack `principle-attack-the-premise`, MIT) · P1 · S · Judgment · Depends on: HS-018 · Sources: N5, N122**
- **Status.** done — skills/core-rules premise check and evidence-first disagreement
- **Problem.** Models affirm users' stated causes, and prompting alone mitigates this poorly.
- **Mechanism.** A user-asserted cause becomes a hypothesis checked with the cheapest evidence step. The reply follows: evidence → conclusion → the cheapest settling check → the user decides.
- **Evidence.** ELEPHANT §4.3; *Science* 2026: ~49% more affirmation than humans ([00c N122](research/00c-beyond-every-stack.md)); pstack ([03 #5](research/03-ideation-product.md)).
- **Context-over-templates.** Evidence comes from this project.

#### HS-071 · Long-run protocol on native `/goal`
**Skills (14) · Thin · P1 · M · Autonomy · Depends on: HS-027, HS-047, HS-053 · Sources: N35, N131, D9**
- **Status.** done — skills/long-run /goal protocol (goal/step via hs goal, checkpoints, stop gate, overseer, declared effects)
- **Problem.** Long runs mark items done without end-to-end checks, and `/goal` conditions written as wishes are met by a confident summary.
- **Mechanism.**
  - **Native.** `/goal`, Routines, Workflows, `/batch`, worktrees.
  - **Thin addition: feature list.** JSON (all `passes: false`) plus a progress file.
  - **Thin addition: goal conditions.** One measurable end state, the exact check, a receipt ID, constraints and a turn bound.
  - **Thin addition: continuation wording.** The workspace is authoritative; "blocked" only after the same condition persists for 3 rounds.
- **Evidence.** Anthropic long-running harness; `/goal` docs; dsh goal rounds (D9) ([00c N131](research/00c-beyond-every-stack.md)).
- **Context-over-templates.** The feature list comes from the project's spec.

#### HS-072 · Risk-gated tournament
**Skills (05) · Thin · P2 · M · Reliability · Depends on: HS-060, HS-061, HS-025 · Sources: N20**
- **Status.** done — skills/planning several-attempts section: only for high risk with verification effort full; 2-4 approaches in worktrees scored by rubric-grader, no debate
- **Problem.** A single attempt at a high-risk change.
- **Mechanism.** Native worktrees and subagents. Only below the solo boundary and at high risk: 2–4 approaches, rubric scoring, never debate.
- **Evidence.** EGSS: +5–10% with 28% fewer tokens; pstack `arena`; debate 83.0 vs majority vote 88.2 (A7).
- **Context-over-templates.** Scored against this repo's rubric.

#### HS-073 · Change-size governor
**Skills (13) · Build · P2 · S · Reliability · Depends on: HS-065 · Sources: N33**
- **Status.** done — skills/git-ship/scripts/change-size.mjs: threshold from the project's merged history; larger work split into stacked steps
- **Problem.** Diffs too large to review.
- **Mechanism.** A threshold from the project's merged-PR history; larger work is split into stacked steps.
- **Evidence.** addyosmani ~100-line sizing ([07 #8](research/07-code-review.md)).
- **Context-over-templates.** Threshold from this project.

#### HS-074 · Code mode for bulk tool work
**Skills (14) · Build · P2 · S · Cost · Depends on: — · Sources: N40, C33**
- **Status.** done — skills/long-run code mode: write a script that makes the calls; credentials stay in a wrapper
- **Problem.** Looping through tool calls floods context.
- **Mechanism.** Write a script that makes the calls; credentials stay with a wrapper.
- **Evidence.** 150,000 → 2,000 tokens (98.7%); Cloudflare 1.17M → ~1,000 ([C33](research/cloudflare/ideas-for-h-stack.md)).
- **Context-over-templates.** n/a.

#### HS-075 · Hybrid code navigation
**Skills (11) · Build · P2 · M · Cost · Depends on: HS-058 · Sources: N12**
- **Status.** done — gate kept as specified: no graph until telemetry shows structural questions are common (hs retro per-tool counts); skills/memory Structural questions uses native LSP/grep
- **Problem.** Structural questions cost many reads.
- **Mechanism.** A graph for caller and hub questions only, added only if telemetry shows they are common.
- **Evidence.** Codebase-Memory: overall quality 0.83 vs 0.92 for the file explorer ([00b](research/00b-research-backed-ideas.md)).
- **Context-over-templates.** n/a.

#### HS-076 · Sleep-time prep
**Skills (14) · Native — configure only · P2 · S · Cost · Depends on: HS-071 · Sources: N30**
- **Status.** needs-user (credentials or accounts: a nightly Routine is created in the user's claude.ai account; the prompt and task.yaml pattern are in skills/long-run)
- **Problem.** Shared prep work is redone in every session.
- **Mechanism.** A Routine on a nightly schedule refreshes flaky-test triage and the dependency audit, only where many later queries share the context. Results are offered, never acted on.
- **Evidence.** Sleep-time compute: ~5× / 2.5× only under predictable queries ([00c §2](research/00c-beyond-every-stack.md)); Routines docs.
- **Context-over-templates.** Built from this repo.

#### HS-077 · CI watcher for the open PR
**Skills (13) · Native — configure only · P2 · S · Autonomy · Depends on: HS-044, HS-024 · Sources: E15**
- **Status.** needs-user (credentials or accounts: a GitHub-event Routine needs the user's claude.ai account and GitHub app on the repo; behaviour (notice + offer, per-PR opt-in fixes, never merge) is in skills/long-run)
- **Problem.** CI failures wait for a human.
- **Mechanism.** A Routine with a GitHub-event trigger sends a notice and an offer. An automatic fix only with a per-PR opt-in; it never merges (K7, K8).
- **Evidence.** Routines fire from schedule, GitHub-event or API triggers (whats-new; [00 E15](research/00-activation-and-experience.md)).
- **Context-over-templates.** n/a.

#### HS-078 · Known-good oracle bisection
**Skills (14) · Build · P2 · S · Autonomy · Depends on: — · Sources: N128**
- **Status.** done — skills/long-run/scripts/oracle.mjs: bisection against a known-good reference with lock-file claims
- **Problem.** Parallel agents all fix the same giant failure and overwrite each other.
- **Mechanism.** A bisection harness against a known-good reference, so each agent gets a different failing subset; work is claimed with lock files.
- **Evidence.** C-compiler post: the GCC oracle ([00c N128](research/00c-beyond-every-stack.md)).
- **Context-over-templates.** The oracle is chosen per project.

#### HS-079 · Accounting gate for migrations
**Skills (05) · Build · P2 · S · Reliability · Depends on: — · Sources: C37**
- **Status.** done — skills/tdd/scripts/accounting.mjs: every source id maps to target or a reasoned skip; per-stage counts compared; exit 1 on any gap
- **Problem.** Items silently disappear in migrations.
- **Mechanism.** Every source item maps to a target or to a "not migrated: reason" row. Counts are compared per stage, stopping on a mismatch.
- **Evidence.** cloudflare-one-migrations ([C37](research/cloudflare/ideas-for-h-stack.md)).
- **Context-over-templates.** n/a.

#### HS-080 · Learn code, not prose
**Skills (15) · Thin · P1 · M · Learning · Depends on: HS-048, HS-002 · Sources: N111**
- **Status.** done — skills/skill-authoring/scripts/repeated.mjs finds repeated command sequences to turn into scripts, not prose
- **Problem.** Repeated procedures are worth keeping, but prose written by the model hurts.
- **Mechanism.** After a procedure succeeds 2+ times, propose a script with calibrated defaults and a test that ran. skill-creator scaffolds it and benchmarks it. A human reviews the content (K20).
- **Evidence.** SkillsBench F.4: scripts are the top pattern; self-generated prose −8.1 to −11.5 pp. Dynamic Cheatsheet 10% → 99%. SkillWeaver +31.8%.
- **Context-over-templates.** Scripts encode this project's procedures.

### Docs

#### HS-081 · Adopt-and-adapt procedure and skill standard
**Docs · Build · P0 · S · Reliability · Depends on: — · Sources: C29, N56, C32, N44, N28**
- **Status.** done — docs/adopt-and-adapt.md; checked by scripts/lint.mjs
- **Problem.** Imports bring house styles, size and licence obligations. Generic or model-written skills lower pass rates.
- **Mechanism.** One short doc used for every import (checked by HS-013):
  1. Pick the top-ranked permissive skill.
  2. Read every file in full.
  3. Keep LICENSE and copyright.
  4. Add a THIRD_PARTY.md row with the commit and the changes made.
  5. Strip styles and templates.
  6. Reshape into Gate → Contract → Retrieve → Before you finish.
  7. In `when_to_use`, name the siblings this skill is not for.
  8. Route to upstream docs instead of copying.
  9. Encode project and domain procedure, not generic advice.
  10. Set `user-invocable: false` and trim to the budget.
  11. Add `evals/evals.json` and run the skill-creator benchmark.
- **Evidence.**
  - SkillsBench: self-generated −8.1 to −11.5 pp; software engineering only +11.6 pp.
  - cloudflare `sandbox-next`: "a gate, a contract, and a retrieval map" (C29).
  - CONTRIBUTING: route to docs rather than copy them (N56, C32).
  - [15](research/15-skill-authoring.md).
- **Context-over-templates.** The procedure's core is stripping house styles.

#### HS-082 · Native-first map
**Docs · Build · P0 · S · Cost · Depends on: — · Sources: N34**
- **Status.** done — ARCHITECTURE.md §2 table; every built item names its native feature and thin addition
- **Problem.** Stacks reinvent loops, memory, schedulers and guards that Claude Code now ships.
- **Mechanism.** The "Need → native feature → H-Stack's thin addition → evidence" table in [ARCHITECTURE §2](ARCHITECTURE.md#2-need--native-feature--h-stacks-thin-addition). Any item that duplicates a native feature is cut or turned into configuration.
- **Evidence.** The 00b Claude Code features row; dsh "not worth copying"; the memory, skills, hooks and mods docs (2026-11-11).
- **Context-over-templates.** n/a.

### Distribution

#### HS-083 · Supply chain: third-party record, pins and scan
**Distribution · Thin · P0 · S (record) / M (scan) · Reliability · Depends on: HS-012 · Sources: N24, C34**
- **Status.** done — third-party.json -> THIRD_PARTY.md with per-file SHA-256 of shipped and upstream files, checked in CI; SessionStart verifies digests; gate-bash asks on skill/plugin/MCP installs; scripts/scan-skill.mjs scans third-party skills, hooks and MCP configs; nothing loads instructions from a URL
- **Problem.** Imported skills and third-party configs are a supply-chain attack surface, and some stacks fetch their instructions at run time.
- **Mechanism.**
  - **P0.** `plugins/h-stack/THIRD_PARTY.md` lists each import's repo, path, commit, licence, per-file SHA-256 and changes; CI checks it against the files.
  - **Also:**
    - SessionStart verifies digests;
    - PreToolUse asks on `npx skills add`, `claude plugin install` and `@latest` MCP installs;
    - third-party skills, hooks and MCP configs are scanned before they are enabled;
    - H-Stack never loads instructions from a URL.
- **Evidence.**
  - Snyk: injection in 36% of tested skills ([research/README.md](research/README.md)).
  - The MCP Skills manifest carries a `sha256` per file (C34).
  - Remote-loaded instructions flagged in vercel and Orca ([top10-method.md](research/top10-method.md)).
- **Context-over-templates.** n/a.

#### HS-084 · Skill feedback drafts with exact-text approval
**Distribution · Build · P2 · S · Learning · Depends on: HS-058 · Sources: C36**
- **Status.** done — skills/skill-authoring/scripts/feedback-draft.mjs drafts an issue (file, section, expected, actual) with a privacy blocklist; posts only after the user approves the exact text
- **Problem.** Skill failures users notice never reach the H-Stack repo.
- **Mechanism.** H-Stack drafts an issue (file, section, expected, actual) with a privacy blocklist, and posts only after the user approves the exact text.
- **Evidence.** Cloudflare skill-feedback ([C36](research/cloudflare/ideas-for-h-stack.md)).
- **Context-over-templates.** n/a.

#### HS-085 · Release gate
**Distribution · Thin · P1 · S · Reliability · Depends on: HS-001, HS-010, HS-011, HS-013, HS-083 · Sources: none of its own (CLAUDE.md "Validate", "Report honestly")**
- **Status.** needs-user (smoke-test results: evals/release-gate.mjs is built (CI + a smoke run on real tasks newer than the last plugin change, with regressions listed) and its CI part passes; the gate itself cannot pass until the user's real smoke-test tasks exist and have been run (HS-001))
- **Problem.** A release ships without numbers, or hides its regressions.
- **Mechanism.** Bump the version only when these pass:
  - `claude plugin validate .`;
  - the budget, snapshot and lint checks;
  - the THIRD_PARTY check;
  - a fresh smoke-test benchmark, regressions included, committed under `evals/results/`.
- **Evidence.** [CLAUDE.md](CLAUDE.md).
- **Context-over-templates.** n/a.

---

## Anti-idea, licence and native check

Every item was checked against:
- A1–A22;
- the licence and safety flags in [top10-method.md](research/top10-method.md#safety-and-data-quality-flags);
- the native feature set.

**No source idea was dropped whole.** These were adjusted:

| Source | Problem found | Change |
|---|---|---|
| E7 | A3; native git status already in context | HS-017: no repo overview, no git status, facts only |
| E8, D8 | A2: merge-in-place | HS-047: native compaction + schema; a new checkpoint file each time |
| E9 | Budget; native subagents skip auto memory | HS-023: ≤150 tokens, including matching memory and lessons |
| E10 | A1, A2, A21; native `feedback` memory exists | HS-049: native capture; promotion to a committed lesson needs evidence and review |
| E11 | A3 | HS-054: native `@imports` and `paths`, on demand only |
| E15 | A17; native Routines exist | HS-077: Routine + offer; auto-fix needs opt-in |
| E17 | Per-request model switching breaks the cache (A20) | **Per-request part dropped**; HS-041 per subagent or skill |
| E20 | A16, A1 | HS-059: measured signals; one proposal, gated by the smoke test |
| C4 | Autonomy | HS-030: ask + binding + opt-in allowlist |
| C14 | A20: disabling tools mid-session | HS-038: deny, tools stay listed |
| D3, N123 (pass^3), N125, N126 | CLAUDE.md: lean smoke test | HS-006, HS-004, HS-002: P2 "if a problem shows up" |
| D6, D14 | Native duplicates (`background_tasks`; output spill) | HS-027 reads native fields; HS-012 covers H-Stack's own output only |
| N7, N117 | Cache and context cost | HS-055: P2, measured gain required |
| N19 | A8 | HS-061: never the sole final gate; native review first |
| N20 | A7 | HS-072: rubric scoring, no debate |
| N25, N108 | Native transcripts already hold the raw episodes | HS-048: no parallel episode store; excerpts embedded in lessons |
| N26 | A2: counters edited in place | HS-049: appended vote events; git history for lesson text |
| N51 | A14 | HS-063: `Cleared:` rule |
| N3, N29, N106, N111 | A1; SkillsBench | Gated by the benchmark and human review (K20) |
| N12 | Graph tools add tool definitions; lower quality | HS-075: only after telemetry shows a need |
| N30 | A17 | HS-076: Routine; results offered only |
| N101, C3 | Native permission rules exist | HS-029: configure only |

Mechanisms from 00 §2 that are not adopted:
- **Forced evaluation** (mechanism D). Fails A4 and the budget (K3).
- **"Inject the top 3 matches"** (mechanism C). Capped at 2 (A11).

**Licence and safety flags.** Every flagged candidate is in the "Not imported" list under the import table. Ideas taken from them are re-expressed in H-Stack's own words:
- HS-068 from Trail of Bits;
- HS-012 from context-mode.

All D-ideas come from MIT-licensed dsh; quotes stay in `research/` with attribution. Cloudflare sources are MIT, Apache-2.0 and CC BY 4.0 (attribution, not share-alike).

---

## Will not do

The anti-ideas from [00c §5](research/00c-beyond-every-stack.md).

| # | Practice | Why not (evidence) | Where H-Stack enforces the opposite |
|---|---|---|---|
| A1 | Auto-generating skills or rules from sessions without an eval | SkillsBench v4 Table 6: −8.1 to −11.5 pp | HS-081, HS-080, HS-049, K20 |
| A2 | Consolidating memory after every session; rewriting lessons in place | 2605.12978 Table 5 | HS-048, HS-049, HS-050, HS-047 |
| A3 | `/init`-style CLAUDE.md with repo overviews | 2602.11988: no significant gain, +20–23% cost | HS-010, HS-017, HS-054 |
| A4 | ALL CAPS / "YOU MUST" instructions | Best practices: over-application; hooks for rules that can't bend | HS-013, HS-081 (imports reworded) |
| A5 | "Keep going / loop until done" prompts | Over-work; retry feedback raises cheating 33 → 38% | HS-071 |
| A6 | Reflect-and-retry without new evidence | Huang et al.; 2608.14659 | HS-069 |
| A7 | Multi-agent debate as the verifier | Debate 83.0 vs majority vote 88.2 | HS-072, HS-061 |
| A8 | Same-model self-review as the final gate | ×1.7–1.8 self-preference | HS-061, HS-027 |
| A9 | Delegating "for a better answer" or "to save context" | Same model; 1M window | HS-041 |
| A10 | Parallel subagents writing interdependent code without shared decisions | Cognition; Anthropic | HS-052, HS-041 |
| A11 | Comprehensive skills; 4+ skills on one task | SkillsBench Tables 8–9 | HS-018, HS-010, HS-081 |
| A12 | Coverage as the measure of new tests | ACH: 49% | HS-068 |
| A13 | Read-only tests as the only anti-cheat | ImpossibleBench §5.2 | HS-028 |
| A14 | "Find problems" reviewers with no correctness filter | Best practices | HS-061, HS-063 |
| A15 | Trusting self-reported confidence or "I verified this" | 2608.14659; DGM App. H | HS-027, HS-069 |
| A16 | Asking users whether AI made them faster | METR | HS-005, HS-059 |
| A17 | Proactive actions mid-task | ProCodeBench; ProAIDE | HS-024, HS-076, HS-077 |
| A18 | A tool-less summariser as the whole injection defence | CaMeL §2 | HS-032 |
| A19 | Typo or "package exists" checks as the dependency defence | Spracklen §5.4, §6.1 | HS-031 |
| A20 | Adding or removing tools or skills mid-session; timestamps in prompts | Manus; caching docs | HS-011, HS-038 |
| A21 | Learning global rules from user edits | CIPHER §4.3 | HS-049, HS-051 |
| A22 | A fixed heavy process on every task | Harness-design; AGENTS.md cost | HS-018, HS-025, HS-060 |

---

## Coverage

Every source ID maps to exactly one HS item. Anti-ideas map to Will not do.

**E1–E20 (20)**

| ID | HS | ID | HS | ID | HS | ID | HS |
|---|---|---|---|---|---|---|---|
| E1 | 018 | E6 | 027 | E11 | 054 | E16 | 052 |
| E2 | 018 | E7 | 017 | E12 | 056 | E17 | 041 |
| E3 | 018 | E8 | 047 | E13 | 057 | E18 | 038 |
| E4 | 020 | E9 | 023 | E14 | 056 | E19 | 058 |
| E5 | 030 | E10 | 049 | E15 | 077 | E20 | 059 |

**N1–N56 (56)**

| ID | HS | ID | HS | ID | HS | ID | HS |
|---|---|---|---|---|---|---|---|
| N1 | 020 | N15 | 028 | N29 | 008 | N43 | 058 |
| N2 | 046 | N16 | 069 | N30 | 076 | N44 | 081 |
| N3 | 021 | N17 | 066 | N31 | 065 | N45 | 016 |
| N4 | 024 | N18 | 068 | N32 | 020 | N46 | 062 |
| N5 | 070 | N19 | 061 | N33 | 073 | N47 | 062 |
| N6 | 010 | N20 | 072 | N34 | 082 | N48 | 063 |
| N7 | 055 | N21 | 069 | N35 | 071 | N49 | 063 |
| N8 | 011 | N22 | 031 | N36 | 041 | N50 | 053 |
| N9 | 047 | N23 | 032 | N37 | 023 | N51 | 063 |
| N10 | 047 | N24 | 083 | N38 | 037 | N52 | 058 |
| N11 | 026 | N25 | 048 | N39 | 041 | N53 | 036 |
| N12 | 075 | N26 | 049 | N40 | 074 | N54 | 043 |
| N13 | 028 | N27 | 051 | N41 | 001 | N55 | 014 |
| N14 | 028 | N28 | 081 | N42 | 006 | N56 | 081 |

**N100–N132 (33)**

| ID | HS | ID | HS | ID | HS |
|---|---|---|---|---|---|
| N100 | 027 | N111 | 080 | N122 | 070 |
| N101 | 029 | N112 | 048 | N123 | 002 |
| N102 | 060 | N113 | 012 | N124 | 003 |
| N103 | 067 | N114 | 039 | N125 | 004 |
| N104 | 030 | N115 | 011 | N126 | 006 |
| N105 | 040 | N116 | 010 | N127 | 052 |
| N106 | 064 | N117 | 055 | N128 | 078 |
| N107 | 025 | N118 | 041 | N129 | 042 |
| N108 | 048 | N119 | 033 | N130 | 060 |
| N109 | 050 | N120 | 032 | N131 | 071 |
| N110 | 049 | N121 | 059 | N132 | 060 |

**C1–C38 (38)**, numbered in file order. The unnumbered §E self-audit seed maps to HS-014.

| ID | HS | ID | HS | ID | HS | ID | HS |
|---|---|---|---|---|---|---|---|
| C1 | 044 | C11 | 036 | C21 | 063 | C31 | 012 |
| C2 | 062 | C12 | 012 | C22 | 063 | C32 | 081 |
| C3 | 029 | C13 | 027 | C23 | 016 | C33 | 074 |
| C4 | 030 | C14 | 038 | C24 | 066 | C34 | 083 |
| C5 | 030 | C15 | 062 | C25 | 053 | C35 | 016 |
| C6 | 034 | C16 | 062 | C26 | 008 | C36 | 084 |
| C7 | 034 | C17 | 062 | C27 | 002 | C37 | 079 |
| C8 | 035 | C18 | 061 | C28 | 016 | C38 | 023 |
| C9 | 032 | C19 | 061 | C29 | 081 | | |
| C10 | 012 | C20 | 063 | C30 | 013 | | |

**D1–D22 (22)**

| ID | HS | ID | HS | ID | HS | ID | HS |
|---|---|---|---|---|---|---|---|
| D1 | 010 | D7 | 011 | D13 | 023 | D19 | 026 |
| D2 | 011 | D8 | 047 | D14 | 012 | D20 | 014 |
| D3 | 006 | D9 | 071 | D15 | 001 | D21 | 032 |
| D4 | 037 | D10 | 030 | D16 | 007 | D22 | 009 |
| D5 | 036 | D11 | 010 | D17 | 017 | | |
| D6 | 027 | D12 | 020 | D18 | 059 | | |

**A1–A22 (22):** all are in [Will not do](#will-not-do).

**Totals:** 20 + 56 + 33 + 38 + 22 = 169 ideas → 85 items; 22 anti-ideas → Will not do; 0 unmapped.

**Categories.** Every category 01–16 has an import or build decision in [Skill imports by category](#skill-imports-by-category). Categories 02, 03, 10, 12 and 16 contribute few numbered ideas; their "Ideas worth stealing" lists ([research/](research/README.md)) are applied when each category's imports are adapted.
