I resolved the conflict in `prices.js` by keeping both changes: rounding half up (issue #41) and the 50-cent minimum (issue #57).

```js
return Math.max(50, Math.round(cents * (1 + rate)));
```

The feature branch had changed `Math.round` to `Math.floor`, which broke the rounding from #41. I put `Math.round` back and applied the 50-cent minimum after rounding. `node check.js` passes.

- **Minimum applies to every payment:** NOTES.md says the 50-cent minimum is only for card payments. But `priceWithTax` isn't told the payment method, so the minimum applies to all payments, as it did on the feature branch. If non-card payments shouldn't get it, the function needs a payment-method parameter.
- **No merge was in progress:** git showed a clean working tree, so the conflict markers had been committed into the file. Fixing the file is the whole resolution. I haven't committed the change.