---
name: design-ui
description: "UI design and a11y review from project's design system."
when_to_use: "Visual direction for a page, new screens/components, UI polish, a11y checks (focus, labels)."
user-invocable: false
paths: ["**/*.{tsx,jsx,vue,svelte,astro,css,scss,sass,less}", "**/*.html", "**/tailwind.config.*", "**/theme.*", "**/tokens.*"]
metadata:
  hstack:
    category: "10"
    short: UI from the project's own design system, checked for a11y
    intents: [ui, design, frontend, component, accessibility, layout]
    keywords: ["\\b(landing|home|settings|pricing) page\\b", "\\b(ui|ux)\\b", "\\bredesign\\b", "\\b(component|button|modal|dialog|form|navbar|sidebar|layout)\\b", "\\baccessib(le|ility)\\b", "\\ba11y\\b", "\\bresponsive\\b", "\\bdark mode\\b", "\\bpolish\\b", "\\bstyl(e|ing)\\b", "\\b(onboarding|signup|sign-up|login|checkout|profile|dashboard|home|empty-state) (screen|page|view|flow)\\b", "\\bdesign (the|a|an|our) [a-z -]{0,30}(screen|page|view)\\b"]
    not_for: []
    events: [path_edit]
    sizes: [light, full]
    modes: {default: guidance, full_on: []}
    explicit_only: false
    eval: evals/evals.json
    source:
      - {repo: ibelick/ui-skills, path: skills/baseline-ui, licence: MIT}
      - {repo: anthropics/skills, path: skills/frontend-design, licence: Apache-2.0}
---

# Design and UI

## Gate

For any UI work: new screens, components, visual changes, polish, accessibility fixes. Checking a flow in a running browser is `h-stack:qa`. When the project has no graphical UI (a CLI, a library, an API), a request for a "page" or "screen" means that project's own interface for the same job: a command, flags or a config file, following its conventions docs (output streams, error format, config paths, help text), not a web page.

## Four qualities, each with its own pass

The result must belong to this product: two products asking for "a settings page" get two different pages. It needs four qualities at once; each missing one has a name: an idea without structure is a gimmick; structure without an idea is a template; finish without thought is decoration; thought without finish is a draft.

**The balance.** Structure owns the order of the argument and the grid; the idea owns the form of each part. The visitor's questions decide what must be answered, not that each answer becomes its own band with a heading and three cards: answers can share a part, live inside the demo, or be one line. At least one part takes a form only this subject could have.

### 1. Thought: the job

Say what this screen is for (sell, sign up, configure, inform, decide), who arrives, what they already know, and what they must understand before they act. The content comes from the questions that visitor asks, in their order. A selling page usually answers: what is it, is it for me, what does it do about my problem, how does it work, why believe it, what next. A settings page asks different ones. Answer each, or drop it on purpose and say so in the reply.

**Explain it in words.** The first view says in one plain sentence what this is and who it is for, beside whatever shows it, with the main action. Tie each feature to a moment in this user's life, in the subject's vocabulary. Name things as users do; verbs say what happens; one name per action; errors say what went wrong and how to fix it.

**A working page.** Every control does something real or is marked as a placeholder; every link lands somewhere (no bare `href="#"`); the main action returns where the argument ends. A demo the visitor can use is proof: build it to work.

### 2. Idea: before the layout hardens

With the job clear and no layout yet, ask what in this subject's world (its objects, materials, records, rituals, words) can carry the argument in a way a generic page could not. Write two or three different ideas in a line each, pick one, say why. Take it away: if the page loses a reason to believe, keep it; if it only loses a look, it is decoration. When the project has a design system, the idea is small (how this screen uses the system for its job) and the system's structure wins.

### 3. Structure: the calm outside

1. **Read the project first**: its tokens and theme files, components, similar screens, brand assets, copy tone, design docs. Use what exists; a value the theme lacks becomes a new token in the theme file (with a dark value where the theme has one), never a raw value in the component.
2. **No design system yet?** Ground it in the subject and plan before building: `references/direction.md`. The user's own words on look and feel win.
3. One clear order of importance on every screen; each screen does one thing; a small repeated set of spacing, type and radius values; nothing a first-time visitor has to work out. The complexity stays underneath: the visitor feels ease, not machinery.

### 4. Refinement and finish: the worked-out inside

Question every part: what is it for, and where does it fail (long text, small screens, empty and error states, keyboard, both themes where the product has them)? The correctness floor is `references/baseline.md`. Build the whole page before perfecting any part, then work in rounds: render at phone and desktop width, name the single weakest thing, fix it, render again. Stop when a round finds nothing worth fixing, or after three; a round that cannot name a weakness is over, and rounds are not for fiddling. Where rendering is not possible, say so and do the rounds by reading.

Show, don't describe: when proposing directions or comparing options, render each one (a page, a preview, an artifact, the project's own dev server) with the visual tools this session's tool list offers, so the user chooses by looking. When the UI is done, open it for the user at the end, once (H-Stack's show-results rule; interactive sessions only).

## Before you finish

Four questions; a "no" sends the work back to that pass. Is there an idea only this product could have (2)? Does every part answer something the visitor asks (1)? Can a first-time visitor say what matters most on each screen (3)? Did the last round find nothing worth fixing (4)?

The reply names the idea and the alternatives considered; the questions answered and any dropped on purpose; invented copy, features, names and data as drafts; any new tokens and why; the baseline checks run; and a "Not verified:" line for anything not rendered.
