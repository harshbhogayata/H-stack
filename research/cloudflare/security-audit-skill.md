# cloudflare/security-audit-skill — full analysis

Source: https://github.com/cloudflare/security-audit-skill, branch `main`, commit `c1c8a8c` (2026-09-14, "Clarify guidance and full audit modes"; shallow clone shows one commit, GitHub shows 14). **License: MIT, © 2025-2026 Cloudflare, Inc.** Short quotes below are attributed to that repo; everything else is our paraphrase.

Read in full, all 22 files (5,403 lines, ~25,600 words of Markdown):

| File | Lines | Role |
|---|---:|---|
| `README.md` | 106 | Overview, files table, install, design principles |
| `LICENSE` | 21 | MIT |
| `skills/security-audit/SKILL.md` | 192 | Modes, execution safety, setup, write isolation, planning, budget, principles, severity, workflow, anti-patterns |
| `RECONNAISSANCE.md` | 156 | Phase 1: four recon agent prompts, prior-run input, architecture summary, ledger design |
| `HUNTING.md` | 251 | Phase 2: hunter prompt contract, core method, promotion block, candidate gate, result JSON, consolidation, critic waves |
| `ATTACK-CLASSES.md` | 130 | Companion router + 9 ordinary classes |
| `VALIDATION-AND-REPORTING.md` | 186 | Phases 3–6 |
| `AI-AND-LLM.md` | 83 | 14 classes |
| `SUPPLY-CHAIN-AND-RELEASE.md` | 73 | 12 classes |
| `MEMORY-SAFETY-AND-BINARY.md` | 101 | 19 classes |
| `WEB-PROTOCOL-AND-AUTH.md` | 105 | 20 classes |
| `CLIENT-SIDE.md` | 83 | 14 classes |
| `CLOUD-AND-DEPLOYMENT.md` | 86 | 15 classes |
| `PROTOCOLS-RPC-AND-MESSAGING.md` | 81 | 14 classes |
| `RESOURCE-EXHAUSTION-AND-AVAILABILITY.md` | 78 | 13 classes |
| `DATA-ISOLATION-AND-LIFECYCLE.md` | 84 | 15 classes |
| `DESKTOP-MOBILE-AND-LOCAL-IPC.md` | 89 | 15 classes |
| `report-schema.json` | 461 | Findings JSON schema (3 `oneOf` branches) |
| `validate-findings.cjs` | 773 | Zero-dependency schema interpreter + semantic checks |
| `validate-findings.test.cjs` | 652 | 34 `node:test` cases |
| `validate-coverage-ledger.cjs` | 872 | Zero-dependency ledger validator |
| `validate-coverage-ledger.test.cjs` | 740 | 31 `node:test` cases |

File list confirmed against the GitHub tree page (Context.dev scrape) and a `git clone --depth 1`; no other files exist (no plugin manifest, no hooks, no CI, no evals). The raw-URL download and the clone were byte-identical.

---

## 1. What it is, in one paragraph

A single agent-neutral skill that turns a coding agent into a multi-agent security auditor. A **parent** agent coordinates isolated **`research`** (read-only fact-finding) and **`general`** (investigation + bounded local execution) sub-agents through six phases. All shared state lives in a few parent-owned files; every claim is machine-checked by two zero-dependency Node validators; every candidate is checked by an agent that did not find it; reports are derived only from verified JSON records. It is the seed of Cloudflare's production harness (see `other-repos-and-posts.md`).

## 2. Frontmatter and activation

```yaml
name: security-audit
description: Security guidance and vulnerability review for codebases, APIs, services, CLI tools,
  libraries, and daemons. Use for security questions, focused reviews, vulnerability research,
  security audits, or pen tests. Run the complete workflow only for explicit codebase audit or
  pen-test requests, full/comprehensive/end-to-end reviews, or requested report artifacts.
```

Only `name` + `description` (no `allowed-tools`, no `when_to_use`, no model pin). The description does three jobs in ~380 characters: use case first, trigger list second, **and a scope limiter** ("Run the complete workflow only for…"). That last sentence is the activation-time half of the two-mode design.

## 3. Operating modes (SKILL.md "Operating modes")

- **Guidance mode (default).** "Loading it does not authorize the complete audit workflow or file creation." Use only the relevant parts; no six phases, no output directory, no artifacts. Focused agents allowed but return results to the current task.
- **Full audit mode.** Only when the user explicitly asks to audit or pen-test a codebase, asks for a full/comprehensive/end-to-end review, or requests report artifacts.
- **Ambiguity rule:** "ask one focused question before creating files or starting the complete workflow."
- The universal execution-safety rules apply in **both** modes.

README restates: "A direct codebase audit or pen-test request uses full audit mode. Security questions and focused vulnerability work use guidance mode unless you request report artifacts."

## 4. Platform terminology (agent-neutral vocabulary)

The skill never names Claude Code tools. It defines: **Parent** (coordinator, owns shared state), **Task tool** (whatever delegation mechanism exists), **`research` agent** (focused source exploration and factual verification), **`general` agent** (broad investigation and bounded local execution), and `subagent_type:` in a heading to say which role runs that block. "Use equivalent platform capabilities while preserving role, write-isolation, prompt, and independence boundaries." This is how one Markdown skill ports to Claude Code, OpenCode, Codex, etc.

## 5. Universal execution safety (SKILL.md)

Source inspection is read-only. Target-controlled builds, tests, processes, browsers, emulators, fuzzers and fixture processing run **only** in an OS-enforced sandbox with **all** of:

1. no external network (isolated loopback namespace only if a local client/server is needed);
2. empty environment populated from an explicit allowlist with safe values; scratch-local `HOME`, temp dirs, caches;
3. read-only target and toolchain; target process may write only to its assigned `scratch/`;
4. explicit low CPU, memory, process, file-size, disk and wall-clock limits.

Further rules: the agent (outside the sandbox) may copy source into `scratch/` if a build must write beside source. Guidance mode keeps no target-controlled files. Never expose retained output dirs, other agents' dirs, host home, credentials, sockets or shared services to target code. **No dependency installs; builds may not fetch.** "If every control cannot be enforced, do not execute target code": record a `needs_validation` blocker plus a safe plan. Dummy principals/fixtures/secrets only; never probe deployed endpoints, external services, shared infra, production identities, other users' data, live control planes; no availability testing on live/shared processes; no publishing, release changes, or paid-quota spend; stop at the minimum local effect.

Reproduced checks record command, exact input, sandbox limits and only allowlisted env-var names + safe values: "Launch from an empty environment rather than trying to redact one after execution."

## 6. Full audit setup

Resolve before recon: **skill directory** (absolute), **target** (absolute repo root), **repo name**, **output directory** — new, outside the target, default `~/security-audit-skill/<repo-name>/run-<N>` (next unused N). Inside-target output only if the user explicitly picks it **and** the parent verifies VCS ignores the whole directory; otherwise stop and ask. **Source ref**: reviewed commit and whether the worktree is dirty.

### 6.1 Write isolation

Parent is the **only** writer of: `run-metadata.json`, `architecture.md`, `coverage-ledger.json`, `findings.json`, `REPORT.md`, `FINDINGS-DETAIL.md`, `NEEDS-VALIDATION.md`.

Each hunter/verifier gets `<output-dir>/agents/<agent-id>/` with `scratch/` and `artifacts/`. Agent IDs match `^[a-z0-9][a-z0-9_-]{0,63}$` and are not Windows device names (`con`, `prn`, `aux`, `nul`, `com1-9`, `lpt1-9`); lowercase-only prevents case-fold collisions. Agents and sandboxed processes write only to `scratch/`. `artifacts/` is parent-owned, never exposed to the sandbox, writable only by trusted parent-side promotion code. No `/tmp` or host-home fallback.

### 6.2 Artifact-promotion procedure (11 steps)

Before execution the parent opens and keeps **non-inheritable directory descriptors** for the agent's `scratch/` and `artifacts/` and records an **allowlist of expected scratch-relative files** with per-file and cumulative byte limits (descriptors are never passed to the agent/sandbox). After the sandbox and all its processes exit, each allowlisted file is promoted separately:

1. Validate declared relative path; reject absolute, empty, `.`, `..`, symlinked components.
2. Walk parent components from the retained scratch-root descriptor with no-follow, directory-relative ops; never reopen by path.
3. Open leaf no-follow + nonblocking.
4. `fstat`: regular file, link count exactly 1, within per-file and cumulative limits.
5. Enforce limits again while reading.
6. Copy exactly the verified size, `fstat` again, reject changed identity/type/link count/size.
7. Destination: walk from retained artifacts-root descriptor no-follow; existing components must be real directories; create missing ones exclusively, then reopen and verify no-follow.
8. Create leaf exclusively without following links; verify regular file, link count 1; copy from verified source descriptor without reopening either path.
9. Equivalent race-safe APIs on non-POSIX.
10. Never recursively copy or glob scratch, extract archives into artifacts, or promote a symlink, FIFO, socket, device, directory, hard-linked, changing or oversized file.
11. If any check is unavailable or fails, discard; if decisive evidence, keep `needs_validation` with the exact promotion blocker.

**Consistency technique:** HUNTING.md and VALIDATION-AND-REPORTING.md carry this procedure as "one identical fenced block" for hunter and verifier prompts, stating "the same rules in the same order" as SKILL.md, prefixed "Reference only for you: the parent performs these steps; you never perform them." (Checked with `diff`: the two 34-line fenced copies are byte-identical.) The point is that sub-agents know exactly what will and will not count as evidence, without being given the power to do it.

### 6.3 run-metadata.json

Written before delegation with at least: `run_id`, `repo`, `target`, `source_ref`, `profile`, `scope_paths`, `budget` (null if unset), `execution_policy: "sandboxed-source-and-local-only"`, selected companion files, prior-run paths, shared-file owners, `run_status: "in_progress"`. Updated only when those facts change; candidate state lives in the ledger and findings. Terminal values: `complete` or `incomplete` + `incomplete_reason` (named reasons: `budget_cannot_fund_reconnaissance_and_reserves`, `critic_budget_exhausted`, `validation_budget_exhausted`; deferral reasons `budget_cannot_reserve_critics_and_validation`, `quick_profile_final_critic`).

## 7. Full audit planning

### 7.1 Coverage and prior runs (SKILL.md + RECONNAISSANCE.md "Prior-run input")

