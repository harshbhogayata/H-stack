I fixed it in the code. The refund test is unchanged, and the full suite now passes.

**Cause:** `createCart` in `lib/cart.js` called `Object.assign(getDefaults(), customer.prefs)`. That merged the customer's prefs into the shop's single shared defaults object instead of a copy. After any USD customer's cart was created, the shop currency itself became `'USD'`, so `refund(5)` returned `{ amount: -5, currency: 'USD' }` instead of `'EUR'`.

**Fix:**
- `lib/cart.js`: the cart now builds a fresh object (`{ ...getDefaults(), ...customer.prefs }`) instead of writing into the shared one.
- `lib/settings.js`: the defaults object is now frozen. If any future code tries to change it, it throws an error right away instead of quietly breaking a test somewhere else. This is what stops the bug coming back.
- New `test/defaults.test.js` checks two things: creating a cart leaves the defaults unchanged, and writing to the defaults throws an error.

**Checks:**
- Before the fix: the full suite had 1 failure (`refunds use the shop currency`: got USD, expected EUR).
- After the fix: `npm test` gives 5 passed, 0 failed, and `node --test test/refund.test.js` on its own gives 2 passed.
- With the code fix removed, the new test fails, and with it restored, the test passes.

**Your description didn't quite match what I saw:** `refund.test.js` failed when run on its own too, not only in the full suite. Its second line is `require('./cart.test.js')`, which creates the USD cart first and also makes the USD test run twice. That line is an unusual dependency between test files, but it isn't the cause, so I left it in. I can remove it if you want.

Nothing is committed yet.