I fixed it, and both tests in `test/api.test.js` now pass.

**Cause:** `paginate()` in `lib/paginate.js` counts pages from 0, but `listItems()` in `lib/api.js` takes pages counted from 1 and passed the number straight through. So `?page=1` skipped to the second slice and left out items 1–10, and `?page=24` ran past the end and came back empty.

**Fix:** `lib/api.js:8` now passes `page - 1` to `paginate()`. I left `paginate()` alone because `lib/export.js` uses it starting at page 0. I checked that the CSV export still outputs all 237 items, from `1,SKU-0001` to `237,SKU-0237`.

`listItems()` still doesn't check `page`. A request for `page=0` or a negative page returns an empty list rather than an error. That was true before this fix too, and I didn't change it.