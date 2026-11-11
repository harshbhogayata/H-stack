# 11 · Memory & context

What the agent remembers across sessions, and how it gets the right facts (docs, project language) into context.

★ = GitHub stars, read from each repo page on 2026-11-11 (for a skill inside a pack, the whole repo's). Installs = skills.sh all-time installs (`s.sh`) or claude.com/plugins installs (`plugin`) on 2026-11-11; n/a = not listed. Last active = latest commit on the default branch. Score = rubric total out of 45; rubric, candidates and score sheets in [top10-method.md](top10-method.md).

| # | Name | Source | ★ | Installs | Licence | Last active | What it does | Score | Why it ranks here |
|---|---|---|---|---|---|---|---|---|---|
| 1 | handoff + domain-modeling (GLOSSARY, ADRs) | [mattpocock/skills](https://github.com/mattpocock/skills/tree/HEAD/skills/productivity/handoff) | 321k | 1.1M s.sh | MIT | 2026-10-31 | Handoff doc for the next agent; shared glossary and ADRs in the repo | 40/45 | Memory as reviewable repo files; tiny |
| 2 | Context7 | [upstash/context7](https://github.com/upstash/context7/tree/HEAD/skills/find-docs) | 65k | 418k plugin | MIT | 2026-11-11 | Resolve library ID, fetch version-specific docs on demand | 38/45 | Stops invented APIs; 418k plugin installs |
| 3 | MemPalace | [MemPalace/mempalace](https://github.com/MemPalace/mempalace/tree/HEAD/skills/mempalace) | 61k | 2.3k s.sh | MIT | 2026-11-11 | Verbatim local memory with pluggable retrieval; zero API calls | 36/45 | LongMemEval R@5 96.6% (raw, self-reported); MIT |
| 4 | Hindsight | [vectorize-io/hindsight](https://github.com/vectorize-io/hindsight) | 60k | 9.6k s.sh | MIT | 2026-11-11 | Agent memory server that learns from experience | 35/45 | Strong published retrieval scores; server to run |
| 5 | agentmemory | [rohitg00/agentmemory](https://github.com/rohitg00/agentmemory) | 30k | 15k s.sh | Apache-2.0 | 2026-11-11 | Local memory server; imports transcripts; recall, recap, handoff skills | 35/45 | Published benchmarks; Apache-2.0; no model needed |
| 6 | beads | [gastownhall/beads](https://github.com/gastownhall/beads) | 29k | 2.2k s.sh | MIT | 2026-11-10 | Git-backed issue graph as long-horizon agent memory | 34/45 | Work memory survives sessions; also in 04 |
| 7 | Built-in CLAUDE.md + auto memory | [docs](https://code.claude.com/docs/en/memory) (built-in) | n/a | built-in | n/a (built-in) | built-in | Rules you write plus notes Claude keeps; reloaded after compaction | 34/45 | Built-in; start here |
| 8 | context-mode | [mksglu/context-mode](https://github.com/mksglu/context-mode) | 34k | 3.0k s.sh | **ELv2** | 2026-11-11 | Sandboxes tool output, indexes it, returns only what is asked | 33/45 | Benchmarked context savings (median of 5 runs); Elastic License 2.0 |
| 9 | claude-mem | [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | 116k | 9.3k s.sh | Apache-2.0 | 2026-11-11 | Hooks capture tool calls, compress to observations, inject relevant ones later | 33/45 | Most-starred memory plugin (116k★); local worker; analytics on by default |
| 10 | Mem0 | [mem0ai/mem0](https://github.com/mem0ai/mem0) | 69k | 2.3k s.sh | Apache-2.0 | 2026-11-06 | Memory layer, hosted or self-hosted, with Claude Code plugin | 32/45 | Biggest memory community (68.8k★) |

**Also considered (11–15):** **obsidian-skills (kepano)** (32) — Notes vault as memory; **caveman-compress** (32) — Cuts always-on context; **context-engineering (addy)** (31) — Method, not storage; **strategic-compact / context-budget (ECC)** (30) — Small; **Serena** (29) — Popular.

## Ideas worth stealing
- **Memory as files in the repo** (glossary, decisions, lessons): versioned, reviewable, shared with the team.
- **Handoff document** when context runs out or work passes to another agent.
- **Docs on demand** (Context7) instead of trusting the model's memory of an API.
- **Keep raw tool output out of context** (context-mode): store and index it, return only what is asked.
- **Only load what's relevant:** path-scoped rules, summaries over raw transcripts.
- **Memory benchmarks are self-reported** (MemPalace, Hindsight, agentmemory); run our own recall test before trusting any of them.
- **Local by default:** claude-mem ships anonymous analytics on by default; prefer stores that send nothing.
- **Task graph as memory** (beads): work state survives sessions without prose summaries.
- **Review auto memory**; it's recall, not policy.

## H-Stack decision
_Not decided yet._
