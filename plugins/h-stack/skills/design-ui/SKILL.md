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

## The job comes before the look

Before any visual direction, say what this screen is for (sell, sign up, configure, inform, decide), who arrives and what they already know, and what they must understand and believe before they act. The content comes from the questions that visitor asks, in the order they ask them. A page that sells usually has to answer: what is it, is it for me, what does it do about my problem, how does it work, why believe it, what do I do next. A settings page asks different ones; the method is the same. Answer each question on the screen, or drop it on purpose and say so in the reply. The questions decide what is there; this visitor and this subject decide the order and form, never a template. The job sets what the page says; the subject's world still sets how it looks (`references/direction.md`): a complete page in a generic look is half done.

**Explain the product in words.** The first view says in one plain sentence what the product is and who it is for, next to whatever shows it, with the main action; at desktop width that is one screen, not a text block with the proof below the fold. A headline alone is a slogan. Headings make claims the visitor can check against what follows. Tie each feature to a moment in this user's life, in the subject's own vocabulary. The reply marks invented copy, features, names and data as drafts.

**A working page, top to bottom.** Every control does something real or is marked as a placeholder; every link lands somewhere (no bare `href="#"`); the main action is reachable from the first view and again where the argument ends; the last screen is as considered as the first. A demo the visitor can use is proof: build it to work.

## Contract: derive, don't template

The result must look like it belongs to this product. Two different products asking for "a settings page" should get two different settings pages.

1. **Read the project first**: its design tokens or theme (CSS variables, Tailwind config, theme files), component library and primitives, existing screens that resemble the request, brand assets, copy tone, and any design doc. Use what exists; extend it only where it has no answer, in its own style. A value the theme lacks (an error colour, a new spacing step) becomes a new token in the theme file, with a dark-mode value where the theme has one, never a raw hex or pixel value in the component.
2. **No design system yet?** Ground the direction in the subject: who uses it, for what job, in what context. Propose a compact plan (palette, type, layout concept, the element that makes it specific) and check it against the brief and against the generic defaults listed in `references/direction.md` before building. The user's own words about look and feel always win.
3. **Correctness floor** (any product, any style): `references/baseline.md` — accessible primitives, labels, focus, errors next to the action, motion limits, reduced motion, safe areas, data typography, empty states.
4. **Words are design.** Name things by what users understand, use active verbs that say what happens ("Save changes"), keep one name for an action through the flow, make errors say what went wrong and how to fix it.

## Process

Job and questions → plan → check the plan against the project and the brief → build the whole page first: every section standing before any one component is perfected → render at phone and desktop width (a screenshot or browser check where the environment allows) → polish pass → one fix round per width; stop when the checks pass.

**Polish pass**, looking as the visitor: within a few seconds, can you tell what it is and what to do? Is there one clear order of importance? Do spacing, alignment and type sizes repeat a small set of values? Which section is weakest? Fix it or cut it, then remove what does not serve the job.

Show, don't describe: when proposing directions or comparing options, render each one (a page, a preview, an artifact, the project's own dev server) with the visual tools this session's tool list offers, so the user chooses by looking. When the UI is done, open it for the user at the end, once (H-Stack's show-results rule; interactive sessions only).

## Before you finish

- The reply names the questions the screen answers, any dropped on purpose, and the invented copy and data.
- New styles reuse the project's tokens and primitives, or the reply names which new ones were added and why.
- The baseline checks pass for the changed UI (state which were checked).
- If you couldn't render it, say so on a "Not verified:" line.
