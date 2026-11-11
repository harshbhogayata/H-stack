I fixed it, and `parse_duration('1h30m')` now returns 90.

The loop in `duration.py` was replacing `total` each time it read a part (`total = ...`) instead of adding to it. So the minutes part overwrote the hours part. I changed both lines to `total += ...` (`duration.py:8` and `duration.py:10`).

I ran it after the fix: `'1h30m'` gives 90, `'45m'` gives 45 and `'2h'` gives 120.