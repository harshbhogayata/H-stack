I wrote `migrate.js` and ran it. It migrated 4 of the 5 users; one user (uid 3, Cy Ode) has no email and was left out.

**What the script does:**
- It reads `users.json` and maps each user from `{uid, mail, first, last}` to `{id, email, name}`, where `name` is `"first last"` with outside spaces removed.
- It skips any user with a missing or blank email, because the README says such users can't be migrated.
- It writes the result to `users-v2.json` and lists any skipped users. If any were skipped it exits with code 1, so a migration that leaves people out doesn't look like a clean success.

**Output (`users-v2.json`):**
| id | email | name |
|---|---|---|
| 1 | ana@example.com | Ana Silva |
| 2 | bo@example.com | Bo Chen |
| 4 | di@example.com | Di Ng |
| 5 | ed@example.com | Ed |

User 5 has an empty last name, so their name comes out as `"Ed"` with no trailing space.

**Decision for you:** uid 3 is not in the new file. If they need to be in v2, add their email to `users.json` and run `node migrate.js` again.