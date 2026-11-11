I wrote `migrate.js`, ran it, and it converted 4 of the 5 users in `users.json` into `users-v2.json`. User 3 (Cy Ode) has no email, and the README says a user without an email can't be migrated.

```
source: 5, migrated: 4, skipped: 1, written: 4
  not migrated: id 3 (missing email)
```

| id | email | name |
|---|---|---|
| 1 | ana@example.com | Ana Silva |
| 2 | bo@example.com | Bo Chen |
| 4 | di@example.com | Di Ng |
| 5 | ed@example.com | Ed |

User 5's last name is empty, so their name comes out as `"Ed"`, with no trailing space.

**How it works:**
- `migrate.js` renames `uid` to `id` and `mail` to `email`, and joins first and last name into `name`, trimmed.
- Any user without an email is listed in the output with a reason instead of being dropped silently.
- Before and after writing, it checks that the counts add up (source = migrated + skipped, and written = migrated) and stops if they don't.
- Run it with `node migrate.js`. You can also give it an input and an output path as arguments.

**Tests:** I added `migrate.test.js`, with 4 tests run by `node --test`. I watched each one fail before writing the code that made it pass. All 4 pass on the final code. They cover:
- converting a user to the new format
- trimming the name when the last name is empty
- skipping a user with no email
- running the script end to end on a temporary file

As the skill file allowed, I skipped the `hs` and receipts steps. I haven't committed anything.