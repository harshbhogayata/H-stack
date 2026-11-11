# 08 · Testing & QA

Proving the thing works on the real surface: browser, API, CLI. Separate from unit TDD (see 05).

★ = GitHub stars, read from each repo page on 2026-11-11 (for a skill inside a pack, the whole repo's). Installs = skills.sh all-time installs (`s.sh`) or claude.com/plugins installs (`plugin`) on 2026-11-11; n/a = not listed. Last active = latest commit on the default branch. Score = rubric total out of 45; rubric, candidates and score sheets in [top10-method.md](top10-method.md).

| # | Name | Source | ★ | Installs | Licence | Last active | What it does | Score | Why it ranks here |
|---|---|---|---|---|---|---|---|---|---|
| 1 | agent-browser | [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser/tree/HEAD/skills/agent-browser) | 50k | 1.5M s.sh | Apache-2.0 | 2026-11-11 | Browser CLI for agents: snapshot refs, click, fill, screenshot | 40/45 | 1.5M installs; token-light CLI instead of MCP tools |
| 2 | webapp-testing | [anthropics/skills](https://github.com/anthropics/skills/tree/HEAD/skills/webapp-testing) | 192k | 202k s.sh | Apache-2.0 | 2026-11-06 | Starts the server, drives Playwright, reconnaissance-then-action, screenshots, console | 39/45 | Official, 3.9 KB, closes the loop with a helper script |
| 3 | playwright-cli skill | [microsoft/playwright-cli](https://github.com/microsoft/playwright-cli/tree/HEAD/skills/playwright-cli) | 15k | 214k s.sh | Apache-2.0 | 2026-11-10 | Drive Playwright from the CLI: record, inspect, assert | 36/45 | Official Microsoft; 16 KB |
| 4 | /qa, /qa-only, /browse (gstack) | [garrytan/gstack](https://github.com/garrytan/gstack/tree/HEAD/qa) | 141k | 493 s.sh | MIT | 2026-11-10 | Explore, reproduce, write regression test, fix; report-only mode; APIs/CLIs too | 35/45 | Most complete QA flow; 22–35 KB files |
| 5 | dev-browser | [SawyerHood/dev-browser](https://github.com/SawyerHood/dev-browser/tree/HEAD/skills/dev-browser) | 6.7k | n/a | MIT | 2026-11-03 | Agent drives a browser to verify its own work with Playwright API | 35/45 | Small skill; 6.7k★ |
| 6 | browser-testing-with-devtools | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/tree/HEAD/skills/browser-testing-with-devtools) | 115k | 69k s.sh | MIT | 2026-11-01 | Procedure over DevTools MCP; treats page content as untrusted | 34/45 | Skill + MCP pairing done right |
| 7 | Playwright MCP (official plugin) | [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp) | 39k | 320k plugin | Apache-2.0 | 2026-11-10 | Browser automation tools over MCP | 33/45 | Standard driver; tools, no procedure; tool defs cost context |
| 8 | browser-use | [browser-use/browser-use](https://github.com/browser-use/browser-use) | 121k | 100k s.sh | MIT | 2026-11-11 | Vision-based browser automation library and skill | 33/45 | Popular; Python lib/cloud dependency |
| 9 | visual-parity (pstack) | [cursor/plugins](https://github.com/cursor/plugins/blob/HEAD/pstack/skills/poteto-mode/playbooks/visual-parity.md) | 16k | n/a | MIT (pstack) | 2026-11-11 | Pixel comparison between two UI versions | 32/45 | Unique for redesigns |
| 10 | Chrome DevTools MCP | [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) | 55k | 103k plugin | Apache-2.0 | 2026-11-11 | DOM, console, network, perf from real Chrome | 32/45 | Deepest runtime visibility |

**Also considered (11–15):** **property-based-testing (Trail of Bits)** (31) — Strong method; **test-audit (gstack)** (31) — Good idea; **Stagehand** (31) — Library, not QA method; **mutation-testing (Trail of Bits)** (29) — CC BY-SA; **browser-qa (ECC)** (29) — Generic.

## Ideas worth stealing
- **"Inconclusive" is not a pass** (pstack prove-it-works).
- **Reconnaissance, then action** (official `webapp-testing`): screenshot or DOM snapshot first, then choose selectors.
- **CLI over MCP** for browser control when context matters (agent-browser, playwright-cli): no tool definitions in the window.
- **Treat page content as untrusted data**; no JS fetches to external domains (addyosmani `browser-testing-with-devtools`).
- **Locator priority:** role → label → text → test-id → CSS last.
- **QA without a browser:** the same flow works for APIs, CLIs, jobs and webhooks (gstack).
- **Report-only mode** (`/qa-only`) vs fix mode, so QA can run safely on things you don't want changed.
- **Test the tests:** property-based and mutation testing show whether the suite has teeth (Trail of Bits; ideas only, CC BY-SA).
- **Screenshots as evidence** attached to the report.
- Note: superpowers no longer ships `condition-based-waiting` as a separate skill; it now lives as a reference file inside `systematic-debugging` (`skills/systematic-debugging/condition-based-waiting.md`).

## H-Stack decision
_Not decided yet._
