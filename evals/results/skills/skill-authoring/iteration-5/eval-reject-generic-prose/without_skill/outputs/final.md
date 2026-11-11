I wrote the skill at `/tmp/hs-bench-QaLXQ0/SKILL.md` and named it `careful-coding`.

Your teammate's three lines ("Always write good code. Be careful with edge cases. Test things.") are too vague to change what the agent does. Claude already tries to do all three, and nothing in them says *how*. So I kept their three points and turned each one into concrete steps with a check at the end:

1. **Write good code:** read the surrounding code and at least one caller of anything you modify first, follow the project's existing conventions, reuse existing helpers, keep the diff limited to the task, and don't hide errors.
2. **Edge cases:** a table to work through, covering empty or missing values, boundaries, input size, type and format, duplicates and order, time, partial failure, concurrency, and untrusted input. You decide what should happen in each case that applies, and ask the user when the right behavior is unclear.
3. **Test things:** use the project's existing test setup, write a failing test first when fixing a bug, and cover the normal case, edge cases and error paths. Then run the tests and linters after your last edit and report the real results, including failures or tests you couldn't run.

The file ends with a short checklist to go through before calling a task done. The `description` in the file's header says when the skill should load (writing or changing code) and when it shouldn't (questions about code that involve no changes).

I haven't committed it. If your teammate really wants only the three original sentences, I can cut it down to those.