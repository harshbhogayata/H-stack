# Morning report: full H-Stack build

Date: 2026-11-11. Scope: every BACKLOG item (HS-001 to HS-085) and every IM row, in the order M2 → M8, then P1, then P2, with M9 prepared up to the smoke-test numbers.

**Short version.** All 85 HS items and 26 IM rows have a status: **104 done, 7 needs-user, 0 dropped** (one sub-import, resolving-merge-conflicts, was dropped inside a done row). Every needs-user item has one of the allowed reasons: smoke-test tasks, accounts, or desktop visual checks. CI passes 12/12 and `claude plugin validate .` passes. Every import was benchmarked with and without the skill. No import is worse than no skill. Review was worse on its first run and was fixed. Five skills tie at the ceiling. In real sessions, Claude loads the skill H-Stack names 89% of the time (16 of 18 runs) after the routing fixes. The whole-stack smoke test has not run because it needs your real tasks.

## Needs you

1. **Smoke-test tasks (HS-001, M1, M9).** About 10 real tasks from your projects. Each needs:
   - a prompt;
   - a fixture repo at a commit;
   - a `check` script that runs the project's own tests;
   - `protected_tests`, and whether a question is needed.

   The format is in `evals/tasks.json` (validated by `evals/check-tasks.mjs`). Then run:
   - `node evals/run-smoke.mjs --runs 3` for the M1 baseline and v1.0 numbers (OD-6: 3 runs per arm, your daily model);
   - `node evals/release-gate.mjs` before bumping the version.

   The release gate (HS-085) is built and its CI part passes. The gate itself fails until these tasks exist and have been run, so HS-085 is needs-user.
2. **Retire or harden the five ceiling ties (judgement call).** debugging, design-ui, research, review and security-audit score 1.00 with and without the skill. They conflict with two rules:
   - HS-006 says a skill the base model passes without is retired.
   - The goal's import rule says to drop only what is worse than no skill.

   I kept all five. Their evals are probably too easy to show a gain. Choose one:
   - **(a)** keep them and let me write harder evals (for debugging: a multi-cause bug where the obvious fix is wrong);
   - **(b)** retire them now.

   `node evals/retire-check.mjs` lists them.
3. **Routines (HS-076 nightly prep, HS-077 CI watcher).** These must be created in your claude.ai account; the GitHub-event trigger also needs the GitHub app on the repo. What each Routine does and its `task.yaml` pattern are in `skills/long-run` (SKILL.md, references/task-yaml.md).
4. **Second scaffold check (HS-009).** Needs a Codex or dsh install and its own model account.
5. **Visual checks in the desktop app.** I could not look at:
   - the Spinner suffix and announcement line (HS-056);
   - the side pane (HS-057, opt-in via `"pane": true` in `.h-stack/config.json`).

   Both are built and pass the mod tests (5/5); HS-056 and HS-057 are needs-user only for this check.
6. **Off-by-default switches to decide after the smoke test.** Each one costs model calls or context and has no measured gain yet. They are listed in Deviations (item 6).
7. **Self-audit leftovers.** All 12 confirmed findings are fixed. Two plausible ones need a live session to check (REPORT.md §4).
8. **New asks you will see.** Because of the self-audit fixes, H-Stack now asks before:
   - edits to `CLAUDE.md`, `.claude/rules/**` and `.h-stack/config.json`;
   - MCP tools whose names carry no recognisable verb.

   If the asks are too frequent, add the tool to `irreversible.allowlist` in `.h-stack/config.json` (that edit itself asks once).

## What was built, per milestone

