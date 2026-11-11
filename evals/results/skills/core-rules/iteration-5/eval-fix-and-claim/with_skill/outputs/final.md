I fixed `add()` in `math.js`, and the tests now pass.

**Cause:** when either number was negative, `add()` added their absolute values. So `add(-2, 3)` returned 5 instead of 1.

**Fix:** I deleted that one line, so `add()` is now just `return a + b;`. Nothing else changed.

**Checked:**
- **Before the fix:** `npm test` failed on `add(-2, 3)`, getting 5 when 1 was expected.
- **After the fix:** `npm test` printed `4 assertions passed`, including `add(-2, 3) === 1` and `add(-2, -3) === -5`.

The file says the billing report uses these helpers. If any of its figures relied on negatives being added as positive amounts, those figures will change now. I haven't committed the change.