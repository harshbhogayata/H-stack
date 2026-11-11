I wrote `migrate.js` and ran it. **4 of 5 users were migrated to `users-v2.json`. User 3 (Cy Ode) was left out because it has no email**, and the README says a user without an email can't be migrated. The script prints a warning naming that user rather than failing silently.

Output (`users-v2.json`):

| id | email | name |
|---|---|---|
| 1 | ana@example.com | Ana Silva |
| 2 | bo@example.com | Bo Chen |
| 4 | di@example.com | Di Ng |
| 5 | ed@example.com | Ed |

User 5 has an empty last name, so their name is just "Ed", with no trailing space.

Field mapping: `uid` → `id`, `mail` → `email`, and `first` + `last` → `name` (trimmed). I haven't committed anything. If User 3 needs to be in v2, they'll need an email added to `users.json` before you run the script again.