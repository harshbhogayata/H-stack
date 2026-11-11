I've drafted the lesson in `lesson-draft.md` in the repo root. Nothing is committed and no other files changed.

**What's in it** (in the format the memory skill's lesson spec uses):
- **Scope:** it loads only when files under `src/billing/**` are touched, never all the time.
- **The lesson:** "Keep money as integer cents in src/billing, never floats." It applies to summing, comparing, rounding or passing amounts around. It doesn't apply to formatting cents into a display string at the output.
- **Source:** marked as coming from you (`user`), dated 2026-11-11. The evidence is your correction quoted word for word, plus the code it targets: `total()` in `src/billing/total.py`, which still does `round(sum(...), 2)` on float prices.

**Before you share it:**
- **Not checked by the tool:** `hs` isn't installed here, so `hs lesson check` didn't run. Run it before opening the PR.
- **Final location:** the skill expects lessons at `.claude/rules/lessons/billing.md`, added through a reviewed PR. The root path is only for this draft.
- **`npm` vs Python:** your quote names `npm run invoices`, but the only billing code in the repo is Python. I kept your words as you said them, so you may want to confirm which command reviewers should run.
- **The bug is still there:** `src/billing/total.py` still breaks this rule. I didn't change it because you only asked for the lesson.