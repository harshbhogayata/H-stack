# 09 · Security

Finding vulnerabilities in code, and keeping the agent's own setup (skills, hooks, MCP) safe.

★ = GitHub stars on 2026-11-11 (for a skill inside a pack, the stars are the whole repo's).

| # | Name | Source | ★ | License | What it does | Why it ranks here |
|---|---|---|---|---|---|---|
| 1 | security-audit-skill | [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) | 70k | MIT | 6-phase audit: recon → coverage-led hunting → independent validation → schema-checked findings → fresh re-verification → report | Seeded Cloudflare's production vulnerability harness; most rigorous open method found (deep dive below) |
| 2 | claude-security (official) | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | 47k | Apache-2.0 | Deep vulnerability scan in-session at a chosen effort level | Reasons through data flow, validates each finding |
| 3 | Trail of Bits skills | [trailofbits/skills](https://github.com/trailofbits/skills) | 8k | **CC BY-SA 4.0** | CodeQL/Semgrep, differential review, supply-chain audit, insecure defaults | Pro-grade; share-alike, so ideas only |
| 4 | security-guidance (official) | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | 47k | Apache-2.0 | Warnings on edits, diff review on stop | Always-on, low cost |
| 5 | /cso | [garrytan/gstack](https://github.com/garrytan/gstack) | 141k | MIT | OWASP + STRIDE audit, independent challenge, runtime scanners | Threat-model framing |
| 6 | security-and-hardening | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | 115k | MIT | OWASP Top 10, auth, secrets, dependency audit | Good baseline checklist |
| 7 | AgentShield | [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code) | 301k | MIT | Scans prompts, hooks, MCP config, permissions, secrets in agent files | Protects the stack itself |
| 8 | mantis | [google/mantis](https://github.com/google/mantis) | 2.8k | Apache-2.0 | ~15 skills to find, reproduce and fix vulnerabilities | Find → reproduce → fix loop |
| 9 | VulnHunter | [capitalone/vulnhunter](https://github.com/capitalone/vulnhunter) | 1.2k | Apache-2.0 | Attacker-first find/fix/verify skills | Remediation loop |
| 10 | Built-in `/security-review` | Claude Code | — | — | Reviews pending changes for security issues | Already available |

## Ideas worth stealing
- **User approves the scan plan** before scanners run (Trail of Bits semgrep: "the request is not approval").
- **Adversarial validation:** a second agent tries to disprove each finding.
- **Telemetry off** for any scanner (`--metrics=off`).
- **Scan our own skills and hooks** for prompt injection; Snyk found injection in 36% of third-party skills tested.
- **Fail-open defaults** check: what happens when config is missing?

## Cloudflare deep dive

Read on 2026-11-11: `skills/security-audit/SKILL.md`, file list of the attack-class companions (`AI-AND-LLM.md`, `SUPPLY-CHAIN-AND-RELEASE.md`, `VALIDATION-AND-REPORTING.md` headings), the [README](https://github.com/cloudflare/security-audit-skill), and the blog post [Build your own vulnerability harness](https://blog.cloudflare.com/build-your-own-vulnerability-harness). MIT licensed, so short quotes with attribution are fine; we still write our own text.

### How the skill works
- **Two modes.** *Guidance* by default (answer the security question, use only relevant parts, create no files). *Full audit* only when the user explicitly asks to audit / pen-test / produce reports. If unclear, ask one question first.
- **Six phases.** Recon (architecture, trust boundaries, inputs, `coverage-ledger.json`) → coverage-led hunting by isolated hunters → every candidate given to a fresh verifier that tries to disprove it → `findings.json` validated against a JSON schema by a zero-dependency script → fresh agents re-verify final records → reports derived only from verified records.
- **Three verdicts.** `confirmed` (full source trace + observed result, gets a severity), `needs_validation` (names the exact unresolved fact, no severity), `rejected` (disproved).
- **Boundary-first findings.** Every candidate must name the lower-trust actor, the input, the intended control, the boundary crossed, what's affected, and the observed result. Missing best practice is not a vulnerability; a defence-in-depth gap is a hardening note.
- **Severity anchors.** Concrete definitions for critical/high/medium/low/informational; "if you cannot state the concrete damage, the severity is lower than it feels."
- **Coverage ledger.** Work is split into units (surface × boundary × attack class). Critics look for gaps. "No one pass is complete": a single run found about half of what repeated runs found. Later runs read prior ledgers, re-validate changed source, and never treat a scoped or quick run as "the rest is fine".
- **Profiles and budget.** `quick` / `standard` / `deep` change breadth, never the evidence bar. Budget for critics and validation is reserved *before* any hunting is spent.
- **Execution safety.** Target code runs only in an OS-enforced sandbox: no network, empty allowlisted environment, read-only target, writes only to scratch, CPU/memory/time limits. Dummy secrets; never probe live systems.
- **Write isolation.** Only the parent writes shared run files; each agent gets its own scratch and artifacts folder; artifacts are promoted with race-safe, no-symlink checks.
- **Domain companions** loaded by target type: memory safety, AI/LLM agents, web protocol & auth, client-side, supply chain & release, cloud & deployment, RPC & messaging, resource exhaustion, data isolation, desktop/mobile IPC.
- **AI/LLM attack classes** include indirect injection via retrieved content, persistent memory poisoning, cross-session context bleed, confused-deputy tools, approval binding, unbounded delegated loops, sub-agent/MCP trust inheritance, MCP metadata used as policy. Directly applicable to auditing H-Stack's own hooks, memory and skills.

### What the production harness added (blog)
- Different models for discovery and validation; "models are interchangeable, the harness is durable."
- Each agent keeps context use under ~25%; all state in one SQLite DB keyed by run/repo/stage so any stage can resume.
- **Wishlist tool:** when an agent needs something it can't get (a build env, a config), it files a request and the task re-runs once a human supplies it. The most-used tool in the system.
- Threat model required before filing (enforced by output schema order); every confirmed finding ships a PoC test against unmodified code and a proposed patch; the fixer must show a clean fail→pass flip; a human reviews every branch.
- Hunters with zero findings are flagged "shallow" and re-queued; gap-fill passes target thin coverage cells.
- Semgrep was wired in but agents called it zero times in a month: watch what agents actually use before adding tools.
- API errors can arrive as text in a 200 response; treat them as failures, not empty successes.
- Better recon cut validation rejections from 40% to 11%.
- Results: 20,799 raw candidates → 7,245 actionable across 145 repos; ~30k LOC repo ≈ 80 distinct bugs in ~3 h.

### Other Cloudflare work worth knowing
- **Code Mode** (Agents SDK): agents get an API as a typed code interface instead of many tool definitions; Cloudflare reports its whole API in ~1,000 tokens vs ~1.17M as plain MCP tools (via search summaries; check the primary post).
- **Sandboxes / Dynamic Workers:** isolated runtimes for agent-generated code ("you can't just eval() AI-generated code in your app").
- **[cloudflare/skills](https://github.com/cloudflare/skills):** platform skills (Workers, Agents SDK, Durable Objects, Sandbox, wrangler, web-perf…). Only useful if a project runs on Cloudflare. Pattern worth copying: a top-level `cloudflare` skill that routes to the right product skill and to upstream docs instead of duplicating them.
- **MCP governance** (Agents Week 2026): MCP server portals, shadow-MCP detection in Gateway. Enterprise-side; noted for completeness.

## H-Stack decision
_Not decided yet._ Ideas taken from this deep dive are N45–N56 in [00b](00b-research-backed-ideas.md).
