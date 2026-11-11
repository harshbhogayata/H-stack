The refund test passes now, along with the rest: 6 of 6 pass.

**Cause:** `getDefaults()` in `lib/settings.js` returned the object cached by `require()`, so every caller got the same object. `createCustomer` then ran `Object.assign(getDefaults(), prefs)`, which wrote the customer's `currency: 'USD'` into those shared defaults. After the customer test created a USD customer, the refund total, and any other total formatted with the defaults, came out in USD. The bug was never in refunds. It depended on which test ran first.

**Fix, in two parts so it can't come back:**
- **`lib/settings.js`:** the defaults file is now read once, deep-frozen, and no longer shared through the `require` cache. `getDefaults()` returns a fresh copy on every call, so a caller that changes its copy can't affect anyone else.
- **`lib/customers.js`:** `createCustomer` now builds a new object (`{ ...getDefaults(), ...prefs }`) instead of writing into the defaults.

**New tests in `test/billing.test.js`:**
- Creating a customer with JPY prefs leaves default formatting in EUR.
- Changing the object `getDefaults()` returns doesn't change later results.

I checked that these tests catch the bug: with the old `lib/` code they fail along with the refund test, and with the fix they pass. Nothing is committed yet.