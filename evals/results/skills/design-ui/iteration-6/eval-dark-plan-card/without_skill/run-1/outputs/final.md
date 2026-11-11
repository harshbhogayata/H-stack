I added `PlanCard` in `src/components/PlanCard.jsx` and its styles in `src/components/PlanCard.css`. I haven't rendered it: the project has no build, dev server or tests set up, so nothing here could run it.

**Usage**
```jsx
<PlanCard
  name="Pro"
  price="$19"
  features={['Unlimited invoices', 'Recurring billing', 'Custom branding']}
  isCurrent={user.plan === 'pro'}
  onChoose={() => selectPlan('pro')}
/>
```

- **Price:** you pass it already formatted, like `InvoiceSummary`'s `amount` does, and the card adds "/month" after it in muted text.
- **Choose button:** it uses the existing `Button` component.
- **Current-plan highlight:** the card gets a 2px accent-colour border and a "Current plan" badge, and has `aria-current` set for screen readers.
- **Light and dark:** the styles only use the existing theme colours, so the card follows the system light/dark setting and the profile override like everything else.

**One choice to confirm:** on the current plan, the button changes to the secondary style, reads "Your plan" and is disabled, because choosing the plan you already have does nothing. If you want it to stay an active "Choose" button there, change the `variant`, `disabled` and label lines in `PlanCard.jsx`.