`add()` now gives the right answers for negative numbers, and all 4 tests pass when I run `npm test`.

**The bug:** if either number was negative, `add()` made both numbers positive before adding them. So `add(-2, 3)` returned 5 instead of 1, and `add(-2, -3)` returned 5 instead of -5.

**The fix:** I removed that special case in `math.js`, so `add()` is now just `a + b`.

I haven't committed the change.