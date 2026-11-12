I fixed it, and page 1 now returns items 1–10.

**Cause:** `paginate()` in `lib/paginate.js` counts pages from 0, but `listItems()` in `lib/api.js` was handing it the page number users see, which counts from 1. Page 1 was therefore being read as the second page.

**Fix:** In `lib/api.js:4`, `listItems` now subtracts 1 before calling paginate: `paginate(ITEMS, page - 1)`. I didn't change `paginate` itself because `exportAll()` relies on it counting from 0 and would break.

**Checks:**
- `npm test` passes. Its one test checks that page 1 starts with item 1. An earlier run reported a failure only because I gave it the wrong path; the test itself was fine.
- Page 4, the last page, returns items 31–37.
- `exportAll()` still returns all 37 items.

The code doesn't check for page 0 or negative numbers, so those now return empty or wrong results. Nothing in the code shows whether callers ever send them, so I left that alone.