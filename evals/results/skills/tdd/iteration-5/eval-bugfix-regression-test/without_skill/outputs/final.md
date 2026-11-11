I fixed `parse_duration` in `duration.py`. The loop was replacing `total` with each new value (`total = ...`) instead of adding to it, so only the last part counted: for `'1h30m'` that was the 30 minutes. It now uses `total += ...`.

A quick check now gives the right answers: `'1h30m'` → 90, `'45m'` → 45, `'2h'` → 120.