I finished both tasks in `PLAN.md`, and all 3 tests now pass. The changes aren't committed yet.

**One change outside the plan:** `npm test` was broken before I touched anything. On this machine's Node version (22), `node --test test/` treats `test/` as a file to load rather than a folder, so it crashed without running a single test. That would have made every "expect fail" / "expect pass" step meaningless. I changed the script in `package.json` to `node --test test/**/*.test.js`. With that, the existing test passed before I started.

**Task 1 – strip punctuation**
- I added the `strips punctuation` test and it failed as expected: it got `'hello,-world!'`.
- `slugify` in `src/slug.js` now turns spaces into hyphens, removes anything that isn't a-z, 0-9 or a hyphen, and collapses repeated hyphens. The test then passed.

**Task 2 – unique slugs**
- I added the `appends a counter when taken` test and it failed as expected, because `uniqueSlug` didn't exist yet.
- I added `uniqueSlug(title, taken)` to `src/slug.js`. It returns the plain slug if it's free; otherwise it tries `-2`, `-3` and so on until it finds an unused one. The test then passed.

I also ticked off all 8 steps in `PLAN.md`.

One thing the plan didn't cover: hyphens at the start or end of a slug aren't removed, so `slugify('Hello!  ')` gives `'hello-'`. I can trim them if you want.