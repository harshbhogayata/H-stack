# H-Stack

A Claude Code skill stack, built from scratch, one category at a time.

## Install

In Claude Code (desktop app, CLI or web):

```
/plugin marketplace add harshbhogayata/h-stack
/plugin install h-stack@h-stack
```

Skills run as `/h-stack:<skill>`. The repo is private, so the machine needs GitHub access to it.

To update after new commits: `/plugin` → Marketplaces → `h-stack` → update (or enable auto-update).

## Categories

| # | Category | Status |
|---|---|---|
| 01 | Core rules & principles | Researched |
| 02 | Workflow orchestration | Researched |
| 03 | Ideation & product thinking | Researched |
| 04 | Specs & planning | Researched |
| 05 | Build & TDD | Researched |
| 06 | Debugging & performance | Researched |
| 07 | Code review & quality | Researched |
| 08 | Testing & QA | Researched |
| 09 | Security | Researched |
| 10 | Design & UI | Researched |
| 11 | Memory & context | Researched |
| 12 | Docs & writing | Researched |
| 13 | Git, PR & shipping | Researched |
| 14 | Autonomous loops & multi-agent | Researched |
| 15 | Skill authoring & meta | Researched |
| 16 | Business, growth & research | Researched |

Each category's top 10 and the ideas worth taking are in [`research/`](research/README.md).

## How we build
Research → decide → build our own skill → validate (`claude plugin validate .`) → commit. Rules for working on this repo are in [`CLAUDE.md`](CLAUDE.md).
