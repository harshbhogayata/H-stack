I wrote `migrate.js` and ran it. 4 of the 5 users were converted into `users-v2.json`, and 1 was left out.

**Result**
```
source: 5, migrated: 4, skipped: 1
not migrated: 3 (missing email)
```
- **Migrated:** users 1 (Ana Silva), 2 (Bo Chen), 4 (Di Ng) and 5 (Ed). User 5 has an empty last name, so the name is just `"Ed"` with no trailing space.
- **Not migrated:** user 3 (Cy Ode) has no email, and the README says such users can't be migrated.
- **Count check:** every source id ended up either in the output file or on the skipped list with a reason. None are missing, extra or duplicated.

**How `migrate.js` works**
- It turns `{uid, mail, first, last}` into `{id, email, name}`, with `name` set to `"first last"` trimmed.
- It also treats a `mail` that is empty, only spaces, or `null` as "no email". The README doesn't say this; it's my reading of the rule. None of the current data has this case.
- By default it reads `users.json` and writes `users-v2.json`. You can pass other paths: `node migrate.js in.json out.json`.
- It stops with an error if migrated plus skipped doesn't equal the number of users in the source, or if the file it wrote doesn't contain every migrated user.

**Tests:** I added `migrate.test.js`, which uses Node's built-in test runner (`node --test`). It has 5 tests: a normal user, trimming the name, a missing email, an empty or null email, and running the script end to end. I watched each test fail before writing the code for it, and all 5 pass after the final change.

Nothing is committed yet. The new files are `migrate.js`, `migrate.test.js` and `users-v2.json`.