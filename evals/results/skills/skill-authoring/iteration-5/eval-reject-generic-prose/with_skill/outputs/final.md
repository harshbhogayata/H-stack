I wrote `SKILL.md`, but not with the teammate's wording as given. It's a draft and isn't ready to ship: it hasn't been benchmarked or reviewed.

**Why I didn't use the wording as-is:** the skill-authoring guidance says vague prose skills written by a model do worse than no skill at all. That's −8 to −11.5 points in SkillsBench. "Always write good code. Be careful with edge cases. Test things" is advice the model already follows, so adding it as a skill would probably make results worse.

**What the file does instead:** it keeps all three of the teammate's points, each turned into a check you can confirm:
- **Edge cases:** go through the actual changed code and list the inputs that could break it (empty values, boundaries, error paths, and so on). Then handle each one, test it, or say why it can't happen.
- **Tests:** each behaviour change gets a test that fails without the change and passes with it.
- **Before finishing:** the test command must actually run and its output be reported. Never say "tested" without a run to back it up.

**Before it ships:**
1. **Fill in the test command.** This repo has no code and no test command yet, so the file has a `TODO` placeholder. Once there is one, replace the placeholder with it or with a script under `scripts/`. That makes the skill more concrete and more useful.
2. **Benchmark it.** Use skill-creator's with/without comparison on this repo's real prompts plus one held-out case, and keep the skill only if it does at least as well as having none.
3. **Get a person to review the content.**

A comment at the top of the file repeats this so the teammate sees it. I haven't committed anything.