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

## Contract: derive, don't template

The result must look like it belongs to this product. Two different products asking for "a settings page" should get two different settings pages.

1. **Read the project first**: its design tokens or theme (CSS variables, Tailwind config, theme files), component library and primitives, existing screens that resemble the request, brand assets, copy tone, and any design doc. Use what exists; extend it only where it has no answer, in its own style. A value the theme lacks (an error colour, a new spacing step) becomes a new token in the theme file, with a dark-mode value where the theme has one, never a raw hex or pixel value in the component.
2. **No design system yet?** Ground the direction in the subject: who uses it, for what job, in what context. Propose a compact plan (palette, type, layout concept, the one memorable element) and check it against the brief and against the generic defaults listed in `references/direction.md` before building. The user's own words about look and feel always win.
3. **Correctness floor** (any product, any style): `references/baseline.md` — accessible primitives, labels, focus, errors next to the action, motion limits, reduced motion, safe areas, data typography, empty states.
4. **Words are design.** Name things by what users understand, use active verbs that say what happens ("Save changes"), keep one name for an action through the flow, make errors say what went wrong and how to fix it.

## Process

Plan → check the plan against the project and the brief → build → look at it (a screenshot or browser check where the environment allows) → critique and remove one thing that doesn't serve the brief.

## Before you finish

- New styles reuse the project's tokens and primitives, or the reply names which new ones were added and why.
- The baseline checks pass for the changed UI (state which were checked).
- If you couldn't render it, say so on a "Not verified:" line.
