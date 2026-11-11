Fixed. Both tests in `test/api.test.js` now pass.

**Cause:** the API treats `page` as starting at 1, but `paginate()` in `lib/paginate.js` starts counting at 0. `listItems` passed the page number through unchanged, so `page=1` returned items 11–20 and every page was shifted forward by one.

**Fix:** `lib/api.js:8` now passes `page - 1` to `paginate()`. I left `paginate()` alone because `lib/export.js` also uses it and counts pages from 0. After the change, the CSV export still produces all 237 rows.

One more problem I didn't change: `?page=0` or a negative page gives wrong results, because `slice` treats a negative start as counting from the end of the list. Clamping `page` to at least 1 in `listItems` would fix it if you want that.