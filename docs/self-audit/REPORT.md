# H-Stack security self-audit (HS-014)

The audit was written by a review subagent using the imported security-audit skill on H-Stack itself. The subagent harness doesn't let subagents write `.md` files, so the parent session saved this report. Section 0 records the fixes made afterwards. Sections 1–7 are the audit as found at `e0f31ac`.

## 0. Fixes applied after the audit

| Finding | Fix | Regression check |
|---|---|---|
| F1 | `lib/shell.mjs normaliseArgv` moves per-tool global options after the subcommand, so `git -C . push --force`, `gh -R`, `kubectl --context` and `terraform -chdir=` classify like the plain form. | unit `self-audit.test.mjs`; snapshot `bash-force-push-global-flag` |
| F2 | Same helper used in `lib/deps.mjs installTargets`; global value flags added. | unit |
| F3 | `.h-stack/config.json` is now a checker: Edit, Write and Bash writes ask. Setup proposes native ask rules for it. | unit |
| F4 | `gate-bash` denies any non-reading command (other than `hs`) whose arguments name a `.h-stack/` path. Examples: `mv` source side, `node -e`, `find -delete`. | snapshot `bash-state-node-e`; repro |
| F5 | `hs manifest stop` asks. The refusal no longer suggests it. | repro |
| F6 | curl/wget destinations are parsed from bare host arguments too. IPv4-mapped and NAT64 IPv6 are converted to IPv4 before the range checks. | unit; repro |
| F7 | Write detection matches flag prefixes (`-d@x`, `--post-file=`). | repro |
| F8 | The exfiltration check also runs on de-quoted parsed tokens. It treats credential printers as secret sources (`gh auth token`, `aws sts …`, `gcloud auth print-access-token`, `op read`, …). The shell parser now extracts `$( )` substitutions inside double quotes. This also helps every other gate. | unit; repro |
| F9 | MCP tool names are split on `-`, `.` and camelCase. More write verbs were added. A tool with neither a read nor a write verb asks (fail toward asking). | unit; snapshot `mcp-camelcase-write` |
| F10 | `loadLessons` skips any lesson file that fails `validateLessonText`. `.claude/rules/**`, `CLAUDE.md`, `.claude/CLAUDE.md` and `CLAUDE.local.md` are checkers (ask). | unit; repro |
| F11 | `gate-bash` applies the read-only-subagent scratch rule to shell write targets. | repro |
| F12 | Claim kinds come from the parsed executable and subcommand. No-op commands (`echo`, `cat`, …) never count. | unit; repro |
| Hardening | `sessionDir` maps `.` and `..` to `no-session`. | — |

**Still open:**
- The two plausible findings in section 4 need the live runtime to validate.
- The structural point in section 2 stands. These gates parse text heuristically and are a second layer behind Claude Code's native permissions, not a sandbox: in-process tool use (`python -c "subprocess…"`, shell functions) gets past any text-based gate.

All 12 reproductions in `agents/parent/artifacts/repro.sh` now produce an ask or deny.

## 1. Run
- **Scope:** `plugins/h-stack`'s own code: `hooks/*.mjs`, `hooks/register.js` (mods), `hooks/hooks.json`, `lib/**/*.mjs`, `bin/hs`, `scripts/setup.mjs`.
  - Skill markdown was checked only for remote-instruction fetches and exfiltration.
  - Neither was found in the in-scope code paths; the markdown itself was not read in depth.
- **Method:** `skills/security-audit/SKILL.md`, scoped `quick` profile, with the companions AI-AND-LLM, SUPPLY-CHAIN-AND-RELEASE and RESOURCE-EXHAUSTION.
- **Source ref:** `e0f31ac`. The worktree was dirty (`bin/hs`, `hooks/classify.mjs`, `hooks/register.js` and others modified). Files were audited as on disk on 2026-11-11.
- **Execution:** every check was local, running the plugin's own hooks against crafted stdin in a throwaway git fixture under `/tmp`. No network, no installs, no real secrets.
- **Deviations from the full method:**
  - One agent did everything. No separate hunter, coverage-critic or independent-verifier agents ran, so confirmed findings are verified only by the agent's own reproductions.
  - There was no OS-enforced sandbox.
  - There were no prior runs.
- **Artifacts:**
  - `findings.json`: 18 records (12 confirmed, 2 needs_validation, 4 rejected). `validate-findings.cjs` → PASS.
  - `coverage-ledger.json`: 15 units. `validate-coverage-ledger.cjs` → PASS.
  - `run-metadata.json`.

**Threat model.** The lower-trust principal is attacker-controlled text that reaches the agent's context: a web page, issue body, MCP output or dependency file. The H-Stack gates exist so that such text cannot cause irreversible or outbound actions without the user's approval.

**Common condition.** Every bypass matters only when Claude Code's native permission prompt does not already ask. That is the case in auto, acceptEdits or bypass mode, or when an allow rule covers the call (`Bash(git:*)`, an allowed MCP tool, `Bash(hs:*)` from setup).

## 2. Posture

What holds:
- Gates fail closed (deny on crash) and never return allow.
- The stop loop is bounded.
- Approvals are not stored as grants, so they cannot be forged.

