I fixed `add()` in `math.js`. If either number was negative, it added their absolute values, so `add(-2, 3)` returned 5 instead of 1. I removed that check, and `add` now just returns `a + b`.

The tests in `test.js` pass: `node test.js` reports all 4 assertions passed, including `add(-2, 3) === 1` and `add(-2, -3) === -5`. I haven't committed the change.