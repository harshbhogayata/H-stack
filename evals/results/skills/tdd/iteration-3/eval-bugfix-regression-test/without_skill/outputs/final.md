I fixed it, and `parse_duration('1h30m')` now returns 90.

The bug was in `duration.py:8-10`. The loop used `total = ...`, so each part overwrote the one before it and only the last part counted. In `1h30m` that left just the 30. It now adds each part with `total += ...`.

A quick check gave `'1h30m'` → 90, `'45m'` → 45 and `'2h'` → 120.