| Milestone | Items | What exists now |
|---|---|---|
| M1 baseline | HS-001, 003, 005, 082 | Skipped per the goal, apart from what it needs:<br>• smoke runner `evals/run-smoke.mjs` (skill-creator layout; false-done, tampering, questions, unaided, cost per solved task, sameness), self-tested in both arms;<br>• task format and validator;<br>• judge hygiene;<br>• native map (ARCHITECTURE §2).<br>HS-001 is needs-user. |
| M2 skeleton and CI | HS-010, 011, 012, 015, 045, 081, 083, `bin/hs` | • Plugin skeleton and `hooks/hooks.json` (exec-form command hooks, `onFailure: block` on closed guards, timeouts) plus one mods module.<br>• `.h-stack/` JSONL state: single-line appends, gitignored.<br>• `ci.mjs` with: index generator, context budget (always-on 906/1,500 tokens, listing 650/900), 94 snapshot cases, hook contract (5 closed hooks deny on crash), lint, THIRD_PARTY digests. |
| M3 core imports | IM-01, 04, 05, 06, 07, 11, 15; HS-002 | core-rules (verification-before-completion and the Karpathy rules, plus 4 opt-in path-scoped rule templates), planning, tdd, debugging (with `verify-fix.mjs`), clarify. Each has evals and a benchmark. |
| M4 activation | HS-017, 018, 020, 022 | Exit criterion met; see Activation below.<br>• SessionStart router map.<br>• Rules classifier: size, at most one skill, native routes to `/code-review`, `/security-review`, skill-creator, "why that?".<br>• Event triggers.<br>• Act/ask/stop with an intent-check agent.<br>• `claude plugin eval` activation cases. |
| M5 guards I | HS-027, 028, 029 | • Receipts ledger and a Stop gate (blocks once on unbacked "done").<br>• Read-only tests outside `hs phase test`.<br>• Tamper scan (8 patterns).<br>• Protected checkers and paths, plus opt-in permission rules (`setup.mjs`, OD-4). |
| M6 guards II | HS-030, 031, 033 | • Irreversible-action gate: shell unwrapping, effect classes, dry-run receipts, approval binding; exfiltration always denied.<br>• Dependency gate: exists, age, downloads, near-miss; offline ⇒ ask.<br>• MCP tool-description firewall (mods `tool.describe`). |
| M7 state and memory | HS-046, 048, 049 | • Assumption ledger (blocks Stop while open).<br>• Committed path-scoped lessons with evidence and provenance, and a validator.<br>• At most 2 trigger-matched lessons per prompt.<br>• Native auto memory configured by setup. |
| M8 rubric | HS-060 | rubric-writer and blind rubric-grader agents; `hs rubric`; unmet must-haves block Stop. |
| M9 v1.0 prep | HS-085 | • Release gate `evals/release-gate.mjs`.<br>• README "What ships", "Results so far" and "Checks".<br>• This report.<br>Missing: only the smoke-test numbers. |

### Per priority

| Priority | done | needs-user | dropped |
|---|---:|---:|---:|
| P0 (26) | 25 | 1 (HS-001 smoke tasks) | 0 |
| P1 (36) | 34 | 2 (HS-056 visual check; HS-085 smoke results) | 0 |
| P2 (23) | 19 | 4 (HS-009, 076, 077 accounts; HS-057 visual check) | 0 |
| IM rows (26) | 26 | 0 | 0 (resolving-merge-conflicts dropped inside the IM-13 row: upstream archived) |

**P1 highlights**
- Ten more imports (review, qa, security-audit, design-ui, memory/handoff, writing, git-ship, long-run, research) plus skill-authoring, which H-Stack wrote itself.
- Taint and fetch-destination guard; scope lock; error-as-success and outcome-unknown detectors; repeat-call reminders; step and spawn budgets; syntax check on edits.
- Compaction checkpoints; memory shadow log; decision ledger; wishlist.
- Spinner and announcement mod.
- Review lanes with a mechanical findings validator, coverage ledger and shallow detector.
- Counterfactual fix proof; repro harvest; signal rules; premise check; `/goal` long-run protocol.
- Local telemetry with 90-day pruning; `hs retro`; routing examples from corrections; solo-boundary verification effort; egress inventory in CI; release gate; retire check.

**P2 highlights**
- Declared effects for unattended jobs (`task.yaml` + `hs manifest`, enforced by the Bash gate).
- Diff-targeted mutation check; change-size governor; oracle bisection with lock files; migration accounting gate.
- Reviewer calibration from overrides; skill feedback drafts with exact-text approval.
- Git-based retro signals (reverts, rework, request-to-commit time); user-edit candidates for lessons.
- Several-attempts guidance for high-risk work.
- Effort measurement; opt-in recitation and few-shot rut breaker (HS-055); side pane.

## Benchmark numbers per import

