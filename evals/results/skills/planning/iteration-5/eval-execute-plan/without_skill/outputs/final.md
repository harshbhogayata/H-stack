I finished both tasks in PLAN.md. All 3 tests pass and I ticked all 8 steps in the plan. Each new test failed before I wrote the code and passed after.

- **Task 1, removing punctuation:** `slugify` in `src/slug.js` now turns spaces into hyphens, deletes every character that isn't a-z, 0-9 or a hyphen, and merges repeated hyphens into one. `slugify('Hello, World!')` gives `hello-world`.
- **Task 2, unique slugs:** I added `uniqueSlug(title, taken)` to `src/slug.js`. If the plain slug isn't in `taken`, it returns it unchanged. Otherwise it adds `-2`, `-3` and so on until it finds a free one.

The plan didn't cover leading or trailing hyphens, so I left them alone. Input like `' Hello '` or `'!Hello'` gives a slug that starts or ends with a hyphen (`-hello-`). Trimming them would take one more line if you want it.

The changes aren't committed yet.