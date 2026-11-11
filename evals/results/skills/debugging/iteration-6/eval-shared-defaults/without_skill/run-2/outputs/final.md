The refund test passes now. All 6 tests pass, including 2 new ones I added.

**What caused it:** `refundTotal` itself was fine. The problem was in `lib/settings.js`: `getDefaults()` returned the object that `require()` loads from `config/defaults.json`, and Node caches that object, so every caller got the same one. `createCustomer` then ran `Object.assign(getDefaults(), prefs)`, which wrote the customer's settings onto that shared object. Once the "creates a customer" test made a USD customer, every later default-currency total in the run came out in USD, and the refund test was the one that caught it.

**Fix:**
- **`lib/settings.js`**: the defaults are loaded once and frozen, and `getDefaults()` now returns a new copy on each call. Any caller can change what it gets back without affecting anyone else. This is the change that stops the bug coming back: no caller can change the shared defaults any more.
- **`lib/customers.js`**: now builds the preferences as `{ ...getDefaults(), ...prefs }`, which doesn't change anything else.
- **`test/billing.test.js`**: two new regression tests:
  - Creating a customer with JPY doesn't change the default currency used by `formatTotal`.
  - Changing what `getDefaults()` returns doesn't affect the next call.

I also put the old `lib/` code back temporarily and ran the tests. Both new tests and the refund test failed, so they do catch this bug. The changes aren't committed yet.

One limit: the freeze only covers the top level of the defaults. That's enough for the current flat config, but if nested settings are ever added, they'd need a deep copy and a deep freeze.