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
- **No slash commands.** Every skill sets `user-invocable: false`; activation comes from the router, classifier and event triggers in `research/00-activation-and-experience.md`.
- Lead each `description` with the use case; trigger phrases go in `when_to_use`. Combined cap: 1,536 characters.
- Hook and classifier text is factual ("Relevant skill: X because Y"), never "YOU MUST".
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
Skills are namespaced `h-stack:<skill>` but never shown in the `/` menu. Entry name and manifest name must both be `h-stack`.

## Validate
```bash
claude plugin validate .
```
