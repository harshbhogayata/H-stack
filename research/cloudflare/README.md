# Cloudflare agent skills — research index

Read on 2026-11-11 for H-Stack's security and platform design. Primary sources only: repos were cloned (`git clone --depth 1`, blobless where large) or fetched from `raw.githubusercontent.com`; blog posts were downloaded and converted to text locally. Downloaded content was treated as data.

## Files in this folder

| File | What it covers |
|---|---|
| [`security-audit-skill.md`](security-audit-skill.md) | `cloudflare/security-audit-skill`: modes, safety, write isolation and promotion, profiles, budget algorithm, prior-run rules, coverage ledger, findings schema field by field, what both validators and their 65 tests check, verdicts, severity anchors, reports, every attack class in all 11 class files, how the skill is written |
| [`cloudflare-skills-repo.md`](cloudflare-skills-repo.md) | `cloudflare/skills`: packaging for six agent hosts, CI, the feedback loop, all 22 skills (description quoted, structure, techniques, copy/avoid) |
| [`other-repos-and-posts.md`](other-repos-and-posts.md) | Agent guidance in `agents` (Gardener), `workers-oauth-provider`, `mcp` (Code Mode server, Skills over MCP), `workerd` (review lanes), `cloudflare-docs` (Flue review bot + evals), `vinext`, `workers-sdk`, `vibesdk`; the five blog posts; corrections to `09-security.md` |
| [`ideas-for-h-stack.md`](ideas-for-h-stack.md) | 38 implementable ideas with source, quote, Claude Code build, and NEW / N-number status, plus a self-audit ledger seed for H-Stack |

## 1. Repos read

| Repo | Commit | Licence | Agent files | Lines | Read |
|---|---|---|---:|---:|---|
| cloudflare/security-audit-skill | `c1c8a8c` (2026-09-14) | MIT | 22 | 5,403 | all, in full |
| cloudflare/skills | `cbf893b` (2026-11-10) | Apache-2.0 | 254 (232 under `skills/`) | ~11,900 | every text file in full |
| cloudflare/agents | `5071d3c` | MIT | 39 | 8,270 | Gardener + root AGENTS.md in full; rest inventoried |
| cloudflare/workers-oauth-provider | `5c75ddc` | MIT | 2 | 357 | all, in full |
| cloudflare/mcp | `77d8f76` | Apache-2.0 | 14 | 6,431 | AGENTS.md + skills types in full; generated tools inventoried |
| cloudflare/workerd | `0a1a79b` | Apache-2.0 | 107 | 10,358 | review agents + safety skills in full; rest inventoried |
| cloudflare/cloudflare-docs | `feb0f21` (branch `production`) | CC BY 4.0 | 213 | 40,378 | Flue AGENTS.md, reviewer/judge prompts, rule authoring in full; evals in part; rest inventoried |
| cloudflare/vinext | `8659957` | MIT | 21 | 2,366 | `fix` skill, `autopilot` in full; `viguy` in part |
| cloudflare/workers-sdk | `88c774b` | MIT / Apache-2.0 | 13 | 1,526 | `bonk` agent in part; rest inventoried |
| cloudflare/vibesdk | `32c9e42` | MIT | 19 | 9,538 | max-steps prompt in full; CLAUDE.md and model prompts in part |
| cloudflare/kumo, templates, containers | `fee1148`, `b1c1382`, `a17055c` | — | 18 | 3,567 | inventoried |
| cloudflare/sandbox-sdk, mcp-server-cloudflare | `61cac81`, `a21972e` | — | 0 | 0 | no agent files at HEAD |

