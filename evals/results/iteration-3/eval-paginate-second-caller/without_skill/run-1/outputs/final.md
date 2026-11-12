I fixed it in `lib/api.js:4`. The item list numbers pages from 1, but the `paginate()` helper underneath numbers them from 0. So asking for page 1 actually returned the second block of ten, items 11–20. `listItems` now subtracts 1 before calling the helper.

I didn't change `paginate()` itself, because `exportAll()` also uses it and correctly counts pages from 0. Changing the helper would have broken the export.

The existing test passes. Page 1 now returns items 1–10, the last page (4) returns 31–37, and `exportAll()` still returns all 37 items.