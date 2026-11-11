I've written `CLAUDE.md`. There wasn't much to work from: the repo has only `CONTRIBUTING.md`, `package.json` and a one-line `src/money.ts`, and no README.

**What's in it:**
- **Commands:** `npm run dev`, `npm test`, `npm run lint`, and how to run a single test with `npx vitest run <file>` (add `-t "<name>"` to pick one test by name).
- **Team rules from `CONTRIBUTING.md`:**
  - Store money as integer cents using the `Cents` type, never floats.
  - Never edit a migration that has shipped; add a new one.
  - Change `legacy/` only for security fixes.
  - Run tests and lint before pushing.

**Gaps it flags, so agents don't trip on them:**
- `package.json` doesn't list `tsx`, `vitest` or `eslint` as dependencies, so none of the scripts will run until they're added.
- `npm run dev` points at `src/index.ts`, which doesn't exist.
- `legacy/` and the migrations the rules mention aren't in the repo yet.
- `Cents` is just another name for `number`, so TypeScript won't stop a float being used as money.

I left out an architecture section because there's no code structure to describe yet. There are no Cursor, Copilot, Codex or Gemini config files in the repo. I couldn't check your home directory for Codex or Gemini settings; if you have any, reply `/import` to bring them in, or run `claude import` from a terminal.