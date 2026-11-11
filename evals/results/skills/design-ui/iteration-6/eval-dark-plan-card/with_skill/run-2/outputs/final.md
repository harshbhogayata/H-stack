I added `PlanCard` in `src/components/PlanCard.jsx` with its styles in `src/components/PlanCard.css`. I haven't rendered it, and the project has no build or test setup, so the component hasn't been compiled either.

**How to use it:**
```jsx
<PlanCard name="Pro" price="$12" features={['Unlimited invoices', 'Recurring billing']} isCurrent={false} onChoose={() => …} />
```
- **`price`** takes text that's already formatted, the same way `InvoiceSummary` takes `amount`. The card adds "per month" after it in muted text.
- **Current plan:** the card gets an accent-coloured border and a "Your current plan" label in the highlight colour. Its button turns into a disabled "Current plan" button, since choosing the plan you already have does nothing.
- **Other plans** show a main button that says "Choose Pro" (or whatever the plan is called), so screen-reader users can tell the buttons apart.

**Reused from the project:** everything comes from what's already there: the `Button` component and the existing colour, spacing and corner tokens in `theme.css`. That means dark mode and the user's own `data-theme` setting work without extra code, and I didn't need any new tokens. The card's layout copies `InvoiceSummary`: same background, border and padding, and the price uses the same lined-up digits at 1.5rem.

**Accessibility checks (done by reading the code, not in a browser):**
- The card uses proper building blocks: a section element with a heading, a real list for features, and real buttons.
- Being the current plan is shown in words, not only by colour.
- The highlight border doesn't change the card's size, so cards side by side stay aligned.
- Lined-up digits for the price.
- If a plan has no features, the empty list is left out.
- No animation.
- The colours used here should pass the WCAG AA text contrast standard (e.g. dark amber on white is about 5.5:1).

**Focus outline:** `Button.css` has no focus style of its own, so keyboard users see the browser's default outline. That's fine to leave, but adding a `:focus-visible` style to `Button` would improve every button in the app.

Not verified: I couldn't render it, so the light and dark looks and the keyboard focus outline haven't been checked visually.