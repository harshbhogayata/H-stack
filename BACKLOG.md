# H-Stack backlog

One de-duplicated, prioritised list of everything the research proposed. Built 2026-11-11 from:

| Source set | IDs | Count | File |
|---|---|---:|---|
| Experience ideas | E1–E20 | 20 | [research/00-activation-and-experience.md §3](research/00-activation-and-experience.md) |
| Research-backed ideas | N1–N56 | 56 | [research/00b-research-backed-ideas.md](research/00b-research-backed-ideas.md) |
| Beyond every stack | N100–N132 | 33 | [research/00c-beyond-every-stack.md §3](research/00c-beyond-every-stack.md) |
| Cloudflare ideas (numbered 1–38 in the file) | C1–C38 | 38 | [research/cloudflare/ideas-for-h-stack.md](research/cloudflare/ideas-for-h-stack.md) |
| DeepSeek Harness ideas | D1–D22 | 22 | [research/deepseek-harness.md §8](research/deepseek-harness.md) |
| Anti-ideas | A1–A22 | 22 | [research/00c-beyond-every-stack.md §5](research/00c-beyond-every-stack.md) |
| **Total** | | **191** | |

The 169 ideas merge into **85 items (HS-001…HS-085)**. The 22 anti-ideas are in [Will not do](#will-not-do). No source idea was dropped whole. 23 were changed to fit an anti-idea, a licence or safety flag, or a native feature (see [Anti-idea and licence check](#anti-idea-and-licence-check)). The design behind these items is in [ARCHITECTURE.md](ARCHITECTURE.md).

**Binding rules applied to every item** (from [CLAUDE.md](CLAUDE.md)):
- Every item names the metric it should move.
- Nothing ships until it beats the no-change baseline on the eval suite (HS-001…HS-005).
- Each design choice cites evidence.
- Output is derived from the project's own context, not from templates.

**Priority meaning**
- **P0:** needed for the first measurable version, meaning a scorecard comparing H-Stack with no stack.
- **P1:** next.
- **P2:** later.

Where this differs from a priority in 00c (which used "build first"), the item says so and why.

## Summary

| Layer | P0 | P1 | P2 | Total |
|---|---:|---:|---:|---:|
| Evals | 5 | 2 | 2 | 9 |
| Self-checks/CI | 3 | 2 | 0 | 5 |
| Skill index | 1 | 1 | 0 | 2 |
| Activation | 2 | 7 | 1 | 10 |
| Guards | 4 | 11 | 3 | 18 |
| State & memory | 2 | 6 | 3 | 11 |
| Visibility | 0 | 1 | 1 | 2 |
| Telemetry | 0 | 1 | 1 | 2 |
| Skills (category NN) | 0 | 11 | 10 | 21 |
| Docs | 2 | 0 | 0 | 2 |
| Distribution | 0 | 2 | 1 | 3 |
| **Total** | **19** | **44** | **22** | **85** |

**Metric** (primary metric each item should move):

| Metric | Items |
|---|---:|
| Reliability | 37 |
| Autonomy horizon | 11 |
| Learning | 10 |
| Judgment | 13 |
| Cost | 14 |

**P0 path**, in build order (milestones in [ARCHITECTURE.md §9](ARCHITECTURE.md#9-build-order-p0-path)):
1. HS-082, HS-001, HS-002, HS-003, HS-004, HS-005: evals and baseline.
2. HS-081, HS-010, HS-011, HS-012, HS-015: skeleton and CI.
3. HS-045, HS-027: state and receipts.
4. HS-029, HS-028: test integrity.
5. HS-030: irreversible actions.
6. HS-018: activation.
7. HS-020, HS-046: judgment.

**Native Claude Code features this backlog builds on** (checked at code.claude.com/docs on 2026-11-11):
- [hooks](https://code.claude.com/docs/en/hooks), with 30 events, `onFailure`, `PostToolBatch`, PreCompact instructions, Stop `background_tasks`, and the 8-continuation cap.
- [skills](https://code.claude.com/docs/en/skills), with `metadata`, `paths`, `context: fork` and the 1,536-character cap.
- [mods](https://code.claude.com/docs/en/plugins/mods/reference), with `prompt.submit`, `tool.describe`, `agent.spawn`, `turn.step`, `turn.complete`, `$.model.complete` and the Spinner/Pane render sites.
- [`claude plugin eval`](https://code.claude.com/docs/en/plugin-evals).
- [`/goal`](https://code.claude.com/docs/en/goal).
- Cloud scheduled tasks and dynamic workflows.
- Auto mode.
- `/skill-doctor`.

---

## Conflicts and how they are resolved

| # | Conflict | Items involved | Resolution and reason |
|---|---|---|---|
| K1 | **ACE evolving playbooks vs a minimal always-on context.** ACE grows a detailed, itemised playbook in the prompt (+10.6% on AppWorld). The AGENTS.md study found context files cost +20–23% with no significant gain. 2605.12978 shows ACE also degrades over long streams. | HS-049, HS-010 | Keep ACE's *itemised delta with counters*, but lessons are never always-on. A lesson is retrieved only when its trigger matches, at most 2 per prompt, with the raw episode excerpt. The counters are appended vote events, not in-place edits. Reason: Table 5 of 2605.12978 (in-place rewriting is the most damaging step), plus the budget in HS-010. |
| K2 | **Multi-agent gains vs cost and coupling.** Anthropic's research system scored +90.2% with multiple agents, dsh Teams +10 pts, and review lanes and tournaments add more agents. On the other side: ~15× tokens, coding is "less parallelizable", and Cognition's implicit-decision conflicts. | HS-041, HS-025, HS-061, HS-072, HS-052 | Default is one agent for coding. Subagents are used for read-only research and review. Budgets by size are enforced by `agent.spawn` (direct 0, light ≤1, full 2–5). Review lanes and tournaments run only below the measured solo boundary or at high risk. Parallel writers must log implicit decisions. |
| K3 | **Forced-evaluation activation (84%) vs the context budget and A4.** | HS-018 | Not adopted. Forced evaluation spends tokens on every turn and uses "check every skill" wording. Instead, a rules classifier adds at most one factual line naming ≤2 skills. Forced evaluation survives only as an ablation arm, to measure what it would add. |
| K4 | **SessionStart router (superpowers pattern) vs the AGENTS.md evidence** (overviews don't help, cost +20%). | HS-017, HS-018 | The router is P1. It must beat per-prompt classification alone in an ablation (HS-006) and fit inside the budget. The briefing carries only facts that can't be inferred from the repo. |
| K5 | **D8 checkpoint "merge prior, drop stale" and native auto-memory merges vs append-only memory.** | HS-047, HS-050 | Each compaction writes a *new* checkpoint file; earlier ones stay on disk and user corrections are copied verbatim. Native auto-memory merges are shadow-logged with a restore option. |
| K6 | **Read-only tests vs TDD and legitimate test changes.** | HS-028 | The guard depends on the phase. Test edits are allowed in a declared test-writing step. During implementation they need the user's approval with the diff shown. The deterministic tamper scan (HS-028b) runs in every phase. |
| K7 | **"Irreversible verbs are human-only" (C4) vs autonomy horizon** (CI babysitting, auto-merge). | HS-030, HS-077, HS-044 | These actions ask by default, with approval bound to the exact command. A per-project, opt-in allowlist lets the user pre-approve named actions. H-Stack never merges on its own initiative. The autonomy metric counts these asks as *necessary* interventions, so they don't count against it. |
| K8 | **Proactive watchers and prep (E15, N30) vs A17** (proactive actions mid-task). | HS-024, HS-076, HS-077 | These features make offers, not actions. An automatic fix turn needs a per-PR opt-in. Offers are shown at workflow boundaries (ProAIDE: 52% engagement at boundaries vs 62% dismissed mid-task). |
| K9 | **Small-model classifier vs cost and latency.** | HS-018, HS-019 | Open decision OD-1. P0 is rules-only. The model fallback (P1) is off until the activation evals show a recall gain worth its per-prompt cost. |
| K10 | **Several Stop checks (N100, N105, D6, N2, test tamper) vs nagging and the 8-continuation cap.** | HS-027, HS-028, HS-040, HS-046 | One Stop dispatcher runs the checks in a fixed order, emits one combined note, blocks at most once per stop (`stop_hook_active`), and never blocks a turn that made no edits. |
| K11 | **Cross-family blind review vs availability and egress.** dsh's auto review uses the same model. | HS-061 | Use a different family when the user configures one (OD-7). Otherwise use a fresh-context Claude reviewer plus deterministic validators. A same-model review is never the only final gate (A8). |
| K12 | **Shallow-result detector (N51) vs "default to no findings" (C20, A14).** | HS-063 | Empty findings with a full `Cleared:` list are accepted. Empty findings with thin coverage or few file reads trigger a re-run from a different angle. |
| K13 | **Learning from corrections and edits (E10, the "lessons loop" in 01) vs A1, A2 and A21.** | HS-049, HS-051 | Lessons are keyed to their context and linked to an episode. They are *proposed*, saved only on approval, and never become global rules unless they hold across contexts. CIPHER found context-agnostic preferences did worse than no learning. |
| K14 | **Catalogue breadth vs the skill-listing budget and "no slash commands".** At up to 1,536 characters per skill, 10 full listings cost ~3.8k tokens on every request. Hiding skills with `disable-model-invocation` would make them unreachable without slash commands. | HS-015, HS-010, HS-081 | Keep the listed catalogue small: roughly one routing skill per category, with playbooks in `references/` loaded on demand (pstack router + playbooks; Cloudflare router-to-docs). Open decision OD-8. |
| K15 | **Guards everywhere vs dsh's evidence that a guard can cost more than it gives.** dsh switched off its read-before-write guard after benchmark comparison. | All Guards | Every guard reads `HSTACK_DISABLE` and is ablated (HS-006). Guards with Δ ≤ 0 are retired. |
| K16 | **Recitation and per-batch notes vs cache and context cost.** | HS-055, HS-011 | These notes are digest-gated (re-injected only when the fact changed), P2, and ship only if an ablation shows a gain. |
| K17 | **Per-step model routing (E17 via `turn.step`) vs the prompt cache.** | HS-041 | Routing is per subagent or per skill (`model`, `effort` frontmatter), never per request. Each model switch loses the cached prefix (Manus: cached $0.30 vs $3/MTok). |
| K18 | **Rubric-before-code (heavy) vs A22** (fixed heavy process on every task). | HS-060, HS-025 | Only for tasks sized `full` that sit below the measured solo boundary. |

---

## Items

Format for each item:
- Header line: layer, priority, size, metric, dependencies, sources.
- Then four fields: problem, mechanism (the Claude Code primitive used), evidence, and the context-over-templates check.

Sizes: **S** ≤ 1 day · **M** ≤ 1 week · **L** > 1 week.

### Evals

#### HS-001 · Eval harness with four arm types
**Evals · P0 · L · Reliability (measures all five) · Depends on: — · Sources: N41, D3, D15**
- **Problem.** Nothing about H-Stack can be claimed without a baseline. Native `claude plugin eval` has only two arms (with and without the plugin). Its graders read the transcript or the files Claude created; none re-runs a command in the workspace after the run.
- **Mechanism.** Script: a runner (`evals/run.mjs`) starts `claude -p --output-format json` in a fresh temp HOME and a git fixture for each run. Four arm types:
  - `bare`: `--bare --tools Bash --system-prompt-file evals/arms/minimal.txt`.
  - `none`: `--bare`, default tools, no plugin.
  - `hstack`: `--bare --plugin-dir plugins/h-stack`.
  - `ablate:<component>`: the `hstack` arm plus `HSTACK_DISABLE=<component>`.

  After each run, the task's `check` script re-runs commands and re-reads files from outside the agent ("verify the world"). It never reads the agent's report. Native `claude plugin eval` is used alongside for activation and trigger cases, where transcript graders are enough. To verify in M1: that `--bare` still loads `--plugin-dir`.
- **Evidence.**
  - Same checkpoint in different scaffolds: DSH Minimal 90.6, DSH Standard 85.8, Claude Code 88.0 on TB2.1 ([deepseek-harness.md §5.1, D3](research/deepseek-harness.md)).
  - "An e2e assertion re-runs the command… a keyword probe on the agent's own output lets a cheating agent pass" (dsh `docs/testing.md`, §6, D15).
  - Two-arm design and grader list: [plugin-evals docs](https://code.claude.com/docs/en/plugin-evals).
- **Context-over-templates.** Fixtures are real repos with different stacks and conventions. Checks run each project's own tests and linters.

#### HS-002 · Real-task suite with paired cases and pass^k
**Evals · P0 · M · Reliability · Depends on: HS-001 · Sources: N123, C27**
- **Problem.** One-sided evals produce one-sided behaviour: a gate that always blocks scores 100% on "should block".
- **Mechanism.**
  - Each task lives in `evals/tasks/<id>/` with a `task.yaml`, a fixture and a `check`.
  - Every gate and every skill ships with matched pairs that differ in one detail: should-trigger vs should-not, and act vs ask vs stop.
  - Gates report pass^3. Outcome tasks report both mean pass and pass^3.
  - The first suite has about 40 tasks: categories 01, 05, 06, 07 and 13, plus judgment pairs, canaries (HS-004) and sameness groups (HS-005).
- **Evidence.**
  - AgentAbstain's paired design: "no constant policy exceeds 50% Paired Accuracy".
  - Anthropic evals post: "One-sided evals create one-sided optimization" ([00c N123](research/00c-beyond-every-stack.md)).
  - Cloudflare Flue: one trigger case and one clean counterexample per rule ([cloudflare ideas C27](research/cloudflare/ideas-for-h-stack.md)).
- **Context-over-templates.** Tasks are spread across several fixture projects, so no single house style can pass them all.

#### HS-003 · Judge hygiene
**Evals · P0 · S · Reliability · Depends on: HS-001 · Sources: N124**
- **Problem.** The default judge is a small Claude model grading Claude's output.
- **Mechanism.**
  - Deterministic graders come first: exit codes, file bytes, `regex`, `tool_used`, `tool_order`.
  - `llm` graders are used only for binary rubric items, with an "Unknown" way out.
  - The judge runs on a stronger or different model (`--judge-model`).
  - Pairwise `baseline` graders are never the main signal.
  - Decisive evidence is placed in the last 12 messages, because the judge sees only the first 12 and the last 12.
  - Each trial is isolated, with no shared git history.
- **Evidence.**
  - Claude Haiku 4.5 and Sonnet 4.5 judges are ×1.71–1.78 more likely to pass their own failed rubric items; pairwise is the worst format (2604.06996).
  - The plugin-eval judge's 12+12 trace window.
  - Anthropic evals post: agents gained "an unfair advantage" from earlier trials' git history ([00c N124](research/00c-beyond-every-stack.md)).
- **Context-over-templates.** n/a.

#### HS-004 · Impossible-task canaries
**Evals · P0 (00c: P1; raised because the North star's test-tampering rate can't be measured without it) · S · Reliability · Depends on: HS-002 · Sources: N125**
- **Problem.** A stack change can make Claude better at "passing" by cheating, and normal evals reward that.
- **Mechanism.** 5–10 tasks whose tests contradict their spec. Passing one counts as a failure. The correct outcome is to stop and explain (HS-028c).
- **Evidence.** ImpossibleBench:
  - Cheating rate equals the pass rate on impossible tasks.
  - Claude cheats >79% of the time by modifying tests.
  - Prompt wording moved GPT-5 from >85% to 1% ([00b findings](research/00b-research-backed-ideas.md)).
- **Context-over-templates.** n/a.

#### HS-005 · Scorecard: five metrics plus a sameness check
**Evals · P0 · M · All five · Depends on: HS-001, HS-002 · Sources: CLAUDE.md "North star" (no idea ID)**
- **Problem.** The North star names five metrics and a sameness check, but no scorer computes them.
- **Mechanism.** A scoring script (`evals/score.mjs`) computes each metric per arm. Definitions are in [ARCHITECTURE §6.6](ARCHITECTURE.md#66-metrics).
  - Reliability: pass rate, false-done rate and tampering rate.
  - Autonomy: tool calls and wall-clock time per scripted intervention.
  - Learning: repeat-task series with `.h-stack/` kept between runs.
  - Judgment: necessary vs unnecessary questions, and seeded wrong premises caught before the first edit.
  - Cost: tokens (including cache reads and writes) and wall-clock per solved task.
  - Sameness: groups of 3 contexts per request; scores conformance to each context and similarity across contexts.
- **Evidence.**
  - [CLAUDE.md North star](CLAUDE.md).
  - Measure rather than ask: METR found developers forecast −24% time, felt −20%, and measured +19% ([00c N121](research/00c-beyond-every-stack.md)).
  - Ask-or-Assume reports both asked-task counts and questions per task ([00b](research/00b-research-backed-ideas.md)).
- **Context-over-templates.** The sameness check *is* this rule, measured.

#### HS-006 · One-component ablation and retirement on each model release
**Evals · P1 · M · Cost · Depends on: HS-001, HS-005 · Sources: N42, N126**
- **Problem.** Scaffolding that helped an older model becomes overhead on a newer one, and cutting many parts at once can't show which part was load-bearing.
- **Mechanism.** Every hook, mod and skill honours `HSTACK_DISABLE`. On each model release, a cloud scheduled task or CI job runs `hstack` against each `ablate:` arm. A component whose Δ ≤ 0 on two consecutive runs is proposed for removal.
- **Evidence.**
  - Harness-design post: "removing one component at a time" worked, the radical simplification failed, and Opus 4.6 made the sprint construct unnecessary ([00c N126](research/00c-beyond-every-stack.md)).
  - dsh switched off its read-before-write guard after a benchmark comparison ([deepseek-harness.md §2.4](research/deepseek-harness.md)).
- **Context-over-templates.** n/a.

#### HS-007 · Effort and model as eval axes
**Evals · P1 · S · Cost · Depends on: HS-001 · Sources: D16**
- **Problem.** Skills set `effort` and `model` by guesswork.
- **Mechanism.** Run the suite at 2–3 `--effort` levels and on 2 models. Each skill's `effort` and `model` frontmatter is then set from the measured pass-rate and token curve.
- **Evidence.** dsh tech report §5.3.2: effort 25 → 100 moved TB2.1 from 82.4 to 90.6, and the 60–80 range recovers most of the accuracy at under half the tokens ([deepseek-harness.md §5.1](research/deepseek-harness.md)).
- **Context-over-templates.** n/a.

#### HS-008 · Skill gym: tuning on held-out data
**Evals · P2 · L · Learning · Depends on: HS-006, HS-058 · Sources: N29, C26**
- **Problem.** Skill text is tuned by opinion.
- **Mechanism.** Offline:
  1. Replay real trajectories, rejected findings and user corrections.
  2. A reflector proposes edits to the skill text.
  3. An edit is kept only if it improves the Pareto front on the eval set *and* on a held-out fixture repo.
  4. The user approves the edit.
- **Evidence.**
  - GEPA: +6% on average and up to +20% over GRPO with up to 35× fewer rollouts; Pareto selection +12.4% vs +6.1% greedy.
  - Cloudflare tests prompt changes "against a held-out repository" ([C26](research/cloudflare/ideas-for-h-stack.md)).
- **Context-over-templates.** Tuning uses trajectories from the user's own projects, and the held-out repo guards against over-fitting.

#### HS-009 · Second-scaffold robustness run
**Evals · P2 · M · Reliability · Depends on: HS-001 · Sources: D22**
- **Problem.** Gains might come from Claude Code specifics rather than from the skill content.
- **Mechanism.** Run a subset of the suite with H-Stack's skills loaded into dsh (`customSkillDirs`, description-only triggers) or into Codex.
- **Evidence.** DeepSeek trains and evaluates across 8 scaffolds (tech report Fig. 8; [deepseek-harness.md D22](research/deepseek-harness.md)).
- **Context-over-templates.** n/a.

### Self-checks/CI

#### HS-010 · Always-on context budget and a Model Experience section
**Self-checks/CI · P0 · S · Cost · Depends on: — · Sources: N6, N116, D1, D11**
- **Problem.** Every always-on line costs attention and money on every turn, and stacks only grow.
- **Mechanism.** CI renders everything H-Stack adds to context from fixtures and fails above the budget ([ARCHITECTURE §7](ARCHITECTURE.md#7-context-budget)). That covers:
  - the skill listing,
  - SessionStart output,
  - the largest per-prompt classifier output,
  - SubagentStart output,
  - the largest per-event note.

  The starting budget is 1,500 tokens always-on. Every SKILL.md and every hook README has a "Model Experience" section giving the exact text the model sees, its token cost and its cache effect; a validator checks it exists and matches the snapshot. Writing rules from D11: delete constraints the model learns from results, and say each fact once.
- **Evidence.**
  - Context files: LLM-written ones cost +20%/+23% with no significant gain (p = 0.87 / 0.37) ([00b](research/00b-research-backed-ideas.md)).
  - SkillsBench: a "comprehensive" SKILL.md gains +0.7 pp vs +19.0 for a compact one (Table 9).
  - The full dsh Standard system prompt is about 1.5k tokens ([deepseek-harness.md §0](research/deepseek-harness.md)).
- **Context-over-templates.** n/a.

#### HS-011 · Cache-safe injection and snapshot tests
**Self-checks/CI · P0 · M · Cost · Depends on: HS-012 · Sources: N8, N115, D2, D7**
- **Problem.** One timestamp or reordered key in injected text breaks the prompt cache for everything after it.
- **Mechanism.**
  - All injected text is appended `additionalContext`, serialised deterministically (sorted keys, no timestamps or random IDs).
  - Injection is digest-gated: a runtime fact is re-injected only when its digest changes, and then says "replaces earlier versions".
  - H-Stack never edits CLAUDE.md, toggles skills or tools, or changes settings mid-session.
  - CI pipes canned payloads into every hook and mod handler twice and diffs the output against `*.expected` snapshots.
- **Evidence.**
  - Manus: KV-cache hit rate is the key production metric; cached input costs $0.30 vs $3/MTok.
  - Prompt-caching docs: cache writes cost 1.25× (5-minute TTL) or 2× (1-hour TTL); reads cost 0.1×.
  - Composio measured dsh at 88.6k tokens per task vs 649.9k for Claude Code on DeepSeek, which it attributes to cache discipline ([deepseek-harness.md §3.6](research/deepseek-harness.md)).
- **Context-over-templates.** n/a.

#### HS-012 · Hook and script contract
**Self-checks/CI · P0 · S · Cost · Depends on: — · Sources: N113, C10, C12, C31, D14**
- **Problem.** Verbose or ambiguous hook output fills context. Crashed guards silently fail open. Vague refusals make the agent loop.
- **Mechanism.** Every H-Stack hook and script follows these rules:
  - **Output size.** At most about 10 stdout lines; full detail goes to a log whose path is printed.
  - **Refusals.** Written as `Blocked by <rule>: <fact>. To proceed: <action>.`
  - **Scripts.** Print one JSON object `{status, reason, …}`.
  - **Failure mode.** A header declares `FAILURE_MODE=closed|open`, `hooks.json` sets `onFailure` to match, and a test asserts that closed hooks deny when they crash.
  - **Large output.** Becomes head + tail + a path to the rest. Native Claude Code already spills hook output over 10,000 characters and large Bash results to a file, so this applies only to H-Stack's own output.
- **Evidence.**
  - C-compiler post: "context window pollution" and the `--fast` sample mode.
  - Writing-tools post: concise responses use about ⅓ the tokens of detailed ones.
  - SWE-agent: a 100-line file window beat 30 lines and whole files ([00c N113](research/00c-beyond-every-stack.md)).
  - Cloudflare MCP: refusals that name the rule, so "a wrong pick can't loop" (C12).
  - Hooks docs: `onFailure` (v2.1.295+) and the 10,000-character cap.
- **Context-over-templates.** n/a.

#### HS-013 · Skill linter
**Self-checks/CI · P1 · S · Cost · Depends on: HS-081 · Sources: C30**
- **Problem.** Skills drift: copied snippets rot, frontmatter rules slip, size grows.
- **Mechanism.** CI checks every skill for:
  - `user-invocable: false`;
  - `description` + `when_to_use` ≤ 1,536 characters, with the use case first;
  - SKILL.md ≤ 500 lines and within its size budget;
  - a valid `metadata.hstack` schema and an existing eval directory;
  - referenced files and commands that exist;
  - no fenced code longer than N lines in `references/`, unless tested or marked illustrative;
  - no all-caps imperatives (A4).
- **Evidence.** Copied snippets in Cloudflare's references drifted into real bugs: a request body read twice, `Access-Control-Allow-Origin: *`, and missing fail-closed handling. Their `check-reference-code-blocks.py` lint exists for this reason ([C30](research/cloudflare/ideas-for-h-stack.md)). Size budgets and drift checks appear in [15 Ideas worth stealing](research/15-skill-authoring.md).
- **Context-over-templates.** The linter rejects copied boilerplate in references.

#### HS-014 · Self-audit and egress audit
**Self-checks/CI · P1 · M · Reliability · Depends on: HS-062, HS-063 · Sources: N55, D20, Cloudflare §E self-audit seed**
- **Problem.** H-Stack's hooks, memory and mods are themselves an attack surface.
- **Mechanism.** Before each public release, run a coverage-ledger audit of H-Stack itself.
  - **Units.** Seeded from Cloudflare's AI/LLM and supply-chain classes: memory poisoning, provenance confusion, approval binding, unbounded loops, subagent and MCP trust inheritance, mutable install inputs, and hooks that run on install.
  - **Findings.** Use the three-verdict schema.
  - **Egress inventory.** Lists every byte that leaves the machine. By default nothing does, apart from the user's own model calls.
- **Evidence.**
  - Cloudflare's §E table ([ideas §E](research/cloudflare/ideas-for-h-stack.md)).
  - dsh's default-on session-log upload, up to 8 MiB per request ([deepseek-harness.md §6](research/deepseek-harness.md)).
  - Snyk found prompt injection in 36% of third-party skills ([research/README.md](research/README.md)).
- **Context-over-templates.** n/a.

### Skill index

#### HS-015 · Skill index in frontmatter and a generated catalogue
**Skill index · P0 · M · Reliability · Depends on: HS-010 · Sources: the 00 §4 rule "each skill declares its own triggers in one place" (no ID)**
- **Problem.** Description matching alone activates the right skill about 20% of the time, and a separate hand-kept rules file drifts.
- **Mechanism.** Each SKILL.md declares its routing data:
  - **Native fields:** `description`, `when_to_use`, `paths`, `model`, `effort`, `context`.
  - **`metadata.hstack`:** intents, keyword patterns, `not_for` siblings, events, sizes, modes, `explicit_only`, cost and eval path.

  CI generates a sorted `index.json` from these fields. The classifier, the event triggers and the budget checker read it. CI fails if the index is stale. Format in [ARCHITECTURE §4](ARCHITECTURE.md#4-skill-index).
- **Evidence.**
  - About 20% activation with descriptions alone ([00 §1](research/00-activation-and-experience.md)).
  - Skills docs: `metadata` is a free-form map "read by your own tooling".
  - The mods `skill.prompt` event exposes `e.frontmatter`.
- **Context-over-templates.** The index holds triggers only. How to decide stays in the skill body.

#### HS-016 · Light-by-default and explicit-only skills
**Skill index · P1 · S · Cost · Depends on: HS-015, HS-018 · Sources: N45, C28, C23, C35**
- **Problem.** Loading a heavy skill shouldn't launch a full audit, and skills that push, merge or loop shouldn't auto-run.
- **Mechanism.**
  - **Two modes.** A heavy skill declares a guidance mode (answer only, no files, no fan-out) and the phrases that unlock full mode.
  - **Profiles.** They change breadth, never the evidence bar.
  - **Explicit-only skills.** A PreToolUse hook on the `Skill` tool allows them only when the classifier recorded an explicit request this turn. They keep `user-invocable: false`. `disable-model-invocation` is not used, because it would make them unreachable without slash commands.
- **Evidence.**
  - Cloudflare security-audit: "Loading it does not authorize the complete audit workflow" (C28); "Profiles change breadth… never the evidence bar" (C23).
  - vinext `fix` is opt-in only (C35).
  - SkillsBench: 2–3 skills +19.0 pp vs ≥4 skills +10.1 pp.
- **Context-over-templates.** Full mode scopes itself to the project's own surfaces.

### Activation

#### HS-017 · SessionStart router and session briefing
**Activation · P1 · M · Autonomy · Depends on: HS-010, HS-011, HS-015, HS-045 · Sources: E7, D17**
- **Problem.** Each session starts without the facts it can't infer: the running dev server, open wishlist items, the last checkpoint.
- **Mechanism.** A SessionStart hook (`startup|resume|clear|compact`) emits two things:
  - **(a) A skill-map pointer.** Byte-stable, kept only if an ablation shows it beats per-prompt classification alone (K4).
  - **(b) Facts that can't be inferred:**
    - branch and uncommitted-file count, and the open PR;
    - listening dev servers (URL and port);
    - open wishlist items;
    - the last checkpoint pointer, and after compaction the failure-log tail.

  It never emits a repo overview.
- **Evidence.**
  - superpowers' SessionStart router ([02 #1](research/02-workflow-orchestration.md)).
  - Repo overviews don't help agents find files (2602.11988 §4.3).
  - dsh postmortem 0003: the agent "validated a replacement server instead of its current GUI" ([deepseek-harness.md D17](research/deepseek-harness.md)).
- **Context-over-templates.** The briefing is facts read from this project's own state.

#### HS-018 · Per-prompt rules classifier: size gate, sticky mode, plain-language overrides
**Activation · P0 · M · Reliability · Depends on: HS-015, HS-045 · Sources: E1, E2, E3**
- **Problem.** The right skill must be in front of Claude without slash commands, and trivial requests must skip process.
- **Mechanism.** A `UserPromptSubmit` command hook (P0; it moves to a mod at P1, see [ARCHITECTURE §5.3](ARCHITECTURE.md#53-ordering-concurrency-and-portability)) works in this order:
  1. Plain-language overrides ("just do it", "go deep", "why that?").
  2. Sticky playbook from `route.json` for "continue", "next" or "fix that".
  3. Size label: `direct`, `light` or `full`.
  4. Index match: at most 2 skills above threshold.

  It adds at most one factual line, for example: "H-Stack: size=light. Relevant skill: h-stack:x because <rule>." Direct prompts get nothing. It never rewrites the prompt.
- **Evidence.**
  - Activation was 20% with a simple hook and 84% with forced evaluation (Scott Spence, via [00 §1](research/00-activation-and-experience.md)).
  - Mechanism C in [00 §2](research/00-activation-and-experience.md).
  - SkillsBench: 1–3 skills is best (Table 8).
  - Harness-design: process inside the model's solo boundary is overhead (A22).
  - Hooks docs: `UserPromptSubmit` times out at 30 s and its context is dropped on timeout.
- **Context-over-templates.** Routing uses the index and the session's state; there is no fixed pipeline per task.

#### HS-019 · Small-model classifier fallback
**Activation · P1 · M · Reliability · Depends on: HS-018, HS-058 · Sources: 00 §2 mechanism E (no ID); open decision OD-1**
- **Problem.** Rules miss fuzzy requests.
- **Mechanism.**
  - **Trigger.** Rules found no match and the size isn't `direct`.
  - **Call.** A mod `prompt.submit` calls `$.model.complete`, with a Haiku-class model and the cached index catalogue as the system prompt.
  - **Output.** `{size, act|ask|stop, skill}`.
  - **Default.** Off until the activation evals show a recall gain worth the cost.
- **Evidence.**
  - Mechanism E in [00 §2](research/00-activation-and-experience.md).
  - Mods API: `$.model.complete`, prompt caching, and the 10 s hook limit (which excludes time spent in API calls).
- **Context-over-templates.** n/a.

#### HS-020 · Act / ask / stop with a separate intent check and a question budget
**Activation · P0 · M · Judgment · Depends on: HS-018, HS-046 · Sources: N1, E4, N32, D12**
- **Problem.** Agents either guess or over-ask, and they ask about things they could look up.
- **Mechanism.** For `full` or ambiguous prompts, a forked read-only skill (`context: fork`) sees only the prompt and the discoverable facts. It returns one of three answers:
  - **act**;
  - **ask**: the 1–3 questions that most change the outcome, each with a recommended answer;
  - **stop**.

  Rules that apply in every case:
  - Facts are looked up, never asked.
  - "Just build it" means proceed and log assumptions (HS-046).
  - Non-blocking questions are batched to the end.
  - A skipped question means continue, not permission.
  - Conversational agreement does not approve a plan.
- **Evidence.**
  - Ask-or-Assume: separating the intent check gave 69.4% vs 61.2% resolved, close to full-information 70.8% ([00b](research/00b-research-backed-ideas.md)).
  - Kimi K2.6 over-asked at 8.71 questions per task.
  - mattpocock grilling (1.5M installs; [03 #1](research/03-ideation-product.md)).
  - dsh's planning and asking wording (D12).
- **Context-over-templates.** Questions come from this repo's real gaps; facts come from the project.

#### HS-021 · Explainable routing
**Activation · P1 · S · Judgment · Depends on: HS-018, HS-058 · Sources: N3**
- **Problem.** Users can't see or correct why a skill was chosen.
- **Mechanism.** "Why that?" returns the rule that matched. A correction is logged as a routing example keyed to its context, and feeds description tuning, gated by the evals.
- **Evidence.** skill-creator's description tuning ([15 #2](research/15-skill-authoring.md)); [00b N3](research/00b-research-backed-ideas.md).
- **Context-over-templates.** Routing examples are stored per project.

#### HS-022 · Event triggers
**Activation · P1 · M · Reliability · Depends on: HS-015, HS-027 · Sources: 00 §4 L3 (no ID)**
- **Problem.** The best moment to suggest a skill is often a tool event, not a prompt.
- **Mechanism.** Hooks map events to skills through the index's `events` field:
  - PostToolUse or PostToolUseFailure on a failing test or build → "Relevant skill: debugging because `<cmd>` exited `<n>`".
  - An edit to a path matching a skill's `paths` → a design-check note.
  - PreToolUse on `git push` or `gh pr create` → a review note.

  At most one note per event type per turn, digest-gated.
- **Evidence.** Mechanism F in [00 §2](research/00-activation-and-experience.md): deterministic and nearly free.
- **Context-over-templates.** Triggers come from each skill's `paths` and the project's own commands.

#### HS-023 · Subagent briefing and delegation standard
**Activation · P1 · M · Reliability · Depends on: HS-011 · Sources: E9, N37, D13, C38**
- **Problem.** Vague delegation duplicates work, and subagents miss the rules.
- **Mechanism.**
  - **Brief template.** Objective, scope, output schema, tools, known facts, done-criteria, the untrusted-content sentence, and a scratch directory.
  - **`SubagentStart` injection.** At most 150 tokens: a principles pointer and the latest implicit decisions.
  - **Coordination rules.** Launch independent subagents together; the integrator reviews the final diff and runs the tests.
  - **Write isolation.** PreToolUse denies writes outside scratch for review and audit subagents.
- **Evidence.**
  - Anthropic's research post: vague delegation duplicated work.
  - pstack: "subagents read the principles first" (00 E9).
  - Cloudflare write isolation (C38).
  - dsh `tool-subagent` rules (D13).
- **Context-over-templates.** Briefs carry this task's facts, not a generic persona.

#### HS-024 · Offers only at workflow boundaries
**Activation · P1 · S · Autonomy · Depends on: HS-018 · Sources: N4**
- **Problem.** Proactive actions built on predicted intent are usually wrong, and suggestions made mid-task get dismissed.
- **Mechanism.** After a commit, a test pass or a PR opening, the mod `turn.complete` shows one line offering a predicted next step. It never acts on it.
- **Evidence.** The best agent predicts developer intent only 35.57% of the time (ProCodeBench). Suggestions at boundaries got 52% engagement, while mid-task suggestions were dismissed 62% of the time (ProAIDE) ([00b N4](research/00b-research-backed-ideas.md)).
- **Context-over-templates.** Offers come from this repo's state.

#### HS-025 · Verification effort set by the measured solo boundary
**Activation · P1 · M · Cost · Depends on: HS-058, HS-061 · Sources: N107**
- **Problem.** Heavy reviewers cost 10–20× and add nothing on tasks the model already does reliably.
- **Mechanism.**
  - **Tracking.** For each project and task class, H-Stack records how often solo work passed review and CI.
  - **Above the threshold.** Only receipts are required.
  - **Below the threshold, or at high risk.** Rubric (HS-060), review lanes (HS-061) and tournaments (HS-072) are used.
  - **Cold start.** Medium.
- **Evidence.** The harness-design post: an evaluator "is worth the cost when the task sits beyond what the current model does reliably solo"; the full harness cost 20× solo ($200 vs $9) ([00c N107](research/00c-beyond-every-stack.md)).
- **Context-over-templates.** Boundaries are measured per project.

#### HS-026 · Fresh-session handoff when context rots
**Activation · P2 · S · Reliability · Depends on: HS-047 · Sources: N11, D19**
- **Problem.** Quality drops as input grows, even far below the window limit.
- **Mechanism.** Between unrelated tasks, suggest `/clear`. For long autonomous runs, offer a fresh session that continues from the structured checkpoint. Same-session `/goal` stays the default.
- **Evidence.** Context Rot: across 18 models, a focused ~300-token input beat the full ~113k-token input. This idea was downgraded in 00c because 1M windows make running out rare ([00c §2](research/00c-beyond-every-stack.md)).
- **Context-over-templates.** n/a.

### Guards

#### HS-027 · Evidence receipts and the Stop verification gate
**Guards · P0 · M · Reliability · Depends on: HS-012, HS-045 · Sources: N100, E6, C13, D6**
- **Problem.** Agents claim "tests pass" without running them, or after editing again. The `/goal` evaluator reads only the transcript.
- **Mechanism.**
  - **Recording receipts.** PostToolUse on Bash appends a receipt `{id, cmd, exit, out_sha, tree, ts}` to the session ledger. PostToolBatch adds a one-line receipt to context, digest-gated. Any later edit marks earlier receipts stale.
  - **Stop dispatcher.** Blocks once if:
    - files changed and the final message claims a passing check without a fresh matching receipt;
    - the final message has neither a receipt nor a "Not verified:" line;
    - native `background_tasks` are still running.
  - **`/goal`.** Conditions that H-Stack writes cite receipt IDs.
- **Evidence.**
  - DGM App. H: Claude "claim[ed] that the Bash tool was used to run tests… but Claude did not invoke any tools".
  - `/goal` docs: the evaluator "does not call tools".
  - Cloudflare: "A successful dry run… does not prove… runtime behavior" (C13).
  - Hooks docs: the 8-continuation cap, `stop_hook_active` and `background_tasks` ([00c N100](research/00c-beyond-every-stack.md)).
  - Closest prior art: superpowers verification-before-completion, 45/45 ([01 #1](research/01-core-rules.md)).
- **Context-over-templates.** Checks are whatever this project runs; nothing is hard-coded.

#### HS-028 · Test-integrity triad: read-only tests, tamper scan, contradiction stop
**Guards · P0 · M · Reliability · Depends on: HS-012, HS-027, HS-029 · Sources: N13, N14, N15**
- **Problem.** Claude's main way of cheating is editing tests. Read-only tests don't stop special-casing, and LLM monitors miss about half of cheating.
- **Mechanism.**
  - **(a) Read-only tests.** During implementation, PreToolUse on Edit, Write or Bash redirects into test files asks the user and shows the diff. Exception: a declared test-writing step.
  - **(b) Tamper scan.** A deterministic scan of the diff at Stop and before commit looks for:
    - weakened or removed assertions;
    - skips;
    - raised timeouts;
    - literals special-cased from test inputs;
    - call-count state;
    - patched clocks;
    - `__eq__` and operator overloads.
  - **(c) Contradiction stop.** `hs stop "<reason>"` is a real way to stop when tests contradict the spec. The Stop gate accepts it as an honest ending.
- **Evidence.** ImpossibleBench ([00b](research/00b-research-backed-ideas.md)):
  - >79% of Claude's cheating is test modification.
  - Read-only tests don't stop special-casing (§5.2).
  - An abort option cut GPT-5's cheating from 54% to 9%.
  - LLM monitors catch only 42–65%.

  gstack's version exists only as a plan document ([00c §4 #2](research/00c-beyond-every-stack.md)).
- **Context-over-templates.** Test globs and the framework are auto-detected from the project and can be overridden in `.h-stack/config.json`.

#### HS-029 · Protected checkers and paths
**Guards · P0 · S · Reliability · Depends on: HS-012 · Sources: N101, C3**
- **Problem.** An optimiser that can edit its checker learns to satisfy the checker.
- **Mechanism.** A PreToolUse hook on Edit, Write and Bash path matches, with `onFailure: block`:
  - **Deny** direct writes to the H-Stack plugin directory and to `.h-stack/` ledgers. The agent writes there only through the `hs` CLI.
  - **Ask** before writes to:
    - `.claude/settings*.json`, `.claude/hooks/**` and `.mcp.json`;
    - CI workflows and CODEOWNERS;
    - test-runner and coverage config;
    - the `scripts` section of a package manifest.

  Skills never quote the checkers' exact rules.
- **Evidence.**
  - DGM App. H: objective hacking happens more when checks aren't hidden, and one agent removed the logging it was judged by.
  - Cloudflare Gardener refuses edits under `.github/workflows/` and similar paths (C3).
  - The C-compiler agent "simply cheats… and calls out to GCC" ([00c N101](research/00c-beyond-every-stack.md)).
- **Context-over-templates.** The protected list extends per project.

#### HS-030 · Irreversible-action gate with a dry-run receipt and approval binding
**Guards · P0 · M · Autonomy · Depends on: HS-012, HS-027 · Sources: E5, N104, C4, C5, D10**
- **Problem.** Agents run the irreversible step first and find out it was wrong afterwards ("act-then-discover"). A general "go ahead" given earlier gets treated as approval for a different command.
- **Mechanism.** A PreToolUse hook on Bash and `mcp__.*` parses commands, unwrapping `bash -c`, `env`, `xargs` and `sudo`. It classifies each by its effects:
  - **Medium** (asks, showing an exact manifest of executable, target and destination):
    - force push, or push to the default branch;
    - merge, release, publish, or deploy to production;
    - delete remote resources;
    - migrate or drop a non-local database;
    - send or post messages.

    It also needs a fresh read-only receipt for the same target this turn (dry-run, plan, diff, or list-before-delete). Approval binds a hash of the exact command; a changed command asks again.
  - **High** (exfiltration of secrets to the network): denied.
  - **Everything reversible:** proceeds.

  The list lives per project in `.h-stack/config.json`, with an opt-in allowlist. Auto mode already blocks destructive git and asks before `rm -rf` on unresolved variables, so H-Stack covers deploy, publish, send and approval binding.
- **Evidence.**
  - AgentAbstain: act-then-discover across seven models; models are "action-type-blind" (63.0% vs 62.0%) ([00c N104](research/00c-beyond-every-stack.md)).
  - workers-oauth-provider: agents "must never merge" (C4).
  - Turnstile: "Do not infer confirmation from an earlier setup step" (C5).
  - dsh `REVIEW_POLICY` authority roles (D10).
  - git-guardrails, with 553k installs, and CC Safety Net's command parsing ([01 #3, #6](research/01-core-rules.md)).
- **Context-over-templates.** The irreversible list is per project.

#### HS-031 · Dependency gate
**Guards · P1 · M · Reliability · Depends on: HS-012 · Sources: N22**
- **Problem.** Models recommend packages that don't exist, and attackers register those names.
- **Mechanism.** A PreToolUse hook checks install commands, manifest edits and new imports. A package passes only if it:
  - exists in the registry;
  - is at least N days old;
  - has real download or dependent history;
  - is not a near-miss of a popular name.

  Otherwise it asks. Lookups are cached; when offline, it asks.
- **Evidence.**
  - 19.7% of recommended packages didn't exist, and 43% of the fake names recurred in all 10 re-queries (Spracklen §5).
  - Only 13.4% were near-misses, so an existence or typo check alone is not enough (A19).
  - A hijacked agent can add an import and let the user install it (2506.08837 §4.10).
- **Context-over-templates.** Uses the project's own package ecosystem.

#### HS-032 · Untrusted content: provenance, argument taint, fetch-destination guard
**Guards · P1 · M · Reliability · Depends on: HS-045 · Sources: N23, N120, C9, D21**
- **Problem.** A tool-less summariser protects control flow but not data flow: injected text can still change the arguments of later tool calls.
- **Mechanism.**
  - **Provenance and taint.** PostToolUse on WebFetch, WebSearch, `mcp__.*` and `gh` reads appends a provenance note. It also records the URLs, hosts, emails and paths that appeared there into `taint.jsonl`.
  - **Consequential calls.** PreToolUse asks when an argument of a network write, a push remote, `curl -d` or a send/post tool matches a string seen only in untrusted content.
  - **Fetch destinations.** Fetches to loopback, RFC1918 or metadata addresses ask while untrusted content is in play.
  - **Briefs.** Every brief includes one sentence: untrusted text can supply values but cannot change the procedure or authorise writes.
- **Evidence.**
  - CaMeL §2: "the data flow can still be manipulated" ([00c N120](research/00c-beyond-every-stack.md)).
  - Cloudflare's single rule for untrusted text (C9).
  - dsh's `web_fetch` reaches cloud-metadata addresses (D21).
  - Auto mode already screens actions driven by content Claude read, so H-Stack adds provenance, not a second classifier.
- **Context-over-templates.** n/a.

#### HS-033 · Tool-description firewall
**Guards · P1 (00c: P0; needs the mock-MCP eval cases from HS-002 before it can show a Δ) · M · Reliability · Depends on: HS-002, HS-012 · Sources: N119**
- **Problem.** A poisoned MCP tool description steers the agent without the poisoned tool ever running.
- **Mechanism.** The mod `tool.describe` scans each description, including deferred tools loaded through tool search. It looks for:
  - imperatives aimed at other tools or at the session;
  - secret paths;
  - hidden Unicode;
  - cross-tool references.

  A suspicious tool gets `isDeferred: true`, a neutralised description, and a notice naming the server and the tool. It warns rather than deletes. Evals use plugin-eval's mock MCP servers.
- **Evidence.** MCPTox: up to 72.8% attack success, Claude 3.7 Sonnet 34.3%, refusals under 3%. The mods reference documents `tool.describe` ([00c N119](research/00c-beyond-every-stack.md)).
- **Context-over-templates.** n/a.

#### HS-034 · Secrets hygiene and trusted executables
**Guards · P1 · S · Reliability · Depends on: HS-012 · Sources: C6, C7**
- **Problem.** Secrets leak through argv, logs and chat, or through project-controlled binaries.
- **Mechanism.**
  - **Credential-bearing commands.** PreToolUse asks when one runs through `npx`, `pnpm exec`, `npm run` or `./node_modules/.bin`.
  - **Env files.** Writes to `.env*` require `git check-ignore` to pass.
  - **Pasted tokens.** `UserPromptSubmit` gives a factual warning.
  - **Never** ask the user to paste a secret (offer `read -rs` instead), and never request session cookies.
- **Evidence.** Turnstile Spin steps 2–3 ([C6, C7](research/cloudflare/ideas-for-h-stack.md)). last30days asks for X session cookies (`AUTH_TOKEN`, `CT0`) ([top10-method.md safety flags](research/top10-method.md)).
- **Context-over-templates.** n/a.

#### HS-035 · Scope lock on the invoked issue or PR
**Guards · P1 · S · Judgment · Depends on: HS-045 · Sources: C8**
- **Problem.** Numbers mentioned in comments get treated as instructions to act on other items.
- **Mechanism.** The target number is recorded. PreToolUse on `gh issue|pr (comment|edit|close|review|merge)` and on `gh api` writes asks if the number differs.
- **Evidence.** workers-sdk `bonk` and vinext `viguy`: "verify the target number matches" ([C8](research/cloudflare/ideas-for-h-stack.md)).
- **Context-over-templates.** n/a.

#### HS-036 · Error-as-success and outcome-unknown detectors
**Guards · P1 · S · Reliability · Depends on: HS-027 · Sources: N53, C11, D5**
- **Problem.** Errors that arrive as normal text, or as "Aborted." with exit 0, get counted as success. Interrupted calls get retried blindly.
- **Mechanism.**
  - **Pattern table.** PostToolUse flags these as failures and marks the receipt failed:
    - exit 0 with "Aborted.";
    - `"success":false`;
    - HTTP 200 with an error body;
    - an empty list after an error.
  - **Interrupted calls.** PostToolUseFailure or an interrupt → "outcome unknown: only read-only or idempotent retries; check state first".
  - **Resume.** SessionStart(`resume`) scans the transcript for unanswered calls.
- **Evidence.**
  - Cloudflare harness: "you end up logging empty runs as successes".
  - `cf-cli`: "a zero exit does not mean the resource was deleted" (C11).
  - dsh: unanswered calls after a step failure (D5).
- **Context-over-templates.** n/a.

#### HS-037 · Repeat-call and failure-signature reminders
**Guards · P1 · S · Autonomy · Depends on: HS-045 · Sources: N38, D4**
- **Problem.** Repeating the same step is the most common multi-agent failure.
- **Mechanism.** PostToolUse hashes the tool name plus its canonical input. At 3, 5 and 8 consecutive identical calls it adds one factual line with the previous result. It never blocks, and it resets on each user message. It also flags results from a subagent that are then ignored.
- **Evidence.** MAST: step repetition is 15.7% of failures, the most common mode. dsh's repeat-tool-reminder uses thresholds `[3, 5, 8]` ([deepseek-harness.md D4](research/deepseek-harness.md)).
- **Context-over-templates.** n/a.

#### HS-038 · Step and spend budget
**Guards · P1 · S · Cost · Depends on: HS-045, HS-058 · Sources: E18, C14**
- **Problem.** Runaway turns burn budget. Agents degrade past their step limit instead of reporting.
- **Mechanism.** The mod `turn.step` tracks tokens and tool calls against a budget set by task size. Past the cap, PreToolUse denies further calls with "Step budget reached; summarise done / remaining / next". Tools stay listed (A20). The user raises the budget in plain language.
- **Evidence.**
  - gstack runaway-stopper (00 E18).
  - vibesdk: "Tools are disabled until next user input" (C14).
  - Anthropic: early systems spawned 50 subagents for simple queries.
- **Context-over-templates.** n/a.

#### HS-039 · Syntax check on every edit
**Guards · P1 · S · Reliability · Depends on: HS-012 · Sources: N114**
- **Problem.** Syntax errors are a large share of failures and cause repeated edits of the same snippet.
- **Mechanism.** PostToolUse on Edit and Write runs the project's fastest parser for that file type and returns only *new* errors, with ±3 lines of context. The timeout is 3 s; on slow projects it falls back to batching at Stop.
- **Evidence.** SWE-agent: 18.0% with a lint guardrail vs 15.0% without. SWE-Bench Pro: syntax errors were 24.2% of Opus 4.1's failures ([00c N114](research/00c-beyond-every-stack.md)).
- **Context-over-templates.** Uses the project's own toolchain.

#### HS-040 · Unresolved-concern check at Stop
**Guards · P1 · S · Reliability · Depends on: HS-027 · Sources: N105**
- **Problem.** The agent spots a problem, then talks itself past it and reports done.
- **Mechanism.** The mod `turn.complete` runs only on turns with edits. A Haiku-class `$.model.complete` call lists the concerns raised in the turn and whether each was resolved or reported. If any is unresolved, one factual note is sent through `$.prompt.submit`, at most once per user prompt.
- **Evidence.**
  - AgentAbstain: "half-acknowledgment".
  - Harness-design: the QA agent would "talk itself into deciding they weren't a big deal".
  - ImpossibleBench Fig. 9: a rationalisation fooled the monitor ([00c N105](research/00c-beyond-every-stack.md)).
- **Context-over-templates.** n/a.

#### HS-041 · Spawn governor and model routing
**Guards · P1 · M · Cost · Depends on: HS-018, HS-058 · Sources: E17, N36, N39, N118**
- **Problem.** Effort-scaling written as prose gets ignored, and every step runs on the strongest model.
- **Mechanism.** The mod `agent.spawn` enforces subagent budgets by size, returning `{deny: reason}` over budget:
  - direct: 0;
  - light: ≤1;
  - full: 2–5 with a lead.

  It also sets the model per role: Haiku-class for search, the strongest model for review and debugging. Routing is per subagent or skill. The per-request switching through `turn.step` proposed in E17 is dropped (K17).
- **Evidence.**
  - Anthropic research post: multi-agent uses ~15× the tokens of chat; an early system spawned 50 subagents; coding has "fewer truly parallelizable tasks".
  - The mods reference: `agent.spawn` can return a model or a deny ([00c N118](research/00c-beyond-every-stack.md)).
- **Context-over-templates.** n/a.

#### HS-042 · Asynchronous overseer
**Guards · P2 · M · Autonomy · Depends on: HS-037, HS-041 · Sources: N129**
- **Problem.** Long unattended runs loop or drift with nobody watching.
- **Mechanism.** During long runs only, a mod timer (`$.clock.every`) summarises recent calls and the subagent tree. It checks for MAST signatures and either notes them through `$.prompt.submit` or stops the run.
- **Evidence.** SICA's overseer checks every 30 s. MAST step repetition: 15.7%.
- **Context-over-templates.** n/a.

#### HS-043 · Sandbox for untrusted code
**Guards · P2 · M · Reliability · Depends on: — · Sources: N54**
- **Problem.** Running code from PRs or downloaded repos with full access.
- **Mechanism.** Such code runs in the native sandbox with:
  - no network;
  - an allowlisted environment;
  - read-only source;
  - resource limits.

  Skills say so.
- **Evidence.** Cloudflare security-audit's execution-safety rules ([09 Cloudflare deep dive](research/09-security.md)).
- **Context-over-templates.** n/a.

#### HS-044 · Declared effects and a plan/apply split for unattended jobs
**Guards · P2 · M · Autonomy · Depends on: HS-030, HS-071 · Sources: C1**
- **Problem.** The prompt of a scheduled job can widen what it does.
- **Mechanism.**
  1. Every scheduled task, workflow or loop H-Stack sets up has a `task.yaml`: trigger, read tools, allowed effects, network and budgets.
  2. A planning run with read tools only emits a JSON plan.
  3. A script validates the plan against the declared effects and applies it.
  4. PreToolUse in the apply session denies anything outside the manifest.
- **Evidence.** Cloudflare Gardener: "Nothing outside the declaration is possible, whatever the instructions say" ([C1](research/cloudflare/ideas-for-h-stack.md)).
- **Context-over-templates.** n/a.

### State & memory

#### HS-045 · `.h-stack/` state folder, session ledger and `hs` CLI
**State & memory · P0 · M · Reliability · Depends on: HS-012 · Sources: none of its own (infrastructure for E6, E8, E16, N2, N9, N100)**
- **Problem.** Receipts, assumptions and handoffs need durable, tamper-resistant, append-only storage.
- **Mechanism.**
  - A `.h-stack/` folder per project, gitignored.
  - JSONL, append-only, one writer per file.
  - The agent writes only through `${CLAUDE_PLUGIN_ROOT}/bin/hs` (`assume`, `decide`, `wish`, `stop`, `failed`, `lesson propose`).
  - Secrets are redacted on write, and a retention sweep removes old data.
  - Layout in [ARCHITECTURE §3](ARCHITECTURE.md#3-state-folder-h-stack).
- **Evidence.**
  - Anthropic long-run harness: JSON was overwritten less than Markdown.
  - Manus: files as restorable memory.
  - 2605.12978: in-place rewriting is the most damaging memory operation.
  - Hooks docs: PostToolUse fires concurrently for parallel calls, so appends must be atomic single lines.
- **Context-over-templates.** n/a.

#### HS-046 · Assumption ledger
**State & memory · P0 · S · Judgment · Depends on: HS-045, HS-027 · Sources: N2**
- **Problem.** When the agent proceeds without asking, its assumptions are invisible and never checked.
- **Mechanism.** `hs assume "<assumption>" --check "<how to verify>"` records each assumption, and the list is shown in the reply. At Stop, each assumption must be verified (with a receipt), refuted, or handed to the user.
- **Evidence.**
  - The "just build it" escape hatch lists assumptions at the top ([03 Ideas](research/03-ideation-product.md)).
  - Ask-or-Assume; AgentAbstain's conflicting-evidence category (28%).
- **Context-over-templates.** Assumptions are about this project.

#### HS-047 · Compaction checkpoint and failure log
**State & memory · P1 · M · Autonomy · Depends on: HS-045, HS-017 · Sources: E8, N9, N10, D8**
- **Problem.** Compaction drops dead ends and user corrections, so the agent retries what already failed.
- **Mechanism.**
  - **PreCompact.** Its stdout (natively used as the compaction instructions) supplies a fixed schema:
    - Intent, quoted verbatim;
    - Files and Code, with exact paths;
    - Errors and Fixes, and Failed approaches;
    - Pending Jobs, Current Work, Next Step;
    - user corrections, copied verbatim.
  - **PostCompact.** Writes a *new* `checkpoints/NNN.md` from `compact_summary`.
  - **SessionStart(`compact`).** Re-injects the failure-log tail.
  - **Failure log.** Appended by PostToolUseFailure and by `hs failed`.
- **Evidence.**
  - dsh compaction schema (D8).
  - Manus: keep errors in context, and use restorable compression.
  - Hooks docs: PreCompact stdout is used as the compaction instructions ([00 E8](research/00-activation-and-experience.md)).
- **Context-over-templates.** n/a.

#### HS-048 · Episodic-first memory with provenance
**State & memory · P1 (00c: P0 for N108; moved so that the learning metric's baseline exists first and memory has to beat it) · M · Learning · Depends on: HS-045, HS-005 · Sources: N25, N108, N112**
- **Problem.** Consolidated lessons degrade over time and get ignored. Memory is a target for prompt injection.
- **Mechanism.**
  - **Episodes.** At Stop (an async hook, because SessionEnd has only 1.5 s) write an episode: task, size, skills, commands and exit codes, diff stat, outcome and evidence.
  - **Provenance.** Each item is tagged `user`, `executed` or `untrusted`.
  - **Retrieval.** A lesson is injected only together with a ≤300-token raw excerpt from its episode.
  - **Untrusted items.** Shown as quotes and never promoted.
- **Evidence.**
  - Raw trajectories score 76.6 vs 43.2 for default consolidation (2605.12978 Table 5).
  - Condensed lessons are often ignored (2601.22436).
  - MCPTox: refusals under 3% ([00c N108, N112](research/00c-beyond-every-stack.md)).
- **Context-over-templates.** Episodes are this project's own history.

#### HS-049 · Delta lessons with counters, a specificity gate and correction capture
**State & memory · P1 (00c: P0 for N110, for the same reason as HS-048) · M · Learning · Depends on: HS-048, HS-062 · Sources: N26, N110, E10**
- **Problem.** Lessons get rewritten wholesale, lose the conditions under which they apply, or become global rules.
- **Mechanism.**
  - **Storage.** `lessons.jsonl` holds append-only events (`add`, `helpful`, `harmful`, `retire`); counters are computed from them.
  - **Specificity gate.** A validator requires a trigger (glob, command or error string), an applicability condition, a counter-condition and an episode link, and rejects generic advice.
  - **Corrections.** "No, don't…" produces a *proposed* lesson keyed to that context, saved only on approval.
  - **Retrieval.** By trigger, at most 2 per prompt.
  - **Pruning.** When harmful counts exceed helpful ones.
- **Evidence.**
  - ACE: +10.6% on AppWorld, and context collapse from 18,282 to 122 tokens when rewritten.
  - 2605.12978: add+delete without in-place edits scored 64.0 vs 43.2.
  - SkillsBench F.3: harmful skills lacked applicability boundaries.
  - CIPHER: context-agnostic preferences did worse than no learning.
- **Context-over-templates.** Every lesson is keyed to a context.

#### HS-050 · Shadow log for native auto memory
**State & memory · P1 · S · Learning · Depends on: HS-045 · Sources: N109**
- **Problem.** Native auto memory merges entries near its limit, an in-place rewrite.
- **Mechanism.** PostToolUse on writes under `~/.claude/projects/*/memory/` appends a before/after diff to a shadow log. A merge that drops concrete specifics is flagged, with an offer to restore it.
- **Evidence.**
  - Memory docs: "merge or drop stale entries" near the 200-line / 25 KB limit.
  - 2605.12978 Table 5: forbidding in-place rewriting raised the score from 43.2 to 50.0.
- **Context-over-templates.** n/a.

#### HS-051 · Context-keyed learning from user edits
**State & memory · P2 · M · Learning · Depends on: HS-048, HS-049 · Sources: N27**
- **Problem.** Users repeat the same corrections.
- **Mechanism.**
  1. Compare Claude's change with what the user committed afterwards.
  2. Infer a readable preference tagged with its context (path glob, file type, task class).
  3. Retrieve it for similar contexts.
  4. Propose it as a rule only if it holds across contexts.
- **Evidence.** CIPHER: edit distance −31% (summaries) and −73% (emails); context-agnostic preferences did worse than no learning ([00c §2](research/00c-beyond-every-stack.md)).
- **Context-over-templates.** Context-keying is the mechanism.

#### HS-052 · Decision log and implicit-decision ledger
**State & memory · P1 · S · Judgment · Depends on: HS-045 · Sources: E16, N127**
- **Problem.** Long and parallel runs make implicit choices that no one can audit, and that collide at merge.
- **Mechanism.** `hs decide "<what>" --why --scope --evidence measured|inferred|guessed` appends to `decisions.jsonl`. Any choice the spec didn't dictate is logged. SubagentStart injects recent entries, and conflicts are flagged before merge.
- **Evidence.**
  - Cognition: "Actions carry implicit decisions, and conflicting decisions carry bad results."
  - pstack show-me-your-work ([14 Ideas](research/14-autonomous-multiagent.md)).
  - C-compiler agents claim tasks with lock files.
- **Context-over-templates.** Decisions are the project's own.

#### HS-053 · Wishlist: park and resume
**State & memory · P1 · S · Autonomy · Depends on: HS-045, HS-017 · Sources: N50, C25**
- **Problem.** Blocked on something only the user can provide, the agent either guesses or gives up.
- **Mechanism.** `hs wish "<need>" --why --resume "<task>"` parks the task and the agent continues with other work. SessionStart lists open items, and resolving one re-queues the parked task.
- **Evidence.** Cloudflare's wishlist had 25,472 writes and is "the main way the agents talk back to us" ([09 deep dive](research/09-security.md)).
- **Context-over-templates.** n/a.

#### HS-054 · Project language: glossary and decision records on demand
**State & memory · P2 · S · Judgment · Depends on: HS-015 · Sources: E11**
- **Problem.** Terms and past decisions get re-derived, or misread, in every session.
- **Mechanism.** A glossary and ADRs as files in the project's docs, loaded on demand by `paths` or retrieval and never always-on. They cover only terms that aren't obvious.
- **Evidence.** mattpocock domain-modeling ([11 #1](research/11-memory-context.md)). Overviews add cost with no gain (A3).
- **Context-over-templates.** Entirely project-sourced.

#### HS-055 · Recitation hook and few-shot rut breaker
**State & memory · P2 · S · Autonomy · Depends on: HS-011, HS-006 · Sources: N7, N117**
- **Problem.** On long runs the goal drifts out of the high-attention zone, and batch work imitates itself.
- **Mechanism.** On long runs only, PostToolBatch appends the goal and current step when their digest changes. On repetitive batches it restates the current item's goal with varied wording. Ships only if an ablation shows a gain (K16).
- **Evidence.** Manus: recite the plan at the end of context, and "Don't get few-shotted" ([00b](research/00b-research-backed-ideas.md)).
- **Context-over-templates.** n/a.

### Visibility

#### HS-056 · Spinner status and a one-line announcement
**Visibility · P1 · S · Judgment · Depends on: HS-018 · Sources: E12, E14**
- **Problem.** Users can't see what H-Stack picked, so wrong picks go uncorrected.
- **Mechanism.** The mod's Spinner render site shows `H-Stack · <size> · <skill> · step n/m`, plus one announcement line when a skill starts. Neither adds context tokens.
- **Evidence.** The Spinner render site exists in Terminal, Desktop and VS Code; mods don't draw in `-p` (mods reference). See [00 E12, E14](research/00-activation-and-experience.md).
- **Context-over-templates.** n/a.

#### HS-057 · Side pane
**Visibility · P2 · M · Judgment · Depends on: HS-056 · Sources: E13**
- **Problem.** Long runs are opaque.
- **Mechanism.** A mod Pane gives a read-only view of `.h-stack/`: the playbook checklist, skills used, receipts, assumptions and decisions. Open decision OD-2.
- **Evidence.** [00 E13](research/00-activation-and-experience.md); mods Pane render site.
- **Context-over-templates.** n/a.

### Telemetry

#### HS-058 · Local activation and tool-use telemetry
**Telemetry · P1 · M · Learning · Depends on: HS-045, HS-018 · Sources: E19, N43, N52**
- **Problem.** Descriptions and tools are tuned blind.
- **Mechanism.** Local JSONL records:
  - the classifier's pick, and whether the skill was invoked;
  - any user correction in the next prompt;
  - calls per tool, so tools are added only when usage shows a need;
  - per-turn usage, from `turn.complete`.

  Nothing leaves the machine. Retention is 90 days. `/skill-doctor` already covers per-skill context cost.
- **Evidence.**
  - Cloudflare's agents never called Semgrep in a month (N52).
  - `/skill-doctor` (whats-new).
  - Default-on telemetry was flagged in caveman, claude-mem and OpenSpec ([top10-method.md](research/top10-method.md)).
- **Context-over-templates.** n/a.

#### HS-059 · Measured retro and postmortems
**Telemetry · P2 · M · Learning · Depends on: HS-058, HS-048 · Sources: E20, N121, D18**
- **Problem.** Developers' sense of speed-up is wrong, and failures aren't learned from.
- **Mechanism.** A local report per session or week gives measured signals only:
  - time from request to accepted change;
  - the share spent waiting or reviewing;
  - rework (user edits within N minutes);
  - reverts.

  It proposes at most one improvement, gated by HS-006. A visible failure gets a postmortem with transcript sequence points.
- **Evidence.** METR: forecast −24%, felt −20%, measured +19% ([00c N121](research/00c-beyond-every-stack.md)). dsh postmortems (D18).
- **Context-over-templates.** n/a.

### Skills (category NN)

#### HS-060 · Rubric before code: spec, contract and interfaces
**Skills (04) · P1 (00c: P0; under "evals before skills" a skill follows the harness; a candidate for the first category built) · L · Reliability · Depends on: HS-002, HS-027, HS-061, HS-025 · Sources: N102, N130, N132**
- **Problem.** "Done" is decided after the fact by the agent that did the work. Tests miss root causes and scope creep.
- **Mechanism.** For `full` tasks below the solo boundary:
  1. A product-level spec: deliverables, behaviour, and an Interfaces section (signatures, endpoints, data shapes).
  2. A read-only rubric subagent (`context: fork`) explores the repo and writes `rubric.yaml`. Items are binary, weighted must / important / nice, across four axes: scope, spec alignment, integrity and runtime behaviour.
  3. The user sees one screen and can strike items.
  4. A blind reviewer grades the final diff, and must-have items feed the Stop gate.
- **Evidence.**
  - Agentic Rubrics: +3.5 to +4.6 pp Best@16; 54% of rubric-only failures were real; rubrics got worse without repo exploration.
  - SWE-Bench Pro: performance degraded without interface augmentations.
  - Harness-design: the sprint contract and a product-level planner ([00c N102, N130, N132](research/00c-beyond-every-stack.md)).
  - Prior art: superpowers writing-plans, Spec Kit ([04](research/04-specs-planning.md)).
- **Context-over-templates.** The rubric comes from exploring this repo; there's no fixed checklist.

#### HS-061 · Blind review lanes with a rule-bound judge
**Skills (07) · P1 · M · Reliability · Depends on: HS-062, HS-063 · Sources: N19, C18, C19**
- **Problem.** Claude is a lenient reviewer of its own family's work, and "nothing found" can't be told apart from "not checked".
- **Mechanism.**
  - **Reviewer input.** Reviewer subagents get only the command that produces the diff and the spec or rubric. They never see the author's reasoning.
  - **Lanes.** One axis each (correctness, security, tests), with capped findings and a `Cleared:` list of areas checked and found clean.
  - **Judge.** A different model family when one is configured (OD-7); otherwise a fresh Claude plus deterministic validators. It re-checks findings against the same rules and drops uncertain ones.
  - **Not the final gate.** Review is never the only final gate (A8).
- **Evidence.**
  - Claude judges are ×1.7–1.8 more likely to pass their own failed items, and pairwise judging is the worst format (2604.06996).
  - workerd: `Cleared:` separates "no bugs there" from "did not get to it" (C18).
  - Flue judge: "When uncertain, drop" (C19).
  - The official code-review plugin re-validates each issue ([07 #1](research/07-code-review.md)).
- **Context-over-templates.** Rules come from the repo's REVIEW.md, CLAUDE.md and lint config.

#### HS-062 · Findings schema, three verdicts and a deterministic validator
**Skills (07, 09) · P1 · M · Reliability · Depends on: HS-012 · Sources: N46, N47, C15, C16, C17, C2**
- **Problem.** The model grades its own output format, and invalid output gets "fixed up" into findings.
- **Mechanism.**
  - **Schema.** One JSON schema with three verdicts, `confirmed`, `needs_validation` and `rejected`, each with its own field vocabulary.
  - **Validator.** A zero-dependency Node script with hostile-input tests, plus truth checks: cited files and lines exist, the quoted snippet is at that line, the patch applies, the test parses.
  - **Enforcement.** SubagentStop runs the validator. Malformed output is discarded and re-run fresh, never repaired.
  - **Side effects.** Done by scripts; agents only decide.
- **Evidence.**
  - Cloudflare `report-schema.json` and its validators (65 tests). The published validator checks format only; the production harness adds the existence and parse checks (C16).
  - "Trusted code drives; agents only decide" (C2).
  - Better recon cut validation rejections from 40% to 11% ([09 deep dive](research/09-security.md)).
- **Context-over-templates.** n/a.

#### HS-063 · Coverage ledger, shallow-result detector, and verification budget reserved first
**Skills (09, 07) · P1 · M · Reliability · Depends on: HS-062 · Sources: N48, C21, N51, C20, N49, C22**
- **Problem.** "All clear" hides what wasn't checked, and exploration spends the budget that verification needed.
- **Mechanism.**
  - **Ledger.** Units are area × concern, with named states and a "Not reviewed" list.
  - **Shallow detector.** Empty findings with a full `Cleared:` list are accepted. Empty findings with thin coverage → re-run from a different angle (K12).
  - **Budget.** About 30% is reserved for verification before exploring. Unvalidated items are never reported.
- **Evidence.** Cloudflare:
  - a single run found about half of what repeated runs found;
  - hunters with zero findings were flagged "shallow";
  - "A review that manufactures four LOW findings… is a reviewer justifying their existence" ([C20–C22](research/cloudflare/ideas-for-h-stack.md)).
- **Context-over-templates.** Units come from the target's own architecture.

#### HS-064 · Reviewer calibration from user overrides
**Skills (07) · P2 · S · Judgment · Depends on: HS-061, HS-058 · Sources: N106**
- **Problem.** Reviewer leniency drifts.
- **Mechanism.** Each time the user overrides a review verdict, the case is logged per project. These become versioned few-shot calibration examples, gated by the evals.
- **Evidence.** Harness-design: making a standalone evaluator sceptical is "far more tractable", and few-shot examples with score breakdowns "reduced score drift".
- **Context-over-templates.** Calibration is per project.

#### HS-065 · Review guide with every change
**Skills (13) · P1 · S · Reliability · Depends on: HS-027 · Sources: N31**
- **Problem.** Reviewers' minutes are the scarce resource, and only 48% of developers always check AI code.
- **Mechanism.** The final reply or PR body gives:
  - what changed;
  - the risk per hunk;
  - where to look first;
  - what was verified (receipt IDs);
  - a "Not verified" section.
- **Evidence.** Sonar State of Code 2026 ([00b](research/00b-research-backed-ideas.md)); mattpocock `pr` ([13 #3](research/13-git-ship.md)).
- **Context-over-templates.** Derived from the diff and the receipts.

#### HS-066 · Counterfactual fix proof
**Skills (06) · P1 · S · Reliability · Depends on: HS-027 · Sources: N17, C24**
- **Problem.** New tests often pass whether or not the fix is applied.
- **Mechanism.** A `verify-fix` script:
  1. Stash the fix; the new test must fail.
  2. Restore the fix; the test must pass.

  It records receipts. The debugging and TDD skills call it.
- **Evidence.** Cloudflare's Fixer "requires a clean fail→pass flip". viguy: "tests that pass regardless of whether the fix is applied" ([C24](research/cloudflare/ideas-for-h-stack.md)).
- **Context-over-templates.** Uses the project's own test runner.

#### HS-067 · Harvest reproduction scripts into the test suite
**Skills (06) · P1 · S · Reliability · Depends on: HS-066 · Sources: N103**
- **Problem.** The best evidence of a bug, the throwaway repro script, gets deleted.
- **Mechanism.** Scripts that fail on the base commit and pass with the fix are offered as regression tests, deduplicated by their normalised form.
- **Evidence.** Agentless §3.3; EGSS test consolidation +5–10% ([00c N103](research/00c-beyond-every-stack.md)).
- **Context-over-templates.** Tests follow the project's conventions.

#### HS-068 · Diff-targeted mutation check
**Skills (08) · P2 · M · Reliability · Depends on: HS-066 · Sources: N18**
- **Problem.** Coverage says nothing about whether new tests have teeth.
- **Mechanism.** Mutate only the changed lines, a few ways each. New tests must catch the mutants; otherwise they are flagged as weak.
- **Evidence.**
  - ACH: 49% of useful tests would have been discarded by a line-coverage criterion (A12).
  - The "test the tests" idea from Trail of Bits ([08](research/08-testing-qa.md)) is CC BY-SA, so idea only, no text.
- **Context-over-templates.** Uses the project's language and test runner.

#### HS-069 · Signal rules: retry on a new signal, escalate on disagreement
**Skills (01) · P1 · S · Reliability · Depends on: HS-027, HS-037 · Sources: N16, N21**
- **Problem.** "Reflect and retry" without new evidence lowers accuracy, and self-reported confidence is weak.
- **Mechanism.** A core rule, backed by HS-037:
  - every retry cites a new external signal (test output, error, measurement or user input);
  - verification escalates when independent checks disagree.
- **Evidence.**
  - Huang et al.: on GSM8K, GPT-4 fell from 95.5 to 89.0.
  - 2608.14659: uncertainty-triggered regeneration −3 to −10 pp; verification-based +6 to +26.
  - Retry feedback raised cheating from 33% to 38% (ImpossibleBench) ([00b](research/00b-research-backed-ideas.md)).
- **Context-over-templates.** n/a.

#### HS-070 · Premise check and evidence-first disagreement
**Skills (01) · P1 · S · Judgment · Depends on: HS-018 · Sources: N5, N122**
- **Problem.** Models affirm users' stated causes, and prompting alone mitigates this poorly.
- **Mechanism.** A user-asserted cause is treated as a hypothesis and checked with the cheapest evidence step. The reply follows a fixed order: evidence → conclusion → the cheapest settling check → the user decides. Measured with seeded-wrong-premise tasks.
- **Evidence.** ELEPHANT §4.3: prompt-level mitigations have limited effect. *Science* 2026: models affirm users ~49% more than humans do ([00c N122](research/00c-beyond-every-stack.md)).
- **Context-over-templates.** Evidence comes from this project.

#### HS-071 · Long-run protocol on native `/goal`
**Skills (14) · P1 · M · Autonomy · Depends on: HS-027, HS-047, HS-053 · Sources: N35, N131, D9**
- **Problem.** Long runs mark items done without end-to-end checks, and `/goal` conditions written as wishes are "met" by a confident summary.
- **Mechanism.**
  - **Initializer.** Writes a feature list as JSON (all `passes: false`), a progress file and an init script.
  - **Each iteration.** Smoke-test, do one item, verify end to end, update both files.
  - **Goal conditions.** One measurable end state, the exact check, a receipt ID, constraints and a turn bound.
  - **Continuation wording.** The workspace is authoritative over earlier narration. "Blocked" is allowed only after the same condition persists for 3 rounds. Only a human sets the goal.
- **Evidence.**
  - Anthropic long-running harness.
  - `/goal` docs: the evaluator judges from the transcript only.
  - dsh's goal-round driver (D9) ([00c N131](research/00c-beyond-every-stack.md)).
- **Context-over-templates.** The feature list is derived from the project's spec.

#### HS-072 · Risk-gated tournament
**Skills (05) · P2 · M · Reliability · Depends on: HS-060, HS-061, HS-025 · Sources: N20**
- **Problem.** A single attempt at a high-risk change.
- **Mechanism.** Only below the solo boundary and at high risk: 2–4 approaches in worktrees, and rubric scoring (not debate) picks the winner. It branches only where two cheap plans disagree.
- **Evidence.**
  - EGSS: +5–10% with 28% fewer tokens.
  - pstack `arena`.
  - Huang et al.: debate scored 83.0 vs 88.2 for majority vote (A7).
- **Context-over-templates.** Candidates are scored against this repo's rubric.

#### HS-073 · Change-size governor
**Skills (13) · P2 · S · Reliability · Depends on: HS-065 · Sources: N33**
- **Problem.** Diffs too large to review.
- **Mechanism.** A threshold taken from the project's history of merged PR sizes. Larger work is split into stacked steps.
- **Evidence.** addyosmani sizes reviews at about 100 lines ([07 #8](research/07-code-review.md)). Sonar: only 48% of developers always check AI code.
- **Context-over-templates.** The threshold comes from the project's own PR history.

#### HS-074 · Code mode for bulk tool work
**Skills (14) · P2 · S · Cost · Depends on: — · Sources: N40, C33**
- **Problem.** Looping through tool calls one at a time floods context.
- **Mechanism.** Write a script that makes the calls. Credentials stay with a wrapper and are never echoed.
- **Evidence.** Anthropic: 150,000 → 2,000 tokens (98.7%). Cloudflare Code Mode: 1.17M → ~1,000 tokens ([C33](research/cloudflare/ideas-for-h-stack.md)).
- **Context-over-templates.** n/a.

#### HS-075 · Hybrid code navigation
**Skills (11) · P2 · M · Cost · Depends on: HS-058 · Sources: N12**
- **Problem.** Structural questions ("who calls this?") cost many reads.
- **Mechanism.** A code graph answers structural questions only; grep and read handle everything else. Added only if telemetry shows structural queries are common (N52).
- **Evidence.** Codebase-Memory: 10× fewer tokens but lower overall quality, 0.83 vs 0.92 ([00b](research/00b-research-backed-ideas.md)).
- **Context-over-templates.** n/a.

#### HS-076 · Sleep-time prep through scheduled tasks
**Skills (14) · P2 · M · Cost · Depends on: HS-071 · Sources: N30**
- **Problem.** Shared prep work is redone in every session.
- **Mechanism.** A nightly cloud scheduled task refreshes repo-derived caches: glossary candidates, flaky-test triage and a dependency audit. It runs only where many later queries share the context. Results are offered, never acted on.
- **Evidence.** Sleep-time compute: ~5× less test-time compute at equal accuracy, and 2.5× cheaper only with 10 queries per context. On an agentic SWE task it was worse than plain test-time compute at high budgets ([00c §2](research/00c-beyond-every-stack.md)).
- **Context-over-templates.** Caches are built from this repo.

#### HS-077 · CI watcher for the open PR
**Skills (13) · P2 · M · Autonomy · Depends on: HS-044, HS-024 · Sources: E15**
- **Problem.** CI failures wait for a human to notice.
- **Mechanism.** A mod timer (`$.clock.every`) polls CI. A failure produces a notice and an offer. An automatic fix turn runs only with a per-PR opt-in (K8), and the watcher never merges.
- **Evidence.** [00 E15](research/00-activation-and-experience.md); Sentry `iterate-pr` ([13 Ideas](research/13-git-ship.md)).
- **Context-over-templates.** n/a.

#### HS-078 · Known-good oracle bisection for large parallel failures
**Skills (14) · P2 · S · Autonomy · Depends on: — · Sources: N128**
- **Problem.** Parallel agents all fix the same giant failure and overwrite each other.
- **Mechanism.** First build a bisection harness against a known-good reference, so each agent gets a different failing subset. Agents claim work with lock files.
- **Evidence.** C-compiler post: 16 agents were stuck on the Linux kernel until GCC was used as an oracle ([00c N128](research/00c-beyond-every-stack.md)).
- **Context-over-templates.** The oracle is chosen per project.

#### HS-079 · Accounting gate for migrations and large refactors
**Skills (05) · P2 · S · Reliability · Depends on: — · Sources: C37**
- **Problem.** Items silently disappear in migrations.
- **Mechanism.** Every source item maps to a target or to a "not migrated: reason, impact" row. Counts are compared after each stage, and the process stops on a mismatch.
- **Evidence.** cloudflare-one-migrations: "Stop on mismatches" ([C37](research/cloudflare/ideas-for-h-stack.md)).
- **Context-over-templates.** n/a.

#### HS-080 · Learn code, not prose
**Skills (15) · P1 · M · Learning · Depends on: HS-048, HS-002 · Sources: N111**
- **Problem.** Model-written prose skills hurt, yet repeated procedures are worth capturing.
- **Mechanism.** After a procedure succeeds 2+ times (from episodes), propose a script with calibrated defaults plus a test that was run. It ships only after its eval passes and the user approves.
- **Evidence.**
  - SkillsBench F.4: shipping executable scripts was the top authoring pattern; self-generated prose skills scored −8.1 to −11.5 pp.
  - Dynamic Cheatsheet: 10% → 99%.
  - SkillWeaver: +31.8%.
  - gstack `skillify` does this, but for scrapes only ([00c N111](research/00c-beyond-every-stack.md)).
- **Context-over-templates.** Scripts encode this project's procedures.

### Docs

#### HS-081 · Skill authoring standard
**Docs · P0 · S · Reliability · Depends on: — · Sources: C29, N56, C32, N44, N28**
- **Problem.** Generic, comprehensive or model-written skills lower pass rates.
- **Mechanism.** One short standard, checked by HS-013:
  - **Shape.** Gate → Contract → Retrieve → Before you finish.
  - **Negative routing.** `when_to_use` names the sibling skills it is *not* for.
  - **Sources.** Route to upstream docs instead of copying; keep one source of truth in `references/`.
  - **Content.** Encode project and domain procedure, not generic advice. Teach how to decide, with the project's context as input.
  - **Process.** A model-drafted skill ships only after it passes its eval and the user approves.
- **Evidence.**
  - SkillsBench v4: self-generated −8.1 to −11.5 pp; software engineering gains +11.6 pp, second-lowest of 8 domains.
  - cloudflare `sandbox-next`: "a gate, a contract, and a retrieval map" (C29).
  - cloudflare/skills CONTRIBUTING: help agents find docs rather than keep another copy (N56, C30, C32).
  - See [15](research/15-skill-authoring.md).
- **Context-over-templates.** The standard bans baked-in palettes, layouts and boilerplate, and requires every skill to read the project first.

#### HS-082 · Native-first map
**Docs · P0 · S · Cost · Depends on: — · Sources: N34**
- **Problem.** Older stacks reinvent loops, schedulers and guards that Claude Code now ships.
- **Mechanism.** [ARCHITECTURE §2.3](ARCHITECTURE.md#23-native-first-map) lists what Claude Code already does and what H-Stack adds. Any item that duplicates a native feature is cut.
- **Evidence.** The 00b Claude Code features row; dsh's "Not worth copying" list ([deepseek-harness.md §8](research/deepseek-harness.md)).
- **Context-over-templates.** n/a.

### Distribution

#### HS-083 · Supply chain: pin, digest and scan
**Distribution · P1 · M · Reliability · Depends on: HS-012, HS-014 · Sources: N24, C34**
- **Problem.** Skills, hooks and MCP configs are a supply-chain attack surface, and some stacks fetch their instructions at run time.
- **Mechanism.**
  - **Lock file.** `skills.lock.json` with the commit and per-file SHA-256 of the H-Stack plugin, verified at SessionStart.
  - **Installs.** PreToolUse asks on `npx skills add`, `claude plugin install` and `@latest` MCP installs.
  - **Third-party scan.** Skills, hooks and MCP configs are scanned before they are enabled.
  - **No remote instructions.** H-Stack never loads instructions from a URL at run time.
- **Evidence.**
  - Snyk: injection in 36% of tested skills.
  - MCPTox.
  - The MCP Skills manifest carries a `sha256` per file (C34).
  - Remote-loaded instructions in vercel `web-design-guidelines` and Orca ([top10-method.md flags](research/top10-method.md)).
- **Context-over-templates.** n/a.

#### HS-084 · Skill feedback drafts with exact-text approval
**Distribution · P2 · S · Learning · Depends on: HS-058 · Sources: C36**
- **Problem.** Skill failures that users notice never reach the H-Stack repo.
- **Mechanism.** When the user says a skill was wrong, H-Stack drafts an issue (file, section, expected, actual) with a privacy blocklist applied. It posts only after the user approves the exact text.
- **Evidence.** cloudflare skill-feedback: "never post an issue until the user has seen the exact title and body and approved it" ([C36](research/cloudflare/ideas-for-h-stack.md)).
- **Context-over-templates.** n/a.

#### HS-085 · Release gate
**Distribution · P1 · S · Reliability · Depends on: HS-001, HS-005, HS-010, HS-011, HS-013 · Sources: none of its own (CLAUDE.md "Validate" and "Report honestly")**
- **Problem.** A release ships without numbers, or hides its regressions.
- **Mechanism.** The version is bumped only when these pass:
  - `claude plugin validate .`;
  - the budget check;
  - the snapshot tests;
  - the linter;
  - a scorecard for the release, regressions included, committed to `evals/results/`.

  The README quotes the numbers.
- **Evidence.** [CLAUDE.md](CLAUDE.md).
- **Context-over-templates.** n/a.

---

## Anti-idea and licence check

Every item was checked against A1–A22 and the safety and licence flags in [top10-method.md](research/top10-method.md#safety-and-data-quality-flags).

**No source idea was dropped whole.** These were adjusted:

| Source | Problem found | Change |
|---|---|---|
| E10, the "lessons loop" in 01 | A1, A2, A21: auto-saved global rules | HS-049: proposed, context-keyed, linked to an episode, saved only on approval |
| E15 | A17: a proactive fix turn mid-task | HS-077: notice + offer; auto-fix needs a per-PR opt-in |
| E17 | Per-request model switch via `turn.step` breaks the prompt cache (A20, Manus) | **The per-request part is dropped.** HS-041 routes per subagent or skill only |
| E20 | A16, A1: a qualitative retro that auto-edits rules | HS-059: measured signals only; one proposal, gated by evals |
| E7 | A3: repo overview in context | HS-017: only facts that can't be inferred |
| E9 | A11 and the budget: rules injected into every subagent | HS-023: ≤150 tokens, counted in HS-010 |
| E11 | A3: always-on glossary | HS-054: on demand only |
| C4 | Autonomy: "never, even when asked" | HS-030: ask with approval binding; opt-in allowlist |
| C14 | A20: disabling tools mid-session | HS-038: PreToolUse deny; tools stay listed |
| D6 | Native duplicate | HS-027 reads the native Stop `background_tasks` |
| D8 | A2: merge-and-drop in place | HS-047: a new checkpoint file each time, the old one kept |
| D14 | Native duplicate (hook output over 10,000 characters and large Bash results already spill to a file) | HS-012: applies to H-Stack's own output only |
| N7, N117 | Cost and cache (K16) | HS-055: P2, digest-gated, ablation required |
| N19 | A8: same-model review as the final gate | HS-061: never the only final gate |
| N20 | A7: debate | HS-072: rubric scoring and voting, never debate |
| N26 | A2: counters edited in place | HS-049: appended vote events |
| N51 | A14 | HS-063: the `Cleared:`-based rule (K12) |
| N3, N29, N106, N111 | A1: self-generated changes | All gated by evals and user approval |
| N12 | Graph tools add MCP tool definitions; graphs lower overall quality | HS-075: only after telemetry shows a need |
| N30 | A17 | HS-076: results are offered, never acted on |

Mechanisms from the research that are **not adopted** (they have no idea ID):
- **Forced-evaluation activation** (mechanism D in 00 §2). Fails A4 and the budget (K3).
- **"Inject the top 3 matches"** (mechanism C). Capped at 2 per SkillsBench Table 8 (A11).

**Licence and safety flags**, and how each is handled:

| Flag | Where it touches the backlog | Handling |
|---|---|---|
| Trail of Bits skills: CC BY-SA 4.0 | Mutation and property testing ideas (HS-068) | Idea only; no text, structure or examples copied |
| context-mode: ELv2 | "Keep raw output out of context" (HS-012) | Idea only. Native spill already covers it |
| cloudflare-docs: CC BY 4.0. security-audit-skill and cloudflare/skills: MIT and Apache-2.0 | C1–C38 | Own text only. Short quotes stay in `research/` with attribution |
| deepseek-harness: MIT | D1–D22 | Quotes stay in `research/`, attributed. No dsh text in skills |
| Remote-loaded instructions (vercel guidelines, Orca) | HS-083 | H-Stack never fetches instructions at run time and asks before such installs |
| Default-on telemetry (caveman CLI, claude-mem, OpenSpec, the dsh session log) | HS-058, HS-014 | Telemetry is local only. The egress audit defaults to nothing leaving the machine |
| Session-cookie requests (last30days) | HS-034 | H-Stack never asks for cookies or for pasted secrets |
| Licence rider against Anthropic and OpenAI (mcp_agent_mail) | none | Not used |
| Inflated install counts (designed-by-ai, flowkit-labs, `*/superpowers` name-alikes) | none | Not cited as evidence anywhere |
| CC Safety Net README tracking pixel | HS-030 borrows its command-parsing *idea* (MIT) | Fine; the pixel is in the README only |

---

## Will not do

These are the anti-ideas from [00c §5](research/00c-beyond-every-stack.md). Each is a popular practice the evidence says to avoid.

| # | Practice | Why not (evidence) | Where H-Stack enforces the opposite |
|---|---|---|---|
| A1 | Auto-generating skills or rules from sessions and promoting them without an eval | SkillsBench v4 Table 6: self-generated skills −8.1 to −11.5 pp vs no skills | HS-081, HS-080, HS-049 |
| A2 | Consolidating memory after every session, or rewriting lessons in place | 2605.12978: utility rises, then falls. In-place rewriting is the most damaging step (Table 5) | HS-048, HS-049, HS-047, HS-050 |
| A3 | Keeping an `/init`-generated CLAUDE.md with repo overviews | 2602.11988: no significant gain, +20–23% cost | HS-010, HS-017 |
| A4 | ALL CAPS, "IMPORTANT" or "YOU MUST" in instructions | Best practices: emphasis makes Claude over-apply the rule. Rules that can't bend belong in hooks | HS-013 lint; CLAUDE.md hook-text rule |
| A5 | "Keep going / don't be lazy / loop until done" prompts | Causes over-work. Retry feedback raises cheating from 33% to 38% | HS-071 (evidence-based conditions) |
| A6 | Reflect-and-retry without new external evidence | Huang et al.: accuracy drops. 2608.14659: −3 to −10 pp | HS-069 |
| A7 | Multi-agent debate as the verifier | Debate 83.0 vs majority vote 88.2 | HS-072, HS-061 |
| A8 | Same-model self-review as the final gate | Claude judges ×1.7–1.8 self-preference | HS-061, HS-027 |
| A9 | Delegating to a subagent "for a better answer" or "to save context" | Same model, same task. The 1M window makes the context argument rare | HS-041 |
| A10 | Parallel subagents writing interdependent code without shared decisions | Cognition; Anthropic research post | HS-052, HS-041 |
| A11 | Comprehensive skills, or four or more skills on one task | SkillsBench Tables 8–9 | HS-018 (≤2), HS-010 |
| A12 | Coverage as the measure of new tests | ACH: 49% of mutant-killing tests add no line coverage | HS-068 |
| A13 | Read-only tests as the only anti-cheat | ImpossibleBench §5.2 | HS-028 (triad) |
| A14 | Reviewers told to "find problems" with no correctness filter | Best practices: such a reviewer "will always find something" | HS-061, HS-063 |
| A15 | Trusting self-reported confidence or "I verified this" | 2608.14659; DGM App. H | HS-027, HS-069 |
| A16 | Asking the user whether AI made them faster | METR: forecast −24%, measured +19% time | HS-059, HS-005 |
| A17 | Proactive actions mid-task | ProCodeBench ≤35.6%. ProAIDE: 62% of mid-task suggestions dismissed | HS-024, HS-077, HS-076 |
| A18 | A tool-less summariser as the whole injection defence | CaMeL §2: data flow is still manipulable | HS-032 |
| A19 | Typo-distance or "package exists" checks as the dependency defence | Only 13.4% are near-misses, and attackers register names | HS-031 |
| A20 | Adding or removing tools or skills mid-session; timestamps in system prompts | Manus; the prompt-caching docs | HS-011, HS-038 |
| A21 | Learning global rules from user edits | CIPHER §4.3 | HS-051, HS-049 |
| A22 | A fixed heavy process on every task | Harness-design: an evaluator is overhead inside the solo boundary | HS-018 size gate, HS-025, HS-060 |

---

## Coverage

Every source ID maps to exactly one HS item. Anti-ideas map to "Will not do".

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

**C1–C38 (38)**, numbered in the order they appear in [ideas-for-h-stack.md](research/cloudflare/ideas-for-h-stack.md). The unnumbered §E self-audit seed maps to HS-014.

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
| D3 | 001 | D9 | 071 | D15 | 001 | D21 | 032 |
| D4 | 037 | D10 | 030 | D16 | 007 | D22 | 009 |
| D5 | 036 | D11 | 010 | D17 | 017 | | |
| D6 | 027 | D12 | 020 | D18 | 059 | | |

**A1–A22 (22):** all are in [Will not do](#will-not-do).

**Totals:** 20 + 56 + 33 + 38 + 22 = 169 ideas → 85 items; 22 anti-ideas → Will not do; 0 unmapped.

**Category gaps.** Categories 02 (orchestration), 03 (ideation), 10 (design and UI), 12 (docs and writing) and 16 (business and research) have no backlog item from the numbered idea sets. Their "Ideas worth stealing" lists ([research/](research/README.md)) are decided when each category is built, one category at a time, through HS-081 and the eval suite.
- Category 10 matters most for the context-over-templates rule: its research leans on fixed palettes and style catalogues (UI UX Pro Max, Taste Skill). The sameness check (HS-005) exists to catch exactly that.
- Category 03's interview mechanics are already covered by HS-020.
