# Morning report: full H-Stack build

Date: 2026-11-11. Scope: every BACKLOG item (HS-001 to HS-085) and every IM row, in the order M2 → M8, then P1, then P2, with M9 prepared up to the smoke-test numbers.

**Short version.** All 85 HS items and 26 IM rows have a status: **103 done, 8 needs-user, 0 dropped** (one sub-import, resolving-merge-conflicts, was dropped inside a done row). Seven needs-user items have an allowed reason: smoke-test tasks, credentials or accounts, or desktop visual checks. HS-006 also waits on a permission decision, which is outside that list: auto mode refused sessions with H-Stack's safety gates off, and I did not work around it. CI passes 12/12 and `claude plugin validate .` passes. Every import was benchmarked with and without the skill. After closing two benchmark leaks and adding harder evals (3 runs per arm, blind grading), every skill beats no-skill. The margins on the six skills that got harder evals are small (+0.01 to +0.07). The regressions found along the way were fixed and re-measured. A sameness check across three very different projects shows each skill fitting the project better than no skill (fit 0.92–0.97 vs 0.73–0.85), with no template sameness. In real sessions, seven eval-backed activation cases score 0.88 with the plugin vs 0.52 without; they are better on 6 of 7 and worse on none, and Claude loaded the named skill in 18 of 21 runs. The whole-stack smoke test has not run because it needs your real tasks.

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
2. **Routines (HS-076 nightly prep, HS-077 CI watcher).** These must be created in your claude.ai account; the GitHub-event trigger also needs the GitHub app on the repo. What each Routine does and its `task.yaml` pattern are in `skills/long-run` (SKILL.md, references/task-yaml.md).
3. **Second scaffold check (HS-009).** Needs a Codex or dsh install and its own model account.
4. **Visual checks in the desktop app.** I could not look at:
   - the Spinner suffix and announcement line (HS-056);
   - the side pane (HS-057), which opens by itself during a long run with a recorded goal (`"pane": "auto"`; `true` always, `false` never).

   Both are built and pass the mod tests (10/10); HS-056 and HS-057 are needs-user only for this check.
