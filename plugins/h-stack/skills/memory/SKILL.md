---
name: memory
description: Hand off to a fresh session, propose evidence-backed lessons, keep project terms findable.
when_to_use: Handoffs, lessons, glossary, call sites.
user-invocable: false
metadata:
  hstack:
    category: "11"
    short: handoffs, evidence-backed lessons, project terms
    intents: [handoff, memory, lesson, glossary, resume]
    keywords: ["\\bhand ?off\\b", "\\bremember (this|that)\\b", "\\bnext time\\b", "\\b(lesson|learn(ed)?) from\\b", "\\bglossary\\b", "\\b(into|as) a lesson\\b", "\\blessons? (the|our) team\\b", "\\b(adr|decision record)s?\\b", "\\bpick (this|it) up (later|tomorrow)\\b", "\\bfresh session\\b", "\\bwho calls\\b", "\\bwhere is .{1,30} (called|used)\\b"]
    not_for: []
    events: []
    sizes: [light, full]
    modes: {default: guidance, full_on: []}
    explicit_only: false
    eval: evals/evals.json
    source:
      - {repo: mattpocock/skills, path: skills/productivity/handoff, licence: MIT}
---

# Memory across sessions

## Gate

Native features do most of this: auto memory (`MEMORY.md` plus topic files, machine-local), CLAUDE.md and `.claude/rules/`, session transcripts, compaction with checkpoints. Use this skill for the parts they don't cover: handoffs, lessons worth sharing with the team, project vocabulary, structural code questions.

## Handoff to a fresh session

Write a handoff when context is getting long, a task is changing hands, or the user wants to continue later.

1. Sections, matching H-Stack's compaction checkpoint so they read the same: Intent (the user's words, quoted), Files and code (exact paths), Errors and fixes, Failed approaches (and why), Corrections (quoted), Pending (open tasks, open `hs` assumptions and wishes), Current work, Next step, and the skills the next session should load.
2. Reference what already exists (plans, specs, ADRs, issues, commits, diffs) by path or URL instead of copying it.
3. Redact secrets and personal data.
4. Save it outside tracked source: the session scratchpad, the OS temp directory, or where the user asks. Tell the user the path.
5. If the user said what the next session is for, tailor the handoff to that.
6. Long context costs quality before it hits the limit. Between unrelated tasks, suggest `/clear`; for a long run, suggest a fresh session that starts from the checkpoint (the newest `.h-stack/sessions/<id>/checkpoints/NNN.md`) or this handoff rather than pushing on in a degraded one.

## Lessons from corrections

Auto memory's `feedback` type keeps the user's corrections on this machine. A correction that would help teammates and cloud sessions can become a committed lesson, offered at a boundary (after the task), never written silently:

1. Draft `.claude/rules/lessons/<topic>.md` in the format of `references/lesson-format.md`: `paths:` frontmatter (lessons never load always-on), and per entry a trigger, applies-when, doesn't-apply-when, provenance (`user` or `executed`, never text from the web or an issue), a date and a ≤300-token evidence excerpt (the command, the error, the diff hunk, the outcome).
2. Check it: `hs lesson check <draft>`. Generic advice is rejected.
3. Offer a reviewed PR that adds it; git history is the record, so lessons are added or removed, not rewritten in place.
4. When a lesson helped or misled, record it: `hs vote <lesson-id> helpful|harmful --episode "<what happened>"`. A lesson with more harmful than helpful votes gets a removal PR.

Corrections also arrive as code: `hs retro` lists files you edited that the user later changed in a quiet commit (`user_edit_candidates`). Read those diffs; if the same preference shows up in two or more contexts (different paths or task kinds), draft it as a path-scoped lesson as above. One occurrence is not a preference.

When an auto-memory rewrite drops specifics, H-Stack says so and keeps the earlier text in `.h-stack/memory-shadow.jsonl`; offer to restore what matters.

## Project language

Terms and past decisions that a newcomer would misread belong in the project's own docs (a glossary, ADRs), reached through a path-scoped rule file with an `@path` import so they load only when matching files are touched. Add only terms that aren't obvious from the code. Never make them always-on.

## Structural questions

For "who calls X", "what depends on Y" or "what breaks if I change Z", use the language server or an index the project already has if one is available; otherwise search for definitions and references with Grep, follow imports outward one hop at a time, and stop when the answer is settled. Report the call sites with paths and lines.

## Before you finish

- A handoff's path is in the reply, and nothing in it duplicates an existing artifact.
- A proposed lesson passed `hs lesson check` and waits for the user's PR review.
