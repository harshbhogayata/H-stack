I wrote `features.json` with 8 checks covering the 3 items in SPEC.md. I tested them both ways: with no `todo.js` all 8 fail, and against a small throwaway `todo.js` in my scratchpad all 8 pass. Your repo is unchanged apart from the new `features.json`, which is untracked. No `todo.js` was written to the repo.

Paste this:

```
/goal todo.js implements SPEC.md. Done when all of these hold: (1) running the "runner" command stored in features.json from the repo root prints PASS for all 8 features and "ALL PASS", and exits 0; (2) `sha256sum features.json` prints 1b2baa610c89ef900e05c04e38dd9778a70395778b5bf9764566187a3ebf24ed, so the checks were not edited; (3) `git diff --quiet SPEC.md todos.json` exits 0. Only create or edit todo.js; never modify features.json, SPEC.md or todos.json.
```

**What the checks cover:**
- **`add`:** prints exactly `added: x`, saves the item to `todos.json` (which must stay valid JSON), and adds new items after the existing ones, in order.
- **`list`:** prints one line per item, numbered from 1 in the order added. An empty list exits cleanly with no numbered lines.
- **`done N`:** prints exactly `done: <text>`, removes the Nth item (I check item 2 as well as item 1), and the remaining items are numbered again from 1.

**Things to know before you leave it running:**
- **The checks don't touch your files.** Each one copies `todo.js` into a fresh temp folder with an empty `todos.json`, so running them never changes the repo's `todos.json`.
- **Some parts are left open because the spec doesn't decide them.** The items in `todos.json` can be stored as strings or as objects. List lines can be `1. x`, `1) x` or `1: x`. If you want one fixed format, say so and I'll tighten the checks and give you a new hash.
- **Two things aren't checked because the spec doesn't mention them:** a missing `todos.json`, and `done` with a number that doesn't exist.
- **The hash is there to keep the checks honest.** It stops the overnight run from editing the checks to make them pass. If you edit `features.json` yourself, run `sha256sum features.json` again and update the hash in the condition.