"No one pass is complete." Build a deterministic coverage plan before hunting; update after every agent result; parent alone updates the ledger. If prior runs exist, read **every** compatible `coverage-ledger.json` and `findings.json` first. Carry-forward rules:

1. Compare current source with each prior record/unit. "A prior source ref alone is not evidence that a path is unchanged."
2. **Prior `confirmed`, unchanged source** → carry into current candidate set with the same fingerprint, link to a current unit seeded `planned` with `prior_status: "prior_confirmed_same_source"`, exclude only that root cause from hunters, and send it through current final verification. The Phase 3 verifier that re-checks it becomes the unit's owner and moves it to `candidate`.
3. **Prior `confirmed`, changed source** → new planned `prior_confirmed_changed_source` revalidation unit; *not* on the hunter exclusion list; stays confirmed only if current independent validation re-establishes it.
4. Prior `needs_validation`, `deferred`, `blocked`, `out_of_scope` and changed-source units → **current work**. A still-external `needs_validation` can be carried only after its trace is re-checked against current source and linked (`prior_needs_validation`); it keeps its blocker. "These prior states never suppress a current unit."
5. Prior same-source covered unit may inform priority but stays visible. Prior `rejected` suppresses only the unchanged failed claim, not its unit.
6. Prior `quick` or scoped ledgers contribute only recorded evidence and gaps, "never an implied 'rest is fine.'"
7. Missing/incompatible ledgers are recorded, not treated as empty coverage. If none exist, say so in the final coverage statement; "Never imply that one run exhausts the target."

### 7.2 Run profiles and scope

| Profile | Ledger granularity | Waves | Critics | Verification |
|---|---|---|---|---|
| `quick` | surface × boundary × attack class; subsystem fixed to `profile/quick/all-in-scope-subsystems` | exactly 1 hunter wave | exactly 1 final critic; accepted gaps recorded `deferred` (`quick_profile_final_critic`) | one fresh verifier per candidate does both Phase 3 and Phase 5 |
| `standard` (default) | as written | until clean | post-wave critic + distinct final-clean critic | separate Phase 3 and Phase 5 agents |
| `deep` | split per subsystem **and lifecycle mode** | critic waves to a clean pass | same as standard | separate agents; `prior_covered_same_source` units get an independent second pass |

**Scoped run:** named paths, one subsystem, one companion domain, or a diff between two refs. In-scope units only; everything else `out_of_scope`, "never as `covered`". Scoped and `quick` runs present themselves as partial. "Profiles change breadth and redundancy, never the evidence bar."

### 7.3 Cost budget algorithm

Unit of account: **agent invocations across all phases.** One unit ≈ one hunter assignment; one surviving candidate ≈ 1 (quick) or 2 verifier calls.

1. **Strict gate before any recon agent.** Reserve: 4 baseline recon calls + 1 final critic (`quick`) or 1 post-wave + 1 distinct final-clean critic (`standard`/`deep`) + ≥1 verifier. Each extra focused-recon call repeats the gate. If the budget can't fund the minimum, launch nothing, ask for more budget / narrower scope / different profile; if unchanged, `run_status: "incomplete"`, reason `budget_cannot_fund_reconnaissance_and_reserves`, report that no audit pass ran.
2. Count recon, each post-wave critic and the final-clean critic as invocations.
3. **Reserve critics and validation before hunting.** Before every standard/deep wave: reserve its post-wave critic + the final-clean critic + verifier cost (≈1–2 per expected candidate; "when in doubt reserve 30% of the balance after critic reservation"). Never assign hunters into a reserve.
4. Assign hunters in priority order until the hunting allowance is spent; spend the post-wave critic immediately; keep final-clean and validation reserves intact.
5. Before a later wave, reserve its post-wave critic again; if critic + validation reserves don't fit, launch no hunters, mark the wave's units `deferred` (`budget_cannot_reserve_critics_and_validation`), use the retained final-clean critic to record the gap.
6. Before wave 1, update the estimate (seeded units, implied hunters, critic calls, validation reserve); if clearly insufficient, propose tighter scope or coarser profile "instead of silently thinning evidence".
7. If the final-critic reserve gets consumed: no hunters, defer all planned work, `incomplete` + `critic_budget_exhausted`, no complete-coverage claim.
8. **Validation overflow:** stop hunting, validate candidates in **fingerprint order**, set `incomplete` + `validation_budget_exhausted`; unvalidated fingerprints stay `candidate` ledger units, never enter `findings.json`, never relabelled `needs_validation`. Partial report allowed only if its first section says so and lists them. "Never exceed a user-set strict budget silently."

Hunter priority order when capped (HUNTING.md): (1) unauthenticated/lowest-trust surfaces first; (2) boundaries protecting the most valuable resources (credentials, cross-tenant data, code exec, release authority); (3) prior-run gaps, revalidation targets, changed source; (4) classes that historically yield confirmed findings for this target type. **Ties break lexicographically by `coverage_id`** so runs stay deterministic.

## 8. Core principles (SKILL.md)

1. **Require a boundary and result.** Every candidate names: lower-trust principal; accepted input/action; intended control; crossed boundary; affected principal/resource; concrete observed or owner-observable result. Not findings: missing best practice, guessed deployment behaviour, generic parser crash, self-impact.
2. **Use bounded local evidence.** Static analysis establishes the path; sandboxed local tests resolve behaviour (minimal harness, existing unit test, small parser fixture, dummy-tenant integration test, locally rendered config, bounded loopback client). Stop at the minimum effect; no persistence, post-fault or concealment material.
3. **Respect source visibility.** Deployment controls, proxies, provider settings, browser headers, identity policy, broker ACLs, packaging, topology are real controls; if decisive and absent from the repo, assume neither presence nor absence → `needs_validation` with the exact missing fact.
4. **Separate priority from certainty.** Only `confirmed` gets severity; overall ≤ demonstrated impact; `needs_validation` "is not a low-confidence confirmed vulnerability".
5. **Recommend the smallest effective source fix**: name the invariant, the narrowest change at "the last trusted decision point", plus a regression test. The audit never modifies target source.

### 8.1 Severity anchors (verbatim levels, paraphrased content)

- **critical** — unauthenticated actor gains code execution, full data-store access, or arbitrary account takeover.
- **high** — fully defeats an explicit control with real consequences: auth bypass, cross-tenant read/write, stored XSS affecting others, authenticated RCE, unauthenticated remote stop of a shared service.
- **medium** — real boundary violation with limited blast radius, uncommon preconditions, or narrow resource set.
- **low** — non-secret internals disclosed, or effect needing sustained effort for minimal gain.
- **informational** — confirmed minimal impact; mainly a prerequisite in a larger chain.

Discriminator: does the result "fully defeat an explicit control for an action with real consequences, or only weaken it?" and "If you cannot state the concrete damage, the severity is lower than it feels." Severity has separate `likelihood` and `impact` scores with reasons; the validator enforces overall ≤ impact.

### 8.2 Anti-patterns (10)

Checklist deviations as vulns; defence-in-depth advice with no reachable violation; live/shared testing; guessing provider/proxy/browser/identity/deployment behaviour; treating same-principal authority or self-impact as cross-boundary; overstating a parser/runtime effect; prose-only hunter results that can't be deduplicated; re-reporting carried same-source confirmed records "or using them as exemplars that anchor the hunt"; severity on `needs_validation`; writing the report before verification "or letting prose and JSON disagree".

### 8.3 Terminal states

"Do not end the run before one of exactly two terminal states: (a) all Phase 6 artifacts are written and both validators pass, or (b) `run_status: "incomplete"` is recorded with its exact reason and the gap is disclosed." "Never stop mid-phase."

## 9. Phase by phase

### Phase 1 — Reconnaissance (RECONNAISSANCE.md)

**Inputs:** target, prior ledgers/findings, budget. **Pre-steps:** write `run-metadata.json`, run the budget gate, create agent scratch roots and the ledger. Recon reads only local source/build/config; no endpoints, IdPs, registries, brokers, cloud APIs.

**Agents:** four parallel `research` agents, return structured facts, write nothing. Each prompt is a fenced `text` block, numbered asks, ending with a reference rule (`file:line`, repository-relative):

| Agent | Asks for |
|---|---|
| 1a Product, stack, local operation | product type/users/operators/trust-sensitive actions; languages, frameworks, build, runtimes, deployment models; entry points and subsystem boundaries; exact **offline** build/test commands + write locations + inputs processed ("Do not run them"); a source-grounded comparable product (or say none); missing toolchains/runtime facts |
| 1b Principals, authority, controls | each lower-trust principal and its by-design actions; authn/peer identity per surface; per-resource authz and tenant scope; process/browser/workload/CI/plugin/model-tool/device/local-IPC authority; privilege change, confirmation, revocation, recovery, fallback; which controls are source-visible vs dependent on unobserved deployment fact. "Do not infer live reachability." |
| 1c Entry surfaces, copies, sinks | every place lower-trust input enters (HTTP/browser, RPC/message, files/archives, CLI/env/config, plugins/deps/CI, cloud events/IAM selectors, **model context/tool arguments**, mobile/deep-link/webview, local IPC); transformations, stored/derived copies, sinks, limits, parallel paths |
| 1d Local execution & deployment visibility | small offline tests/fixtures for boundaries; loopback-only processes; commands that would fetch/publish/hit paid APIs/shared state (**mark prohibited**); deployed controls source can't establish; deterministic active path per deployment mode; whether the platform can enforce every sandbox control; whether trusted promotion is possible. Missing controls block execution / block scratch evidence. |

Extra focused recon agents for distinct deployment modes/subsystems; if the budget blocks one, seed a `deferred` unit and disclose.

**Outputs:**

- `architecture.md`, **hard cap ~1,000 words**: product/principals/authority/protected resources; comparable-software baseline (calibration only: "never to dismiss a demonstrated finding"; a shared defect pattern that mattered in practice *strengthens* a finding); stack, deployment paths, offline limits; entry surfaces and key source→sink/lifecycle paths; trust boundaries + strongest control on each; starting paths; prior gaps and revalidation targets; short companion-selection summary. Per-unit block maps stay in the ledger, not here, "keeps the architecture cap valid for large runs".
- **Companion selection rule:** select a companion because recon found the boundary in its "When to use this file" section, **not** because a language/dependency name appears. Don't exclude a visible boundary because another agent covers a related class.
- `coverage-ledger.json` (section 10).

### Phase 2 — Coverage-led hunting waves (HUNTING.md)

