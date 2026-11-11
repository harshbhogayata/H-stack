I drafted the lesson as `lesson-draft.md` in the repo root. Nothing is committed, and I haven't run `hs lesson check` on it because `hs` isn't installed here.

**What's in it:** one lesson, `L-bill-1`: keep money as integer cents in `src/billing/` and never call `round()` on floats.
- It loads only when files under `src/billing/` are touched.
- It doesn't apply when cents are being turned into a display string; dividing by 100 there is fine.
- Its evidence is your correction quoted word for word, plus the current code in `src/billing/total.py:2`, which still does `round(sum(...), 2)` on float prices. The source is marked as your correction (`user`), since I didn't run anything to reproduce the bug.

**Things to check before you open a PR:**
- **`npm run invoices` may be wrong:** the correction cites that command, but this repo has no `package.json`, and the billing code is Python. I kept your words as they were, so please confirm the command before the team relies on it.
- **The code still has the bug:** `total()` still sums float prices and rounds them, so it breaks the rule. Fixing it is separate work, and I haven't touched it.
- **File location:** the memory skill expects lessons at `.claude/rules/lessons/billing.md`. When you're happy with the draft, move it there and add it in a reviewed PR.