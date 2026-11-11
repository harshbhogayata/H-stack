I resolved the conflict in `prices.js` by keeping both changes, and `node check.js` passes:

```js
return Math.max(50, Math.round(cents * (1 + rate)));
```

- **Rounding (issue #41):** I used `Math.round` from main. The feature branch's `Math.floor` would have broken this. For example, 1001 at 25% tax is 1251.25 before rounding, and 1000 at 20% comes out as 1199.999…, which `Math.floor` turns into 1199 instead of 1200.
- **Minimum charge (issue #57):** I kept the 50-cent floor from the feature branch.

**The conflict markers were already committed.** Git isn't actually in the middle of a merge: the working tree was clean, and the only commit is `1a14434 fixture`. So I didn't run `git add` or finish a merge. The fix is an uncommitted change to `prices.js`, ready for you to commit.

**Decision for you:** NOTES.md says the 50-cent minimum is for card payments only, but `priceWithTax` doesn't know how the customer is paying. As written, the minimum applies to every payment, which is what the feature branch did and what `check.js` expects. If non-card payments shouldn't get the minimum, the function needs a payment-method argument; I can add one if you want.