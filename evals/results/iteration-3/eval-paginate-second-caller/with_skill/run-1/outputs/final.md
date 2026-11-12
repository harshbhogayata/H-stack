Page 1 now starts at item 1 instead of item 11.

**Cause:** the API takes page numbers starting at 1, but `paginate` counts pages from 0. So `listItems(1)` was really asking for the second page.

**Fix:** `lib/api.js:4` now calls `paginate(ITEMS, page - 1)`. I left `paginate` itself alone because `exportAll` also uses it and expects pages counted from 0.

**Checked:** the test that was failing (`page 1 starts with item 1`) now passes. Page 1 returns items 1–10, page 4 returns items 31–37, and `exportAll` still returns all 37 items.