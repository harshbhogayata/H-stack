I've added the PlanCard component in `src/components/PlanCard.jsx` and its styles in `src/components/PlanCard.css`. Nothing has been run: the repo has no build or test setup, so I haven't rendered it.

**Usage:**
```jsx
<PlanCard
  name="Pro"
  price="$19"
  features={['Unlimited invoices', 'Recurring billing', 'Priority support']}
  isCurrent={user.plan === 'pro'}
  onChoose={() => selectPlan('pro')}
/>
```

- **Card:** it shows the plan name, then the price followed by a muted "/month", a bulleted feature list, and the Choose button. It reuses your existing `Button` component.
- **Price:** `price` takes a string you've already formatted (like `InvoiceSummary`'s `amount`), so currency formatting stays with the caller.
- **Current plan:** the border is highlighted, a "Current plan" badge appears, and the button becomes a disabled secondary button labelled "Your plan" so users can't choose the plan they already have. The card is also marked as current for screen readers.
- **Light and dark mode:** the styles use only the theme's colour variables, so the card follows both the system setting and the `data-theme` override. The highlight uses your existing `--highlight` variable (amber). The badge text uses `--surface`, which stays readable on amber in both themes.

Each feature string is also its React list key, so two identical features in one plan would trigger a duplicate-key warning.