I fixed it: the refund test passes again and the whole suite passes (6 of 6). The refund code was never the problem.

**Cause:** `getDefaults()` in `lib/settings.js` returned the one object Node keeps after loading `config/defaults.json`, so every caller got the same object. `createCustomer` runs `Object.assign(getDefaults(), prefs)`, which writes the customer's preferences into it. The customer test runs just before the refund test and sets `currency: 'USD'`, so from then on the shared defaults said USD. That's why the refund test passed when run alone and failed in the full suite.

**Fix (`lib/settings.js`):** the defaults are now frozen when they load, and `getDefaults()` hands each caller its own copy. No caller can change the shared defaults any more, whether through `createCustomer` or anything written later.

**To stop it coming back:** I added `test/settings.test.js`, which checks two things directly, so it doesn't depend on which test runs first:
- Changing the object `getDefaults()` returns doesn't affect the next call.
- Creating a customer with its own preferences leaves the global defaults alone.

**Proof:**
- Reproduction command: `npm test`. Before the fix: 3 pass, 3 fail (the refund test plus both new tests). After: 6 pass, 0 fail.
- The skill's `verify-fix.mjs` script couldn't run here because it needs an H-Stack module that isn't installed. I did the same check by hand: with the fix stashed, all three of those tests fail; with it restored, all six pass.

I didn't add any debug logging, so there's nothing to clean up. The changes aren't committed.