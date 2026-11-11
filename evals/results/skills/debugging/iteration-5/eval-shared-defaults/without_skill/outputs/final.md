I fixed it and all 6 tests now pass. Refunds come out in EUR again.

**Cause:** this was never a refund bug. `getDefaults()` in `lib/settings.js` handed out the object that `require()` caches for `config/defaults.json`, so every caller got the same object. `createCustomer` then ran `Object.assign(getDefaults(), prefs)`, which wrote the customer's `USD` into that shared object. After that, every `formatTotal` and `refundTotal` call in the process used USD. The refund test failed only because the customer test runs before it.

**Fix, with two layers so it can't come back:**
- **`lib/settings.js`:** the defaults are now deep-frozen once when loaded, and `getDefaults()` returns a fresh copy on every call. If any future code tries to change the shared defaults, the change is either blocked or applied only to that caller's copy.
- **`lib/customers.js`:** builds `prefs` as a new object (`{ ...getDefaults(), ...prefs }`) instead of writing into the defaults.

**Regression tests** added in `test/billing.test.js`:
- Creating a customer with USD and precision 0 must not change how invoices or refunds are formatted.
- Changing what `getDefaults()` returns must not affect the next call.

To check the new tests really catch the bug, I put back the old `lib/` code and ran them: 3 tests failed, including both new ones. With the fix, all 6 pass. The changes aren't committed.