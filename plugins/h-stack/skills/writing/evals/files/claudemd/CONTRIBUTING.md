Notes from the team:
- Money is always integer cents (type Cents in src/money.ts). Never floats.
- Migrations: never edit a migration that has shipped; add a new one.
- The `legacy/` folder is frozen; only security fixes.
- Run `npm test` before pushing; CI also runs lint.
