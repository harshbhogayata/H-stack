# 00 · Activation & experience

Goal: H-Stack starts by itself. No slash commands. Claude decides which skill to use, when, and the user can see what it picked.

Sources: Claude Code docs ([skills](https://code.claude.com/docs/en/skills), [hooks](https://code.claude.com/docs/en/hooks), [mods events](https://code.claude.com/docs/en/plugins/mods/events), [mods API](https://code.claude.com/docs/en/plugins/mods/api), [mods interface](https://code.claude.com/docs/en/plugins/mods/interface)), superpowers' `hooks/hooks.json` and `using-superpowers`, and the activation write-ups linked below. Checked 2026-11-11.

## 1. How activation works today

**Native:** every skill's `description` (+ `when_to_use`) is always in context; Claude loads the full skill when it judges it relevant. Limits: description + `when_to_use` are cut at 1,536 characters; keep SKILL.md under 500 lines.

**Problem:** description matching alone is unreliable. One measured test: **~20%** activation with a simple hook, **84%** with a "forced evaluation" hook that makes Claude check each skill before answering ([Scott Spence](https://scottspence.com/posts/how-to-make-claude-code-skills-activate-reliably)). The fix in every serious stack is to *put the right skill in front of Claude* rather than hope it remembers.

### Frontmatter that matters for "no slash commands"
| Field | Use in H-Stack |
|---|---|
| `user-invocable: false` | Hide every H-Stack skill from the `/` menu; only Claude invokes them |
| `when_to_use` | Trigger phrases and example requests, kept separate from the description |
| `paths` | Only auto-activate on matching files (e.g. design skills on `**/*.{tsx,css}`) |
| `context: fork` + `agent` | Run heavy skills in a subagent so the main conversation stays clean |
| `model`, `effort` | Cheap model for triage-type skills, high effort for architecture/debugging |
| `hooks` | A skill can register hooks when it activates (e.g. TDD guard only during TDD) |
| `disable-model-invocation: true` | Only for actions that must never auto-run (deploy, publish) |

## 2. Activation mechanisms compared

| # | Mechanism | How | Reliability | Cost | Who uses it |
|---|---|---|---|---|---|
| A | Descriptions only | Native matching | Low (~20% in one test) | Free | Everyone by default |
| B | SessionStart router | Hook injects a "how to use skills" skill at `startup`, `clear`, `compact` | Medium-high | ~1 small skill per session | superpowers (`using-superpowers`), pstack Claude port |
| C | Keyword/intent rules per prompt | `UserPromptSubmit` hook matches prompt against `skill-rules.json`, injects top 3 matches | High for known phrasings | ~0 (regex) | [skill-activation hook](https://claudefa.st/blog/tools/hooks/skill-activation-hook), diet103 pattern |
| D | Forced evaluation | Hook tells Claude to rate every skill YES/NO before acting | 84% in one test | Verbose; tokens every turn | [Scott Spence](https://scottspence.com/posts/how-to-make-claude-code-skills-activate-reliably) |
| E | Model classifier per prompt | Mod `prompt.submit` calls a small model (`$.model.complete`, e.g. Haiku) with the cached skill catalog; adds the chosen skill as context | Highest for fuzzy requests | One small cached call per prompt | New with mods; nobody ships it yet |
| F | Event triggers | Tool events start skills: test fails → debugging; UI file edited → design check; `git push` → review; Stop with unverified changes → verification | Deterministic | ~0 | gstack/pstack do parts by convention |
| G | File-scoped | `paths` frontmatter | Deterministic | Free | Native |

Notes:
- Hook text should be **factual statements**, not "YOU MUST" commands. The docs warn that imperative system-style wording can trip prompt-injection defences.
- `UserPromptSubmit` command hooks time out at 30 s by default and their context is dropped on timeout. Keep the classifier fast.
- Mods' `prompt.submit` can add context Claude reads without changing what the user typed: `next({ ...e, context: [...] })`.

## 3. Experience concepts (beyond activation)

### Flow
1. **Size gate.** Trivial requests skip all process; the classifier labels each prompt `direct` / `light` / `full`. (pstack: "small tasks are often better done directly")
2. **Sticky mode.** Once a playbook is picked, "continue" / "next" / "fix that" stay in it until the task ends. State kept in the mod store. (pstack custom mode)
3. **Plain-language overrides.** "just do it", "skip the plan", "go deep on this", "why did you pick that?" handled by the classifier, no syntax to learn.
4. **Clarify-first gate.** Ambiguous request → ask the 1–3 questions that most change the outcome, each with a recommended answer; "just build it" still works. (grill-me escape hatch)
5. **Pause only for irreversible actions.** Force push, deploy, data deletion, sending messages → `$.ui.ask` confirmation; everything reversible proceeds. (pstack, mods `tool.call` guard)
6. **Verification gate on Stop.** If code changed and no check ran, the Stop hook sends Claude back to verify instead of claiming done.

### Context & memory
7. **Session briefing.** SessionStart adds branch, uncommitted files, open PR, last handoff note, and sets the session title.
8. **Survive compaction.** `PreCompact` writes a handoff note; SessionStart `compact` re-injects the router and the note.
9. **Every subagent gets the rules.** `SubagentStart` injects the H-Stack principles into each subagent. (pstack: "subagents read the principles first")
10. **Lessons loop.** When the user corrects Claude ("no, don't…"), offer to save it as a project rule. (pstack `correct`, Cherny `lessons.md`)
11. **Project language.** Glossary + decision records as files, loaded when relevant. (mattpocock)

### Visibility (works in the desktop app)
12. **Status in the spinner.** Mods can change the spinner text: `H-Stack · bug fix · step 3/6`. Spinner, Pane and message render sites work in terminal, Desktop and VS Code.
13. **Side pane.** Current playbook checklist, skills used this session, decisions log.
14. **Short announcement.** One line when a skill starts: "Using systematic debugging to find the cause first."

### Autonomy & cost
15. **Background watchers.** `$.clock.every` checks CI on the open PR; on failure `$.prompt.submit` starts a fix turn. (auto-babysit)
16. **Decision trail.** Long runs log each decision with evidence (measured / inferred / guessed). (pstack show-me-your-work)
17. **Model routing per step.** `turn.step` or skill `model` sends cheap steps to a small model, hard ones to the strongest.
18. **Runaway guard.** Track usage per turn; warn or stop past a budget. (gstack runaway-stopper)

### Self-improvement
19. **Activation telemetry, local only.** Record which skill the classifier picked, whether Claude used it, and whether the user corrected course; use it to tune descriptions. (skill-creator description tuning)
20. **End-of-session retro.** Suggest one improvement to rules, skills or hooks. (mattpocock `retro`, gstack `/learn`)

## 4. Proposed H-Stack activation design

```
Session start ──► [L1] Router: compact skill map + size gate + principles pointer
                      (hooks.json SessionStart: startup|resume|clear|compact)
                      + session briefing (branch, changes, handoff note, title)

Every prompt ───► [L2] Classifier (mod prompt.submit)
                      1. fast rules: keywords / intent per skill (no model call)
                      2. if unclear: small model with cached catalog → {mode, skill, size}
                      3. sticky mode + plain-language overrides
                      → adds 1–2 factual lines of context; never rewrites the prompt

During work ────► [L3] Event triggers
                      test/build failure → debugging · UI files edited → design + browser check
                      before push/PR → review · Stop with unverified changes → verify
                      irreversible command → ask user

Always ─────────► [V] Visibility: spinner text + side pane (playbook, step, skills used)
```

Rules for every H-Stack skill:
- `user-invocable: false` (no `/` menu entries).
- Lead the description with the use case; trigger phrases in `when_to_use`.
- Each skill declares its own triggers (keywords, intents, paths, events) in one place so L2/L3 read them; no separate hand-maintained rules file to drift.

Fallbacks: if mods aren't available (e.g. older client), L1 + plain `UserPromptSubmit` command hook with rules still works.

## 5. Open questions for the user
- Classifier: rules only (free, fast), or rules + small-model fallback (smarter, small cost per prompt)?
- How visible: spinner only, or spinner + side pane?
- Which actions count as irreversible and always need a confirm?
