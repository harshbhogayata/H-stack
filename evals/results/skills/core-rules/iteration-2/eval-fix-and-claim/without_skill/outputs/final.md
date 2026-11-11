I fixed `add()` in `math.js`, and all 4 test assertions now pass, including `add(-2, 3) === 1` and `add(-2, -3) === -5`.

The function had a special case that took the absolute value of both numbers whenever either was negative, so `add(-2, 3)` returned 5 instead of 1. I removed that line, and it now just returns `a + b`.

A comment says this code feeds the billing report. If any part of that report relied on the old behaviour to add negative amounts like refunds as positive, those totals will now come out different.

I haven't committed the change.