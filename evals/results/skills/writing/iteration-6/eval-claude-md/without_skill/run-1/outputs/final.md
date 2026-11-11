I wrote `CLAUDE.md` at the repo root. It's short because the repo only has three files: `package.json`, `CONTRIBUTING.md` and `src/money.ts`, which holds a single type. There was no README, Cursor rules, Copilot instructions or Codex/Gemini config to bring in.

It covers:
- **Commands:** `npm run dev`, `npm test`, `npm run lint`, and how to run one test file or one named test with Vitest.
- **Team rules from `CONTRIBUTING.md`:** money is always whole cents using the `Cents` type, never floats; shipped migrations are never edited, only added to; `legacy/` takes security fixes only; run tests and lint before pushing, since CI runs lint.

I didn't run any of the scripts, and I don't think they'll work yet:
- **`npm run dev`:** it runs `src/index.ts`, which doesn't exist.
- **All three scripts:** `package.json` has no dependencies, so `tsx`, `vitest` and `eslint` need installing first.
- **Rules for missing folders:** there's no `legacy/` folder or migrations yet, so those two rules don't apply to anything right now.

The file says all of this so future agents aren't caught out. I didn't add an architecture section because there's no code structure to describe yet; it's worth adding one once the app has more files.