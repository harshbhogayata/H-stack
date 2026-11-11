I added `PlanCard` in `src/components/PlanCard.jsx` and `src/components/PlanCard.css`. I haven't rendered it in a browser, because the repo has no build or dev setup.

**Props:** `name`, `price` (a ready-formatted string such as `"$12"`, the same way `InvoiceSummary` takes `amount`), `features` (a list of strings), `isCurrent` and `onChoose`.

**What it shows:**
- The plan name, then the price in large figures followed by "per month" in muted text. The digits are fixed-width, so prices line up across cards.
- The features as a bulleted list. If there are no features, the list is left out.
- A **Choose** button, using the project's existing `Button`. Screen readers hear it as "Choose Pro" (or whichever plan it is), so a row of cards doesn't read as several identical "Choose" buttons.
- **If it's the user's current plan:** the border turns the theme's `--highlight` colour (amber), a "Your current plan" label appears next to the name, and the button becomes a greyed-out, unclickable "Current plan" button. The highlight border doesn't change the card's size, so cards in a row don't shift.

**Styling:** it uses only the existing theme values for colour, spacing and corner radius, so dark mode and the in-app light/dark setting work without extra code. I didn't need to add any new theme values.

**Accessibility checks I did:**
- Each card is a labelled section, so screen readers announce it by the plan name.
- Keyboard focus is still visible, because nothing removes the browser's default focus outline.
- Text contrast meets the WCAG AA standard in both light and dark mode, including the amber label (about 5.3:1 on white).
- A very long plan name is cut off with "…" instead of breaking the layout.
- There is no animation.

Not verified: I haven't seen how it looks or checked the contrast and layout in a running app.