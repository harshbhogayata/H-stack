I fixed `add()` in `math.js`. When either number was negative, it added the absolute values instead of the actual numbers, so `add(-2, 3)` returned 5 instead of 1 and `add(-2, -3)` returned 5 instead of -5.

I removed that special case, so `add()` is now just `return a + b;`. After the change, `node test.js` passes all 4 assertions, including the two with negative numbers that the old code got wrong.

I haven't committed the change.