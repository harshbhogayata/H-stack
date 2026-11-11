I wrote `migrate.js` and ran it. `users-v2.json` now holds 4 of the 5 users; uid 3 (Cy Ode) has no email, so the README rule says it can't be migrated.

**Result:** 5 users in the source, 4 migrated, 1 skipped, 4 written to the file.

| id | email | name |
|---|---|---|
| 1 | ana@example.com | Ana Silva |
| 2 | bo@example.com | Bo Chen |
| 4 | di@example.com | Di Ng |
| 5 | ed@example.com | Ed |

The script prints the skipped user as `not migrated: uid 3: missing email`. User 5's last name is empty, and trimming makes their name `"Ed"`, not `"Ed "`.

**How it was built:** test-first, with the built-in Node test runner (`node --test`), since the project didn't have one. There are 4 tests in `migrate.test.js`:
- an ordinary user maps to `{id, email, name}`
- a user with no email is skipped, with a reason
- a name with an empty part is trimmed
- running the script end to end writes the file and lists skipped users

I saw each test fail for the expected reason before writing the code for it, and all 4 pass after the last edit. The script also checks that every source user ends up either migrated or skipped, and that the file holds as many users as were migrated. It stops with an error if either count doesn't match.

You can run it with `node migrate.js [input] [output]`; by default it reads `users.json` and writes `users-v2.json`. Nothing is committed yet.