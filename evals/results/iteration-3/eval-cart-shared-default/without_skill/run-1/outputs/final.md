`refund.test.js` passes now, both in the full suite (5/5) and run by itself (2/2).

**Why it failed:** in `lib/cart.js`, `createCart` called `Object.assign(getDefaults(), customer.prefs)`. `getDefaults()` returns the one shop-defaults object that every caller shares, so building a USD cart permanently changed the shop currency from EUR to USD. Any later `refund()` in the same process then came back in USD. One correction: here it also failed when run alone, because `refund.test.js` loads `cart.test.js` itself, so the USD cart gets built first either way.

**The fix:**
- **`lib/cart.js`**: `createCart` now copies the defaults and customer prefs into a new object (`{ ...getDefaults(), ...prefs }`) instead of writing into the shared one.
- **`lib/settings.js`**: the shared defaults are now frozen. Any future code that tries to change them throws a `TypeError` straight away, instead of quietly breaking whichever test happens to run next. This is what stops the bug coming back: the old `Object.assign` line would now crash the cart test outright. I worked that out from how frozen objects behave but didn't run it.
- **`test/settings.test.js`** (new): checks that building a USD cart leaves the defaults and `refund()` on EUR, and that trying to change the defaults throws.

The fix doesn't depend on test order, but `refund.test.js` still loads `cart.test.js` for no clear reason. You may want to remove that line so each test file runs on its own. Nothing is committed yet.