The weak point was that the controls binding the agent were parsed heuristically from text. Their policy and state lived in files the agent could change: `.h-stack/config.json`, the taint, manifest, steps and phase files, and the `hs` CLI, which could lift the manifest and is pre-allowed by setup. A determined or injected agent could switch off most gates with one ordinary command. Section 0 lists what changed.

## 3. Confirmed findings

| ID | Sev | Title | Location |
|---|---|---|---|
| F1 | medium | Irreversible gate skipped when a global flag precedes the subcommand | `lib/irreversible.mjs:68` (also :18, :29, :32) |
| F3 | medium | Agent can rewrite `.h-stack/config.json` (`allowlist ["re:.*"]`) with no ask | `lib/protected.mjs:15`, `hooks/gate-bash.mjs:63` |
| F4 | medium | Bash writes to `.h-stack` state bypass protected-state outside a short writer list | `hooks/gate-bash.mjs:21`, `:116` |
| F5 | medium | Agent can disarm the declared-effects manifest with `hs manifest stop` | `bin/hs:173`, `hooks/gate-bash.mjs:87` |
| F8 | medium | Secret-to-network guard matches the raw command text (`.e""nv`, `$(gh auth token)`) | `lib/irreversible.mjs:79`, `:86` |
| F9 | medium | MCP gate misses hyphenated, camelCase and `*_write` tool names | `hooks/gate-mcp.mjs:9`, `:21` |
| F10 | medium | Lessons injected without the provenance check; lesson files writable with no ask | `lib/retrieve.mjs:8`, `lib/memory.mjs:18`, `lib/protected.mjs:6` |
| F2 | low | Dependency gate misses `npm --prefix . install`, `pnpm -C x add`, `uv --quiet add` | `lib/deps.mjs:42`, `:49` |
| F6 | low | Private-destination guard misses scheme-less curl URLs and IPv4-mapped IPv6 | `hooks/gate-bash.mjs:125`, `lib/taint.mjs:30` |
| F7 | low | Untrusted-value check misses `curl -d@x` and `wget --post-file=` | `hooks/gate-bash.mjs:129` |
| F11 | low | Read-only subagent isolation covered Edit/Write but not Bash | `hooks/gate-edit.mjs:45` |
| F12 | low | Stop gate accepted a "tests pass" claim after any exit-0 command containing "test" | `lib/ledger.mjs:8`, `hooks/stop.mjs:24` |

Each finding's reproduction is in `agents/parent/artifacts/repro.sh`; run it with `bash docs/self-audit/agents/parent/artifacts/repro.sh` from the repo root. Full records are in `findings.json`.

## 4. Needs validation (plausible, no severity)

- **The MCP firewall scans only the `description` field** (`hooks/register.js:103-110`).
  - Blocker: the shape of the `tool.describe` event isn't shown.
  - Next step: a dummy MCP server with an injected schema-property description, logging the event.
- **Concern-check resubmit loop** (`hooks/register.js:188-189`; off by default).
  - Blocker: whether `$.prompt.submit` creates a new `prompt_id`.
  - Next step: enable it with a cap of 3 turns and count the resubmits.

## 5. Refuted

- **Forging approvals or receipts.** `approvals.jsonl` is never read to allow anything, and a receipt only changes the text of the ask.
- **`session_id` traversal.** `/` is replaced, `..` stays inside `.h-stack`, and Claude Code supplies the id. Now hardened further: see section 0.
- **Endless stop loop.** Bounded by `stop_hook_active`.
- **`setup.mjs` install hooks.** There are none, it uses no network, and it writes only with `--apply`.

## 6. Hardening notes and positive patterns

**Positive patterns:**
- Closed gates deny on crash (`runHook`), with `onFailure: block` as a second layer.
- Gates never return allow.
- `appendLine` redacts secrets and caps line size.
- The mod firewall defers a tool when its own check fails.
- Registry lookups send only the package name.

**Hardening notes:**
- The config's `re:` allowlist and `claims` regexes come from a project file, so a catastrophic regex could slow every call (self-impact only).
- `register.js` trusts the raw `.h-stack/active-session` value in path templates.
- In-process tool use defeats any text-based gate. Document the H-Stack gates as a second layer behind native permissions.

## 7. Coverage

15 units: 14 `candidate`, 1 `covered`. No coverage critic ran.

**Not covered:**
- `session-start.mjs` in depth: `gh pr view`, transcript parsing, the retention sweep's `rmSync`.
- `pre-compact.mjs`, `post-compact.mjs`, `session-end.mjs`, `failure.mjs`, `syntax.mjs`.
- `lib/tamper.mjs`, `lib/yaml.mjs`, `lib/findings.mjs`, `lib/retro.mjs`, `lib/telemetry.mjs`, `lib/tests.mjs`, `lib/index.mjs`, `lib/pure/classify-rules.mjs`.
- `scripts/` other than `setup.mjs`.
- The firewall's `HIDDEN` Unicode class, character by character.
- Skill markdown in depth.
- Live Claude Code runtime behaviour.