Parent assigns `planned` units to `general` hunters; related units in one subsystem may share a hunter; no unit silently unassigned. Before launch: unit → `in_progress`, `agent_id` set, scratch/artifacts created. Hunters write only to scratch; return one structured result.

**Required hunter prompt — 9 parts in fixed order:**

1. Two-sentence role preamble (goal: source-grounded invariant failures in assigned units; return exactly one JSON object per the contract at the end).
2. `architecture.md` verbatim.
3. Assigned coverage IDs, subsystem, boundary, starting paths, each unit's block map.
4. **Exact selected blocks copied verbatim**: the ordinary class block; from each companion its `Core discipline`, each chosen class subsection, `Universal moves`, `Validation rules`. "Do not send block or companion names alone."
5. Excluded blocks, each with a reason.
6. Core hunting method, then the promotion procedure block.
7. Core validation rules (candidate gate).
8. Carried same-source exclusions (fingerprint, title, root cause only) + peer-owned coverage IDs not to duplicate.
9. Scratch/artifact paths, agent ID, promotion allowlist and byte limits, the structured-result contract, and the `confirmed` + `needs_validation` schema branches **copied verbatim**.

Unexpected different boundary → return it under `uncovered`; parent makes a unit for the next wave.

**Core hunting method (fenced block, included in every hunter prompt)** — headings in caps: READ THE CODE AT DEPTH (follow input through parsing, identity, authz, normalization, state, derived copies, sink; read sibling/legacy/batch/retry/cancel/migration/error paths; compare controls for *equivalence* not presence; compare what one component guarantees vs what the next assumes). WORK FROM A CONCRETE INVARIANT (6 steps: principal + capability → accepted value/action/selector → the control that should reject/bind/isolate/limit/revoke → exact path after that decision → stop at smallest dummy effect → source change + regression case). DEPTH BOUND ("Stop a line of investigation as soon as the invariant is settled either way" and record covered/candidate/blocked/uncovered). TEST SAD PATHS AND DISAGREEMENTS (absent, empty, zero, negative, max, over-limit, duplicate, mixed encoding, stale, revoked, reordered, concurrent, partially migrated, failed dependency, rollback; compare canonicalization and units at every handoff; multi-step: each output is a prerequisite, don't assume later boundaries). **Variant analysis**: a high/critical candidate's reusable root cause triggers lexical/structural/logical variant search, but only within own units; variants without a unit go to `uncovered`. USE THE NARROWEST LOCAL CHECK (sandbox rules repeated; prefer existing unit test, minimal harness, dummy-tenant call, small malformed fixture, deterministic race schedule, locally rendered policy; no installs). Record exact input, command, limits, minimum result, allowlisted env only. Out-of-source facts (deployment, browser, provider, broker, OS, proxy, package, secret, identity) are "not proof either way" → `needs_validation` with exact observation and safe owner check.

**Candidate gate (fenced, every hunter prompt), 7 rules:** complete repo-relative trace + evidence including the strongest visible control; proposed `confirmed` needs bounded local observed result, meaningful cross-boundary impact, complete conditions, no visible preventing layer; don't upgrade crash→RCE, ordinary work→shared availability, same-principal action→privilege gain; non-visible decisive fact → `needs_validation` with exact blockers, no severity; missing best practice without affected principal is excluded/hardening, and "A candidate disproved by source is not needs_validation"; same source-derived fingerprint in every state, matching `^[A-Za-z0-9][A-Za-z0-9._:/@+-]*$`, never containing line/wave/agent/severity/verdict; empty array when nothing survives.

**Local validation boundaries:** allowed only in the sandbox (offline builds with present deps, loopback processes with dummy state, unit/integration tests, small fixtures, sanitizers, bounded fuzz/regression, deterministic concurrency, local browser/emulator with dummy accounts, rendered manifests/policy with dummy identities, mocked external/paid calls). Disallowed: live traffic, unstarted services, network installs, real accounts, prod data, shared queues/cloud/runners/registries/signing, publishing, stress, cost generation, anything past the minimum result. Missing sandbox/promotion capability "does not erase a source-grounded candidate".

**Structured hunter result (exactly one JSON object, no prose):** `units[]` (each: `coverage_id`, `disposition: covered|candidate|blocked`, `reviewed_paths`, `checks[]` with `agent_id`, `reviewed_paths`, `invariant`, `method: source|local`, `result`, `artifact` (null for source)), `candidate_fingerprints`, `unresolved`), `candidates[]` (schema-shaped but `proposed_verdict` instead of `verdict`), `hardening[]` (concrete non-finding notes), `uncovered[]` (surface, boundary, subsystem, attack_class, starting_paths, reason). Every assigned ID exactly once. Trace with >1 entry: `entrypoint` … `propagation` … `sink`. Unit `reviewed_paths` = union of its checks' paths. A verifier can add independently owned checks to a unit without taking ownership.

**Parent consolidation:** validate each unit result; reject duplicate/absent IDs, unsafe agent IDs, source checks with artifacts, local artifacts not promoted into that check owner's subtree; copy paths/checks/artifacts/fingerprints/unresolved into the ledger; keep `hardening` in a bookkeeping field for Phase 6. **A failed, malformed or unsupported conclusion leaves the unit `planned`** for reassignment. Run the ledger validator; "an invalid ledger cannot drive another assignment". Dedupe by fingerprint then root cause; one root cause with several entry paths = one candidate with the strongest complete trace; independent missing controls = separate fingerprints.

**Coverage-critic waves:** after every wave, one fresh `research` critic gets `architecture.md`, the full ledger with block maps, candidate fingerprints and states, prior-gap summary; reads source, writes/runs nothing; returns exactly `{missing_units[], reassign_ids[], resolved_prior_leads[], stop}`. Checks: unmapped entry points, unchecked parallel paths, missing lifecycle modes, selected companion classes without a unit, unjustified exclusions, units closed without paths/checks, prior `needs_validation` or changed-source gaps no unit addresses. "It proposes coverage, not findings." `stop` is advisory; the **parent's loop condition decides**. Parent rejects out-of-scope units, derives canonical IDs, dedupes, fails on collision. Reassignment archives the live terminal record into `attempts` with `reassignment_reason`, increments `wave`, gives a **fresh owner** with empty live evidence. Standard/deep: when a post-wave critic reports nothing and no `planned` units remain, spend the reserved **distinct final-clean critic**; complete only if it also finds nothing; otherwise loop. Early stop → defer untouched units, disclose. "Never use a silent wave or agent cap as evidence of complete coverage." Quick: one wave, one critic, accepted units/reassignments become `deferred` (`quick_profile_final_critic`) — "a pre-declared early stop". Scoped: critic's out-of-scope gaps recorded `out_of_scope`.

### Phase 3 — Independent candidate validation (VALIDATION-AND-REPORTING.md)

After the clean critic pass (or recorded early stop), consolidate by fingerprint/root cause, including carried prior confirmations. Every unique candidate → fresh `general` verifier that did not hunt it. Verifier receives **only**: the candidate, linked unit checks/artifact paths, needed architecture facts, relevant companion validation blocks, the promotion block, the execution boundary, all three schema branches verbatim, prior records with the same fingerprint. **It must not receive another verifier's conclusion.** It must re-read every cited location and rerun any decisive check it can do safely.

**Verifier prompt** opens: "You did not write this candidate. Try to refute it from repository source and bounded local evidence." Six numbered checks: verify every trace/evidence file, line, scope, description, first entry is a real lower-trust entrypoint and last is the sink; reconstruct the strongest visible controls (note comparable baseline as calibration only); independently reproduce the minimum result for proposed `confirmed`; check likelihood/impact/confidence/fix match evidence; for `needs_validation` decide whether the blocker is genuinely outside source/local (refuted → reject); preserve fingerprint. Returns `{"decision": "confirmed|needs_validation|rejected", "record": {...}}`; "A corrected record replaces the hunter's wording."

Verdict movements: promote `needs_validation`→`confirmed` only after independently establishing full path + result; demote to `needs_validation` when a specific deployment/runtime fact is unknown; `rejected` when source, local behaviour, a visible control, missing impact or impossible prerequisite refutes. "`needs_validation` is never a parking place for a speculative idea." **Malformed or prose-wrapped verifier output is discarded, not repaired**; re-run with a fresh verifier if budget permits.

### Phase 4 — findings.json

Parent writes all decided records sorted by fingerprint. Read the schema "immediately before writing"; `additionalProperties: false` so no hunter wrapper fields. Run both validators; fix every error. "Validator success proves format and ledger consistency only."

### Phase 5 — Fresh-eyes record verification

One fresh `research` verifier per final `confirmed` and `needs_validation` record, in parallel; checks the record, not the hunter write-up. (Quick merges 3 and 5.) Confirmed checklist: every path/line/scope/operation; real entry interface and exact input shape; every condition, parser/policy step, preventing layer, observed result; affected principal and impact; likelihood/impact separation; remediation enforces the invariant "without merely moving trust". Needs-validation checklist: path real and supports only the claimed root cause; each blocker decisive and not locally answerable; names a boundary and concrete possible result; ≥1 exact plan (`local` bounded fixture; `deployment` = owner observes config/identity/route/policy/runtime; "never send audit traffic to a deployment"); fingerprint consistent. Output: `{"decision":"verified","fingerprint":...}` or `{"decision":"replace","reason":...,"record":{...}}`.

**Material-replacement rule:** a replacement that promotes a verdict, or materially changes root cause, trace, execution input, observed result, impact or severity, is **not applied** until a *new* independent verifier (one that did not hunt, Phase-3-validate, or propose the replacement) re-checks and returns `verified`; repeat on further material changes. No budget/independence → remove the record from findings, keep its unit as an unresolved candidate, mark incomplete. Wording/line fixes may be applied directly. Rerun both validators after every replacement. A newly discovered separate root cause gets a new fingerprint and goes through Phase 3. `complete` only when every ledger candidate has an independent final disposition. "Do not verify only `confirmed` records. A misleading `needs_validation` handoff wastes owner time and can preserve a false premise."

### Phase 6 — Target-neutral reports

Only after Phase 5 passes. Prose is derived from records + ledger + hardening notes and "never change[s] a verdict, severity, blocker, or demonstrated impact".

