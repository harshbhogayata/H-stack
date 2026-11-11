The bug is fixed with one change in `lib/api.js:8`: the page number is now converted from 1-based to 0-based before it's passed to `paginate`.

```js
items: paginate(items, page - 1, size)
```

**Cause:** `paginate()` counts pages from 0, but `listItems()` was passing the API's page number, which counts from 1. So `page=1` returned items 11–20, and page 24 came back empty.

**Proof:** the repro was `npm test`.
- **Before the fix:** both tests failed. Page 1 started at id 11, and page 24 returned `[]` instead of ids 231–237.
- **After the fix:** both tests pass.
- **Fix removed:** I stashed the change and reran, and both tests failed again, so this change is what makes them pass.

The CSV export is the other caller of `paginate`, and it already counts pages from 0. I left `paginate` unchanged so the export doesn't lose its first 100 rows. I ran the export after the fix and it still returns all 237 rows, from `1,SKU-0001` to `237,SKU-0237`.

The existing tests already cover this bug, so I didn't add a new one. No debug logging was added. One related gap I didn't change: `page=0` or a negative page isn't checked, and would now give empty or wrong results.