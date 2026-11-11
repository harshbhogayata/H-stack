`parse_duration('1h30m')` now returns 90. The bug was in `duration.py:8-10`: each unit replaced the running total (`total = …`) instead of adding to it (`total += …`), so the minutes overwrote the hours.

**What I did:**
1. **Test first:** I added `test_hours_and_minutes_combine` to `tests/test_duration.py`, which checks that `parse_duration("1h30m") == 90`. Calling the function before the fix returned 30, so the test failed for the reason in the bug report.
2. **Fix:** I changed the two assignments in `duration.py` from `=` to `+=`.
3. **Green:** I called all three test functions directly with `python3` after the fix: `test_minutes`, `test_hours` and `test_hours_and_minutes_combine`. All three passed.

**Not verified:**
- pytest itself hasn't run: the command needed approval in this environment. The suite has only these three plain functions, so the direct calls covered all of it, but run `python -m pytest -q` to confirm.
- I added the new test to the existing test file without the skill's `hs phase test` step, because the `hs` helper isn't installed here. No existing test was changed.