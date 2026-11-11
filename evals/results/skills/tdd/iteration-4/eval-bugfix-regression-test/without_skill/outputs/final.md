I fixed it in `duration.py:8-10`. The loop used `total =` instead of `total +=`, so each unit replaced the running total instead of adding to it. For `1h30m`, the `30m` part overwrote the 60 from `1h`, which is why you got 30.

I checked it afterwards: `1h30m` now gives 90, `45m` gives 45 and `2h` gives 120.