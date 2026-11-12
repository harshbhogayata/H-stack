The refund test passes now, in the full suite and on its own.

**Cause:** in `lib/cart.js`, `createCart` did `Object.assign(getDefaults(), customer.prefs)`. That writes the customer's prefs into the single cached shop-defaults object. Once the USD cart test had run, the shop currency was `USD` for every later caller, so `refund()` returned USD instead of EUR. Customer settings were overwriting shop settings, so this was a real bug in the app code, not just a test problem.

**Fix:**
- `lib/cart.js`: merge into a new object (`Object.assign({}, getDefaults(), …)`).
- `lib/settings.js`: the shared defaults are now frozen. If any future code tries to change them, it throws an error straight away instead of silently leaking state. This is the "can't come back" part.
- `test/cart.test.js`: new test `customer prefs do not leak into shop defaults`.

**Evidence:**
- Before: `npm test` gave 2 pass, 1 fail (`currency: 'USD'` where `'EUR'` was expected). `node --test test/refund.test.js` alone also failed, 1 pass and 1 fail, because that file `require`s `cart.test.js`.
- The new test failed before the fix for the right reason.
- With the fix removed, `npm test` exits 1. With the fix back in, it exits 0. I checked this with the skill's `verify-fix` script, which removes the fix and re-runs the suite.
- After: `npm test` gives 5 pass, 0 fail. `refund.test.js` alone gives 3 pass, 0 fail.

`refund.test.js` still pulls in `cart.test.js`, which ties the two files together. I left that line alone since it's your test file; removing it would be a good cleanup. Nothing is committed yet.