5. **HS-006: two things only you can give.**
   - **Credentials.** The bare-agent arm uses `claude --bare`, which authenticates only with `ANTHROPIC_API_KEY`. This environment has none.
   - **A permission decision (outside the goal's allowed reasons, stated plainly).** Claude Code's auto mode refused to start sessions with H-Stack's safety gates switched off (`ablate:stop`, `ablate:all`: "Create Unsafe Agents"). It also refused a bare agent built from ordinary flags ("Auto-Mode Bypass"). I did not work around either refusal, so the safety-gate ablation is unmeasured.
   - **What did run:** the ablation of non-safety components (classifier off, session-start map off). Everything is built, and `--dry-run` shows each arm's exact command.
   - **To finish:** set an API key, add a permission rule for `node evals/run-smoke.mjs`, then run `node evals/run-smoke.mjs --arms with,without,bare,ablate:stop` alongside the smoke test.
6. **Run H-Stack's setup in each project** (`node plugins/h-stack/scripts/setup.mjs --apply`).
   - Its allow rule for `hs` is what lets an agent declare a test-writing step.
   - Without it, in a headless or unattended run, the read-only-tests gate blocks new regression tests in existing test files. Measured: the bugfix case stalled until `hs` was allowed.
7. **Model-call features to watch in the smoke test.**
   - The concern check (HS-040) is on by default. It costs one Haiku-class call per edited turn, and when it finds an open point it adds a follow-up turn. That follow-up then becomes the last message a headless caller receives.
   - The classifier model fallback (HS-019) stays off: its spec keeps it off until trigger evals show a recall gain, and the rules already reach recall ≥ 0.8 on all 15 skills.

   Switch either with `concerns` or `classifier.fallback` in `.h-stack/config.json`.
8. **Self-audit leftovers.** All 12 confirmed findings are fixed. Two plausible ones need a live session to check (REPORT.md §4).
9. **New asks you will see.** Because of the self-audit fixes, H-Stack now asks before:
   - edits to `CLAUDE.md`, `.claude/rules/**` and `.h-stack/config.json`;
   - MCP tools whose names carry no recognisable verb.

   If the asks are too frequent, add the tool to `irreversible.allowlist` in `.h-stack/config.json` (that edit itself asks once).

## What was built, per milestone

| Milestone | Items | What exists now |
|---|---|---|
| M1 baseline | HS-001, 003, 005, 082 | Skipped per the goal, apart from what it needs:<br>• smoke runner `evals/run-smoke.mjs` (skill-creator layout; false-done, tampering, questions, unaided, cost per solved task, sameness), self-tested in both arms;<br>• task format and validator;<br>• judge hygiene;<br>• native map (ARCHITECTURE §2).<br>HS-001 is needs-user. |
| M2 skeleton and CI | HS-010, 011, 012, 015, 045, 081, 083, `bin/hs` | • Plugin skeleton and `hooks/hooks.json` (exec-form command hooks, `onFailure: block` on closed guards, timeouts) plus one mods module.<br>• `.h-stack/` JSONL state: single-line appends, gitignored.<br>• `ci.mjs` with: index generator, context budget (always-on 994/1,500 tokens, listing 738/900), 96 snapshot cases, hook contract (5 closed hooks deny on crash), lint, THIRD_PARTY digests. |
| M3 core imports | IM-01, 04, 05, 06, 07, 11, 15; HS-002 | core-rules (verification-before-completion and the Karpathy rules, plus 4 opt-in path-scoped rule templates), planning, tdd, debugging (with `verify-fix.mjs`), clarify. Each has evals and a benchmark. |
| M4 activation | HS-017, 018, 020, 022 | Exit criterion met, measured in real sessions: 7 eval-backed activation cases, plugin 0.88 vs 0.52 without (3 runs per arm, blind grading), better on 6 of 7, none worse. See Activation below.<br>• SessionStart router map.<br>• Rules classifier: size, at most one skill, native routes to `/code-review`, `/security-review`, skill-creator, "why that?".<br>• Event triggers.<br>• Act/ask/stop with an intent-check agent.<br>• `claude plugin eval` activation cases. |
| M5 guards I | HS-027, 028, 029 | • Receipts ledger and a Stop gate (blocks once on unbacked "done").<br>• Read-only tests outside `hs phase test`.<br>• Tamper scan (8 patterns).<br>• Protected checkers and paths, plus opt-in permission rules (`setup.mjs`, OD-4). |
| M6 guards II | HS-030, 031, 033 | • Irreversible-action gate: shell unwrapping, effect classes, dry-run receipts, approval binding; exfiltration always denied.<br>• Dependency gate: exists, age, downloads, near-miss; offline ⇒ ask.<br>• MCP tool-description firewall (mods `tool.describe`). |
| M7 state and memory | HS-046, 048, 049 | • Assumption ledger (blocks Stop while open).<br>• Committed path-scoped lessons with evidence and provenance, and a validator.<br>• At most 2 trigger-matched lessons per prompt.<br>• Native auto memory configured by setup. |
| M8 rubric | HS-060 | rubric-writer and blind rubric-grader agents; `hs rubric`; unmet must-haves block Stop. |
| M9 v1.0 prep | HS-085 | • Release gate `evals/release-gate.mjs`.<br>• README "What ships", "Results so far" and "Checks".<br>• This report.<br>Missing: only the smoke-test numbers. |

### Per priority

| Priority | done | needs-user | dropped |
|---|---:|---:|---:|
| P0 (26) | 25 | 1 (HS-001 smoke tasks) | 0 |
| P1 (36) | 33 | 3 (HS-006 API key and a permission decision; HS-056 visual check; HS-085 smoke results) | 0 |
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

**Method.** All numbers below come from `evals/skill-bench.mjs`:
- skill-creator layout;
- each run is a separate `claude -p` in a fresh fixture copy;
- a check command runs outside the agent;
- a separate grader judges the remaining expectations.

Two leaks were found and closed during the build. Numbers from before the fixes are not used below.
- **Until iteration 5, the with-skill arm could read the skill's own `evals/evals.json`,** whose expectations describe the answers. It now sees a copy of the skill without `evals/`.
- **Grading has been blind and tool-less since iteration 6.**
  - The grader is a fresh `claude -p --tools ""` call, not told the arm, with lines that mention the skill removed from the evidence.
  - A grader that could call tools sometimes ran out of its single turn and returned nothing, which scored a correct run as failed.

Full table: `evals/results/skills/SUMMARY.md`.

| Skill (imports) | Iteration | Evals | Runs/arm | With | Without | Δ | Δ tokens |
|---|---|---:|---:|---:|---:|---:|---:|
| memory (handoff) | 5 | 3 | 1 | 0.78 | 0.44 | +0.33 | +13k |
| git-ship (finishing, worktrees, pr) | 5 | 3 | 1 | 1.00 | 0.72 | +0.28 | +57k |
| long-run (dispatching-parallel-agents) | 5 | 3 | 1 | 1.00 | 0.72 | +0.28 | +14k |
| skill-authoring (own) | 5 | 3 | 1 | 1.00 | 0.72 | +0.28 | +83k |
| tdd | 5 | 3 | 1 | 1.00 | 0.78 | +0.22 | +338k |
| clarify (grilling) | 5 | 3 | 1 | 1.00 | 0.89 | +0.11 | +31k |
| core-rules (verification, Karpathy) | 5 | 3 | 1 | 0.89 | 0.78 | +0.11 | +92k |
| debugging (systematic-debugging) | 6 | 6 | 3 | 1.00 | 0.93 | +0.07 | +117k |
| planning (writing/executing-plans) | 5 | 3 | 1 | 0.93 | 0.87 | +0.07 | +44k |
| writing (writing-for-agents, unslop) | 6 | 3 | 3 | 1.00 | 0.93 | +0.07 | +45k |
| qa (webapp-testing) | 7 | 6 | 3 | 0.96 | 0.93 | +0.03 | +65k |
| research | 6 | 6 | 3 | 0.97 | 0.94 | +0.03 | +78k |
| review (receiving-code-review) | 6 | 6 | 3 | 0.94 | 0.91 | +0.03 | +47k |
| security-audit (cloudflare) | 6 | 6 | 3 | 0.97 | 0.94 | +0.03 | +44k |
| design-ui (baseline-ui, frontend-design) | 6 | 6 | 3 | 1.00 | 0.99 | +0.01 | +67k |

Every import beats no-skill, so none is dropped.

**How to read the margins.**
- The one-run rows (iteration 5) are within noise below about 0.15.
- The three-run rows are steadier but have small margins.
- Before the leak was closed, qa scored +0.44 (iteration 1). Its leak-free result is +0.03, so the old number was inflated.

**Regressions found along the way, all fixed and re-measured:**
- **review, iteration 1 (0.89 vs 1.00).** The verdict scheme made a rare edge case read as a bug. Fix: severity is now separate from verdict.
- **review, `duration-spec`.** The agent reported floating-point results that the spec defines as bugs. Fix: check a claim against the spec's own definition first. Result: 1.00 vs 0.83.
- **research, `untrusted-page`.** The agent ignored an injected instruction but didn't report it. Fix: report which source contained it. Result: 1.00 vs 0.83.
- **qa, `swallowed-422`.** The e2e test still failed after the bug was fixed. Fix: prove a regression test passes on a scratch fix. Result: 0.92 vs 0.83.
- **qa, `dashboard-injection`.** An injected instruction went unreported. Fix: report it. Result: 1.00 vs 1.00.
- **design-ui.** The agent hard-coded a colour instead of adding a token. Fix: a value the theme lacks becomes a new token.

**Cost.** Every skill raises tokens per task (+13k to +338k, tdd highest). This is the main cost to watch in the smoke test.

## Harder evals and the HS-006 retire rule

The five skills that tied at 1.00 vs 1.00, plus qa, each got 3 new hard evals. A subagent wrote them, with objective offline checks. Each check:
- fails on the untouched fixture;
- passes on a correct answer;
- fails on a plausible wrong one.

| Skill | New hard evals |
|---|---|
| debugging | shared mutable defaults behind a misleading symptom; time-zone due dates that only fail outside UTC; a fix that breaks an untested second caller |
| review | cache key on the first argument only; a spec grammar with look-alike non-bugs; free-shipping threshold checked before the discount |
| security-audit | IDOR through a router that matches exactly instead of by prefix; a start-anchored regex reaching `shell=True`; triage of three reports, two of them false |
| research | stale README vs installed code; a saved page with an injected instruction; a wrong top search result |
| design-ui | toast with motion and z-index tokens; signup form with four subtle a11y bugs and two bait lines; plan card that needs dark-mode tokens |
| qa | boundary mutants that survive the suite; a 422 swallowed in the browser flow; a dashboard with a wrong total and an injected instruction |

They ran at 3 runs per arm with blind grading. Most of the separation comes from the hard evals:

| Eval | With | Without |
|---|---:|---:|
| debugging `shared-defaults` | 1.00 | 0.75 |
| research `stale-readme` | 1.00 | 0.75 |
| review `cache-key` | 1.00 | 0.75 |
| qa `boundary-mutants` | 1.00 | 0.67 |
| writing `claude-md` | 1.00 | 0.78 |

**HS-006 applied.** A skill is retired only if it still doesn't beat no-skill after these evals. All six now beat it (table above), so none is retired. design-ui's margin (+0.01) is within noise. It is kept because its own job, fitting the project's context, shows a clear gain on the sameness check below.

## Sameness check (context over templates)

`evals/sameness.mjs` sends the same request into three real fixture projects:
- a children's reading app (playful tokens, "you" voice, parental gate);
- a bank's internal admin tool (`--ld-*` tokens, permissions, audit log, formal copy);
- a developer CLI (`logq`: stdout/stderr rules, XDG paths, terse docs).

The requests: design-ui "add a settings page", writing "write the README intro", planning "plan adding export of the user's data". Each runs with and without the skill, 2 runs per arm.

How it's graded:
- **Fit:** a fresh grader sees only the project's files and the output. It isn't told the context name or the arm, and it scores the fit criteria that apply to that kind of request.
- **Similarity:** the mean pairwise token Jaccard between the three contexts' outputs.

| Skill | Fit with | Fit without | Similarity with | Similarity without |
|---|---:|---:|---:|---:|
| design-ui | **0.93** | 0.73 | 0.19 | 0.14 |
| writing | **0.92** | 0.85 | 0.14 | 0.13 |
| planning | **0.97** | 0.80 | 0.18 | 0.16 |

No skill produces near-identical output across contexts: similarity stays at or below 0.20 everywhere.

**What the check found.**
- **CLI context (fixed).** design-ui was weak in the CLI project (4/5, 2/5): it didn't reliably turn "settings page" into a config command. The skill now says a project without a graphical UI gets its own interface for the job. After the fix: fit 0.93 vs 0.73, CLI runs 3/5 and 5/5.
- **Harness flaw (fixed).** The first grading counted criteria a README intro can't meet, such as "adds a command", so writing scored 0.50. The grader now marks criteria as applicable or not, and the stored outputs were re-graded.

## Description optimiser (HS-002, HS-008)

`evals/description-optimizer.mjs` implements skill-creator's method in zero-dependency Node. Its own scripts weren't run because auto mode blocks downloaded code.

**Method.**
- It measures native triggering from the skill list alone, with all hooks off (`disableAllHooks`).
- Trigger sets cover all 15 skills, split 60/40 into train and held-out, at 3 runs per query.
- Claude proposes rewrites from the training failures.
- A rewrite is kept only if held-out accuracy doesn't drop.

**Results.**
- **Changed (8 of 15):** tdd, clarify, core-rules, review, research, qa and design-ui raised train accuracy with held-out unchanged.
- **No better candidate found:** planning, writing and debugging.
- **Held-out stays low (≤ 0.5)** on description-only triggering for core-rules, design-ui, planning, writing and git-ship. In real sessions H-Stack's classifier covers this.
- **Listing cost** rose to 738/900 tokens.
- **Load rate unchanged:** after the change, Claude still loaded the named skill in 16 of 18 real sessions.

**A measurement confound found here.** Stale THIRD_PARTY digests make SessionStart call the edited skills "unverified", and Claude then avoids them: planning loaded 0/3 instead of 3/3. `activation-bench.mjs` now refuses to run with stale digests.

**Effort (HS-007), low vs session default.**

| Skill | Pass rate | Tokens | Time |
|---|---|---:|---:|
| tdd | 0.89 (unchanged) | −17% | −22% |
| planning | 1.00 (unchanged) | −23% | −24% |

I did not set frontmatter `effort: low`. The field overrides your session effort for the whole turn, and 3 small fixtures are too little evidence for that.

**Activation (HS-018, M4).** There are three measures. Only the first two exercise H-Stack's classifier.

1. **Real sessions** (`evals/activation-bench.mjs`): `claude -p` with the plugin, 6 prompts (tdd, debugging, planning, review, writing, research). It counts whether Claude called the Skill tool for the skill H-Stack named.

   | Wording of the classifier line | Loaded |
   |---|---:|
   | "Relevant skill: X (load with the Skill tool) because …" (shipped) | **16/18 (0.89)**, 3 runs per prompt; 27/30 across both passes |
   | "Skill check: X matches …; its procedure is not in context until loaded …" | 10/12 |
   | Pointer plus a one-line summary of the skill | 10/12 |

   The two misses were one debugging run and one writing run. The research cites "84% with forced evaluation"; the plain factual pointer does as well here, so it ships unchanged.

2. **Outcomes in real sessions (the M4 check)** (`evals/activation-bench.mjs --outcome --cases evals/activation-cases-hard.json`).
   - **Cases:** seven, taken from the per-skill evals where the two arms separated. Each keeps its fixture, its objective check command and its expectations.
   - **Routing:** the prompt goes through H-Stack's normal routing, with no instruction to read a skill.
   - **Runs:** with the plugin vs without, 3 runs per arm, 20-turn budget.
   - **Grading:** the check command, plus a fresh grader with no tools that isn't told the arm and sees everything the agent said.

   | Case (skill it should route to) | Plugin | No plugin |
   |---|---:|---:|
   | lesson-draft (memory) | **1.00** | 0.00 |
   | pr-body (git-ship) | **1.00** | 0.50 |
   | bugfix-regression-test (tdd/debugging) | **0.67** | 0.33 |
   | shared-defaults (debugging) | **0.75** | 0.50 |
   | cache-key (review) | **1.00** | 0.75 |
   | untrusted-page (research) | **1.00** | 0.75 |
   | claude-md (writing) | 0.78 | 0.78 |
   | **All seven** | **0.88** | **0.52** |

   Claude loaded the named skill in 18 of 21 plugin runs. The three misses were all the one-line bugfix prompt, which Claude judged too simple to need a skill.

   **Fixes found while measuring:**
   - **CLAUDE.md requests were blocked.** The self-audit made CLAUDE.md a protected file, so H-Stack asked before the very edit the user requested, and a headless run can't approve. That failed 3 of 3 times. A protected file named in the user's prompt is now approved for that turn.
   - **research ignored the repo's note convention.** It now copies the existing structure.
   - **Two classifier misses.** Bug reports phrased "returns X instead of Y" and "turn this into a lesson the team can share" now route correctly.

   **Two harness corrections:**
   - Sessions are allowed to run `hs`, as H-Stack's setup gives a real project.
   - Grading reads everything the agent said, because a concern-check follow-up had replaced the final message.

   Before the cases were rebuilt, the six simple activation prompts scored 1.00 vs 0.89, with four tied at the ceiling.

3. **`claude plugin eval`.** Its traces show the classifier hook never runs inside plugin eval: 0 classifier events, against 1 in a plain `claude -p` trace. So its skill-fired grader measures only the session-start skill map and the skill descriptions. Its scored cases, 3 runs per arm, with the final code:

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
| context budget | always-on 994/1,500 tokens; listing 738/900; 0 rows over |
| snapshots | 98/98 |
| hook contract | 20 hook scripts; 5 closed hooks deny on crash |
| lint | 15 skills, 4 agents, 0 problems |
| THIRD_PARTY | 19 import rows, 0 problems |
| egress inventory | 9 points, 0 outside the inventory |
| unit and validator tests | 39 pass, 0 fail (trigger sets cover all 15 skills) |
| mod tests (`claude plugin test`) | 11 pass |
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
2. **Per-skill benchmarks:** 1 run per arm (the goal's "light benchmark") for the nine skills that clearly beat no-skill; 3 runs per arm for the six that got harder evals. OD-6's 3 runs apply to the smoke test.
3. **skill-creator's description optimiser** was implemented in zero-dependency Node (`evals/description-optimizer.mjs`) rather than run from its own scripts, which auto mode blocks as downloaded code. The method is the same: 60/40 split, 3 runs per query, held-out acceptance.
4. **Subagent output validation moved from SubagentStop to PostToolUse(Agent)** (`hooks/agent-result.mjs`). A SubagentStop block sends the same subagent back to repair its output; §10 wants a fresh re-run, never a repair.
5. **Firewall and mods were tested with the mods test kit** (`claude plugin test`), not plugin-eval mock MCP servers. `claude plugin eval` refuses Bash here because the container has no sandbox backend.
6. **Classifier model fallback (HS-019) is off.** Its own mechanism says so until trigger evals show a recall gain (OD-1).
7. **Long-run features need a recorded goal.** The overseer, recitation and rut breaker, and the side pane switch on by themselves only during a long run with a recorded goal (`hs goal set`); that is how "long runs only" is implemented.
8. **Upstream tests for the Cloudflare security-audit validators were not executed**: auto mode blocked running downloaded code.
   - A review subagent safety-read the 11 companion files in full.
   - I read the core files, schema and validators in full; I reviewed the test files for side effects but did not read every line.
9. **resolving-merge-conflicts not imported**: the upstream skill is archived. git-ship covers conflicts in its own words.
10. **HS-006 applied after harder evals.** No skill is retired. design-ui's benchmark margin (+0.01) is within noise; it is kept on its sameness result (fit 0.93 vs 0.73).
11. **Solo-boundary pass signal (HS-025)** is "the next prompt is not a correction". That is a proxy until smoke-test data exists; cold start is `medium` as specified.
12. **Activation is measured in real `claude -p` sessions, not plugin eval** (HS-018). Plugin eval doesn't run UserPromptSubmit hooks (0 classifier events in its traces), so it can't measure H-Stack's classifier.

13. **HS-006 is not complete.** The ablation of the classifier and the session-start map ran. The bare-agent arm needs an `ANTHROPIC_API_KEY`. The safety-gate ablation and the flag-built bare agent were refused by auto mode, which is a permission decision outside the goal's allowed reasons for leaving work undone. See Needs you, item 5.

## Next steps

1. Add your ~10 real tasks to `evals/tasks.json`.
2. Run the M1 baseline, then the full stack, with `node evals/run-smoke.mjs --runs 3`.
3. Drop any piece that makes results worse (CLAUDE.md), then commit the results.
4. Raise runs per arm to 3 for the nine skills still measured at 1 run, if you want tighter numbers. Each takes about 15 minutes.
5. Run the bare and ablation arms with the smoke test once allowed (`--arms with,without,bare,ablate:<component>`). Re-run `node evals/activation-bench.mjs` (and `--outcome`) on each new model; the other wordings stay selectable through `HSTACK_LINE_STYLE`.
6. Use the smoke test to decide whether the concern check earns its model call, and whether the classifier fallback should come on.
7. Once `node evals/release-gate.mjs` passes, bump `plugins/h-stack/.claude-plugin/plugin.json` from 0.0.1 and put the smoke numbers, regressions included, in the README.