Blog posts read in full: [Build your own vulnerability harness](https://blog.cloudflare.com/build-your-own-vulnerability-harness), [Code Mode: The better way to use MCP](https://blog.cloudflare.com/code-mode/), [Sandboxing AI agents, 100x faster](https://blog.cloudflare.com/dynamic-workers) (Dynamic Workers), [Code Mode: give agents an entire API in 1,000 tokens](https://blog.cloudflare.com/code-mode-mcp/), [Introducing the Cloudflare One stack](https://blog.cloudflare.com/cloudflare-one-stack/) (the closest thing to an announcement of `cloudflare/skills`; no post announcing the whole repo was found).

## 2. Every skill found across Cloudflare repos

| Repo | Skill | Files | Lines |
|---|---|---:|---:|
| security-audit-skill | security-audit | 20 (+README, LICENSE) | 5,276 |
| skills | cloudflare | 130 | 2,545 |
| skills | agents-sdk | 21 | 1,277 |
| skills | basin | 17 | 1,133 |
| skills | k2 | 2 | 68 |
| skills | cf-cli | 2 | 135 |
| skills | cloudflare-app-bootstrap | 2 | 88 |
| skills | cloudflare-email-service | 7 | 761 |
| skills | cloudflare-one | 2 | 244 |
| skills | cloudflare-one-migrations | 2 | 155 |
| skills | durable-objects | 5 | 576 |
| skills | frameworks-on-cloudflare | 2 | 77 |
| skills | gateway-workers | 2 | 83 |
| skills | nextjs-on-cloudflare | 2 | 78 |
| skills | sandbox-next | 4 | 170 |
| skills | sandbox-stable | 2 | 155 |
| skills | sandbox-migrate-to-next | 2 | 230 |
| skills | turnstile-spin | 15 | 2,252 |
| skills | web-perf | 2 | 246 |
| skills | workers-best-practices | 5 | 646 |
| skills | workers-development | 2 | 66 |
| skills | workers-profiling | 2 | 89 |
| skills | wrangler | 2 | 116 |
| workers-oauth-provider | migrate-to-1.x | 1 | 62 |
| agents | gardener-tasks (`.gardener/`, incl. 10 TASK.md) | 13 | 2,779 |
| agents | agent-think/open-pr | 1 | 207 |
| agents | agent-think/reproduce | 1 | 349 |
| workers-sdk | local-explorer | 2 | 131 |
| vinext | fix | 3 | 249 |
| vinext | migrate-to-vinext | 4 | 667 |
| vinext | triage | 3 | 153 |
| cloudflare-docs | contributing | 7 | 819 |
| cloudflare-docs | eli5 | 6 | 3,919 |
| cloudflare-docs | pr-mr | 1 | 207 |
| cloudflare-docs | workers-code-review | 4 | 398 |
| kumo | index-knowledge | 1 | 375 |
| kumo | kumo-design | 1 | 315 |
| vibesdk | app-ai-binding / app-file-structure / frontend-design / frontend-design-landing-page / frontend-design-saas | 5 | 108 / 485 / 41 / 3,278 / 3,439 |
| workerd | 19 skills (bazel-test-hygiene 60, commit-categories 44, dad-jokes 34, find-and-run-tests 70, identify-reviewer 60, investigation-notes 113, iwyu 29, kj-style 6, markdown-drafts 71, parent-project-skills 49, pr-review-guide 101, receiving-code-review 213, rust-review 6, ts-style 6, update-v8 207, wd-test-format 327 (2 files), workerd-api-review 6, workerd-safety-review 6, wpt-update 322) | 20 | 1,730 |

Also relevant but not skills: `cloudflare/mcp` serves `cloudflare/skills` over the MCP Skills extension; `cloudflare/agents/packages/agents/src/skills/*.ts` is the Agents SDK runtime for skills (code); review-bot prompts in `cloudflare-docs/.flue/prompts/` (31 files) and subagents in `workerd/.opencode/agent/` (5) and `.claude/agents/` (5 shims).

## 3. Top takeaways for H-Stack

1. **The model never grades its own work, and code checks the format.** Three verdicts with different field vocabularies, a zero-dependency validator run after every update, malformed agent output discarded rather than repaired, and every candidate checked by an agent that didn't find it — often on a different model. The published validators check *format only*; the production harness adds "cited files exist, patch and test parse". H-Stack should do both (ideas 15–17, 19).
2. **Boundaries belong in declarations and hooks, not prompts.** Gardener's tools/effects/network/limits frontmatter with a plan/apply split, Flue's "Trusted code drives; agents only decide", workerd's Bash allowlists, workers-oauth-provider's human-only release rule. Directly matches H-Stack's rule that must-never-slip rules live in hooks (ideas 1–4).
3. **Untrusted text has one rule everywhere**: it can supply values but cannot change the procedure or authorise writes; PR comments are never directives; issue reports are "a report to judge". Combine with approval binding (approve the exact manifest, fresh each time) and a scope lock on the invoked issue/PR (ideas 5, 8, 9).
4. **Credentials stay out of model reach.** Code Mode/Dynamic Workers inject credentials outside the sandbox; Turnstile Spin never passes secrets through argv, chat, env exports or project-controlled binaries (ideas 6, 7, 33).
5. **Coverage is a ledger, not a feeling.** Deterministic units, named states and reasons, fresh owners on reassignment, critics until a final clean pass, "Not reviewed" lists, `Cleared:` lines, and partial runs that say so first. A single run finds about half of what repeated runs find (ideas 18, 20–23).
6. **Honest failure detection.** Errors arriving as 200-OK text, permission-filtered empty lists, "Aborted." with exit 0, silently dropped events — all must count as failures (idea 11).
7. **Skills route to sources and stay small**; copied code in references drifted into real bugs (double body read, `CORS *`, missing fail-closed handling). Use Gate → Contract → Retrieve skills, negative routing between siblings, and a lint for copied code (ideas 29, 30, 32).
8. **Supply chain of skills is a real attack surface**: several Cloudflare skills install other skills or MCP servers unpinned at runtime. H-Stack should pin and digest (MCP Skills extension already ships sha256 per file) and ask before installs (idea 34).
9. **Evals per rule** (one trigger + one clean counterexample) and held-out-target testing for prompt changes are how Cloudflare keeps agent rules honest; only `turnstile-spin` in `cloudflare/skills` has tests at all (ideas 26, 27).

## 4. What could not be done

- I could not execute the security-audit validator test suites: the sandbox's auto-mode classifier blocked running downloaded code. Test counts (34 + 31) and what they assert were read from source.
- `codeload.github.com` tarballs returned HTTP 403; `git clone` through the session's git proxy worked instead, so nothing was lost.
- Context budget did not allow reading the ~70,000 lines of lower-relevance agent files in the "other repos" set line by line (generated MCP tools, bot implementation code, design-system and template guidance, large frontend-design skills). They are inventoried with line counts in Appendix C and marked **I**.

## Appendix A — cloudflare/security-audit-skill (22 files, all read in full)

| File | Lines |
|---|---:|
| `LICENSE` | 21 |
| `README.md` | 106 |
| `skills/security-audit/AI-AND-LLM.md` | 83 |
| `skills/security-audit/ATTACK-CLASSES.md` | 130 |
| `skills/security-audit/CLIENT-SIDE.md` | 83 |
| `skills/security-audit/CLOUD-AND-DEPLOYMENT.md` | 86 |
| `skills/security-audit/DATA-ISOLATION-AND-LIFECYCLE.md` | 84 |
| `skills/security-audit/DESKTOP-MOBILE-AND-LOCAL-IPC.md` | 89 |
| `skills/security-audit/HUNTING.md` | 251 |
| `skills/security-audit/MEMORY-SAFETY-AND-BINARY.md` | 101 |
| `skills/security-audit/PROTOCOLS-RPC-AND-MESSAGING.md` | 81 |
| `skills/security-audit/RECONNAISSANCE.md` | 156 |
| `skills/security-audit/RESOURCE-EXHAUSTION-AND-AVAILABILITY.md` | 78 |
| `skills/security-audit/SKILL.md` | 192 |
| `skills/security-audit/SUPPLY-CHAIN-AND-RELEASE.md` | 73 |
| `skills/security-audit/VALIDATION-AND-REPORTING.md` | 186 |
| `skills/security-audit/WEB-PROTOCOL-AND-AUTH.md` | 105 |
| `skills/security-audit/report-schema.json` | 461 |
| `skills/security-audit/validate-coverage-ledger.cjs` | 872 |
| `skills/security-audit/validate-coverage-ledger.test.cjs` | 740 |
| `skills/security-audit/validate-findings.cjs` | 773 |
| `skills/security-audit/validate-findings.test.cjs` | 652 |

## Appendix B — cloudflare/skills (254 files; every text file read in full; 2 images identified only)

| File | Lines |
|---|---:|
| `.agents/plugins/marketplace.json` | 20 |
| `.antigravity-plugin/plugin.json` | 23 |
| `.claude-plugin/marketplace.json` | 36 |
| `.claude-plugin/plugin.json` | 27 |
| `.codex-plugin/plugin.json` | 50 |
| `.cursor-plugin/marketplace.json` | 13 |
| `.cursor-plugin/plugin.json` | 12 |
| `.gitignore` | 2 |
| `.mcp.json` | 8 |
| `CODEOWNERS` | 2 |
| `CONTRIBUTING.md` | 12 |
| `LICENSE` | 201 |
| `README.md` | 100 |
| `icon.png` | binary |
| `logo.svg` | 3 |
| `mcp.json` | 9 |
| `mcp_config.json` | 7 |
| `plugin.json` | 26 |
| `rules/workers.mdc` | 20 |
| `skills/agents-sdk/SKILL.md` | 206 |
| `skills/agents-sdk/references/browse-the-web.md` | 63 |
| `skills/agents-sdk/references/callable.md` | 92 |
| `skills/agents-sdk/references/client-sdk.md` | 11 |
| `skills/agents-sdk/references/codemode.md` | 110 |
| `skills/agents-sdk/references/configuration.md` | 72 |
| `skills/agents-sdk/references/durable-execution.md` | 51 |
| `skills/agents-sdk/references/email.md` | 146 |
| `skills/agents-sdk/references/human-in-the-loop.md` | 10 |
| `skills/agents-sdk/references/mcp.md` | 13 |
| `skills/agents-sdk/references/observability.md` | 44 |
| `skills/agents-sdk/references/queue-retries.md` | 18 |
| `skills/agents-sdk/references/routing.md` | 75 |
| `skills/agents-sdk/references/server-driven-messages.md` | 7 |
| `skills/agents-sdk/references/skill-feedback.md` | 41 |
| `skills/agents-sdk/references/state-scheduling.md` | 15 |
| `skills/agents-sdk/references/streaming-chat.md` | 16 |
| `skills/agents-sdk/references/think.md` | 112 |
| `skills/agents-sdk/references/voice.md` | 68 |
| `skills/agents-sdk/references/webhooks-push.md` | 86 |
| `skills/agents-sdk/references/workflows.md` | 21 |
| `skills/basin/SKILL.md` | 28 |
| `skills/basin/references/catalog/README.md` | 16 |
| `skills/basin/references/catalog/api.md` | 47 |
| `skills/basin/references/catalog/configuration.md` | 17 |
| `skills/basin/references/catalog/gotchas.md` | 18 |
| `skills/basin/references/catalog/patterns.md` | 17 |
| `skills/basin/references/pipelines/README.md` | 90 |
| `skills/basin/references/pipelines/api.md` | 124 |
| `skills/basin/references/pipelines/configuration.md` | 155 |
| `skills/basin/references/pipelines/gotchas.md` | 58 |
| `skills/basin/references/pipelines/patterns.md` | 130 |
| `skills/basin/references/skill-feedback.md` | 41 |
| `skills/basin/references/sql/README.md` | 64 |
| `skills/basin/references/sql/api.md` | 121 |
| `skills/basin/references/sql/configuration.md` | 50 |
| `skills/basin/references/sql/gotchas.md` | 39 |
| `skills/basin/references/sql/patterns.md` | 118 |
| `skills/cf-cli/SKILL.md` | 94 |
| `skills/cf-cli/references/skill-feedback.md` | 41 |
| `skills/cloudflare-app-bootstrap/SKILL.md` | 47 |
| `skills/cloudflare-app-bootstrap/references/skill-feedback.md` | 41 |
| `skills/cloudflare-email-service/SKILL.md` | 77 |
| `skills/cloudflare-email-service/references/cli-and-mcp.md` | 125 |
| `skills/cloudflare-email-service/references/deliverability.md` | 283 |
| `skills/cloudflare-email-service/references/rest-api.md` | 17 |
| `skills/cloudflare-email-service/references/routing.md` | 199 |
| `skills/cloudflare-email-service/references/sending.md` | 19 |
| `skills/cloudflare-email-service/references/skill-feedback.md` | 41 |
| `skills/cloudflare-one-migrations/SKILL.md` | 114 |
| `skills/cloudflare-one-migrations/references/skill-feedback.md` | 41 |
| `skills/cloudflare-one/SKILL.md` | 203 |
| `skills/cloudflare-one/references/skill-feedback.md` | 41 |
| `skills/cloudflare/SKILL.md` | 170 |
| `skills/cloudflare/references/ai-gateway/README.md` | 27 |
| `skills/cloudflare/references/ai-gateway/configuration.md` | 18 |
| `skills/cloudflare/references/ai-gateway/dynamic-routing.md` | 15 |
| `skills/cloudflare/references/ai-gateway/features.md` | 22 |
| `skills/cloudflare/references/ai-gateway/sdk-integration.md` | 19 |
| `skills/cloudflare/references/ai-gateway/troubleshooting.md` | 16 |
| `skills/cloudflare/references/ai-search/README.md` | 25 |
| `skills/cloudflare/references/ai-search/api.md` | 13 |
| `skills/cloudflare/references/ai-search/configuration.md` | 16 |
| `skills/cloudflare/references/ai-search/gotchas.md` | 13 |
| `skills/cloudflare/references/ai-search/patterns.md` | 15 |
| `skills/cloudflare/references/bindings/README.md` | 16 |
| `skills/cloudflare/references/bindings/api.md` | 19 |
| `skills/cloudflare/references/bindings/configuration.md` | 20 |
| `skills/cloudflare/references/bindings/gotchas.md` | 18 |
| `skills/cloudflare/references/bindings/patterns.md` | 20 |
| `skills/cloudflare/references/browser-rendering/README.md` | 18 |
| `skills/cloudflare/references/browser-rendering/api.md` | 12 |
| `skills/cloudflare/references/browser-rendering/configuration.md` | 12 |
| `skills/cloudflare/references/browser-rendering/gotchas.md` | 15 |
| `skills/cloudflare/references/browser-rendering/patterns.md` | 12 |
| `skills/cloudflare/references/containers/README.md` | 23 |
| `skills/cloudflare/references/containers/api.md` | 13 |
| `skills/cloudflare/references/containers/configuration.md` | 15 |
| `skills/cloudflare/references/containers/gotchas.md` | 16 |
| `skills/cloudflare/references/containers/patterns.md` | 18 |
| `skills/cloudflare/references/cron-triggers/README.md` | 20 |
| `skills/cloudflare/references/cron-triggers/api.md` | 16 |
| `skills/cloudflare/references/cron-triggers/configuration.md` | 16 |
| `skills/cloudflare/references/cron-triggers/gotchas.md` | 17 |
| `skills/cloudflare/references/cron-triggers/patterns.md` | 18 |
| `skills/cloudflare/references/d1/README.md` | 15 |
| `skills/cloudflare/references/d1/api.md` | 18 |
| `skills/cloudflare/references/d1/configuration.md` | 18 |
| `skills/cloudflare/references/d1/gotchas.md` | 18 |
| `skills/cloudflare/references/d1/patterns.md` | 21 |
| `skills/cloudflare/references/hyperdrive/README.md` | 28 |
| `skills/cloudflare/references/hyperdrive/api.md` | 26 |
| `skills/cloudflare/references/hyperdrive/configuration.md` | 34 |
| `skills/cloudflare/references/hyperdrive/gotchas.md` | 20 |
| `skills/cloudflare/references/hyperdrive/patterns.md` | 15 |
| `skills/cloudflare/references/images/README.md` | 12 |
| `skills/cloudflare/references/images/api.md` | 13 |
| `skills/cloudflare/references/images/configuration.md` | 17 |
| `skills/cloudflare/references/images/gotchas.md` | 16 |
| `skills/cloudflare/references/images/patterns.md` | 16 |
| `skills/cloudflare/references/kv/README.md` | 15 |
| `skills/cloudflare/references/kv/api.md` | 18 |
| `skills/cloudflare/references/kv/configuration.md` | 16 |
| `skills/cloudflare/references/kv/gotchas.md` | 17 |
| `skills/cloudflare/references/kv/patterns.md` | 21 |
| `skills/cloudflare/references/miniflare/README.md` | 22 |
| `skills/cloudflare/references/miniflare/api.md` | 16 |
| `skills/cloudflare/references/miniflare/configuration.md` | 16 |
| `skills/cloudflare/references/miniflare/gotchas.md` | 15 |
| `skills/cloudflare/references/miniflare/patterns.md` | 19 |
| `skills/cloudflare/references/observability/README.md` | 27 |
| `skills/cloudflare/references/observability/api.md` | 20 |
| `skills/cloudflare/references/observability/configuration.md` | 23 |
| `skills/cloudflare/references/observability/gotchas.md` | 25 |
| `skills/cloudflare/references/observability/patterns.md` | 14 |
| `skills/cloudflare/references/pages-functions/README.md` | 20 |
| `skills/cloudflare/references/pages-functions/api.md` | 13 |
| `skills/cloudflare/references/pages-functions/configuration.md` | 14 |
| `skills/cloudflare/references/pages-functions/gotchas.md` | 17 |
| `skills/cloudflare/references/pages-functions/patterns.md` | 16 |
| `skills/cloudflare/references/pages/README.md` | 20 |
| `skills/cloudflare/references/pages/api.md` | 13 |
| `skills/cloudflare/references/pages/configuration.md` | 16 |
| `skills/cloudflare/references/pages/gotchas.md` | 19 |
| `skills/cloudflare/references/pages/patterns.md` | 15 |
| `skills/cloudflare/references/queues/README.md` | 24 |
| `skills/cloudflare/references/queues/api.md` | 16 |
| `skills/cloudflare/references/queues/configuration.md` | 20 |
| `skills/cloudflare/references/queues/gotchas.md` | 18 |
| `skills/cloudflare/references/queues/patterns.md` | 21 |
| `skills/cloudflare/references/r2/README.md` | 26 |
| `skills/cloudflare/references/r2/api.md` | 16 |
| `skills/cloudflare/references/r2/configuration.md` | 19 |
| `skills/cloudflare/references/r2/gotchas.md` | 17 |
| `skills/cloudflare/references/r2/patterns.md` | 18 |
| `skills/cloudflare/references/secrets-store/README.md` | 22 |
| `skills/cloudflare/references/secrets-store/api.md` | 21 |
| `skills/cloudflare/references/secrets-store/configuration.md` | 25 |
| `skills/cloudflare/references/secrets-store/gotchas.md` | 19 |
| `skills/cloudflare/references/secrets-store/patterns.md` | 27 |
| `skills/cloudflare/references/skill-feedback.md` | 41 |
| `skills/cloudflare/references/static-assets/README.md` | 21 |
| `skills/cloudflare/references/static-assets/api.md` | 16 |
| `skills/cloudflare/references/static-assets/configuration.md` | 16 |
| `skills/cloudflare/references/static-assets/gotchas.md` | 18 |
| `skills/cloudflare/references/static-assets/patterns.md` | 17 |
| `skills/cloudflare/references/stream/README.md` | 22 |
| `skills/cloudflare/references/stream/api-live.md` | 18 |
| `skills/cloudflare/references/stream/api.md` | 21 |
| `skills/cloudflare/references/stream/configuration.md` | 18 |
| `skills/cloudflare/references/stream/gotchas.md` | 18 |
| `skills/cloudflare/references/stream/patterns.md` | 22 |
| `skills/cloudflare/references/tail-workers/README.md` | 21 |
| `skills/cloudflare/references/tail-workers/api.md` | 13 |
| `skills/cloudflare/references/tail-workers/configuration.md` | 15 |
| `skills/cloudflare/references/tail-workers/gotchas.md` | 16 |
| `skills/cloudflare/references/tail-workers/patterns.md` | 15 |
| `skills/cloudflare/references/tunnel/README.md` | 20 |
| `skills/cloudflare/references/tunnel/api.md` | 14 |
| `skills/cloudflare/references/tunnel/configuration.md` | 14 |
| `skills/cloudflare/references/tunnel/gotchas.md` | 15 |
| `skills/cloudflare/references/tunnel/networking.md` | 14 |
| `skills/cloudflare/references/tunnel/patterns.md` | 15 |
| `skills/cloudflare/references/vectorize/README.md` | 22 |
| `skills/cloudflare/references/vectorize/api.md` | 18 |
| `skills/cloudflare/references/vectorize/configuration.md` | 19 |
| `skills/cloudflare/references/vectorize/gotchas.md` | 15 |
| `skills/cloudflare/references/vectorize/patterns.md` | 24 |
| `skills/cloudflare/references/waf/README.md` | 21 |
| `skills/cloudflare/references/waf/api.md` | 17 |
| `skills/cloudflare/references/waf/configuration.md` | 18 |
| `skills/cloudflare/references/waf/gotchas.md` | 19 |
| `skills/cloudflare/references/waf/patterns.md` | 17 |
| `skills/cloudflare/references/workers-ai/README.md` | 24 |
| `skills/cloudflare/references/workers-ai/api.md` | 13 |
| `skills/cloudflare/references/workers-ai/configuration.md` | 16 |
| `skills/cloudflare/references/workers-ai/gotchas.md` | 15 |
| `skills/cloudflare/references/workers-ai/patterns.md` | 14 |
| `skills/cloudflare/references/workflows/README.md` | 23 |
| `skills/cloudflare/references/workflows/api.md` | 17 |
| `skills/cloudflare/references/workflows/configuration.md` | 18 |
| `skills/cloudflare/references/workflows/gotchas.md` | 19 |
| `skills/cloudflare/references/workflows/patterns.md` | 30 |
| `skills/durable-objects/SKILL.md` | 184 |
| `skills/durable-objects/references/rules.md` | 19 |
| `skills/durable-objects/references/skill-feedback.md` | 41 |
| `skills/durable-objects/references/testing.md` | 23 |
| `skills/durable-objects/references/workers.md` | 309 |
| `skills/frameworks-on-cloudflare/SKILL.md` | 36 |
| `skills/frameworks-on-cloudflare/references/skill-feedback.md` | 41 |
| `skills/gateway-workers/SKILL.md` | 42 |
| `skills/gateway-workers/references/skill-feedback.md` | 41 |
| `skills/k2/SKILL.md` | 27 |
| `skills/k2/references/skill-feedback.md` | 41 |
| `skills/nextjs-on-cloudflare/SKILL.md` | 37 |
| `skills/nextjs-on-cloudflare/references/skill-feedback.md` | 41 |
| `skills/sandbox-migrate-to-next/SKILL.md` | 189 |
| `skills/sandbox-migrate-to-next/references/skill-feedback.md` | 41 |
| `skills/sandbox-next/SKILL.md` | 96 |
| `skills/sandbox-next/references/api-quick-ref.md` | 19 |
| `skills/sandbox-next/references/examples.md` | 14 |
| `skills/sandbox-next/references/skill-feedback.md` | 41 |
| `skills/sandbox-stable/SKILL.md` | 114 |
| `skills/sandbox-stable/references/skill-feedback.md` | 41 |
| `skills/turnstile-spin/README.md` | 52 |
| `skills/turnstile-spin/SKILL.md` | 340 |
| `skills/turnstile-spin/references/astro.md` | 199 |
| `skills/turnstile-spin/references/hugo.md` | 114 |
| `skills/turnstile-spin/references/nextjs-app.md` | 261 |
| `skills/turnstile-spin/references/nextjs-pages.md` | 82 |
| `skills/turnstile-spin/references/skill-feedback.md` | 41 |
| `skills/turnstile-spin/references/sveltekit.md` | 191 |
| `skills/turnstile-spin/references/vanilla-html.md` | 157 |
| `skills/turnstile-spin/scripts/auth-probe.sh` | 285 |
| `skills/turnstile-spin/scripts/persist-skill.sh` | 119 |
| `skills/turnstile-spin/scripts/validate.sh` | 137 |
| `skills/turnstile-spin/scripts/widget-create.sh` | 121 |
| `skills/turnstile-spin/tests/test_persist_skill.py` | 81 |
| `skills/turnstile-spin/tests/validation.md` | 72 |
| `skills/web-perf/SKILL.md` | 205 |
| `skills/web-perf/references/skill-feedback.md` | 41 |
| `skills/workers-best-practices/SKILL.md` | 68 |
| `skills/workers-best-practices/references/configuration.md` | 145 |
| `skills/workers-best-practices/references/platform-apis.md` | 51 |
| `skills/workers-best-practices/references/runtime-patterns.md` | 341 |
| `skills/workers-best-practices/references/skill-feedback.md` | 41 |
| `skills/workers-development/SKILL.md` | 25 |
| `skills/workers-development/references/skill-feedback.md` | 41 |
| `skills/workers-profiling/SKILL.md` | 48 |
| `skills/workers-profiling/references/skill-feedback.md` | 41 |
| `skills/wrangler/SKILL.md` | 75 |
| `skills/wrangler/references/skill-feedback.md` | 41 |

## Appendix C — other Cloudflare repos: every agent-facing file (446 files, 82,791 lines)

Status: **R** read in full, **P** read in part, **I** inventoried (name and size only). See `other-repos-and-posts.md` for what was read and why.


**agents**

| File | Lines | Status |
|---|---:|:---:|
| `.gardener/SKILL.md` | 299 | R |
| `.gardener/gardener.json` | 8 | R |
| `.gardener/gardener.lock.json` | 1107 | I |
| `.gardener/tasks/dependabot-merge/TASK.md` | 106 | R |
| `.gardener/tasks/fix-blocked/TASK.md` | 37 | P |
| `.gardener/tasks/fix-ready/TASK.md` | 35 | P |
| `.gardener/tasks/fix/TASK.md` | 80 | R |
| `.gardener/tasks/mention-reply/TASK.md` | 159 | P |
| `.gardener/tasks/opencode-upgrade/TASK.md` | 268 | P |
| `.gardener/tasks/pi-upgrade/TASK.md` | 303 | P |
| `.gardener/tasks/pr-review-fix/TASK.md` | 108 | P |
| `.gardener/tasks/resolved-check/TASK.md` | 186 | P |
| `.gardener/tasks/triage/TASK.md` | 83 | R |
| `AGENTS.md` | 208 | R |
| `agent-think/AGENTS.md` | 209 | I |
| `agent-think/skills/open-pr/SKILL.md` | 207 | I |
| `agent-think/skills/reproduce/SKILL.md` | 349 | I |
| `design/AGENTS.md` | 119 | I |
| `docs/AGENTS.md` | 45 | I |
| `examples/AGENTS.md` | 306 | I |
| `examples/webmcp-react/AGENTS.md` | 9 | I |
| `guides/AGENTS.md` | 62 | I |
| `packages/agents/AGENTS.md` | 425 | I |
| `packages/agents/src/skills/catalog.ts` | 417 | I |
| `packages/agents/src/skills/index.ts` | 62 | I |
| `packages/agents/src/skills/manifest.ts` | 161 | I |
| `packages/agents/src/skills/markdown.ts` | 135 | I |
| `packages/agents/src/skills/r2.ts` | 136 | I |
| `packages/agents/src/skills/resource.ts` | 177 | I |
| `packages/agents/src/skills/result.ts` | 24 | I |
| `packages/agents/src/skills/runner.ts` | 1085 | I |
| `packages/agents/src/skills/script-workspace.ts` | 208 | I |
| `packages/agents/src/skills/script.ts` | 88 | I |
| `packages/agents/src/skills/skill.ts` | 476 | I |
| `packages/agents/src/skills/source.ts` | 114 | I |
| `packages/agents/src/skills/tools/ai-sdk.ts` | 123 | I |
| `packages/agents/src/skills/tree.ts` | 93 | I |
| `packages/agents/src/skills/workspace.ts` | 182 | I |
| `packages/agents/src/tests/capabilities/AGENTS.md` | 71 | I |

**cloudflare-docs**

| File | Lines | Status |
|---|---:|:---:|
| `.agents/agents/docs.md` | 178 | I |
| `.agents/references/components.md` | 908 | I |
| `.agents/references/procedures.md` | 71 | I |
| `.agents/references/style-guide.md` | 441 | I |
| `.agents/skills/contributing/SKILL.md` | 69 | I |
| `.agents/skills/contributing/references/changelog.md` | 97 | I |
| `.agents/skills/contributing/references/choosing-components.md` | 127 | I |
| `.agents/skills/contributing/references/content-types.md` | 117 | I |
| `.agents/skills/contributing/references/information-architecture.md` | 108 | I |
| `.agents/skills/contributing/references/reviewing-docs.md` | 232 | I |
| `.agents/skills/contributing/references/writing-docs.md` | 69 | I |
| `.agents/skills/eli5/README.md` | 98 | I |
| `.agents/skills/eli5/SKILL.md` | 461 | I |
| `.agents/skills/eli5/recommendations/internal-dns/index.eli5.mdx` | 205 | I |
| `.agents/skills/eli5/references/EXAMPLES_REFERENCE.md` | 1834 | I |
| `.agents/skills/eli5/references/content-type-guide.md` | 687 | I |
| `.agents/skills/eli5/references/pattern-library.md` | 634 | I |
| `.agents/skills/pr-mr/SKILL.md` | 207 | I |
| `.agents/skills/workers-code-review/SKILL.md` | 125 | I |
| `.agents/skills/workers-code-review/common-patterns.md` | 134 | I |
| `.agents/skills/workers-code-review/workers-types.md` | 70 | I |
| `.agents/skills/workers-code-review/wrangler-config.md` | 69 | I |
| `.claude/.gitignore` | 7 | I |
| `.claude/CLAUDE.md` | 0 | I |
| `.claude/agents` | 0 | I |
| `.claude/skills` | 0 | I |
| `.flue/AGENTS.md` | 252 | R |
| `.flue/agents/code-reviewer.ts` | 53 | I |
| `.flue/agents/conventions-reviewer.ts` | 44 | I |
| `.flue/agents/dependabot-reviewer.ts` | 126 | I |
| `.flue/agents/rebase-conflict-resolver.ts` | 125 | I |
| `.flue/agents/review-judge.ts` | 57 | I |
| `.flue/agents/style-guide-reviewer.ts` | 53 | I |
| `.flue/app.ts` | 252 | I |
| `.flue/bin/clear-r2-pr-data.ts` | 103 | I |
| `.flue/bin/dotenv.ts` | 29 | I |
| `.flue/bin/replay-comment-spam.ts` | 90 | I |
| `.flue/bin/replay-dependabot.ts` | 97 | I |
| `.flue/bin/replay-effort-label.ts` | 91 | I |
| `.flue/bin/replay-prs.json` | 17 | I |
| `.flue/bin/replay-size-label.ts` | 66 | I |
| `.flue/bin/replay-spam.ts` | 97 | I |
| `.flue/bin/replay.ts` | 180 | I |
| `.flue/bin/run-evals.ts` | 119 | I |
| `.flue/cloudflare.ts` | 260 | I |
| `.flue/evals/clef-harness.ts` | 51 | I |
| `.flue/evals/code-reviewer.eval.ts` | 54 | I |
| `.flue/evals/comment-spam-filter.eval.ts` | 137 | I |
| `.flue/evals/conventions-reviewer.eval.ts` | 105 | I |
| `.flue/evals/harness.ts` | 212 | P |
| `.flue/evals/mocks/github-repo-tools.ts` | 45 | I |
| `.flue/evals/review-fixtures.ts` | 142 | I |
| `.flue/evals/review-judge.eval.ts` | 374 | P |
| `.flue/evals/spam-filter.eval.ts` | 165 | I |
| `.flue/evals/style-guide-reviewer.eval.ts` | 76 | R |
| `.flue/flue.config.ts` | 7 | I |
| `.flue/lib/agents/agent-step.test.ts` | 47 | I |
| `.flue/lib/agents/agent-step.ts` | 149 | I |
| `.flue/lib/agents/durability.ts` | 23 | I |
| `.flue/lib/agents/instructions.test.ts` | 14 | I |
| `.flue/lib/agents/instructions.ts` | 21 | I |
| `.flue/lib/agents/models.ts` | 5 | I |
| `.flue/lib/agents/review-rules.test.ts` | 21 | I |
| `.flue/lib/agents/review-rules.ts` | 57 | I |
| `.flue/lib/agents/submit-result.ts` | 48 | I |
| `.flue/lib/bot-role.ts` | 1 | I |
| `.flue/lib/changelog-date-check.test.ts` | 251 | I |
| `.flue/lib/changelog-date-check.ts` | 253 | I |
| `.flue/lib/clef.test.ts` | 65 | I |
| `.flue/lib/clef.ts` | 106 | I |
| `.flue/lib/codeowners.test.ts` | 76 | I |
| `.flue/lib/codeowners.ts` | 99 | I |
| `.flue/lib/comment-spam.test.ts` | 310 | I |
| `.flue/lib/comment-spam.ts` | 289 | I |
| `.flue/lib/dependabot-review.test.ts` | 236 | I |
| `.flue/lib/dependabot-review.ts` | 357 | I |
| `.flue/lib/dev-clef-eval-routes.test.ts` | 101 | I |
| `.flue/lib/dev-clef-eval-routes.ts` | 49 | I |
| `.flue/lib/dev-comment-spam-routes.ts` | 63 | I |
| `.flue/lib/dev-effort-label-routes.ts` | 49 | I |
| `.flue/lib/dev-review-routes.test.ts` | 7 | I |
| `.flue/lib/dev-review-routes.ts` | 118 | I |
| `.flue/lib/dev-size-label-routes.ts` | 49 | I |
| `.flue/lib/dev-spam-routes.ts` | 72 | I |
| `.flue/lib/docs-evidence.test.ts` | 255 | I |
| `.flue/lib/docs-evidence.ts` | 406 | I |
| `.flue/lib/draft-stale.test.ts` | 780 | I |
| `.flue/lib/draft-stale.ts` | 554 | I |
| `.flue/lib/effort-assessment.test.ts` | 386 | I |
| `.flue/lib/effort-assessment.ts` | 382 | I |
| `.flue/lib/effort-label.test.ts` | 208 | I |
| `.flue/lib/effort-label.ts` | 233 | I |
| `.flue/lib/github-repo-tools.test.ts` | 110 | I |
| `.flue/lib/github-repo-tools.ts` | 556 | I |
| `.flue/lib/github-webhook.test.ts` | 159 | I |
| `.flue/lib/github-webhook.ts` | 75 | I |
| `.flue/lib/github.test.ts` | 347 | I |
| `.flue/lib/github.ts` | 1394 | I |
| `.flue/lib/pipeline-entry.ts` | 428 | I |
| `.flue/lib/pr-size-label.test.ts` | 130 | I |
| `.flue/lib/pr-size-label.ts` | 68 | I |
| `.flue/lib/rebase-conflict.test.ts` | 58 | I |
| `.flue/lib/rebase-conflict.ts` | 685 | I |
| `.flue/lib/review/agent-input.test.ts` | 129 | I |
| `.flue/lib/review/agent-input.ts` | 251 | I |
| `.flue/lib/review/bot-comment.test.ts` | 23 | I |
| `.flue/lib/review/bot-comment.ts` | 17 | I |
| `.flue/lib/review/diff/code-lines.test.ts` | 88 | I |
| `.flue/lib/review/diff/code-lines.ts` | 85 | I |
| `.flue/lib/review/diff/comments.ts` | 86 | I |
| `.flue/lib/review/diff/diff.test.ts` | 452 | I |
| `.flue/lib/review/diff/filter.ts` | 75 | I |
| `.flue/lib/review/diff/findings.ts` | 54 | I |
| `.flue/lib/review/diff/fingerprint.ts` | 32 | I |
| `.flue/lib/review/diff/format.ts` | 134 | I |
| `.flue/lib/review/diff/patch.ts` | 46 | I |
| `.flue/lib/review/diff/relocate-full.test.ts` | 98 | I |
| `.flue/lib/review/diff/relocate.ts` | 54 | I |
| `.flue/lib/review/diff/target-skip.test.ts` | 86 | I |
| `.flue/lib/review/diff/target.ts` | 179 | I |
| `.flue/lib/review/flow.test.ts` | 460 | I |
| `.flue/lib/review/hash.ts` | 23 | I |
| `.flue/lib/review/pipeline-reraise.test.ts` | 89 | I |
| `.flue/lib/review/pipeline.test.ts` | 326 | I |
| `.flue/lib/review/pipeline.ts` | 244 | I |
| `.flue/lib/review/read-patch-r2.ts` | 25 | I |
| `.flue/lib/review/read-patch.test.ts` | 44 | I |
| `.flue/lib/review/read-patch.ts` | 99 | I |
| `.flue/lib/review/render.test.ts` | 291 | I |
| `.flue/lib/review/render.ts` | 457 | I |
| `.flue/lib/review/run-agents.ts` | 33 | I |
| `.flue/lib/review/run-context.ts` | 145 | I |
| `.flue/lib/review/run-finish.test.ts` | 372 | I |
| `.flue/lib/review/run-finish.ts` | 444 | I |
| `.flue/lib/review/run-start.test.ts` | 301 | I |
| `.flue/lib/review/run-start.ts` | 315 | I |
| `.flue/lib/review/start.test.ts` | 56 | I |
| `.flue/lib/review/start.ts` | 61 | I |
| `.flue/lib/review/state.test.ts` | 130 | I |
| `.flue/lib/review/state.ts` | 229 | I |
| `.flue/lib/review/testing/r2-fake.ts` | 53 | I |
| `.flue/lib/review/types.test.ts` | 105 | I |
| `.flue/lib/review/types.ts` | 348 | I |
| `.flue/lib/reviewer-contact-policy.test.ts` | 18 | I |
| `.flue/lib/reviewer-contact-policy.ts` | 19 | I |
| `.flue/lib/reviewer-recommendations.test.ts` | 960 | I |
| `.flue/lib/reviewer-recommendations.ts` | 718 | I |
| `.flue/lib/run-reviewer-recommendations.test.ts` | 92 | I |
| `.flue/lib/run-reviewer-recommendations.ts` | 485 | I |
| `.flue/lib/spam-filter.test.ts` | 112 | I |
| `.flue/lib/spam-filter.ts` | 239 | I |
| `.flue/lib/token-provider.ts` | 32 | I |
| `.flue/lib/webhook-classify.test.ts` | 355 | I |
| `.flue/lib/webhook-classify.ts` | 233 | I |
| `.flue/orchestrators/comment-spam-workflow.test.ts` | 132 | I |
| `.flue/orchestrators/comment-spam-workflow.ts` | 186 | I |
| `.flue/orchestrators/dependabot-review-workflow.ts` | 315 | I |
| `.flue/orchestrators/effort-label-workflow.test.ts` | 206 | I |
| `.flue/orchestrators/effort-label-workflow.ts` | 212 | I |
| `.flue/orchestrators/ingest-workflow.test.ts` | 184 | I |
| `.flue/orchestrators/ingest-workflow.ts` | 249 | I |
| `.flue/orchestrators/rebase-workflow.ts` | 474 | I |
| `.flue/package.json` | 33 | I |
| `.flue/pnpm-lock.yaml` | 5570 | I |
| `.flue/pnpm-workspace.yaml` | 19 | I |
| `.flue/prompts/code-reviewer.md` | 11 | R |
| `.flue/prompts/code-rules.md` | 18 | I |
| `.flue/prompts/conventions-reviewer.md` | 9 | I |
| `.flue/prompts/conventions-rules.md` | 9 | I |
| `.flue/prompts/dependabot-review.md` | 102 | I |
| `.flue/prompts/effort-label.md` | 67 | I |
| `.flue/prompts/rebase-conflict.md` | 53 | I |
| `.flue/prompts/repo-tools.md` | 6 | I |
| `.flue/prompts/review-judge.md` | 21 | R |
| `.flue/prompts/reviewer-shared.md` | 36 | R |
| `.flue/prompts/style-guide-reviewer.md` | 9 | I |
| `.flue/prompts/style-guide/RULE-AUTHORING.md` | 39 | R |
| `.flue/prompts/style-guide/always/core-content.md` | 119 | I |
| `.flue/prompts/style-guide/components/anchor-heading.md` | 22 | I |
| `.flue/prompts/style-guide/components/api-request.md` | 22 | I |
| `.flue/prompts/style-guide/components/curl.md` | 22 | I |
| `.flue/prompts/style-guide/components/dash-button.md` | 24 | I |
| `.flue/prompts/style-guide/components/extra-flag-details.md` | 24 | I |
| `.flue/prompts/style-guide/components/file-tree.md` | 16 | I |
| `.flue/prompts/style-guide/components/markdown.md` | 22 | I |
| `.flue/prompts/style-guide/components/package-managers.md` | 22 | I |
| `.flue/prompts/style-guide/components/steps.md` | 21 | I |
| `.flue/prompts/style-guide/components/subtract-ip-calculator.md` | 23 | I |
| `.flue/prompts/style-guide/components/tabs.md` | 26 | I |
| `.flue/prompts/style-guide/components/typescript-example.md` | 28 | I |
| `.flue/prompts/style-guide/components/wrangler-config.md` | 22 | I |
| `.flue/prompts/style-guide/conditional/code-blocks.md` | 34 | I |
| `.flue/prompts/style-guide/conditional/frontmatter.md` | 22 | I |
| `.flue/prompts/style-guide/conditional/images.md` | 37 | I |
| `.flue/prompts/style-guide/conditional/imports.md` | 24 | I |
| `.flue/prompts/style-guide/conditional/links.md` | 21 | I |
| `.flue/roles/cloudflare-docs-bot.md` | 17 | R |
| `.flue/tsconfig.json` | 12 | I |
| `.flue/vite.config.ts` | 167 | I |
| `.flue/vitest.config.ts` | 11 | I |
| `.flue/vitest.evals.config.ts` | 23 | I |
| `.flue/wrangler.jsonc` | 260 | I |
| `.opencode/agents` | 0 | I |
| `.windsurf/rules/general-rules.md` | 63 | I |
| `.windsurf/workflows` | 0 | I |
| `AGENTS.md` | 298 | I |
| `GEMINI.md` | 0 | I |
| `src/content/docs/agents/skills/execution.mdx` | 144 | I |
| `src/content/docs/agents/skills/index.mdx` | 167 | I |
| `src/content/docs/agents/skills/sources/code.mdx` | 84 | I |
| `src/content/docs/agents/skills/sources/computer.mdx` | 146 | I |
| `src/content/docs/agents/skills/sources/index.mdx` | 17 | I |
| `src/content/docs/agents/skills/sources/r2.mdx` | 79 | I |

**containers**

| File | Lines | Status |
|---|---:|:---:|
| `AGENTS.md` | 178 | I |

**kumo**

| File | Lines | Status |
|---|---:|:---:|
| `.agents/skills/index-knowledge/SKILL.md` | 375 | I |
| `.opencode/agents/kumo.md` | 214 | I |
| `AGENTS.md` | 171 | I |
| `ci/AGENTS.md` | 107 | I |
| `packages/kumo-docs-astro/AGENTS.md` | 114 | I |
| `packages/kumo-docs-astro/src/components/demos/AGENTS.md` | 57 | I |
| `packages/kumo-figma/AGENTS.md` | 91 | I |
| `packages/kumo-figma/src/generators/AGENTS.md` | 169 | I |
| `packages/kumo-screenshot-worker/AGENTS.md` | 93 | I |
| `packages/kumo/AGENTS.md` | 127 | I |
| `packages/kumo/src/components/AGENTS.md` | 190 | I |
| `skills/kumo-design/SKILL.md` | 315 | I |

**mcp**

| File | Lines | Status |
|---|---:|:---:|
| `AGENTS.md` | 409 | R |
| `CLAUDE.md` | 1 | R |
| `src/generated/forge-mcp/cloudforceOne/threatSignals/articles/skills/tools.ts` | 1989 | I |
| `src/generated/forge-mcp/cloudforceOne/threatSignals/feeds/skills/tools.ts` | 661 | I |
| `src/generated/forge-mcp/cloudforceOne/threatSignals/skills/tagCategories/tools.ts` | 349 | I |
| `src/generated/forge-mcp/cloudforceOne/threatSignals/skills/tools.ts` | 1807 | I |
| `src/skills/bundle.ts` | 227 | P |
| `src/skills/handlers.ts` | 95 | P |
| `src/skills/sync.ts` | 166 | P |
| `src/skills/tar.ts` | 103 | I |
| `src/skills/types.ts` | 72 | R |
| `tests/skills/bundle.test.ts` | 174 | I |
| `tests/skills/server.test.ts` | 234 | I |
| `tests/skills/sync.test.ts` | 144 | I |

**templates**

| File | Lines | Status |
|---|---:|:---:|
| `AGENTS.md` | 387 | I |
| `CLAUDE.md` | 230 | I |
| `agent-visibility-template/AGENTS.md` | 52 | I |
| `ai-brand-visibility-template/AGENTS.md` | 54 | I |
| `x402-proxy-template/AGENTS.md` | 643 | I |

**vibesdk**

| File | Lines | Status |
|---|---:|:---:|
| `AGENTS.md` | 54 | I |
| `CLAUDE.md` | 159 | P |
| `worker/agents/operations/prompts/agenticBuilderPrompts.ts` | 500 | I |
| `worker/agents/operations/prompts/deepDebuggerPrompts.ts` | 458 | I |
| `worker/agents/operations/prompts/phaseImplementationPrompts.ts` | 104 | I |
| `worker/agents/think/prompts/anthropic.txt` | 98 | P |
| `worker/agents/think/prompts/beast.txt` | 147 | I |
| `worker/agents/think/prompts/codex.txt` | 79 | I |
| `worker/agents/think/prompts/default.txt` | 99 | I |
| `worker/agents/think/prompts/gemini.txt` | 155 | I |
| `worker/agents/think/prompts/gpt.txt` | 107 | P |
| `worker/agents/think/prompts/kimi.txt` | 114 | I |
| `worker/agents/think/prompts/max-steps.txt` | 16 | R |
| `worker/agents/think/prompts/trinity.txt` | 97 | I |
| `worker/agents/think/skills/app-ai-binding/SKILL.md` | 108 | I |
| `worker/agents/think/skills/app-file-structure/SKILL.md` | 485 | I |
| `worker/agents/think/skills/frontend-design-landing-page/SKILL.md` | 3278 | I |
| `worker/agents/think/skills/frontend-design-saas/SKILL.md` | 3439 | I |
| `worker/agents/think/skills/frontend-design/SKILL.md` | 41 | I |

**vinext**

| File | Lines | Status |
|---|---:|:---:|
| `.agents/skills/fix/SKILL.md` | 101 | R |
| `.agents/skills/fix/agents/openai.yaml` | 3 | I |
| `.agents/skills/fix/references/rules.md` | 145 | I |
| `.agents/skills/migrate-to-vinext/SKILL.md` | 267 | I |
| `.agents/skills/migrate-to-vinext/references/compatibility.md` | 115 | I |
| `.agents/skills/migrate-to-vinext/references/config-examples.md` | 191 | I |
| `.agents/skills/migrate-to-vinext/references/troubleshooting.md` | 94 | I |
| `.agents/skills/triage/SKILL.md` | 48 | I |
| `.agents/skills/triage/agents/openai.yaml` | 3 | I |
| `.agents/skills/triage/references/rules.md` | 102 | I |
| `.claude/skills/fix` | 0 | I |
| `.claude/skills/triage` | 0 | I |
| `.opencode/agents/nextjs-tracker.md` | 138 | I |
| `.opencode/agents/reviewer.md` | 53 | I |
| `.opencode/agents/viguy.md` | 256 | P |
| `.opencode/commands/address-review.md` | 79 | I |
| `.opencode/commands/autopilot.md` | 87 | R |
| `.opencode/commands/fix-issue.md` | 72 | I |
| `.opencode/commands/review-pr.md` | 35 | I |
| `AGENTS.md` | 576 | I |
| `CLAUDE.md` | 1 | I |

**workerd**

| File | Lines | Status |
|---|---:|:---:|
| `.claude/agents/architect.md` | 21 | I |
| `.claude/agents/code-review.md` | 22 | I |
| `.claude/agents/review-api.md` | 17 | I |
| `.claude/agents/review-safety.md` | 17 | R |
| `.claude/agents/review-style.md` | 17 | I |
| `.claude/commands` | 0 | I |
| `.claude/skills` | 0 | I |
| `.opencode/agent/architect.md` | 153 | I |
| `.opencode/agent/code-review.md` | 257 | R |
| `.opencode/agent/review-api.md` | 77 | I |
| `.opencode/agent/review-safety.md` | 86 | R |
| `.opencode/agent/review-style.md` | 84 | I |
| `.opencode/commands/autogate.md` | 68 | I |
| `.opencode/commands/changelog.md` | 59 | I |
| `.opencode/commands/compat-flag.md` | 51 | I |
| `.opencode/commands/explain.md` | 49 | I |
| `.opencode/commands/find-owner.md` | 37 | I |
| `.opencode/commands/investigate.md` | 180 | I |
| `.opencode/commands/whats-new.md` | 80 | I |
| `.opencode/lib/capnp.ts` | 98 | I |
| `.opencode/lib/compat-date-at.ts` | 229 | I |
| `.opencode/lib/mcp-server.ts` | 114 | I |
| `.opencode/lib/next-capnp-ordinal.ts` | 228 | I |
| `.opencode/lib/tool-def.ts` | 54 | I |
| `.opencode/skills/bazel-test-hygiene/SKILL.md` | 60 | I |
| `.opencode/skills/commit-categories/SKILL.md` | 44 | I |
| `.opencode/skills/dad-jokes/SKILL.md` | 34 | I |
| `.opencode/skills/find-and-run-tests/SKILL.md` | 70 | I |
| `.opencode/skills/identify-reviewer/SKILL.md` | 60 | I |
| `.opencode/skills/investigation-notes/SKILL.md` | 113 | I |
| `.opencode/skills/iwyu/SKILL.md` | 29 | I |
| `.opencode/skills/kj-style/SKILL.md` | 6 | I |
| `.opencode/skills/markdown-drafts/SKILL.md` | 71 | I |
| `.opencode/skills/parent-project-skills/SKILL.md` | 49 | I |
| `.opencode/skills/pr-review-guide/SKILL.md` | 101 | I |
| `.opencode/skills/receiving-code-review/SKILL.md` | 213 | R |
| `.opencode/skills/rust-review/SKILL.md` | 6 | I |
| `.opencode/skills/ts-style/SKILL.md` | 6 | I |
| `.opencode/skills/update-v8/SKILL.md` | 207 | I |
| `.opencode/skills/wd-test-format/SKILL.md` | 172 | I |
| `.opencode/skills/wd-test-format/reference/advanced-configs.md` | 155 | I |
| `.opencode/skills/workerd-api-review/SKILL.md` | 6 | I |
| `.opencode/skills/workerd-safety-review/SKILL.md` | 6 | R |
| `.opencode/skills/wpt-update/SKILL.md` | 322 | I |
| `.opencode/tools/compat-date-at.ts` | 6 | I |
| `.opencode/tools/next-capnp-ordinal.ts` | 6 | I |
| `AGENTS.md` | 369 | I |
| `build/AGENTS.md` | 132 | I |
| `src/bench/streams/AGENTS.md` | 123 | I |
| `src/bench/streams/body/AGENTS.md` | 35 | I |
| `src/bench/streams/compression/AGENTS.md` | 26 | I |
| `src/bench/streams/digest/AGENTS.md` | 21 | I |
| `src/bench/streams/encoding/AGENTS.md` | 32 | I |
| `src/bench/streams/identity/AGENTS.md` | 29 | I |
| `src/bench/streams/piping/AGENTS.md` | 16 | I |
| `src/bench/streams/readable-byte/AGENTS.md` | 30 | I |
| `src/bench/streams/readable/AGENTS.md` | 30 | I |
| `src/bench/streams/strategies/AGENTS.md` | 23 | I |
| `src/bench/streams/transform/AGENTS.md` | 17 | I |
| `src/bench/streams/writable/AGENTS.md` | 13 | I |
| `src/cloudflare/AGENTS.md` | 33 | I |
| `src/node/AGENTS.md` | 62 | I |
| `src/per_isolate/AGENTS.md` | 314 | I |
| `src/per_isolate/crypto/AGENTS.md` | 93 | I |
| `src/per_isolate/events/AGENTS.md` | 29 | I |
| `src/per_isolate/webfs/AGENTS.md` | 119 | I |
| `src/per_isolate/webstreams/AGENTS.md` | 292 | I |
| `src/pyodide/AGENTS.md` | 37 | I |
| `src/rust/AGENTS.md` | 177 | I |
| `src/rust/cxx/AGENTS.md` | 124 | I |
| `src/tests/events/AGENTS.md` | 50 | I |
| `src/tests/events/eventsource/AGENTS.md` | 189 | I |
| `src/tests/events/messagechannel/AGENTS.md` | 150 | I |
| `src/tests/node/AGENTS.md` | 55 | I |
| `src/tests/node/http-client/AGENTS.md` | 275 | I |
| `src/tests/node/http-server/AGENTS.md` | 213 | I |
| `src/tests/node/net/AGENTS.md` | 216 | I |
| `src/tests/node/stream/AGENTS.md` | 393 | I |
| `src/tests/streams/AGENTS.md` | 168 | I |
| `src/tests/streams/cache/AGENTS.md` | 45 | I |
| `src/tests/streams/compression/AGENTS.md` | 221 | I |
| `src/tests/streams/digest/AGENTS.md` | 129 | I |
| `src/tests/streams/encoding/AGENTS.md` | 239 | I |
| `src/tests/streams/formdata/AGENTS.md` | 26 | I |
| `src/tests/streams/htmlrewriter/AGENTS.md` | 48 | I |
| `src/tests/streams/identity/AGENTS.md` | 330 | I |
| `src/tests/streams/inspect/AGENTS.md` | 38 | I |
| `src/tests/streams/iocontext/AGENTS.md` | 33 | I |
| `src/tests/streams/piping/AGENTS.md` | 104 | I |
| `src/tests/streams/r2-patterns/AGENTS.md` | 29 | I |
| `src/tests/streams/readable-byte/AGENTS.md` | 166 | I |
| `src/tests/streams/readable/AGENTS.md` | 156 | I |
| `src/tests/streams/scaling/AGENTS.md` | 42 | I |
| `src/tests/streams/sockets/AGENTS.md` | 72 | I |
| `src/tests/streams/strategies/AGENTS.md` | 55 | I |
| `src/tests/streams/transform/AGENTS.md` | 108 | I |
| `src/tests/streams/writable/AGENTS.md` | 117 | I |
| `src/workerd/api/AGENTS.md` | 48 | I |
| `src/workerd/api/crypto/AGENTS.md` | 28 | I |
| `src/workerd/api/node/AGENTS.md` | 23 | I |
| `src/workerd/api/streams/AGENTS.md` | 84 | I |
| `src/workerd/io/AGENTS.md` | 69 | I |
| `src/workerd/jsg/AGENTS.md` | 193 | I |
| `src/workerd/server/AGENTS.md` | 142 | I |
| `src/workerd/util/AGENTS.md` | 50 | I |
| `src/wpt/fetch/AGENTS.md` | 39 | I |
| `types/AGENTS.md` | 99 | I |

**workers-oauth-provider**

| File | Lines | Status |
|---|---:|:---:|
| `AGENTS.md` | 295 | R |
| `skills/migrate-to-1.x/SKILL.md` | 62 | R |

**workers-sdk**

| File | Lines | Status |
|---|---:|:---:|
| `.github/skills/issue-review.md` | 376 | P |
| `.opencode/agents/bonk.md` | 221 | P |
| `.opencode/skills/local-explorer/SKILL.md` | 74 | I |
| `.opencode/skills/local-explorer/assets/local-explorer-diagram.md` | 57 | I |
| `AGENTS.md` | 157 | I |
| `CLAUDE.md` | 5 | I |
| `packages/create-cloudflare/AGENTS.md` | 35 | I |
| `packages/miniflare/AGENTS.md` | 65 | I |
| `packages/vite-plugin-cloudflare/AGENTS.md` | 117 | I |
| `packages/vitest-plugin/AGENTS.md` | 92 | I |
| `packages/workers-auth/AGENTS.md` | 214 | I |
| `packages/workers-utils/AGENTS.md` | 48 | I |
| `packages/wrangler/AGENTS.md` | 65 | I |
