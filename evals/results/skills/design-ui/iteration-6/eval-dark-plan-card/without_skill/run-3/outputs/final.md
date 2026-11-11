I added `src/components/PlanCard.jsx` and `src/components/PlanCard.css`. I haven't run or rendered it: the project has no build or test setup, only React in `package.json`.

**How to use it**
```jsx
<PlanCard
  name="Pro"
  price="$12"
  features={['Unlimited invoices', 'Custom branding', 'Priority support']}
  isCurrent={user.plan === 'pro'}
  onChoose={() => selectPlan('pro')}
/>
```

**What it shows**
- The plan name, the price with a muted "/month" after it, a bulleted feature list, and a Choose button.
- `price` is a string you format before passing it in, the same way `InvoiceSummary` takes its `amount`.
- The Choose button reuses your existing `Button` component.

**Current plan**
- The card gets an accent-coloured border and a "Current plan" badge, and is marked `aria-current` for screen readers.
- The button becomes a disabled secondary button labelled "Your plan", so users can't choose the plan they already have.

**Styling**
- It only uses the colour and spacing tokens from `theme.css`, not the raw palette. That means it follows the system light/dark setting and the `data-theme` override without any extra CSS.
- The layout is a vertical flex column, and the feature list grows to fill the space. In a row of cards with different feature counts, the buttons should line up at the bottom.

**Choices you might want to change**
- Feature names are used as React keys, so two identical features in one plan will trigger a React duplicate-key warning.
- "Your plan" as the disabled button label is my wording.