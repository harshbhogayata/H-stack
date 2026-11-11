The refund test passes now, and the whole suite passes (6/6).

**Cause:** `getDefaults()` in `lib/settings.js` returned the cached object from `require('config/defaults.json')`, so every caller got the same object. `createCustomer` does `Object.assign(getDefaults(), prefs)`, which writes the customer's preferences into that object. The customer test runs just before the refund test and sets `currency: 'USD'`, so after it every total came out in USD. I confirmed it two ways: the refund test passes when run on its own, and after one `createCustomer({ prefs: { currency: 'USD' } })` call, `getDefaults()` returned `currency: 'USD'`.

**Fix (`lib/settings.js`):** the config is loaded once and frozen, and `getDefaults()` now hands each caller its own copy. Any code that changes what `getDefaults()` returns, now or later, only changes its own copy. I didn't change `customers.js`, since it's safe once the defaults are.

**Regression tests (`test/billing.test.js`):** two new tests that don't depend on which tests ran before them:
- Creating a customer with USD and precision 0 leaves the defaults at EUR/2/de-DE, and a refund still formats in EUR.
- Changing an object returned by `getDefaults()` doesn't affect the next caller.

**Proof** (`node --test`):

| | Result |
|---|---|
| Before, original suite | 3 pass, 1 fail (`-7.50 USD` instead of `-7.50 EUR`) |
| New tests, fix not yet applied | 3 pass, 3 fail (refund test and both new tests) |
| With fix | 6 pass, 0 fail |
| Fix removed with `git stash`, then restored | 3 fail without it, 6 pass with it |

The changes are in the working tree and not committed.