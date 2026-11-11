I fixed it: `parse_duration('1h30m')` now returns 90, and all 3 tests pass.

**Cause:** in `duration.py`, the loop used `total = ...`, so each part replaced the one before. The 30 minutes wrote over the 60 from the hour. It now uses `total += ...` so the parts add up.

**Test first:** I added `tests/test_duration_combined.py`, which checks that `parse_duration("1h30m") == 90`.
- **Before the fix:** the new test failed with `assert 30 == 90`, the reported bug. The two existing tests passed.
- **After the fix:** all 3 tests pass.

I put the regression test in a new file because the skill treats existing test files as read-only, so `tests/test_duration.py` is unchanged. As you instructed, I skipped the `hs` and `receipts` steps.