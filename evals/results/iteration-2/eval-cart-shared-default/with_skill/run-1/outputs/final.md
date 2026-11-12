I fixed it: the full suite now passes 5/5, and `refund.test.js` also passes when run by itself.

**Cause:** `createCart` in `lib/cart.js:3` did `Object.assign(getDefaults(), customer.prefs)`. That wrote each customer's prefs straight into the shop's shared defaults object. After any test created a USD cart, the shop currency became USD for the rest of the run, so `refund(5)` returned `currency: 'USD'` instead of `'EUR'`.

**Fix:**
- `lib/cart.js`: it now copies before merging (`Object.assign({}, getDefaults(), ...)`).
- `lib/settings.js`: the defaults object is now frozen. Any later code that tries to change it in place gets a `TypeError` straight away, instead of quietly breaking whichever test runs next. This is what stops the bug from coming back.
- New `test/settings.test.js`: checks that creating a cart with custom prefs leaves the defaults unchanged, and that writing to the defaults throws.

**Checks:**
- Before the fix, `npm test` failed on `refunds use the shop currency` with expected `EUR`, got `USD`. The new tests also failed.
- After the fix, `npm test` passes 5/5 and `node --test test/refund.test.js` passes 2/2.
- I reverted only the fix and the suite failed again (exit 1). With the fix restored it passed (exit 0), so the fix is what made the difference.

**Not quite as reported:** in this repo, `refund.test.js` didn't pass on its own before the fix. Line 2 does `require('./cart.test.js')`, which runs the USD cart test first every time. That import is also why "US customer pays in USD" runs twice in the suite. Nothing needs it any more, so I'd remove it, but I left it alone because I wasn't sure it was meant to be there. Say if you want it gone.

Nothing is committed yet.