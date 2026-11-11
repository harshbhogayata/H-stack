# H-Stack

A Claude Code skill stack, built from scratch, one category at a time.

**North star:** get as much real capability out of the model as a harness can, measured on our own eval suite: reliability, autonomy horizon, learning over time, judgment, cost. Nothing ships unless it moves those numbers. Details in [`CLAUDE.md`](CLAUDE.md#north-star).

## Install

In Claude Code (desktop app, CLI or web):

```
/plugin marketplace add harshbhogayata/h-stack
/plugin install h-stack@h-stack
```

No slash commands: H-Stack picks the right skill itself and shows what it picked. See [activation & experience](research/00-activation-and-experience.md). The repo is private, so the machine needs GitHub access to it.

To update after new commits: `/plugin` → Marketplaces → `h-stack` → update (or enable auto-update).

## Categories

| # | Category | Status |
|---|---|---|
| 00 | Activation & experience | Researched, design proposed |
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
