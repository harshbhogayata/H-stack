# 12 · Docs & writing

Prose that reads like a person wrote it: docs, READMEs, PR descriptions, documents.

★ = GitHub stars, read from each repo page on 2026-11-11 (for a skill inside a pack, the whole repo's). Installs = skills.sh all-time installs (`s.sh`) or claude.com/plugins installs (`plugin`) on 2026-11-11; n/a = not listed. Last active = latest commit on the default branch. Score = rubric total out of 45; rubric, candidates and score sheets in [top10-method.md](top10-method.md).

| # | Name | Source | ★ | Installs | Licence | Last active | What it does | Score | Why it ranks here |
|---|---|---|---|---|---|---|---|---|---|
| 1 | docx / pdf / pptx / xlsx | [anthropics/skills](https://github.com/anthropics/skills/tree/HEAD/skills/docx) | 192k | 253k s.sh | Apache-2.0 | 2026-11-06 | Create and edit Office files and PDFs with scripts and validation | 37/45 | Official, production-used in Claude apps |
| 2 | writing-for-agents | [mattpocock/skills](https://github.com/mattpocock/skills/tree/HEAD/skills/productivity/writing-for-agents) | 321k | 546k s.sh | MIT | 2026-10-31 | How to write skills, CLAUDE.md and docs that agents read | 36/45 | Writing for the agent audience; 546k installs |
| 3 | avoid-ai-writing | [conorbronsdon/avoid-ai-writing](https://github.com/conorbronsdon/avoid-ai-writing/tree/HEAD/skills/avoid-ai-writing) | 5.6k | 5.1k s.sh | MIT | 2026-11-05 | Detect-only or rewrite; 49+ pattern classes; tiered replacements; never invent | 35/45 | Only writing skill with dated eval calibration; 33 KB |
| 4 | unslop + technical-writing (pstack) | [cursor/plugins](https://github.com/cursor/plugins/tree/HEAD/pstack/skills/unslop) | 16k | 35k s.sh | MIT (pstack) | 2026-11-11 | Strip AI patterns; shape docs, PRs, commit messages for reader and maintainer | 35/45 | Most-installed pstack skill; compact |
| 5 | doc-coauthoring | [anthropics/skills](https://github.com/anthropics/skills/tree/HEAD/skills/doc-coauthoring) | 192k | 100k s.sh | Apache-2.0 | 2026-11-06 | Structured co-writing: context, refine sections, reader test | 34/45 | Official; reader-testing step |
| 6 | copy-editing (marketingskills) | [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills/tree/HEAD/skills/copy-editing) | 60k | 160k s.sh | MIT | 2026-11-11 | Sweeps copy for clarity, voice, proof | 34/45 | Marketing copy focus |
| 7 | writing-beats / writing-shape (mattpocock) | [mattpocock/skills](https://github.com/mattpocock/skills) | 321k | 535k s.sh | MIT | 2026-10-31 | Article drafting by beats and shape | 34/45 | Article writing; not in the plugin manifest |
| 8 | /document-release + /document-generate (gstack) | [garrytan/gstack](https://github.com/garrytan/gstack/tree/HEAD/document-release) | 141k | 414 s.sh | MIT | 2026-11-10 | Audit docs against changed behaviour; generate missing docs (Diataxis) | 33/45 | Keeps docs in sync on every ship |
| 9 | Humanizer | [blader/humanizer](https://github.com/blader/humanizer/blob/HEAD/SKILL.md) | 68k | 13k s.sh | MIT | 2026-11-09 | Removes AI tells from Wikipedia’s "Signs of AI writing"; never invents facts | 33/45 | Most-starred (67.8k★); asks instead of inventing; 32 KB |
| 10 | writing-guidelines (Vercel) | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/HEAD/skills/writing-guidelines) | 34k | 124k s.sh | MIT | 2026-10-27 | Fetches Vercel’s writing guidelines and applies them | 33/45 | Tiny pointer skill; rules fetched from a remote URL every run |

**Also considered (11–15):** **documentation-and-adrs** (32) — Decision records, not prose quality; **visual-explainer** (31) — Presentation, not prose; **internal-comms** (31) — Narrow; **make-pdf + diagram (gstack)** (30) — Output formats; **Mintlify plugin** (30) — Platform-specific.

## Ideas worth stealing
- **Never invent facts while rewriting**; ask when a sentence needs a missing detail.
- **Leave code, data, frontmatter and links untouched** when editing a file.
- **Detect-only mode vs rewrite mode**, with dated calibration of false positives (avoid-ai-writing).
- **Reader test:** a fresh agent reads the document and answers questions about it (official `doc-coauthoring`).
- **Writing for agents is its own genre** (mattpocock `writing-for-agents`): predictable structure, triggers in descriptions, no prose padding.
- **Draft → self-critique → final**, showing the critique.
- **Group tells by mechanism** rather than keeping a phrase blocklist.
- **Office files through scripts plus validation**, not freehand XML (official docx/pptx/xlsx).
- **Docs check on every ship:** what changed in behaviour, which docs mention it.

## H-Stack decision
_Not decided yet._
