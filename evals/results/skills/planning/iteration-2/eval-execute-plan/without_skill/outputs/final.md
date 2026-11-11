I finished both tasks in PLAN.md, and `npm test` now passes all 3 tests. I followed the plan's order: each new test failed first, then passed once the code was in.

- **Task 1:** `slugify` now drops any character that isn't a–z, 0–9 or a hyphen, and turns runs of hyphens into one. `'Hello, World!'` gives `'hello-world'`.
- **Task 2:** I added `uniqueSlug(title, taken)` in `src/slug.js`. It returns the plain slug if no one has it yet. Otherwise it adds `-2`, `-3`, and so on, using the first number that's free.

I ticked all 8 checkboxes in PLAN.md. The changes to `src/slug.js`, `test/slug.test.js` and `PLAN.md` are not committed.

The plan doesn't say to remove hyphens at the start or end of a slug, so I left them. That means a title like `' Hello!'` becomes `'-hello'`. I can trim them if you want.