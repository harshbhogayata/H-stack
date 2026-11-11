I wrote the lesson to `lesson-draft.md` in the repo root and didn't commit it. Its rule: money in `src/billing` is stored and calculated as integer cents, never as floats. It also says not to call `round()` on a float total. The draft explains the March invoice bug, where a float total of 10.299999 was rounded and showed as 10.29 instead of 10.30. It then covers how to do it right:
- Add up cents as integers.
- Turn cents into dollars only when showing the amount.
- Use `Decimal` when a calculation needs fractions, then convert back to integer cents.

It also has a before/after code example and a review checklist.

**The code still has the bug:** `src/billing/total.py` still adds up float prices and calls `round(..., 2)` on the result. The draft names it as code that needs changing; I didn't edit it.

There's no `package.json` here, so I couldn't check the `npm run invoices` command. The draft quotes it as you wrote it.