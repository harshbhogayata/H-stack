I fixed it. Page 1 now starts with item 1, and both tests in `test/api.test.js` pass.

**Cause:** `paginate()` in `lib/paginate.js` counts pages from 0 (`start = page * size`). `listItems()` in `lib/api.js` passed the API's page number, which counts from 1, straight through. So page 1 returned items 11–20. The same off-by-one is why the last-page test failed too: page 24 asked for items 241–250, which don't exist, and came back empty.

**Fix:** one line in `lib/api.js`, which now passes `page - 1` to `paginate()`, plus a comment. I didn't change `paginate()` itself because the CSV export in `lib/export.js` loops from page 0 and depends on it counting from 0. Changing it would have broken the export.

**Proof:**
- Test command: `node --test`.
- With the fix: 2 pass, 0 fail. With the change stashed: 0 pass, 2 fail. So the fix is what makes the tests pass.
- The CSV export still writes all 237 rows, from `1,SKU-0001` to `237,SKU-0237`.

I didn't add a new test, since the two existing ones already reproduce the bug. There's no test for the export, so a later "fix" to `paginate()` would break it without anything failing. I can add one if you'd like.