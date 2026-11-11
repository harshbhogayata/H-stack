I've created `SKILL.md` with frontmatter and the skill name `code-quality-checklist`.

Your teammate's three lines ("write good code, be careful with edge cases, test things") are too vague for Claude to act on, so the skill keeps them as its three sections and spells out specific checks under each:

1. **Write good code:** follow the conventions already in the code, reuse existing helpers, keep the change to the task, handle errors properly, comment on *why* rather than *what*, and remove leftover debug code.
2. **Be careful with edge cases:** a table of categories to check (empty or missing values, boundaries, size, format, time, concurrency, external failures). For each case, decide whether to handle it, reject it, or document it as out of scope.
3. **Test things:** run the tests before and after the change, add tests for new behavior and edge cases, write a test that fails without the fix for bug fixes, try the real thing, run the linter and type checker, and report results honestly.

It ends with a short checklist of what "done" means. If your teammate wanted only the original three sentences, I can cut it down to that.