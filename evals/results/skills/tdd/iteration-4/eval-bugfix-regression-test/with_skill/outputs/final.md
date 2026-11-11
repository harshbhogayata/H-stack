I fixed it: `parse_duration('1h30m')` now returns 90. All 3 tests pass.

**Cause:** in `duration.py`, the loop wrote each unit's value over `total` (`total = ...`) instead of adding to it. So only the last unit counted, and `1h30m` came out as just the 30 minutes. The fix changes both branches to `total += ...`.

**Test-first:**
- **Red:** I added `tests/test_duration_combined.py` with a test asserting `parse_duration("1h30m") == 90`. It failed with `assert 30 == 90`, which is the reported bug.
- **Green:** after the fix, that test and the two existing ones (`45m` → 45, `2h` → 120) pass.

I put the new test in its own file because the skill treats existing test files as read-only. The `hs`/receipts steps were skipped as instructed. I didn't add tests for other inputs, such as a repeated unit (`1h1h`) or text that isn't a duration, because the spec doesn't define what those should return.