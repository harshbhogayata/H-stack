I've drafted the lesson at `lesson-draft.md` in the repo root and didn't commit it.

It states the rule (money in `src/billing` is integer cents, with no floats and no `round()` on floats), describes the March invoice run (10.30 came out as 10.29), and briefly explains why floats cause this. It ends with a short list of do's and don'ts, a code example, and a review checklist.

Before you share it, check three things:

- **The bad code is still there.** `src/billing/total.py` still sums float prices and calls `round(..., 2)`. The lesson calls that "as it stands today" and doesn't claim it's fixed. The "instead" example uses a `price_cents` field that doesn't exist in the repo yet, so the team will need to make that change.
- **The `npm` reference doesn't match the repo.** The correction says `npm run invoices`, but this repo only has a Python file and no `package.json`. I left the command out rather than guess. Add it back if invoices are run from another repo.
- **The exact cause of the 10.29 is unconfirmed.** `round(10.299999, 2)` on its own returns 10.3. So the wrong value probably came from a later step, like truncation or formatting. The lesson says the error survived rounding and then got cut, but doesn't name the exact step. Fill that in if you know which step did it.