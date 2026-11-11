I resolved the conflict in `prices.js` by keeping both changes:

```js
return Math.max(50, Math.round(cents * (1 + rate)));
```

- **Issue #41 (round half up):** kept. The feature branch had switched to `Math.floor`, which drops fractions of a cent and breaks #41. I treated that as a side effect rather than the goal, because #57 is only about the minimum charge.
- **Issue #57 (50-cent minimum):** kept as `Math.max(50, …)`.

**Checks:** `node check.js` prints `ok`, and no conflict markers are left in the file.

**Things to know:**
- There was no merge actually in progress. `git status` was clean and the conflict markers were saved in the repo's only commit. `feature/min-charge` doesn't exist locally, so I couldn't read its commits. I went on NOTES.md and the comments inside the conflict instead.
- #57 says the minimum applies to card payments, but `priceWithTax` doesn't know how the customer is paying, so the 50-cent minimum applies to every price. That's what the feature branch did and what `check.js` expects, so I left it. If other payment methods shouldn't have the minimum, the function will need a payment-method parameter as a separate change.
- The fix is not committed. Tell me if you want me to commit it.