# 08 · Testing & QA

Proving the thing works on the real surface: browser, API, CLI. Separate from unit TDD (see 05).

★ = GitHub stars on 2026-11-11 (for a skill inside a pack, the stars are the whole repo's).

| # | Name | Source | ★ | License | What it does | Why it ranks here |
|---|---|---|---|---|---|---|
| 1 | webapp-testing | [anthropics/skills](https://github.com/anthropics/skills) | 192k | Apache-2.0 | Starts the dev server, drives Playwright, screenshots, reads console | Official, simple, closes the loop |
| 2 | Playwright MCP | [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp) | 39k | Apache-2.0 | Browser automation tools over MCP | Standard browser driver |
| 3 | Chrome DevTools MCP | [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) | 55k | Apache-2.0 | DOM, console, network, perf from real Chrome | Deepest runtime visibility |
| 4 | agent-browser | [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) | 48k | Apache-2.0 | Browser automation CLI built for agents | Lighter than MCP, exploratory QA |
| 5 | /qa, /qa-only, /browse | [garrytan/gstack](https://github.com/garrytan/gstack) | 141k | MIT | Explore the app, reproduce, write regression, fix; also APIs/CLIs/webhooks | Best end-to-end QA flow |
| 6 | browser-testing-with-devtools | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | 115k | MIT | Procedure on top of DevTools MCP | Skill + MCP pairing done right |
| 7 | playwright-skill | [lackeyjb/playwright-skill](https://github.com/lackeyjb/playwright-skill) | 3.3k | MIT | General Playwright automation, auto-loads | Good defaults for test code |
| 8 | visual-parity | [cursor/plugins › pstack](https://github.com/cursor/plugins/tree/main/pstack) | 16k (repo) | MIT | Pixel-exact UI comparison between two versions | Unique, useful for redesigns |
| 9 | condition-based-waiting | [obra/superpowers](https://github.com/obra/superpowers) | 316k | MIT | Replace sleeps/timeouts with waits on real conditions | Fixes flaky tests at the source |
| 10 | playwright-e2e-testing | [qaskills.sh](https://qaskills.sh/blog/best-claude-code-skills-for-testing-2026) | ? | ? | Locator priority (getByRole first), storageState auth, traces | Good locator rules; source not verified |

## Ideas worth stealing
- **"Inconclusive" is not a pass** (pstack prove-it-works).
- **Locator priority:** role → label → text → test-id → CSS last.
- **QA without a browser:** the same flow works for APIs, CLIs, jobs and webhooks (gstack).
- **Report-only mode** (`/qa-only`) vs fix mode, so QA can run safely on things you don't want changed.
- **Screenshots as evidence** attached to the report.

## H-Stack decision
_Not decided yet._
