# 11 · Memory & context

What the agent remembers across sessions, and how it gets the right facts (docs, project language) into context.

★ = GitHub stars on 2026-11-11 (for a skill inside a pack, the stars are the whole repo's).

| # | Name | Source | ★ | License | What it does | Why it ranks here |
|---|---|---|---|---|---|---|
| 1 | Built-in CLAUDE.md + auto memory | Claude Code | — | — | Rules you write + notes Claude keeps; reloaded after compaction | Zero install; start here |
| 2 | claude-mem | [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | 116k | Apache-2.0 | Captures sessions, compresses, injects relevant context next time | Most popular memory plugin |
| 3 | Context7 | [upstash/context7](https://github.com/upstash/context7) | 64k | MIT | Up-to-date, version-specific library docs | Stops invented APIs |
| 4 | agentmemory | [rohitg00/agentmemory](https://github.com/rohitg00/agentmemory) | 30k | Apache-2.0 | Local memory server; can import old transcripts; no model needed | Works from day zero |
| 5 | Hindsight | [vectorize-io/hindsight](https://github.com/vectorize-io/hindsight) | 60k | MIT | Agent memory that learns; strongest published retrieval scores | Best accuracy claims |
| 6 | Mem0 | [mem0ai/mem0](https://github.com/mem0ai/mem0) | 69k | Apache-2.0 | Hosted or self-hosted memory layer + Claude Code plugin | Biggest memory community |
| 7 | Supermemory | [supermemoryai/supermemory](https://github.com/supermemoryai/supermemory) | 32k | MIT | Memory engine, local or hosted, plugin retrieves before prompts | Fast, self-hostable |
| 8 | GLOSSARY.md + ADRs + handoff | [mattpocock/skills](https://github.com/mattpocock/skills) | 321k | MIT | Shared project language; handoff doc for the next agent | Memory as plain repo files |
| 9 | claude-md-management (official) | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | 47k | Apache-2.0 | Audits CLAUDE.md, captures session learnings | Keeps rules files healthy |
| 10 | Basic Memory | [basicmachines-co/basic-memory](https://github.com/basicmachines-co/basic-memory) | 4.6k | **AGPL-3.0** | Linked Markdown notes you own | Good model; copyleft, ideas only |

## Ideas worth stealing
- **Memory as files in the repo** (glossary, decisions, lessons): versioned, reviewable, shared with the team.
- **Handoff document** when context runs out or work passes to another agent.
- **Docs on demand** (Context7) instead of trusting the model's memory of an API.
- **Only load what's relevant:** path-scoped rules, summaries over raw transcripts.
- **Review auto memory**; it's recall, not policy.

## H-Stack decision
_Not decided yet._