All per-skill benchmarks used the same method:
- skill-creator layout, 3 eval prompts per skill;
- 1 `claude -p` run with the skill and 1 without, each in a fresh fixture copy;
- a check command run outside the agent, plus a separate judge call for the remaining expectations.

With one run per arm, a delta under about 0.15 is within noise. Full data: `evals/results/skills/`; table: `evals/results/skills/SUMMARY.md`.

| Skill (imports) | Iteration | With | Without | Δ | Δ tokens | Verdict |
|---|---|---:|---:|---:|---:|---|
| qa (webapp-testing) | 1 | 1.00 | 0.56 | +0.44 | +118k | kept |
| memory (handoff) | 1 | 0.78 | 0.44 | +0.33 | −8k | kept |
| git-ship (finishing, worktrees, pr) | 1 | 1.00 | 0.72 | +0.28 | +69k | kept |
| long-run (dispatching-parallel-agents) | 1 | 1.00 | 0.72 | +0.28 | +152k | kept |
| skill-authoring (own) | 1 | 1.00 | 0.72 | +0.28 | +55k | kept |
| planning (writing/executing-plans) | 2 | 1.00 | 0.87 | +0.13 | +74k | kept |
| clarify (grilling) | 2 | 1.00 | 0.89 | +0.11 | +17k | kept |
| writing (writing-for-agents, unslop) | 1 | 1.00 | 0.89 | +0.11 | +10k | kept |
| core-rules (verification, Karpathy) | 2 | 0.89 | 0.78 | +0.11 | +105k | kept |
| tdd | 4 | 0.89 | 0.78 | +0.11 | +359k | kept (iteration 4 re-checks the spec-coverage change; iteration 2 was the same 0.89 vs 0.78) |
| review (receiving-code-review) | 2 | 1.00 | 1.00 | 0.00 | +36k | kept (tie). **Iteration 1 was worse: 0.89 vs 1.00** (explained below the table) |
| debugging (systematic-debugging) | 2 | 1.00 | 1.00 | 0.00 | +177k | kept (tie at ceiling) |
| design-ui (baseline-ui, frontend-design) | 1 | 1.00 | 1.00 | 0.00 | +34k | kept (tie at ceiling) |
| research | 1 | 1.00 | 1.00 | 0.00 | +148k | kept (tie at ceiling) |
| security-audit (cloudflare) | 1 | 1.00 | 1.00 | 0.00 | −26k | kept (tie at ceiling) |

**Why review failed its first run.** Its verdict scheme (`confirmed`) led the agent to call a rare non-BMP edge case "a real bug". I fixed it by giving each finding a severity that is separate from its verdict, and re-ran it.

**Earlier iterations.** Iteration 1 of the M3 skills had fixture bugs (Python bytecode in diffs, a stale `.pyc`). Iteration 2 replaced it.

**Cost.** Most skills raise tokens per task; that is the main cost to watch in the smoke test.

**Effort (HS-007), low vs session default.**

| Skill | Pass rate | Tokens | Time |
|---|---|---:|---:|
| tdd | 0.89 (unchanged) | −17% | −22% |
| planning | 1.00 (unchanged) | −23% | −24% |

I did not set frontmatter `effort: low`. The field overrides your session effort for the whole turn, and 3 small fixtures are too little evidence for that.

**Activation (HS-018, M4).** There are two measures. Only the first exercises H-Stack's classifier.

1. **Real sessions** (`evals/activation-bench.mjs`): `claude -p` with the plugin, 6 prompts (tdd, debugging, planning, review, writing, research). It counts whether Claude called the Skill tool for the skill H-Stack named.

   | Wording of the classifier line | Loaded |
   |---|---:|
   | "Relevant skill: X (load with the Skill tool) because …" (shipped) | **16/18 (0.89)**, 3 runs per prompt; 27/30 across both passes |
   | "Skill check: X matches …; its procedure is not in context until loaded …" | 10/12 |
   | Pointer plus a one-line summary of the skill | 10/12 |

   The two misses were one debugging run and one writing run. The research cites "84% with forced evaluation"; the plain factual pointer does as well here, so it ships unchanged.

