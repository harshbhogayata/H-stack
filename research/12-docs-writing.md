# 12 · Docs & writing

Prose that reads like a person wrote it: docs, READMEs, PR descriptions, documents.

★ = GitHub stars on 2026-11-11 (for a skill inside a pack, the stars are the whole repo's).

| # | Name | Source | ★ | License | What it does | Why it ranks here |
|---|---|---|---|---|---|---|
| 1 | Humanizer | [blader/humanizer](https://github.com/blader/humanizer) | 67k | MIT | Removes AI tells using Wikipedia's "Signs of AI writing"; never invents facts | Most popular; asks instead of inventing |
| 2 | unslop + technical-writing | [cursor/plugins › pstack](https://github.com/cursor/plugins/tree/main/pstack) | 16k (repo) | MIT | Strip AI patterns; shape docs, PRs, commit messages | Writes for "consumer and maintainer" |
| 3 | docx / pdf / pptx / xlsx | [anthropics/skills](https://github.com/anthropics/skills) | 192k | Apache-2.0 | Create and edit Office files and PDFs | Official, production-used |
| 4 | /document-release + /document-generate | [garrytan/gstack](https://github.com/garrytan/gstack) | 141k | MIT | Audit docs against changed behaviour; generate missing docs (Diataxis) | Keeps docs in sync on every ship |
| 5 | writing-for-agents | [mattpocock/skills](https://github.com/mattpocock/skills) | 321k | MIT | How to write skills, CLAUDE.md and docs agents read | Writing for the agent audience |
| 6 | declauding | [oaustegard/claude-skills](https://github.com/oaustegard/claude-skills) | 313 | MIT | 52 LLM writing tics grouped by mechanism; HTML diff of edits | Groups by mechanism, catches paraphrases |
| 7 | /make-pdf + /diagram | [garrytan/gstack](https://github.com/garrytan/gstack) | 141k | MIT | Markdown → publication PDF; text → editable diagram | Offline docs output |
| 8 | humanizer-skill | [Aboudjem/humanizer-skill](https://github.com/Aboudjem/humanizer-skill) | 307 | MIT | 55 patterns, 5 voices, 0–100 AI-tell score, local only | Scoring idea |
| 9 | Better Writing | [forjd/better-writing](https://github.com/forjd/better-writing) | 56 | MIT | Adds clarity and voice, not just deletions; refuses detector tricks | Honest guardrails |
| 10 | doc-coauthoring | [anthropics/skills](https://github.com/anthropics/skills) | 192k | Apache-2.0 | Structured co-writing of documents | Official co-writing flow |

## Ideas worth stealing
- **Never invent facts while rewriting**; ask when a sentence needs a missing detail.
- **Leave code, data, frontmatter and links untouched** when editing a file.
- **Draft → self-critique → final**, showing the critique.
- **Group tells by mechanism** rather than keeping a phrase blocklist.
- **Docs check on every ship:** what changed in behaviour, which docs mention it.

## H-Stack decision
_Not decided yet._
