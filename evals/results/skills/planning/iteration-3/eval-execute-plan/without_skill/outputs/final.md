Both tasks in PLAN.md are done, and all 3 tests pass.

- **Task 1:** `slugify` now drops every character that isn't a-z, 0-9 or a hyphen, and collapses repeated hyphens. The new `strips punctuation` test failed first, then passed after the change.
- **Task 2:** Added `uniqueSlug(title, taken)` to `src/slug.js`. If the slug is already in `taken`, it adds `-2`, `-3` and so on until it finds a free one. Before it existed, the test file failed to load, so the first two tests didn't run either.

I didn't tick the checkboxes in PLAN.md and didn't commit anything.