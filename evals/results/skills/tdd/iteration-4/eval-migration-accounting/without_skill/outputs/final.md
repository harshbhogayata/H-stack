I wrote `migrate.js` and ran it. It moved 4 of the 5 users into `users-v2.json`. User uid 3 (Cy Ode) was left out because they have no email, and the README says a user without an email can't be migrated.

| id | email | name |
|---|---|---|
| 1 | ana@example.com | Ana Silva |
| 2 | bo@example.com | Bo Chen |
| 4 | di@example.com | Di Ng |
| 5 | ed@example.com | Ed |

- **Field mapping:** `uid` becomes `id`, `mail` becomes `email`, and `first` and `last` are joined into `name`. Following the README, extra spaces are trimmed from the name, so uid 5, who has an empty last name, comes out as `"Ed"` rather than `"Ed "`.
- **Skipped users:** the script prints the uids it leaves out, so none are dropped without notice. Cy Ode will need an email added in `users.json` before they can be migrated.