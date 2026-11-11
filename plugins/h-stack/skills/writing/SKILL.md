---
name: writing
description: Write plain, specific docs and agent instructions in the project's voice.
when_to_use: READMEs, CLAUDE.md, docs, prose cleanup.
user-invocable: false
metadata:
  hstack:
    category: "12"
    short: plain, specific prose; documents agents can follow
    intents: [docs, writing, readme, claude-md, prose]
    keywords: ["\\b(write|update|edit|rewrite) (the |a |our )?(readme|docs?|documentation|changelog|release notes|claude\\.md|agents\\.md)\\b", "\\bcleaner prose\\b", "\\b(sounds|reads) (like )?(ai|robotic|generated)\\b", "\\bunslop\\b", "\\bproofread\\b", "\\b(docx|pptx|xlsx|pdf)\\b"]
    not_for: []
    events: []
    sizes: [light, full]
    modes: {default: guidance, full_on: []}
    explicit_only: false
    eval: evals/evals.json
    source:
      - {repo: mattpocock/skills, path: skills/productivity/writing-for-agents, licence: MIT}
      - {repo: cursor/plugins, path: pstack/skills/unslop, licence: MIT}
---

# Writing

## Gate

For any prose people or agents will read. Office files (docx, pptx, xlsx) and PDFs: use Anthropic's official document skills if installed (`anthropics/skills`), or the project's own tooling; this skill covers the words.

## Contract

- **Fit the project's voice.** Read its existing docs, style guide, CONTRIBUTING and glossary first; their conventions beat any rule here.
- **Say what it does.** Name the mechanism, the command, the number. If a sentence could appear unchanged in another project's docs, it says nothing about this one.
- **One meaning in one place.** Don't restate what the environment already answers (package scripts, config, `--help`); write what the reader can't find by looking: the unwritten convention, the reason behind a choice, the gotcha.

## Documents agents read

Skills, CLAUDE.md, rules files and docs behind pointers: see `references/for-agents.md`. In short: always-loaded text (a skill description, a CLAUDE.md line) costs every turn, so it is pruned hardest and leads with its trigger word; steps end in a checkable completion criterion; reference that only some cases need moves behind a pointer; say the target behaviour rather than the forbidden one; delete sentences the model would obey by default.

## Plain prose

Edit drafts against `references/plain-prose.md`: AI vocabulary and fancy synonyms for "is", vague attributions, forced triads, synonym cycling, filler and hedging, generic conclusions, chatbot phrases and sycophancy, abstract metaphor nouns, passive voice where the actor matters, adverbs propping weak verbs, over-compressed fragments. Punctuation and capitalisation follow the project's style guide; where it has none, sentence-case headings and restrained dashes and bold.

## Before you finish

- Every claim about the code was checked against the code.
- Reread once for the patterns above, deleting whole sentences that say nothing.
