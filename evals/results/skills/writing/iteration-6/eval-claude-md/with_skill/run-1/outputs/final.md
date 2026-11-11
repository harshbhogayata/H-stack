I wrote `CLAUDE.md` in the repo root. I haven't committed it.

It turns the four rules in `CONTRIBUTING.md` into instructions an agent can act on:
- **Money:** amounts are always whole cents, using the `Cents` type in `src/money.ts`. That type is just another name for `number`, so the compiler won't stop a decimal value. The file tells the agent to keep values whole itself.
- **Migrations:** never edit one that has shipped. To change the schema, add a new migration.
- **`legacy/`:** it's frozen, so only change it for security fixes and build new behaviour elsewhere.
- **Before pushing:** run `npm test` and `npm run lint`. `CONTRIBUTING.md` only asks for the tests, but CI also runs lint.

I checked the repo before writing, and some of what the rules describe isn't there yet. The file says so under "Gotchas":
- `npm run dev` points to `src/index.ts`, which doesn't exist, so the dev server won't start until someone creates it.
- There is no `legacy/` folder or migrations folder. The repo is just `package.json`, `CONTRIBUTING.md` and `src/money.ts`.

I left out the npm commands themselves, since an agent can read them in `package.json`.

The rules now exist in both `CONTRIBUTING.md` and `CLAUDE.md`. If you'd rather keep a single copy, `CLAUDE.md` can pull in the other file with a `@CONTRIBUTING.md` line instead.