The refund test passes now, and all 5 tests pass.

**Cause:** this wasn't a problem in the refund code. `getDefaults()` in `lib/settings.js` returned the object from `require()`, which Node caches and shares across the whole process. `createCustomer` then ran `Object.assign(getDefaults(), prefs)`, which wrote the customer's preferences into that shared object. Once the "creates a customer" test set `currency: 'USD'`, every later call to `formatTotal` or `refundTotal` used USD. The refund test failed only because it runs after that test.

**Fix:**
- **`lib/settings.js`:** the config is loaded once and deep-frozen, so nothing can change the shared copy. `getDefaults()` now hands each caller its own copy, which it can safely edit. This closes the bug for any future caller that modifies the defaults, not just this one.
- **`lib/customers.js`:** `createCustomer` now builds a new object with spread instead of writing into the defaults.
- **`test/billing.test.js`:** I added a regression test. It creates a customer with other preferences, changes a returned defaults object, and checks that the defaults and `formatTotal` still give EUR. I ran it against the old code and it fails there, so it will catch this bug if it comes back.

Nothing is committed yet.