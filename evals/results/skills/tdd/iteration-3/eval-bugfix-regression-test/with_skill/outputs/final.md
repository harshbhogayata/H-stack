I fixed it: `parse_duration('1h30m')` now returns 90.

**Cause:** in `duration.py`, the loop used `total = …`, so each part replaced the running total. The minutes part overwrote the hours. I changed both lines to `total += …` so the parts add up.

**Testing:** I added a new test file, `tests/test_duration_combined.py`, which checks that `parse_duration("1h30m") == 90`. I didn't touch the existing test file.
- Before the fix, the new test failed with an `AssertionError` and the two existing tests passed.
- After the fix, all three tests pass.

pytest isn't installed here, so I ran the test functions directly with `python3` instead.