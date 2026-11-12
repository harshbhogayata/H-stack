# Choosing a direction when the project has none

Adapted from anthropics/skills `frontend-design` (Apache-2.0). Removed: the "design studio" persona that pushes distinctiveness regardless of the product, and fixed preferences; kept the grounding, the plan-review-build-critique loop and the writing guidance. This applies only where the project has no design system or the user asked for a new direction; otherwise follow the project.

**Ground it in the subject.** If the brief doesn't say what the product is, propose a concrete subject, audience and primary job, and confirm. The subject's world (its materials, vernacular, users) is where specific choices come from: a toy for children and a dashboard for analysts should look nothing alike.

**A selling page's questions.** Usually: what is it, is it for me, what does it do about my problem, how does it work, why believe it, what do I do next. They set what is answered; the idea sets the form, often several answers in one part.

**Show it happening.** Find from the subject a small, exact picture of the thing the product deals with (a diagram drawn in code, a before and after, a live reading) so the visitor understands before reading; words then support what is shown.

**Plan before code.** After the idea (pass 2 in `SKILL.md`), a compact token plan: 4–6 named colours, the typefaces and their roles (one or two families), a layout concept with alignment, and how the idea shapes the parts. Then check the plan: would you produce the same plan for any similar request? If so, revise that part and say what changed.

**Generated-design defaults to check against** (each is legitimate when the brief asks for it; they are tells when they appear regardless of subject): a warm cream background with a serif display and a terracotta accent; near-black with one acid-bright accent; broadsheet hairline rules with zero radius; identical rounded cards with one soft shadow and gradient washes; tracked all-caps eyebrow labels on every heading, middle-dot meta strings and arrows appended to every link; numbered markers on content that isn't a sequence; fade-and-slide entrances on every section; a fixed run of bands (hero, problem, steps, proof, FAQ, sign-up) whatever the subject.

**The idea carries the argument; the page stays complete.** Originality that does not help the visitor decide is a gimmick. One strong device does not make a page: the rest still answers the visitor's questions, quieter but complete, and the last screen is as considered as the first.

**Hierarchy and type.** The first view pairs the plain sentence of what this is with the most characteristic thing in the subject's world and the main action; at desktop width that is one screen, not a text block with the proof below the fold. A headline alone is a slogan; headings make claims the visitor can check against what follows. Type carries personality: choose faces for this brief, set a clear scale, and keep body line length under about 80 characters. Structure (borders, numbering, labels) should encode information, not decorate. Build to a quality floor without announcing it: responsive to mobile, visible focus, reduced motion respected, accessible contrast.

**Writing.** Words make the interface easier to use: name things from the user's side ("notifications", not "webhook config"); active verbs that say what happens; one name per action through the flow ("Publish" → "Published"); errors explain what happened and how to fix it, without apology; empty screens invite the next action; sentence case, no filler, tone matched to the product.
