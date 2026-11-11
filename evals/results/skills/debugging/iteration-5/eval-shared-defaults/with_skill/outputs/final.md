The refund test passes now. The whole suite passes (6 of 6), and the new tests fail if the fix is taken out.

**Root cause:** `lib/settings.js` returned the object straight from `require(config/defaults.json)`. Node caches what `require` returns, so every caller got the same object. `createCustomer` does `Object.assign(getDefaults(), prefs)`, which wrote the customer's own currency (`USD`) into the global defaults. The refund test fails only when it runs after the customer test.

**Before the fix:**
- `node --test --test-name-pattern=refund` (refund test alone): passed.
- `npm test` (full suite): "formats a refund" failed with `'-7.50 USD'`, expected `'-7.50 EUR'`.
- A direct check showed `getDefaults().currency` went from `EUR` to `USD` after one `createCustomer` call, and `getDefaults() === getDefaults()` was `true`.

**Fix (`lib/settings.js`):** the config file is loaded once and locked with `Object.freeze`. `getDefaults()` now returns a fresh deep copy (`structuredClone`) on every call. That fixes all callers in one place, so code that edits the defaults it's given can't change them for anyone else.

**Keeping it from coming back:** I added `test/settings.test.js`:
- One test checks that each call to `getDefaults()` returns an independent copy, and that changing one copy doesn't change the defaults.
- One test checks that creating a customer with `USD` leaves the defaults and refunds in `EUR`.

Neither depends on the order tests run in, so they catch the leak directly.

**Proof:** the skill's `verify-fix.mjs` script crashed because a file it imports (`lib/tests.mjs`) is missing, so I did the same check by hand. With the fix stashed, 3 tests failed (the refund test and both new ones). With it restored, all 6 passed.

The changes are not committed.