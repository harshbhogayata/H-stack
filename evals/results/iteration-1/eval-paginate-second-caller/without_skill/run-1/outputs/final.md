Fixed. Page 1 now starts with item 1.

**Cause:** `paginate()` in `lib/paginate.js` counts pages from 0, but `listItems()` in `lib/api.js` takes page numbers that start at 1, as users see them. It passed the number through unchanged, so page 1 returned items 11–20.

**Fix** (`lib/api.js:4`): `listItems` now passes `page - 1` to `paginate`. I left `paginate` itself alone because `exportAll()` loops through it starting at page 0 and depends on that.

`npm test` passes, including the `page 1 starts with item 1` test. An earlier run failed only because I passed `test/` to `node --test` myself; the code wasn't the problem.

`listItems(0)` and negative page numbers aren't checked: they return an empty list, or wrong rows for a negative number. I can add a check if you want one.