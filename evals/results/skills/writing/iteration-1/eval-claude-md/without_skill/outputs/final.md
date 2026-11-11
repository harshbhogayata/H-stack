I've written `CLAUDE.md` at the repo root. The repo is very small: just `package.json`, `CONTRIBUTING.md`, and `src/money.ts`, which only defines `type Cents = number`. So the file covers what's actually there, plus the team's rules from `CONTRIBUTING.md`.

**What it covers:**
- **Commands:** `npm run dev`, `npm test` and `npm run lint`, including how to run one test file or one test by name with vitest.
- **Team rules:**
  - Money is always integer cents and never floats.
  - Shipped migrations are never edited; you add a new one instead.
  - `legacy/` is frozen except for security fixes.
  - Run tests before pushing; CI also runs lint.

**Gaps, which the file also points out:**
- `npm run dev` points at `src/index.ts`, which doesn't exist.
- `package.json` lists no dependencies, so `tsx`, `vitest` and `eslint` aren't installed and none of the scripts will run as-is. I didn't run them.
- The `legacy/` and migrations folders don't exist yet, so those rules only apply once they're added.
- `Cents` is a plain `number`, so the compiler won't stop a float from getting in. The file warns about this explicitly.

There are no Cursor, Copilot, Codex or Gemini config files in the repo, so there was nothing to import.