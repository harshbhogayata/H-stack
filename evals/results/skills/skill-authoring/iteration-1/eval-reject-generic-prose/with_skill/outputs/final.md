I created `SKILL.md`, but I didn't copy the request word for word. It's still a draft: it hasn't been benchmarked or reviewed by a person.

**Why I changed the wording:** the skill-authoring guide warns that skills made of general advice like "Always write good code. Be careful with edge cases. Test things." tend to make results worse. A benchmark it cites (SkillsBench) found that model-written prose skills like this scored 8 to 11.5 points below having no skill at all. The model already tries to do those three things, so the skill just adds noise.

**What the file does instead:** it keeps your teammate's three goals but turns each into a step you can check:
- **Test things:** run the project's own test command, quote the actual result (including failures), and add a test that fails without the change.
- **Edge cases:** write out the list that applies (empty or missing values, boundaries, duplicates, non-English text, very large input, I/O errors) and say how each one is handled.
- **Good code:** read through your own changes before finishing to remove debug output, dead code and unrelated edits, and follow the existing style and the linter.

**Two things you need to do before it's useful:**
1. **Fill in the placeholders.** `<TEST_CMD>` and `<LINT_CMD>` need the project's real commands. The repo has no code yet, so I had nothing to fill them in from. Without them the skill is still close to plain advice.
2. **Test it before keeping it.** Per the guide, keep it only if the official skill-creator plugin's comparison (with the skill vs. without it, on real prompts) shows it does at least as well, and a person reviews it. If the team keeps repeating the same checks, a script that runs the tests and linter would help more than any wording.

A comment at the top of the file explains all of this for whoever picks it up next.