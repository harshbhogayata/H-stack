I fixed `add()` in `math.js`, and it now gives correct results for negative numbers.

**Cause:** whenever either number was negative, `add()` turned both numbers positive and then added them. That gave `add(-2, 3) = 5` instead of `1`. I deleted that line, so `add()` is now just `return a + b;` and nothing else changed.

**Checks, run after the edit:**
- **The bug:** before the fix, `add(-2,3)`, `add(2,-5)` and `add(-1,-1)` returned `5 7 2`. After the fix they return `1 -3 -2`, which is correct.
- **Tests:** before the fix, `npm test` failed on `add(-2, 3)` (got `5`, expected `1`). After the fix it prints `4 assertions passed`.

Not verified: there are no H-Stack receipt IDs to cite, because the `hs`/receipts tools aren't installed in this run. The command output above is the evidence instead. Nothing is committed.