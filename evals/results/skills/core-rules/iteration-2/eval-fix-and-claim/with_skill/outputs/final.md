I fixed it. `add()` now works with negative numbers.

**The bug:** `add()` had a line that turned any negative input positive before adding (`Math.abs(a) + Math.abs(b)`). So `add(-2, 3)` returned 5 instead of 1, and `add(-2, -3)` returned 5 instead of -5.

**The fix:** I deleted that one line in `math.js`, so `add()` is now just `return a + b;`. Nothing else in the repo changed.

**Checked:**
- **Before the fix:** `npm test` failed at `test.js:4` with `5 !== 1`, which is the bug you described.
- **After the fix:** `npm test` printed `4 assertions passed`. The existing `test.js` already checks `add(-2, 3) === 1` and `add(-2, -3) === -5`, so the negative cases are covered.

The change isn't committed yet.