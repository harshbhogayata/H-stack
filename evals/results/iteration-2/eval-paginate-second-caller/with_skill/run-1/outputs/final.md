Page 1 now starts at item 1. It was skipping the first 10 items because `listItems` in `lib/api.js:4` passed the user's page number, which starts at 1, to `paginate`, which counts pages from 0. So page 1 returned items 11–20. The fix is a one-line change in `lib/api.js:4`: it now passes `page - 1`.

I left `paginate` as it is because `exportAll` also uses it and already counts pages from 0. Changing `paginate` would have made the export skip the first 10 items too.

**Checks:**
- `npm test` passes. Its one test checks that page 1 starts with item 1.
- A one-off script showed page 1 returns items 1–10, the default page is page 1, page 4 returns items 31–37, and `exportAll` still returns all 37 items.

I also tried to add tests for the default page, the last page and `exportAll`, but a hook blocks edits to `test/api.test.js` unless a test-writing step is declared first. The test file is unchanged. Approve that change and I'll add the tests.