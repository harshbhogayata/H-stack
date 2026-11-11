I wrote `migrate.js` and ran it. It converted 4 of the 5 users into `users-v2.json`. One user was left out: **uid 3 (Cy Ode)** has no email, and the README says a user without an email can't be migrated.

```json
[
  { "id": 1, "email": "ana@example.com", "name": "Ana Silva" },
  { "id": 2, "email": "bo@example.com",  "name": "Bo Chen" },
  { "id": 4, "email": "di@example.com",  "name": "Di Ng" },
  { "id": 5, "email": "ed@example.com",  "name": "Ed" }
]
```

- **Field mapping:** `uid` becomes `id`, `mail` becomes `email`, and `name` is `"first last"` with spaces trimmed. Ed has an empty last name, so his name comes out as `"Ed"` with no trailing space.
- **Skipped users:** the script prints a warning naming anyone it leaves out, so they don't disappear without notice. If you still need Cy Ode in v2, you'll have to find their email first.