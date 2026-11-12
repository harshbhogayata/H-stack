Page 1 now starts at item 1.

**Cause:** user-facing page numbers start at 1, but `paginate` in `lib/paginate.js` counts pages from 0. `listItems` passed the page number through unchanged, so page 1 returned items 11–20.

**Fix:** `lib/api.js:4` now calls `paginate(ITEMS, page - 1)`. I left `paginate` alone because `exportAll` also uses it and needs it to count from 0.

**Checked:** `npm test` passes (1/1). I also ran a spot check: page 1 starts at item 1, page 4 returns items 31–37, page 5 is empty, and `exportAll` still returns all 37 items.

Page 0 or a negative page now returns an empty list. Nothing checks for that today; I can add a check if you want one.