- **REPORT.md** (7 sections): (1) profile, scope, budget spent vs planned, source ref, sandboxed-only statement, prior-run use, deferred/out-of-scope, carried and revalidated items; partial passes say so plainly, list unvalidated fingerprints, name any critic that didn't run; (2) one short posture summary; (3) confirmed table: severity, title, boundary, one-line result; (4) each confirmed finding: location, principal, native bounded reproduction, conditions, result, impact, priority rationale, smallest fix; (5) separate NEEDS VALIDATION table: title, trace, blocker, local next step, owner-observed check, no severity; (6) hardening notes and **positive source patterns**; (7) coverage summary (covered/candidate/blocked/deferred counts, exclusions, final critic result). Rejected records only mentioned to explain prior disagreements.
- **FINDINGS-DETAIL.md**: for each confirmed medium/high/critical: ordered trace and evidence, dummy attacker and resource, native input and exact bounded steps, observed output and the invariant it proves, conditions and containment, fix + regression case.
- **NEEDS-VALIDATION.md**: trace, evidence, blocker, boundary, each local/owner plan; prioritized, no severity, no live-test guidance.

"HTTP is one possible native interface, not the default." "A clean run may have zero confirmed records… without inventing LOW findings."

## 10. Coverage-ledger design (RECONNAISSANCE.md + validator)

