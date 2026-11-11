I resolved the conflict in `prices.js` so it keeps what both sides were trying to do. `node check.js` passes.

```js
return Math.max(50, Math.round(cents * (1 + rate)));
```

- **Main (issue #41):** totals round half up to the nearest cent, using `Math.round`.
- **`feature/min-charge` (issue #57):** charges have a 50-cent minimum, using `Math.max(50, …)`.

The two sides only really clashed on rounding: the feature branch used `Math.floor`, which rounds down. That looks incidental to the minimum charge rather than a deliberate rounding choice, and it would break #41, so I used main's half-up rounding. Rounding first and then applying the minimum lets both rules hold. There are no conflict markers left anywhere in the repo.

Things to know:
- **The minimum applies to every payment, not just cards.** Issue #57 says the 50-cent minimum is for card payments, but `priceWithTax` has no payment-method input, so the feature branch applied it everywhere. I kept that behaviour rather than adding a new parameter. If non-card payments shouldn't have a minimum, the function needs that extra input.
- **Exact half-cent cases could still round the wrong way.** The function multiplies decimal numbers before rounding, so a total that should land exactly on a half cent can be stored as slightly less and round down. The three cases in `check.js` don't hit this, and fixing it would go beyond resolving the conflict.
- **No merge was actually in progress.** The conflict markers had been committed in the repo's only commit, and there is no `feature/min-charge` branch here. So there was no merge to finish with `git add` and a commit. The fix is in the working tree only and isn't committed; tell me if you want it committed.