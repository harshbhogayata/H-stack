I wrote `CLAUDE.md` at the repo root. The repo has only three tracked files and one commit, so the file is short and has no architecture section.

What it covers:
- **Commands:** the npm scripts `dev`, `test` and `lint`, plus how to run a single test with `npm test -- <file>` (add `-t` to filter by name). It also passes on the team note to run `npm test` before pushing, since CI also runs lint.
- **Team rules from `CONTRIBUTING.md`:** money is always integer cents using the `Cents` type in `src/money.ts`, never floats; never edit a migration that has shipped, add a new one instead; and the `legacy/` folder is frozen except for security fixes.

None of the scripts can run yet. `package.json` doesn't list `tsx`, `vitest` or `eslint` as dependencies, and `src/index.ts` (the `dev` entry point) doesn't exist. `legacy/` and any migrations don't exist yet either, but I kept those rules because they'll apply once they do.

There was no README, no Cursor or Copilot rules, and no Codex or Gemini config in the repo. I didn't check for Codex or Gemini config in your home directory.