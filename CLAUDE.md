# H-Stack — working rules

H-Stack is a Claude Code skill stack built **from scratch**. Other stacks (superpowers, gstack, pstack, mattpocock/skills, ...) are reference material only; see `research/`.

## Before doing anything
- Read first. Check this file, `README.md`, and the relevant `research/NN-*.md` before acting.
- Ask when the request is ambiguous instead of guessing and running.

## Research tool order
1. Built-in `WebSearch` / `WebFetch`.
2. Context.dev MCP (`web-search`, `web-scrape`, `submit-batch`) — use for GitHub pages and star counts.
3. Firecrawl — **last-resort fallback only**.

In cloud sessions `github.com` and `api.github.com` are blocked for repos not attached to the session; `raw.githubusercontent.com` works with `curl`.

## Building skills
- Write our own SKILL.md files. Take ideas and mechanisms, not text.
- Never copy text from copyleft sources (GPL, AGPL, CC BY-SA). Short quotes from MIT/Apache sources need attribution in `research/`.
- Credit inspirations in the category's research file under "H-Stack decision".
- One category at a time: research → decide → build → validate → commit.
- Keep always-on context small. Rules that must never slip belong in hooks, not prose.

## Layout
```
.claude-plugin/marketplace.json   marketplace "h-stack"
plugins/h-stack/                  the plugin (skills/, agents/, hooks/)
research/                         top-10 per category + decisions
```
Skills are invoked as `/h-stack:<skill>`. Entry name and manifest name must both be `h-stack`.

## Validate
```bash
claude plugin validate .
```