2. **`claude plugin eval`.** Its traces show the classifier hook never runs inside plugin eval: 0 classifier events, against 1 in a plain `claude -p` trace. So its skill-fired grader measures only the session-start skill map and the skill descriptions. Its scored cases, 3 runs per arm, with the final code:

   | Case | With | Without |
   |---|---:|---:|
   | debugging | 1.00 | 1.00 |
   | tdd | 1.00 | 1.00 |
   | planning | **1.00** | **0.33** |

**What the measurement found and fixed:**
- **Routing.**
  - Intents matched as word prefixes ("pr" matched "primary", "ship" matched "shipped").
  - Review and writing missed common phrasings.
  - Bare "rewrite" sized a paragraph edit as `full`, which added clarify.
  - Three of the six prompts went to the wrong skill or none. The trigger sets in CI now cover 9 skills, including these prompts.
- **The earlier tdd regression (0.50 vs 1.00) was an H-Stack bug.** The read-only-tests gate blocked Claude's second red-green slice in a test file it had just created. Test files Claude creates in a session are now editable by it; pre-existing tests still ask (snapshots `edit-test-created-this-session`, `edit-test-existing`). The tdd skill also gained a check that every rule in the spec has a test.
- **Planning failure.** One planning run failed because clarify asked about six questions. Clarify now counts every question in the reply against its limit of three; other decisions go under "Assumed unless you say otherwise".

## CI summary

Final run (`node plugins/h-stack/scripts/ci.mjs`): **12/12 steps passed.**

| Step | Result |
|---|---|
| plugin validate | passed |
| index | current (15 skills) |
| Model Experience note | current |
| context budget | always-on 906/1,500 tokens; listing 650/900; 0 rows over |
| snapshots | 95/95 |
| hook contract | 19 hook scripts; 5 closed hooks deny on crash |
| lint | 15 skills, 4 agents, 0 problems |
| THIRD_PARTY | 19 import rows, 0 problems |
| egress inventory | 9 points, 0 outside the inventory |
| unit and validator tests | 37 pass, 0 fail |
| mod tests (`claude plugin test`) | 5 pass |
| smoke-test task file | valid; 0 real tasks |

`claude plugin validate .` passes. `node evals/release-gate.mjs`: CI ok; smoke check fails (no real tasks), as expected.

## Self-audit (HS-014)

A review subagent ran the imported security-audit skill on H-Stack's own hooks, mods, lib, `hs` and setup.

**Findings: 12 confirmed (7 medium, 5 low), 2 plausible, 4 refuted.** Both upstream validators pass on `docs/self-audit/findings.json` (18 records) and `coverage-ledger.json` (15 units). Full report: `docs/self-audit/REPORT.md`.

**All 12 confirmed findings are fixed.** Every reproduction in `docs/self-audit/agents/parent/artifacts/repro.sh` now asks or denies, and each finding has at least one automated check:
- unit tests in `tests/unit/self-audit.test.mjs` for F1, F2, F3, F6, F8, F9, F10 and F12;
- snapshot cases in `tests/snapshots/` for F1, F3, F4, F5, F6, F7, F9 and F11 (`bash-force-push-global-flag`, `bash-config-write`, `bash-state-node-e`, `bash-state-mv-source`, `bash-hs-manifest-stop`, `bash-metadata-schemeless`, `bash-taint-data-noprefix-space`, `bash-taint-wget-post-file`, `mcp-camelcase-write`, `bash-subagent-shell-write`).

| Finding | What could happen | Fix |
|---|---|---|
| F1, F2 | Global flags such as `git -C . push --force`, `gh -R`, `kubectl --context` and `npm --prefix` bypassed the irreversible and dependency gates | A shared normaliser moves global options after the subcommand |
| F3 | The agent could rewrite `.h-stack/config.json` to allowlist everything | Edits to config.json now ask |
| F4 | `mv`, `node -e` and `find -delete` on `.h-stack/` state got through | Any non-reading command naming state is denied, except `hs` |
| F5 | `hs manifest stop` lifted the declared-effects manifest without asking | It now asks, and the refusal no longer suggests it |
| F8 | `.e""nv` and `$(gh auth token)` got past the exfiltration guard | De-quoted tokens are checked, credential printers count as secret sources, and the parser now extracts substitutions inside double quotes |
| F9 | Hyphenated, camelCase and `*_write` MCP tools weren't treated as writes | Names are split on `-`, `.` and camelCase; a tool with no recognisable verb asks |
| F10 | A lesson with untrusted provenance was injected into prompts | Lessons are validated before injection, and `.claude/rules/**` and `CLAUDE.md` edits ask |
| F6, F7 | Scheme-less and IPv4-mapped metadata URLs, and `-d@x` / `--post-file=`, slipped through | Fixed |
| F11 | Read-only subagents could still write through Bash | The scratch-only rule now applies to Bash |
| F12 | `echo tests` satisfied a "tests pass" claim | Claim kinds come from the parsed executable |

