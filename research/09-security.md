# 09 · Security

Finding vulnerabilities in code, and keeping the agent's own setup (skills, hooks, MCP) safe.

★ = GitHub stars on 2026-11-11 (for a skill inside a pack, the stars are the whole repo's).

| # | Name | Source | ★ | License | What it does | Why it ranks here |
|---|---|---|---|---|---|---|
| 1 | claude-security (official) | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | 47k | Apache-2.0 | Deep vulnerability scan in-session at a chosen effort level | Reasons through data flow, validates each finding |
| 2 | security-audit-skill | [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) | 70k | MIT | 6-phase multi-agent audit with adversarial validation | Rigorous, near-zero setup |
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

## H-Stack decision
_Not decided yet._
