I fixed it. All 5 tests in the full suite pass now, and `refund.test.js` also passes when run by itself.

**Cause:** the bug was in the app code, not the test. `createCart` in `lib/cart.js` merged the customer's prefs with `Object.assign(getDefaults(), customer.prefs)`. That wrote straight into the shared defaults object, which Node keeps cached and reuses everywhere. So once `cart.test.js` created a USD cart, the shop default stayed USD for the rest of the run, and `refund()` returned USD instead of EUR. It shows up depending on what runs first because `refund.test.js` loads `cart.test.js` at the top. That also means it failed on its own here, not only in the full run.

**Fix:**
- **`lib/cart.js`:** prefs are now merged into a new object (`{ ...getDefaults(), ...prefs }`), so the defaults are left alone.
- **`lib/settings.js`:** the defaults are now locked (`Object.freeze`), so this can't come back. Any code that tries to change them in place will throw an error straight away instead of quietly affecting later calls.
- **`test/settings.test.js` (new):** two regression tests. One checks that creating a cart with prefs leaves the defaults unchanged. The other checks that changing the defaults in place throws.

`refund.test.js` still loads `cart.test.js`, which makes the cart test run twice. That's harmless now, so I left it, but you could remove that line.

Nothing is committed yet.