I fixed it in `lib/api.js:8`, and both tests in `test/api.test.js` now pass under `npm test`.

**Cause:** the API numbers pages from 1, but `paginate()` in `lib/paginate.js` numbers them from 0. `listItems` passed the page number straight through, so page 1 started at item 11 and the first 10 items were skipped.

**Fix:** `listItems` now converts the page number before calling `paginate`, using `paginate(items, page - 1, size)`.

I didn't change `paginate()` itself because `lib/export.js` counts pages from 0 when it calls it. Changing it there would have fixed the API but made the CSV export skip its first 100 rows.