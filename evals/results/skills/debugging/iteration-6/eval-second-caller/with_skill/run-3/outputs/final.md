I fixed it with a one-line change, and both tests in `test/api.test.js` now pass.

**Cause:** `paginate()` in `lib/paginate.js` counts pages from 0, so page 0 is the first page. The API takes page numbers from the request starting at 1, and `listItems` in `lib/api.js` passed that number straight to `paginate`. So `?page=1` returned items 11–20, and the last page (24) came back empty.

**Fix:** `lib/api.js:8` now calls `paginate(items, page - 1, size)`. I left `paginate` alone because `lib/export.js` also uses it and counts pages from 0. Changing `paginate` would have made the CSV export drop its first 100 rows.

**Checks:**
- **Before the fix:** `npm test` → 0 pass, 2 fail (page 1 started at id 11; page 24 was empty).
- **After the fix:** `npm test` → 2 pass, 0 fail.
- **Without the fix again:** I stashed the change and reran. Both tests failed again, so the fix is what makes them pass.
- **CSV export:** it still writes all 237 rows, from `1,SKU-0001` to `237,SKU-0237`. No test covers the export, so I checked it by hand. I can add a test for it if you'd like.