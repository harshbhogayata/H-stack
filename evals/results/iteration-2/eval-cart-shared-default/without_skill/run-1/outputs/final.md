I fixed it, and the full suite now passes 5 of 5. `refund.test.js` also passes when run on its own.

**Cause:** `lib/cart.js` built carts with `Object.assign(getDefaults(), customer.prefs)`. `getDefaults()` returned the single cached object loaded from `config/defaults.json`, so this overwrote the shop defaults instead of copying them. Once the cart test made a cart with `currency: 'USD'`, the shop currency stayed USD for the rest of the run, and `refund()` then returned USD instead of EUR.

**Fix, in two places so it can't come back:**
- **`lib/settings.js`:** the loaded defaults are now frozen, and `getDefaults()` hands back a fresh copy on every call. Code that changes what it gets back can no longer affect anyone else. This is the change that stops the bug returning.
- **`lib/cart.js`:** carts are now built with `{ ...getDefaults(), ...prefs }`, which makes a new object instead of writing into the defaults.
- **New `test/settings.test.js`:** checks that changing what `getDefaults()` returns doesn't carry over to the next call, and that a customer's USD preference leaves refunds in EUR.

I didn't get to run the new test against the original code to watch it fail, because that check needed permission to create a temporary copy of the repo. It should fail there: the first test changes the shared object directly, which the old code allowed.

One more thing: `refund.test.js` starts with `require('./cart.test.js')`, so it runs the cart tests too. That's why it actually failed on its own as well, not only in the full suite. With the fix it's harmless, so I left it in. It's an odd link between test files, though, and you may want to remove it. Nothing is committed yet.