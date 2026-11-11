I fixed it: the refund test passes again, and two new tests will catch the bug if it comes back.

**Cause:** the bug was never in the refund code. `getDefaults()` in `lib/settings.js` handed every caller the same config object, because Node only loads a JSON file once and reuses it. `createCustomer` merges customer preferences straight into that object with `Object.assign(getDefaults(), prefs)`. So the earlier test that creates a USD customer changed the app-wide default currency to USD, and every later `formatTotal`/`refundTotal` call printed USD. I checked this directly: the refund test passes when run alone, `getDefaults() === getDefaults()` was `true`, and the currency switched from EUR to USD after `createCustomer`.

**Fix** (`lib/settings.js`, the only code change): the config is loaded once, locked against changes, and `getDefaults()` now returns a fresh copy on each call. No caller can change the defaults for anyone else, which also covers any future caller that tries what `createCustomer` did.

**Regression tests** added to `test/billing.test.js`. Neither depends on the order tests run in:
- `customer prefs do not leak into global defaults`: creates a JPY customer, then checks that invoice and refund totals still come out in EUR.
- `getDefaults returns an independent copy each call`: changes one returned copy and checks the next call is unaffected.

**Results (`npm test`):**
- Before: 3 pass, 1 fail (`'-7.50 USD'` instead of `'-7.50 EUR'`).
- New tests with the fix removed: 3 pass, 3 fail (the refund test and both new tests).
- With the fix: 6 pass, 0 fail.

The skill's `verify-fix.mjs` script needs H-Stack files that aren't installed here, so I did the same check by hand: I set the fix aside with `git stash`, ran the tests, and put it back. I added no debug logging. The changes are uncommitted in the working tree.