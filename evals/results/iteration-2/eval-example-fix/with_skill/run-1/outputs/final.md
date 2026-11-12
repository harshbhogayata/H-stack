I fixed `add()` in `math.js`. When either number was negative, it took the absolute value of both and added those, so `add(-2, 3)` returned 5 instead of 1. I removed that special case, so it's now just `return a + b`.

The tests in `test.js` now pass (`node test.js`: 4 assertions passed). Those tests include `add(-2, 3) === 1` and `add(-2, -3) === -5`, which the old code got wrong.

The file says these helpers are used by the billing report, so any report produced with negative amounts, such as refunds or credits, may have had wrong totals. The change isn't committed.