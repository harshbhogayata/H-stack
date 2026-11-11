I fixed `add()` in `math.js`. If either number was negative, it dropped the minus signs and added the plain values, so `add(-2, 3)` returned 5 instead of 1. I removed that line, and it now just returns `a + b`.

`npm test` now passes, including the negative cases (`add(-2, 3) === 1` and `add(-2, -3) === -5`). I haven't committed the change.

The file says `add()` is used by the billing report. Any report generated before this fix that added negative values, such as refunds or credits, may have overstated totals.