`parse_duration('1h30m')` now returns 90.

**The bug:** in `duration.py`, the loop that reads each number-and-unit pair used `total = ...`, so each pair overwrote the previous one. For `'1h30m'`, the `30m` replaced the `1h` and the result was 30. I changed both branches to `total += ...` so the pairs add up.

**Checked:** calling the function directly gives `'1h30m'` → 90, `'45m'` → 45 and `'2h'` → 120. The existing tests in `tests/test_duration.py` didn't run because pytest isn't installed here. They only check `'45m'` and `'2h'`, and those match what I got by hand. No test covers a combined input like `'1h30m'`, so it would be worth adding one.