**Still open:**
- **Plausible finding 1:** the MCP firewall may scan only the `description` field.
- **Plausible finding 2:** a resubmit loop in the off-by-default concern check.
- Both need the live runtime to check.
- **Structural limit:** these gates parse text and are a second layer behind Claude Code's native permissions, not a sandbox. In-process tool use (`python -c "subprocess…"`) gets past any text-based gate.
- **Audit method:** one agent did the whole audit (no separate verifier) and coverage is partial. REPORT.md §7 lists what wasn't covered.

## Deviations from ARCHITECTURE.md

1. **M1 baseline skipped** (per the goal). As a result:
   - no with/without smoke numbers exist for any milestone;
   - the "Ends with (measured)" column of §11 holds per-skill benchmarks and activation evals instead.
2. **Per-skill benchmarks ran 1 run per arm** (the goal's "light benchmark"), not the 3 of OD-6. OD-6 applies to the smoke test.
3. **skill-creator's description optimiser was not run** (HS-002, HS-008).
   - Why: cost, and auto mode blocked running its downloaded scripts.
   - Instead: keyword routing is tuned on should/should-not trigger sets checked in CI.
4. **Subagent output validation moved from SubagentStop to PostToolUse(Agent)** (`hooks/agent-result.mjs`). A SubagentStop block sends the same subagent back to repair its output; §10 wants a fresh re-run, never a repair.
5. **Firewall and mods were tested with the mods test kit** (`claude plugin test`), not plugin-eval mock MCP servers. `claude plugin eval` refuses Bash here because the container has no sandbox backend.
6. **Built but off by default:**
   - classifier model fallback (HS-019, consistent with OD-1);
   - concern check at Stop (HS-040);
   - overseer (HS-042);
   - side pane (HS-057, consistent with OD-2);
   - recitation and rut breaker (HS-055, K16: only with a measured gain).
7. **Repeat-call reminders run on PostToolBatch, not PostToolUse** (HS-037): one line per batch instead of one per call.
8. **Upstream tests for the Cloudflare security-audit validators were not executed**: auto mode blocked running downloaded code.
   - A review subagent safety-read the 11 companion files in full.
   - I read the core files, schema and validators in full; I reviewed the test files for side effects but did not read every line.
9. **resolving-merge-conflicts not imported**: the upstream skill is archived. git-ship covers conflicts in its own words.
10. **HS-006 retire rule not applied** to the five ceiling ties (see Needs you, item 2).
11. **Solo-boundary pass signal (HS-025)** is "the next prompt is not a correction". That is a proxy until smoke-test data exists; cold start is `medium` as specified.
12. **Activation is measured in real `claude -p` sessions, not plugin eval** (HS-018). Plugin eval doesn't run UserPromptSubmit hooks (0 classifier events in its traces), so it can't measure H-Stack's classifier.

## Next steps

1. Add your ~10 real tasks to `evals/tasks.json`.
2. Run the M1 baseline, then the full stack, with `node evals/run-smoke.mjs --runs 3`.
3. Drop any piece that makes results worse (CLAUDE.md), then commit the results.
4. Decide on the five ceiling ties. If you keep them, harder evals first, starting with debugging.
5. Re-run `node evals/activation-bench.mjs` on each new model; the other wordings stay selectable through `HSTACK_LINE_STYLE`.
6. Decide the off-by-default switches from measured numbers.
7. Once `node evals/release-gate.mjs` passes, bump `plugins/h-stack/.claude-plugin/plugin.json` from 0.0.1 and put the smoke numbers, regressions included, in the README.
