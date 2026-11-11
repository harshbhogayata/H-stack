I wrote `CLAUDE.md` at the repo root. The repo is tiny: it has only `CONTRIBUTING.md`, `package.json` and `src/money.ts`, which holds just `type Cents = number`. So the file is short and covers three things:

- **Commands:** `dev`, `test`, `lint`, and how to run a single test file or a single test by name with vitest.
- **Team rules from `CONTRIBUTING.md`:** money is always integer cents using the `Cents` type, shipped migrations are never edited, and `legacy/` is frozen except for security fixes. I added one warning: `Cents` is just another name for `number`, so the compiler won't catch a float.
- **Gaps:** `src/index.ts`, which the `dev` script runs, doesn't exist yet, and `package.json` lists no dependencies, so `tsx`, `vitest` and `eslint` aren't installed.

The rules also mention a migrations folder and a `legacy/` folder, but neither exists in the repo yet.

I didn't write an architecture section because there's no code to describe yet. It's worth adding one once the API has some structure.