- **Top-level JSON array** of units; one unit per material combination of **entry surface × trust boundary × subsystem × applicable attack class** (+ lifecycle in deep).
- Each dimension has a human label **and** a stable `canonical_refs` value: repo-relative entry path + exported scope, source-defined route/message identity, the source control defining the boundary, package path, and the attack-class block reference `FILE.md#<exact bold/heading text>` (heading text before any parenthetical, e.g. `Core discipline`). No lowercasing/slugging of labels.
- **`coverage_id` derivation:** each ref must be NFC, valid scalars, visible, no control/format/separator/default-ignorable code points, no surrounding whitespace → UTF-8 → RFC 3986 percent-encode everything except `A-Z a-z 0-9 - . _ ~` (uppercase hex) → join surface, boundary, subsystem, attack_class (+ lifecycle) with `::`. Never include wave, agent, verdict, severity or line. Sort lexicographically before each assignment.
- **Collision rules:** duplicate IDs fail; duplicate IDs with different semantic fields = "canonical identity collision" (never merge/overwrite); one semantic tuple under two different IDs = alias error.
- **Unit fields:** `coverage_id`, `canonical_refs`, `surface`, `boundary`, `subsystem`, `attack_class`, `starting_paths`, `ordinary_attack_class_block` (null only if none applies), `selected_companion_blocks` (class + the companion's `Core discipline`, `Universal moves`, `Validation rules`), `excluded_blocks` [{block, reason}], `prior_status`, `attempts`, `wave`, `status`, `agent_id`, `reviewed_paths`, `local_checks`, `result_fingerprints`, `unresolved` (+ optional `lifecycle`; parent may add bookkeeping fields).
- **`prior_status` enum (11):** `new` (first seen when compatible priors exist), `none` (no compatible prior ledger), `prior_confirmed_same_source`, `prior_confirmed_changed_source`, `prior_needs_validation`, `prior_deferred`, `prior_blocked`, `prior_out_of_scope`, `prior_covered_same_source`, `prior_covered_changed_source`, `prior_rejected_claim_changed`.
- **Status state table (enforced by validator):**

| Status | `agent_id` | `reviewed_paths` / `local_checks` | `result_fingerprints` | `unresolved` |
|---|---|---|---|---|
| `planned` | null | empty | empty | empty |
| `not_applicable`, `out_of_scope`, `deferred` | null | empty | empty | non-empty reason |
| `in_progress` | owner | empty | empty | empty |
| `blocked` | owner | both non-empty (partial evidence) | empty | non-empty blocker |
| `covered` | owner | both non-empty | empty | empty |
| `candidate` | owner | both non-empty | non-empty | optional |

- **Checks:** each has its own `agent_id`, non-empty `reviewed_paths`, `invariant`, `method`, `result`, `artifact` (null for source; for local exactly `agents/<check.agent_id>/artifacts/<file>`). Unit `reviewed_paths` must equal the union of check paths in both directions. Hunter and verifier checks coexist in one unit.
- **`attempts` (append-only archive)**: only `blocked`/`covered`/`candidate` states archived, with `reassignment_reason`; waves strictly increasing and below the current wave; each attempt's owner fresh; current owner must differ from every archived owner; an archived owner's checks or artifacts may not reappear in later attempts or the live state. If profile/budget prevents reassignment: increment wave, live `deferred`, null owner, empty evidence, stop reason.
- "The ledger is the coverage claim." An architecture summary, agent count or "auth reviewed" sentence is not evidence.
- Run the ledger validator after seeding, after every parent update, before Phase 6.

## 11. The findings schema, field by field (`report-schema.json`)

Top level: `type: array`, `items.oneOf` of three branches, each `additionalProperties: false`. A custom keyword `visibleContent: true` means "must contain at least one visible character". Shared sub-objects:

- `fingerprint`: string, `^[A-Za-z0-9][A-Za-z0-9._:/@+-]*$`, "stable source-derived identifier that does not change between validation states".
- `title`, `description`: visible strings.
- `trace[]` (minItems 1, unique): `{kind: entrypoint|propagation|sink, file, line ≥1, scope, description}`.
- `evidence[]` (minItems 1, unique): `{file, line ≥1, description}`.

**`confirmed`** (required: verdict, fingerprint, title, description, root_cause, intended_behavior, trace, evidence, conditions, execution, remediation, severity, confidence):
- `root_cause`, `intended_behavior`: visible strings.
- `conditions[]` (unique, may be empty): `{kind, description}`, kind ∈ `authentication_level, authorization_role, user_interaction, system_configuration, network_routing, environmental_dependency, data_state, timing_dependency, third_party_dependency`.
- `execution` ("Target-neutral reproduction in the target's native interface"): `attacker_perspective`, `payloads[]` (≥1, unique, **raw strings with no visibility rule**, so exact bytes like `""` or control chars are preserved), `instructions[]` (≥1 visible), `observed_result` (visible).
- `remediation`: `strategy` (required), `code_changes[]` of `{file_name, fixed_code}` (`fixed_code` may be empty).
- `severity`: `likelihood{score, reason}`, `impact{score, reason}` (scores ∈ informational|low|medium|high|critical), `overall_severity`.
- `confidence`: `{score: low|medium|high, reason}`.

**`needs_validation`** (required: verdict, fingerprint, title, description, claimed_root_cause, trace, evidence, blockers, validation_plan): `blockers[]` ≥1 unique visible; `validation_plan` `{local?, deployment?}` (schema allows `{}`; the semantic check requires ≥1 visible).

**`rejected`** (required: verdict, fingerprint, title, description, claimed_root_cause, trace, evidence, reason).

Note the deliberate field-name split: `root_cause` only on confirmed, `claimed_root_cause` on the other two. A record can't be one verdict with another verdict's vocabulary.

## 12. What the validators actually check (read from code and tests)

Both are single-file, zero-dependency CommonJS for Node; CLI usage `node validate-*.cjs <file>`; exit 0 with `PASS: N … valid` or exit 1 with `ERROR:` lines and `FAIL: N validation error(s)`.

### 12.1 `validate-findings.cjs`

- **Is a mini JSON-Schema interpreter**, not a general one: it supports exactly the keywords the schema uses (`$comment, additionalProperties (boolean only), const, description, enum, items, minimum, minItems, minLength, oneOf, pattern, properties, required, type, uniqueItems, visibleContent`) and **rejects the schema itself** if any other keyword appears (e.g. `format`, `maxItems`), so the schema can't silently promise something the code won't check. It validates the schema's own shape (types, regex compiles, enums unique, `visibleContent` only on strings).
- `oneOf` requires exactly one passing branch; if zero match but the `verdict` discriminator picks one branch, it reports that branch's specific errors (good diagnostics).
- Uses own-property checks only (inherited/prototype properties are not fields; `constructor` as a key is rejected).
- `minLength` counts code points; `visibleContent` = valid Unicode scalars (no lone surrogates) and at least one char not in White_Space/Cc/Cf/Default_Ignorable.
- `uniqueItems` uses a canonical key (sorted object keys, typed encoding, -0 = 0) with byte caps (1 MiB per key, 5 MiB per set).
- **Semantic checks beyond schema:** duplicate fingerprints; findings **sorted** by fingerprint; trace/evidence `line` positive integer; every `file` and `code_changes[].file_name` is a **safe repository-relative path** (no absolute, `~`, drive letters, `\`, `:`, empty/`.`/`..` segments, trailing space/dot, control/format/separator/default-ignorable chars, lone surrogates, Windows reserved names incl. `CLOCK$`, `CONIN$`, superscript `COM¹`); trace shape (single entry must be `entrypoint` or `sink`; multi-entry must start `entrypoint`, end `sink`, middle `propagation`); confirmed must not have `claimed_root_cause`/`blockers`/`validation_plan`/`reason`, must have visible `observed_result` and `remediation.strategy`, and **`overall_severity` rank ≤ `impact` rank**; needs_validation must not have severity/execution/remediation/reason/root_cause and needs ≥1 visible plan; rejected must not have severity/execution/remediation/blockers/validation_plan/root_cause.
- **Hostile-input hardening:** opens input with `O_NOFOLLOW|O_NONBLOCK` (refuses to run if the OS lacks them), requires a regular file (FIFOs rejected without blocking), 5 MiB cap checked by `fstat` and during reading, strict UTF-8 decode (no replacement chars), a pre-parse text scan enforcing 64-level nesting and 1,000-item arrays, a post-parse iterative (non-recursive) walk rejecting depth, oversize arrays and **repeated/cyclic object references**, error list capped at 100, generic messages for syntax errors (no parser-echoed bytes), and every diagnostic escaped (`\u001b`, `‮` etc.) and clipped at 256 chars so a malicious findings file can't inject terminal control sequences into the agent's or user's terminal.
- **What it does NOT check:** that cited files exist, that lines match the source, that payloads reproduce anything, or that prose matches JSON. That is the job of the Phase 3/5 agents. The skill says so explicitly.

### 12.2 `validate-coverage-ledger.cjs`

- Same safe-read path (no-follow, nonblocking, regular file, 5 MiB, strict UTF-8).
- **Streaming text preflight** before `JSON.parse`: a hand-written state machine that validates JSON structure and counts values, enforcing ≤10,000 top-level units, ≤1,000 items per nested array, ≤1,000 fields per object, ≤64 nesting, ≤500,000 total values; detects truncation, unterminated strings, mismatched containers. Then a second iterative preflight on the parsed document.
- Per unit: all 19 required fields present; four semantic labels are visible text ≤4,096 chars, trimmed; `canonical_refs` has exactly the four (or five with lifecycle) own fields, each a canonical ref (visible, ≤1,024, no forbidden chars, already NFC); `lifecycle` and `canonical_refs.lifecycle` appear together; **`coverage_id` must equal the recomputed percent-encoded ID**; `starting_paths` non-empty safe relative paths; `ordinary_attack_class_block` null or text; selected vs excluded blocks may not overlap; excluded blocks need a reason and are unique; enums for `prior_status` and `status`; `wave` positive integer; agent IDs safe.
- Checks: required fields; safe agent ID; non-empty safe `reviewed_paths`; visible `invariant` and `result`; `method` ∈ source|local; source ⇒ `artifact: null`; local ⇒ artifact under `agents/<that check's agent_id>/artifacts/`.
- **Path ownership**: unit-level `reviewed_paths` must equal the union of the checks' paths (each direction reported).
- **State table** (section 10) enforced for live units and archived attempts; `result_fingerprints` only allowed in `candidate`.
- **Attempts**: required fields incl. `reassignment_reason`; status ∈ covered|candidate|blocked; strictly increasing waves below the current wave; fresh owner per attempt; current owner fresh; earlier owners' checks and earlier local artifacts may not reappear.
- **Document level**: duplicate IDs; collision (same ID, different semantics); alias (same semantics, different ID); lexicographic order.
- Error output capped at 100 and control-escaped.

### 12.3 Tests

`node:test` + `node:assert/strict`, no deps. **34 findings tests**: producer-shaped document through the CLI; each branch accepted; one-line traces; empty/whitespace/invisible/lone-surrogate prose rejected in many fields; exact payload and `fixed_code` strings preserved (control chars allowed there); terminal-control escaping in direct and CLI output; line 0; prototype-property confusion; `oneOf` matched-0/matched-2; duplicate fingerprints; canonical uniqueness at the 1,000-item limit and byte caps; sort order; severity > impact; ~35 unsafe paths (incl. `‮`, `‍`, `COM¹`, `CLOCK$`, trailing dot/space); legitimate Unicode paths accepted; oversize input; invalid UTF-8; FIFO and symlink rejection; nesting/array limits; fingerprint pattern; needs_validation with severity; unsupported schema keywords (`format`, `maxItems`); output capping; a ~3 MB amplification document under `--max-old-space-size=64`; and a **cross-validator alignment test** that asserts both validators share identical regex sources/flags, identical shared LIMITS, and give identical verdicts over a path corpus and prose corpus. **31 ledger tests** (names listed in the source; they cover canonical ID derivation `route:POST /users` → `route%3APOST%20%2Fusers`, NFC rejection of `é`, collisions, aliases, ordering, block maps, artifact ownership, agent-ID safety, every state invariant, attempt archiving, owner freshness, evidence mixing, unsafe paths, control escaping, FIFO/symlink, 20,000-deep and 2,000,000-deep nesting under a 64 MB heap, 10,000-unit output capping, near-maximum multibyte IDs > 16 KB). I could not execute the tests in this sandbox (the auto-mode classifier blocked running downloaded code); counts come from the source.

## 13. Verdict definitions (consolidated)

- **confirmed** — complete repo-relative source trace + bounded local observed result + meaningful cross-boundary impact + complete conditions + no visible preventing layer; independently reproduced by a non-finder; gets likelihood, impact, overall severity, confidence, remediation.
- **needs_validation** — a specific, source-grounded boundary hypothesis whose decisive fact is outside source/local observation (deployment, provider, browser, IdP, broker ACL, packaging, missing sandbox or promotion capability). Must name exact blockers and ≥1 exact local or owner-observed plan. No severity. "Never a parking place for a speculative idea."
- **rejected** — a source-grounded candidate refuted by source, local behaviour, a visible control, missing meaningful impact, or an impossible prerequisite. Kept so future runs don't repeat it unless evidence changes; suppresses only that exact claim.
- Plus ledger-only state: an **unvalidated candidate** (budget ran out) — never in `findings.json`.

## 14. ATTACK-CLASSES.md — ordinary classes

Header framing: "choose and split based on Phase 1"; "Frame work as finding, validating, fixing, and prioritizing vulnerabilities"; no payload chains, live availability tests or shared-environment actions. Then a **router blockquote**: 10 target types → companion file (native/binary/kernel; AI/LLM/agent; HTTP/web/identity; client-side/browser; supply-chain/release; cloud/deployment; protocol/RPC/messaging; resource exhaustion; data isolation/lifecycle; desktop/mobile/local IPC).

All ordinary classes are `subagent_type: general` and self-contained (no Core discipline/Universal moves/Validation rules sections):

1. **Injection** — dangerous sinks by app type (web: SQL, HTML, shell, templates, paths, redirects, deserialization; libraries: buffers, parsers, format strings; CLI: shell construction, paths, env interpolation; services: queries, serialization, logs, LDAP/XPath; client-side → CLIENT-SIDE.md). Look for **stored-then-reused** injection, injection via field names/keys/headers/metadata, and into secondary systems (logs, caches, search, analytics).
2. **Access control** — right permission, right resource, right mechanism: weaker parallel path to the same state; body fields overriding restrictions; authn without authz; inconsistent checks on multiple paths; per-item checks in bulk/batch/export/import. Split auth bypass vs authz logic for complex models.
3. **Resource and file handling** — path traversal (symlinks, encodings, null bytes); SSRF (redirects, DNS rebinding, parser differentials); unsafe deserialization, zip slip, temp files; memory safety; file TOCTOU.
4. **Cryptography and secrets** — weak randomness; hardcoded/logged/URL/client-visible secrets; broken KDF, missing HMAC verification, nonce reuse; timing side channels; ECB/unauthenticated/static IV; crypto failure falling back to no crypto.
5. **Business logic** — state-machine skips/replays/partial-failure rollback; races with business impact (double-spend); numeric manipulation; access boundary vs business rule; implicit trust in stored/config/plugin data; time logic (expiry, skew, boundaries, timezones); default/fallback posture when config missing, flag off, dependency down, mid-migration.
6. **Feature abuse and data leakage** — export/backup as exfiltration; import/restore as injection; search/filter/sort as oracle; enumeration via errors/timing/size/status/reset flows; preview/draft/staging leakage and CDN caching; notification/webhook as SSRF.
7. **Chained vulnerabilities and trust boundaries** — multi-step failures (connect only concrete outputs); cross-component guarantee gaps (truncation, coercion, normalization, tenant, plugins); second-order use (field name → JSON path, slug → file path, string → regex/template/policy); **scope and capability growth** (token, API key, plugin, OAuth, MCP, AI capabilities broaden after delegation/refresh/caching/composition); timing/ordering windows; rollback/recovery re-applying current authz.
8. **Wildcard** — no category: strangest code, half-finished/experimental features, API calls the UI never makes, hidden endpoints/params/headers, feature mixing (localization + preview + caching; import + plugins + webhooks; OAuth + impersonation + API keys), git history (reverted fixes, commented-out auth, removed secrets), valid-account actions with shared impact, irreversible ops and approval binding, environment assumptions (local DB, accurate clock, trustworthy DNS, case-sensitive FS), what tests *don't* cover. "If a function has a comment explaining why it is safe, verify the explanation." Variables named `temp`, `hack`, `legacy` get read closely.
9. **Obvious things** — a literal checklist agent: grep for secrets (`password`, `secret`, `apikey`, `token`, `Bearer`, `-----BEGIN`), security TODO/FIXME/HACK/XXX, debug mode gating, working test/seed creds, unprotected `/debug /admin /test /status /health /metrics /env /.env /config`, committed `.env`/`credentials.json`/`*.pem`/`*.key`, `.gitignore` coverage, pinned deps and lockfile CVEs, `eval/exec/child_process/Function/vm.runInContext/import()` with dynamic input, CORS `*` + credentials, cookie flags, open redirects (`redirect, return, next, url, goto, continue`), TLS, stack traces in errors. "This agent does not need to be creative. It needs to be thorough and literal." But: "A flag is not a finding — trace the impact before reporting."

## 15. Companion files — every class

Every companion has the same skeleton: **When to use this file** (the selection trigger and cross-references to sibling companions) → **Core discipline** (a fenced block, "include in every agent prompt for this domain", ~5 bullets, always ending with the confirmed/needs_validation rule for that domain) → 3–6 groups of **attack classes** (bold name + 2–4 sentence hunting instruction, each group labelled `subagent_type: general`) → **Universal moves** (3–4 bullets) → **Validation rules** (5–6 numbered, "apply before reporting ANY finding here"). That uniformity is what lets the ledger reference `FILE.md#Core discipline` etc. as stable block IDs.

### 15.1 AI-AND-LLM.md (full detail — H-Stack will audit itself with this)

**When to use:** a model participates in a trust-sensitive decision: chatbots, RAG, persistent memory, tool-calling loops, MCP servers/clients, prompt building from untrusted input, code acting on model output. Key flow: "*untrusted content → model or memory → capability, authority, or sink*". Use alongside ATTACK-CLASSES.md; split large targets by retrieval, memory, tool dispatch, MCP, output.

**Core discipline (6 bullets, paraphrased):**
1. "Prompt injection alone is not a finding." Need a code-level boundary failure: content reaches another principal's context, invokes authority the requester lacks, discloses data they can't read, or drives a sink they can't reach.
2. Model output, memory, tool descriptions and MCP responses are untrusted inputs; point to the code that grants authority, trusts output, writes durable state, or feeds a sink.
3. "A guardrail prompt is not a security boundary." Only deterministic checks, resource-scoped authz, isolation, binding and constrained credentials count.
4. State attacker, affected principal, effective execution identity, resource, exact action, authority used, impact. A user intentionally using their own authority through a model is not a delegation defect.
5. **Authorization and action binding are separate controls.** Attacker content causing an action under a victim's valid authority, which the victim didn't intentionally request or approve, is an action-binding failure.
6. Confirmed vs needs_validation rule (provider, deployment, model, renderer, identity behaviour).

**Context, retrieval and memory classes:**
- **Indirect injection through retrieved or ingested content** — attacker writes a RAG doc, indexed page, file, email, issue body, tool response or metadata that enters another principal's context. Trace who can write each source, retrieval scope, whose session consumes it, what capability is enabled; check isolation, resource authz, and binding to the consumer's intent separately. "The defect is a missing deterministic control, not persuasive text by itself."
- **Cross-session or cross-tenant context bleed** — history, embeddings, retrieval results or prompt caches keyed too broadly; check tenant/ACL filters in the query itself and every cache key.
- **Persistent memory poisoning** — attacker content or model summaries written to memory that later shapes another task/user/privileged session. Review who can create/update/merge/delete memory; provenance and tenant scope; whether low-trust observations become durable *instructions or facts*; whether retrieval distinguishes user preferences from tool policy. Not a finding: memory a user saved for their own intentional use.
- **Prompt role and provenance confusion** — untrusted text impersonates system message, prior turn, tool result, policy or memory record via concatenation, untyped history, caller-controlled role fields, serialization round trips losing labels; must change a deterministic trust decision or reach a capability.

**Tool and action classes:**
- **Tool-argument injection into a downstream sink** — model arguments reach SQL/shell/file/URL-fetch/privileged APIs without handler-side validation; treat the tool schema as input parsing. "Structured output narrows shape; it does not establish authorization, safe paths, safe URLs, or query semantics."
- **Excessive agency and confused-deputy authority** — service identity/broad credential while the handler doesn't re-check the requester's permission on the named resource; verify effective identity and whether the caller could do it through the normal product. Shared credential with enforced per-user scope is fine.
- **Action-confirmation and approval binding** — approve one action, execute with changed arguments, different resource/principal, or a later turn; also attacker content causing a side effect under the victim's authority without intent. Binding must cover normalized tool name, **complete argument object**, requester, target, amount, expiry, batch membership; retries and resumed sessions must not let one approval authorize a mutated or duplicate side effect.
- **Tool-schema and dispatcher disagreement** — aliases, extra fields, duplicate keys, coercions, nested free-form objects, out-of-range values interpreted differently by schema vs dispatcher/handler; re-validate where values become resource selectors or security options.
- **Unbounded delegated action loops** — a bounded request enqueues repeated spend/send/mutation/external API work with no per-request budget, per-action authz, cancellation or idempotency; confirm via code-level accounting and a locally bounded loop, never by exhausting a service.

**MCP and sub-agent classes:**
- **Sub-agent and MCP trust inheritance** — delegated task receives full session, credentials, memory or capabilities instead of least authority; check principal/tenant carried into each call, capability narrowing, credential audience, and whether **delegated results are treated as untrusted on return**.
- **MCP server and tool identity confusion** — routing by attacker-influenceable server/tool names, request IDs, resource URIs, model-chosen aliases instead of the authenticated connection and outstanding request; can two servers claim the same tool; does reconnect change binding; can one server's response satisfy another's pending call.
- **MCP metadata and schema as policy** — tool descriptions, resource metadata, prompts, completion hints, schemas from an MCP peer trusted as policy/authz; "can guide the model but cannot grant capability"; find the deterministic allowlist, server identity check and handler authz that stay authoritative.

**Output and disclosure classes:**
- **Insecure output rendering** — model output into executing HTML/Markdown/template/URL/command sink without encoding/policy; browser cases via CLIENT-SIDE.md; renderer outside repo → `needs_validation`.
- **Sensitive context extraction** — assembled context contains credentials, other users' data, private source or access-granting policy values, and user-influenced output exposes them. Disclosing generic instructions is not a finding.

**Universal moves:** draw **four maps first** (execution identities, capabilities, writable context/memory sources, output destinations) and connect start principal to end authority; start at side-effecting tools and walk backward through dispatcher, schema, confirmation, context, retrieval, ingestion; start at durable memory reads and trace every writer; compare direct/queued/retry/resume/batch/delegated paths; "The strongest gate must apply after arguments are final and before every side effect."

**Validation rules (6):** name boundary and observable result (attacker, affected principal/resource, execution identity, target, unauthorized/unrequested action or disclosure); confused-deputy: prove handler lacks requester-and-resource authz *and* attacker can't do it normally; action-binding: prove attacker content caused an action the principal didn't intend/approve ("Valid generic authorization does not establish that intent"); memory/retrieval: cite **both** the attacker-controlled write **and** the later cross-principal read or privileged decision; action binding: compare the approved normalized object with the one the handler uses, confirm a locally observable unrequested/mutated/duplicate action; schema disagreement: compare normalized validated object vs handler object; MCP identity: verify connection, request correlation, tool namespace, effective credential, else `needs_validation`; confirmed/needs_validation rule.

**Mapping to H-Stack's own attack surface** (for N55): untrusted content = web pages, issues, PR comments, fetched docs, MCP results, third-party skills; memory = H-Stack memory/lessons files, CLAUDE.md edits; capabilities = Bash, Write/Edit, git push, MCP tools, Artifact publish; approvals = permission prompts, plan approval, hook `ask` decisions; delegation = subagents, Workflows, remote sessions. Classes that apply directly: indirect injection, persistent memory poisoning, provenance confusion (hook `additionalContext` text impersonating system/policy), approval binding (approve a plan then execute a different diff), unbounded delegated loops (`/loop`, Routines, fan-out), sub-agent trust inheritance (subagents inheriting full tool sets), MCP metadata as policy (tool descriptions as instructions).

### 15.2 SUPPLY-CHAIN-AND-RELEASE.md (full detail — H-Stack is itself a plugin distributed via a marketplace)

**When to use:** dependency resolution, untrusted contributions, CI, release artifacts, signing/promotion, plugins, updates. "Trust handoffs from source and dependency to the artifact a user runs." Defers loader flaws to MEMORY-SAFETY, runtime workload authority to CLOUD. Split into dependency resolution, CI isolation, artifact provenance, release authorization, updater/plugin trust.

**Core discipline (5):** a mutable or known-vulnerable dependency isn't a finding alone (show who influences resolution, which build consumes it, what boundary follows); follow integrity across **every handoff** (source identity → resolved inputs → build worker → artifact identity → test result → signature/attestation → promotion → update consumer); "CI configuration is authorization code" (which event triggered, whose code runs, which secrets/tokens exist, what it may publish or mutate); "A checksum fetched from the same untrusted location as the artifact does not establish independent integrity" (identify trusted root and failure behaviour); confirmed for in-repo control flow with bounded local validation, needs_validation for branch protection, hosted runner, registry, signing service, production promotion.

**Dependency and build-input classes:**
- **Dependency source and namespace confusion** — resolver picks unintended public/private namespace, fallback registry, mirror, repo or URL; review names, source priority, lockfile/checksum use, alternate build files, platform-specific resolution, first-install vs update behaviour.
- **Mutable and unbound build inputs** — branches, tags, unverified submodules, downloaded tools, generated assets, remote includes, **floating CI actions**, container tags that can change without review; need a lower-trust writer and a path into trusted output; "reproducibility by itself does not prove authenticity".
- **Generated-source and codegen provenance gaps** — schemas, vendored archives, generated clients, localization, **documentation examples**, binary blobs shipped without the same review/integrity gate as source; compare regeneration with committed output, verify who controls input and generator.
- **Build-context inclusion** — secrets, local config, repo metadata, test fixtures, developer artifacts land in a package/image because build context and ignore rules exceed intended inputs; confirm a real credential/private data is exposed.

**CI and automation classes:**
- **Untrusted code in a privileged workflow** — PR, issue comment, fork, dependency update or external event runs contributor code with protected secrets, write tokens, deploy authority, trusted runner; compare trigger, checkout ref, approval gate, environment protection, permission narrowing; don't assume host defaults not in source.
- **Workflow command and expression confusion** — branch names, commit messages, issue fields, artifact names, matrix values, generated output into shell, template expressions, paths or privileged inputs without canonical validation.
- **Cache, artifact, and workspace trust mixing** — lower-trust job populates cache/artifact/workspace a higher-trust job restores and executes or releases; review cache keys/namespaces, producer identity, digest binding, retention, re-resolution by mutable name.
- **Automation identity overreach** — CI permissions beyond need and untrusted inputs select the resource; missing least privilege alone is hardening.

**Release and update classes:**
- **Build-to-promotion substitution** — tests, review, signature, publication refer to mutable tags/filenames/channels/IDs rather than one immutable digest; check every copy, repack, arch merge, provenance step.
- **Release authorization and signing-policy gaps** — release/signature accepted from wrong workflow, repo, branch, environment, key role or threshold; consumer must validate attestation identity claims, not just "a valid signature"; rotation/expiry/revocation fail closed.
- **Update metadata and rollback confusion** — updater authenticates payload bytes but not version, product, platform, channel, target path, expiry, rollback state, or mixes metadata and payload from different transactions; atomic install and recovery; "A signature API call without policy binding is incomplete."
- **Plugin and extension trust expansion** — extension gains host authority beyond declared scope; lower-trust publisher replaces another's identity; **install/update hooks run before authenticity and capability checks**. "Intended installation of arbitrary same-user plugins is not a privilege boundary."

**Universal moves:** walk backward from a released digest/installed update to every source, generated input, credential, worker, cache, test result, authz decision; compare untrusted and protected workflow events side by side, mark each persisted channel crossing, require immutable identity + producer trust; review revoked key, failed download, missing attestation, partial platform release, rollback, registry outage ("The failure policy is part of release integrity").

**Validation rules (5):** name lower-trust actor, controllable source/cache/artifact/metadata, consuming trusted job/updater, resulting unauthorized publication/code inclusion/secret disclosure/privileged execution; prove artifact identity across the broken handoff (a different mutable name or unbound digest must reach a real consumer); verify package-manager/host/registry/signing defaults for the pinned version, unknown hosted controls → needs_validation; bounded local validation with harmless fixture repo, dummy credential marker, local registry/config, non-production namespace, never publish; confirmed vs needs_validation.

**Mapping to H-Stack:** the marketplace entry (`.claude-plugin/marketplace.json`) points at a git source; installs track a mutable branch (no digest pinning); auto-update pulls new skill text and hooks that run with the user's privileges; hooks are "install/update hooks" in effect; skills referencing external URLs or `npx` packages are mutable build inputs; any CI that runs on PRs is "CI configuration is authorization code". See `ideas-for-h-stack.md`.

### 15.3 MEMORY-SAFETY-AND-BINARY.md

When: untrusted bytes in memory-unsafe/privileged context (C/C++/ObjC, Rust `unsafe`, FFI, kernel, parsers, daemons, firmware, loaders, runtimes, JITs). Core discipline: re-derive bounds/lifetimes from attacker inputs and all callers against the worst case; crash/panic/sanitizer finding counts only if realistic untrusted input reaches it, don't infer RCE; validate with sanitizers, deterministic concurrency tests, existing fuzz targets, debugger fault classification, no post-corruption technique; assembly/JIT/custom allocators/intra-object/foreign libs may escape sanitizers. Classes: **Bounds/integer/representation** — OOB read/write (recompute headroom after prefixes/alignment/padding/terminators; read before length trusted); integer overflow/underflow/truncation/signedness (`a - b` with `b > a`, `count * size`, near-max adds, negative→unsigned, 64→32 narrowing, `-1` sentinels); unit and pointer-depth confusion (bytes vs elements vs code units vs pages); uninitialized data (needs observable consumer). **Lifetime/type/concurrency** — UAF/stale view/double free (callbacks, wait queues, timers, iterators, raw pointers, every error/cancel/close/realloc path; drain observers); type confusion/invalid downcast; refcount/ownership races; shared-state races and TOCTOU (repeatable schedule or TSAN, else needs_validation); lock-order/deadlock/starvation (availability only if bounded input stops shared progress). **FFI/ABI** — pointer-length/ownership contract mismatch (null, zero length, aliasing, callback retention); layout/alignment/enum disagreement (`repr`, packing, endianness); unwind/exception/thread-affinity violations. **Binary loading/runtime** — library/plugin search-order trust; missing artifact identity/signature binding (verify one, map another); malformed binary metadata/relocation; JIT and generated-code consistency (diff optimized vs unoptimized); unload/reload/teardown safety. **Kernel/privileged interface** — user-copy bounds and double reads; privileged object lifecycle and dispatch consistency; under-authorized powerful interfaces. Universal moves: audit fixes and duplicated paths for the same shape; build a per-parser/FFI table (accepted length/type, checked representation, allocation owner, consumer, thread, teardown) — "Most native findings are one disagreement in that table"; existing corpora + small fixtures. Validation: realistic entry + violated invariant; classify effect precisely; narrowest harness, verify sanitizer covers the faulting op; concurrency via deterministic schedule; loader: checked identity ≠ mapped identity + lower-trust writer; confirmed vs needs_validation.

### 15.4 WEB-PROTOCOL-AND-AUTH.md

When: HTTP parsing, caching, browser auth, identity (apps, APIs, proxies, CDNs, gateways, sessions, JWT, OAuth/OIDC, SAML, recovery, MFA, passkeys, API keys, mTLS). Notes "A single server behind an unobserved managed proxy has little source-confirmable smuggling surface". Core discipline: framing/cache findings need two interpretations of the same request/key, name both and the normalized value each side; for every credential find signature verification and every binding (issuer, audience, origin, RP, client, session, principal, resource, assurance, expiry, one-time state); Host/Forwarded/X-Forwarded-*/Origin/Referer/redirect/callback state are trust decisions; missing header/flag/MFA/rate limit is not a finding alone. Classes: **framing/cache** — request desync (multiple CL, TE, H2/H3 downgrade, header normalization, CR/LF); cache poisoning via unkeyed input; cache deception/private-response caching; Host/forwarded-header trust; response-header injection. **Browser session** — ordinary CSRF (every cookie-authed mutation incl. method-override and legacy; SameSite only for contexts actually used; login CSRF); session fixation and invalidation (rotate on login/switch/MFA/impersonation; invalidate on logout/password change/revoke/disable incl. websockets and caches); cookie scope and transport. **Federated identity** (first establish role: AS vs RP) — JWT verification and claim binding (pinned alg/key, exp/nbf/aud/iss, `kid`/`jku`/`x5u` as untrusted selectors, decode-without-verify); OAuth/OIDC request and callback binding (redirect_uri, session-bound state, PKCE, nonce, selected-IdP binding; retry/mobile/account-link routes); SAML signed-object binding (the signed element is the one used; XML parser config; canonicalization; replay). **MFA/passkey/account transitions** — MFA enrollment and assurance downgrade; step-up binding and bypass; WebAuthn/passkey verification (challenge, RP ID, origin, credential, userHandle, algorithm, UV; counter only if treated as clone signal); account linking and identity collision; password reset and broader recovery. **API keys/mTLS** — key scope and resource binding (prefix vs full secret, publishable vs secret, revocation caches); key exposure and unsafe transport ("A public identifier called a key is not a secret"); mTLS peer vs application identity (proxy-terminated mTLS must strip incoming identity headers); certificate lifecycle fallback (fail-open to bearer/anonymous). Universal moves: walk issue→store→transmit→consume→refresh→revoke; "The effective policy is the weakest parallel path, not the most polished UI"; diff parser/proxy/router/cache normalization with identical local fixtures; draw account before/after graphs for recovery/linking. Validation: source-visibility gate; framing/cache: both components + divergent parse; token/MFA/etc: cite verification line + missing binding, prove the server accepts the invalid transition; CSRF: ambient credential, route, accepted cross-site shape, cookie policy, missing check (read-only or bearer-only routes don't qualify); verify framework defaults, unknown → needs_validation ("do not turn an unverified critical claim into a lower-severity confirmed finding").

### 15.5 CLIENT-SIDE.md

When: browser trust decisions/rendering (SPAs, extensions, webviews, service workers, offline apps), including sources the server never sees (fragments, `window.name`, `postMessage`, cached content). Core discipline: need a controllable source and executing/disclosing sink; impact must reach a victim session, another origin or shared persistence (self-XSS not a finding); framework escaping, SOP, CSP, COOP/CORP, SW scope, noopener defaults are real controls; storage/caches are per-origin and may outlive login. Classes: **DOM/object state** — DOM XSS; DOM clobbering (markup survives + security-relevant use); prototype pollution + **gadget** (pollution alone not enough). **Cross-origin messaging/network** — `postMessage` origin and `event.source` (substring/prefix/regex checks are not checks; send-side `*`); cross-site WebSocket hijacking; credentialed CORS reflection. **Service workers/storage** — SW registration and scope takeover; SW cache and identity confusion (personalized responses served after logout/switch); browser-storage disclosure and stale authorization; cross-context storage/BroadcastChannel confusion. **Cross-site leaks** — XS-Leaks/state oracles (one concrete secret-bearing predicate); window/opener state disclosure. **UI redress/navigation** — clickjacking (sensitive action must complete framed); client-side navigation confusion (`javascript:`/`data:`; reverse tabnabbing only when opener kept). Universal moves: start from sinks and trace back; test account switch, logout, SW update, offline fallback, stale tabs with local origins and dummy accounts; XS-Leaks only for proved predicates. Validation: cite source, sink, policy, affected origin/session, observable result; pollution needs write + gadget; clobbering needs survival + use; SW/storage need lifecycle reachability to a different account; messaging/CORS/WS/XS-Leaks show exact validation + protected state and that CSP/COOP/CORP/SameSite don't already block.

### 15.6 CLOUD-AND-DEPLOYMENT.md

When: cloud identity, IaC, containers, Kubernetes, mesh, serverless, **edge workers**, ingress, object storage, managed services, env-specific config. "Source often expresses intent rather than live fact." Core discipline: don't infer live exposure from a manifest (which environment consumes it, overlays, active path); map workload identity to operations; broad policy is a finding only if lower-trust input reaches an unauthorized action; ingress/proxy/mesh/metadata/admission count only when configuration and attachment are visible; "Secret references are not secret disclosure." Classes: **identity/IAM** — workload identity overreach; cross-account/tenant role confusion (external IDs, token exchange, federation bound to source account/audience/repo/namespace); app authz delegated to cloud metadata (caller-supplied identity headers/tags/labels). **Ingress/network/control plane** — unexpected service or management-plane reachability (a repo-controlled public route to a sensitive handler can be confirmed); trusted-proxy and mesh identity bypass (alternate ports, health/legacy paths, fail-open without proxy); metadata and internal-service reachability (SSRF to IMDS/control sockets). **Container/orchestration** — host or control-plane capability exposure (privileged, host namespaces/paths, runtime sockets, SA tokens; missing seccomp alone is hardening); admission and policy path inconsistency; namespace and label trust confusion. **Config/secret lifecycle** — security-control precedence drift (dev values, chart defaults, env vars, flags, feature gates, per-region overlays; "Render the final configuration for each maintained deployment"); secret exposure across workload boundaries; credential renewal and outage fallback. **Managed storage/events/edge** — object and signed-URL policy confusion; event-source identity confusion (provider-signed envelope, topic, account, region, replay; push/pull/retry/DLQ); **edge/runtime boundary mismatch** (edge assumes secret/API/FS/isolation/tenant policy different from origin; fallback to origin changes authority or cache). Universal moves: render every maintained environment into a matrix (port, identity, peers, secrets, resources); follow a lower-trust request/object/label/event into cloud policy; diff deploy/migration/restore/maintenance/failover/emulator paths and behaviour when mesh/admission/identity/secret/policy services are down. Validation: active source path and effective object; name caller, identity, selector, resource, operation; verify provider defaults at the pinned version, don't assume public IP/IMDS/firewall; local rendering/policy eval/emulators with dummy identities only.

### 15.7 PROTOCOLS-RPC-AND-MESSAGING.md

When: gRPC, GraphQL transports, Cap'n Proto, Thrift, Protobuf, custom binary protocols, streaming RPC, webhooks, brokers, queues, pub/sub. Split by producer/consumer pair, peer role, sync vs streaming vs async. Core discipline: "'Internal' is not authentication"; schema validation proves shape, not provenance/authority/ordering/safe values; broker vs application guarantees differ (write down retry, ordering, ack, dedup, transactions first); parser disagreement needs two concrete consumers and one divergent value. Classes: **framing/schema** — message boundary/canonicalization disagreement; union/enum/default confusion; envelope vs payload identity mismatch. **RPC identity/authz** — interceptor and method-path inconsistency (unary vs streams, reflection, health, gateway-transcoded); peer identity → application-principal confusion; per-item and streaming authz gaps (revocation mid-stream); callback and reply-correlation confusion. **Broker/queue isolation** — topic/routing-key/subscription scope (tenant text in payload is not isolation); dead-letter/retry/diagnostic disclosure; untrusted producer treated as control plane. **Replay/ordering/transactions** — duplicate delivery and idempotency gaps; out-of-order/stale acceptance; ack/commit ordering; partial multi-consumer transitions. Universal moves: draw producer→broker→gateway→consumer→storage per message family with peer, authoritative fields, validation, side effect at each hop; feed the same fixture to every schema version/binding; compare normal/retry/DLQ/replay/migration/reflection/stream/gateway routes. Validation: name producer, message, channel identity, affected resource, unauthorized result; disagreement: both parsers + divergent value (safe rejection by either side prevents confirmation); replay/order: actual delivery guarantees + bounded in-memory reproduction; check all interceptor/ACL/gateway/consumer layers.

### 15.8 RESOURCE-EXHAUSTION-AND-AVAILABILITY.md

When: untrusted work consumes CPU, memory, disk, connections, worker slots, **paid APIs**, queue capacity, or can deadlock/crash a shared service. "Never validate by stressing a shared or live service." Core discipline: need input-to-cost path + missing effective bound + impact on another user, shared service, safety function, or **operator-owned spend**; a missing rate limit isn't enough (check body/message/file caps, concurrency, queues, deadlines, DB constraints, gateways, per-tenant quotas); no stress tests (asymptotic analysis, small growth points, mocked paid calls, strict local limits); state attacker cost, service work, persistence, scope, recovery. Classes: **amplification** — superlinear parsing/matching/evaluation (ReDoS, nested parsing, template expansion, hash flooding); decompression/representation amplification; DB/downstream query amplification. **Accumulation** — unbounded buffering and cardinality (sessions, cache keys, metric labels, subscriptions, pending jobs); FD/handle/temp leaks; detached work after cancellation. **Quota/scheduling** — pre-authentication work imbalance; quota-accounting scope and reset gaps; worker/pool/priority starvation. **Failure/recovery** — reachable fatal error or deadlock; retry storm and fail-open amplification; poison-record/head-of-line blocking; unsafe recovery and capacity rollback. Universal moves: input-to-resource table (earliest size gate, work before auth, fan-out, persistence, shared pool, limit owner, cleanup, recovery); compare aggregate vs per-object limits ("Ten thousand valid one-byte items may evade a per-message cap"); isolated fixture with strict limits, mock paid calls. Validation: name input, requester work, amplification/retained resource, blast radius, recovery; confirm no visible upstream bound; superlinear: complexity + bounded growth; leaks: repeatable retention; fatal: supervisor isolation; prioritize by low attacker work, unauth reachability, cross-tenant scope, persistence, poor recovery.

### 15.9 DATA-ISOLATION-AND-LIFECYCLE.md

When: multi-tenant/ACL'd data, derived copies (search/index/cache/analytics), object links, export/restore, migrations, deletion/revocation/retention promises. Follow one data item through every copy. Core discipline: "A tenant or owner field on a record is not isolation" (find the query/key/path/policy/RLS that enforces it on each path); trace derived copies; deletion/revocation are lifecycle contracts across current, historical, cached, indexed, exported, restored, queued copies; privacy preference ≠ vulnerability without an explicit boundary. Classes: **tenant/object isolation** — missing tenant/owner enforcement (direct, nested, background, admin, import, legacy); composite-key and namespace collision (cache keys, object paths, search doc IDs, temp files, dedup keys omit tenant/env); policy vs query disagreement (RLS vs ORM scopes vs raw/`unscoped`/service clients); blob and signed-reference overreach. **Derived data/disclosure** — search/cache/index ACL drift; analytics/logs/traces/diagnostics as alternate readers; enumeration and aggregate oracles. **Export/backup/restore/migration** — export/backup scope expansion; import/restore authority expansion; migration default and ownership confusion; backup and replication boundary drift. **Deletion/revocation/lifecycle** — soft-delete/tombstone bypass (and re-registration of soft-deleted identifiers); stale authorization and derived-copy use; retention and queued-work overrun; restore reintroduces invalid state. Universal moves: draw one record's write/query/cache/index/event/export/backup/delete/restore paths with principal and tenant on every edge; two dummy tenants through the same local methods before and after ACL change, deletion, account switch, restore; start at bypass clients, background jobs, migrations, global uniqueness, cache keys. Validation: name attacker, data, owner, alternate copy/operation, result; cite both the intended policy and the disagreeing path; prove with dummy tenants; external storage/retention → needs_validation.

### 15.10 DESKTOP-MOBILE-AND-LOCAL-IPC.md

When: desktop/mobile apps, privileged helpers, updaters, local daemons, webview hosts, deep links, native-messaging hosts, local IPC. Name the realistic attacker's starting capability (downloaded document, remote web content, another app, another OS user, sandboxed process, lower-privilege account). Core discipline: self-harm within the same account isn't a boundary; "Paths, process names, bundle/package IDs, and claimed sender fields are not peer authentication" (use OS peer credentials, code identity, capability handles); bridges/helpers must authorize each operation and final resource after parsing; OS sandbox, signing, entitlements, permissions, keychain ACLs, exported-component policy are real controls when visible. Classes: **deep links/callbacks** — custom-scheme/deep-link ambiguity; app and account handoff confusion; file-open and intent authority confusion (share intents, drag/drop, clipboard, notification actions). **Webview/bridge** — navigation-origin to bridge confusion (validate at call time and after every navigation/redirect/subframe/popup/error page); over-broad native bridge capabilities; webview file and universal access. **Local IPC/exported components** — IPC peer-authentication gaps (Unix sockets, named pipes, XPC, Binder, D-Bus, native messaging, loopback listeners); claimed principal vs channel identity; exported service/activity/receiver/provider overreach; IPC lifecycle and correlation confusion. **Privileged helper/local files** — helper as confused deputy (sudo/polkit/UAC/XPC rules); install/update/repair path trust; local file ownership and TOCTOU (descriptor-relative ops); credential-store and local-secret boundary mismatch ("Plaintext readable only by the same intended OS account is not automatically a vulnerability"). **App state/device lifecycle** — account switch/logout/device restore leakage; pending-action and user-presence confusion (confirmation bound to normalized action, resource, account, foreground state). Universal moves: enumerate every process, component, endpoint, scheme, file association, origin, helper with OS identity, privilege, caller, operation; read final packaging inputs (merged manifest, entitlements, installer rules, native-messaging registration); dummy profiles on isolated machine/emulator. Validation: attacker capability, principal crossed, channel, accepted argument, result; confirm OS controls; bridges: navigation control + native sink; IPC: peer auth + per-resource authz; helpers: final normalized destination.

## 16. How the skill is written (techniques worth copying)

1. **Progressive disclosure by phase and by domain.** SKILL.md (192 lines) holds principles, modes, safety, planning; each phase lives in its own file; ten domain companions load only when recon selects them. The parent reads phase files as it reaches them; hunters receive only the blocks they need.
2. **Prompts are data, not prose.** Every sub-agent prompt is a fenced block with a fixed part order and an exact JSON return contract. Parent copies blocks **verbatim** ("Do not send block or companion names alone"), so every agent receives identical rules regardless of how the parent paraphrases.
3. **Identical repeated blocks.** The 11-step promotion procedure appears three times with the same text; the "same rules in the same order" sentence makes drift reviewable.
4. **Stable block IDs.** Companion headings (`Core discipline`, `Universal moves`, `Validation rules`, bold class names) double as machine identifiers in the ledger (`FILE.md#<heading>`), so hunter prompts are auditable from the ledger alone.
5. **Uniform companion skeleton.** When to use → Core discipline (fenced, "include in every agent prompt") → classes (bold name + 2–4 sentences: *what the bug is*, *what to compare*, *what doesn't count*) → Universal moves → Validation rules ("apply before reporting ANY finding here").
6. **Every class carries its own "not a finding" sentence.** E.g. "Memory intentionally saved by a user… is not a cross-boundary finding"; "Intended installation of arbitrary same-user plugins is not a privilege boundary". This is the main false-positive control and it lives next to the hunting instruction, not in a separate list.
7. **Calm, imperative, technical wording.** No capitals-for-emphasis outside the core method's section labels, no "YOU MUST", no persona. Rules are stated as definitions ("`needs_validation` is never a parking place…") and as named states with named reasons (`quick_profile_final_critic`).
8. **Determinism everywhere:** canonical IDs, lexicographic sorts, tie-break by ID, fingerprint-order validation under budget pressure, exact terminal states. Two runs with the same inputs plan the same work.
9. **The model never grades its own format.** Two validators, re-run after every parent update; malformed agent outputs are discarded, not repaired (prevents the parent from "fixing" an agent's answer into a finding).
10. **Independence is structural, not requested:** fresh agents, no access to other verifiers' conclusions, owner freshness enforced by the validator, material replacements need another independent agent.
11. **Defensive framing for safety-trained models:** "defensive, source-first workflow", "finding, validating, fixing, and prioritizing", minimum-effect stop rules. This keeps the skill usable without triggering refusals and keeps validation non-destructive.
12. **Honest limits stated in the artifact itself:** partial runs must say so in the report's first section; "Validator success proves format and ledger consistency only."
13. **Hostile-input-hardened tooling:** even the validators assume the JSON they read was produced by agents that read attacker-controlled code (terminal-escape injection, symlink/FIFO tricks, memory blow-ups).

Size note: SKILL.md + phase files ≈ 785 lines; a full hunter prompt (architecture ≤1,000 words + blocks + schema branches + method) is large by design. The always-loaded part is just the ~380-char description.

## 17. What H-Stack should take, adapt or skip

- **Take:** two-mode activation with an explicit scope limiter in `description`; three verdicts with different field vocabularies; boundary-and-result gate; per-class "not a finding" sentences; verbatim prompt blocks with return contracts; discard-don't-repair malformed agent outputs; deterministic ledger with explicit states and named reasons; reserve-before-spend budgeting; prior-run carry-forward that never suppresses work; validator hardening (no-follow reads, escaped diagnostics); the AI-AND-LLM and SUPPLY-CHAIN classes as the checklist for auditing H-Stack itself.
- **Adapt:** Claude Code has `Agent`/`Task` subagents, worktrees, hooks and sandboxing (`/sandbox`, devcontainers); map `research` → a read-only subagent (`tools: Read, Grep, Glob`), `general` → a subagent with Bash inside the sandbox. Write isolation maps to per-agent worktrees/scratch dirs plus a PreToolUse hook that blocks writes outside the agent's own folder.
- **Skip / defer:** the full descriptor-based promotion code (H-Stack rarely needs to retain artifacts from untrusted execution; a simpler rule "never trust files written by sandboxed target code; copy only allowlisted regular files under a size cap" covers it); the `deep` profile until there is demand.
- **Gap to fill ourselves:** the validators check format, not truth. H-Stack's N47 promises "cited files exist, lines match"; that check does not exist in Cloudflare's code and is cheap to add (see `ideas-for-h-stack.md`).
