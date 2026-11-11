**No, it's not safe.** The handler builds its SQL query by gluing user input into the string, which is a SQL injection. I reviewed this as a focused question, not a full audit.

## Finding: SQL injection in `searchUsers` (`users.js:5`)

```js
const name = req.query.name;
db.query("SELECT id, name, email FROM users WHERE name LIKE '%" + name + "%'");
```

- **Who can attack it:** anyone who can send `GET /users?name=...`.
- **Input:** `req.query.name` is pasted into the SQL text with no escaping and no placeholder.
- **What should stop it:** nothing does. `db.query` accepts a `params` argument (`db.js:1`), but the handler never uses it.
- **Example:** `name=' UNION SELECT id, password_hash, email FROM users --` closes the string literal and attaches a query of the attacker's choosing. A payload like this can read any table the database account can see, not just names and emails. Depending on the driver and database permissions, it may also allow stacked statements that change data.
- **Other issues:**
  - `req.query.name` can be undefined, which matches the literal text `'%undefined%'`.
  - `?name=a&name=b` turns it into an array.
  - `%` and `_` inside the input act as LIKE wildcards, so a user can match more rows than intended.

## What I couldn't verify from this repo
- **Who can reach the endpoint.** The comment says it's for the "admin search box", but the handler has no authentication or role check. The routing and middleware aren't in the repository. That affects severity:
  - **Reachable without logging in:** critical. An outsider can read the whole database.
  - **Admins only:** still a real bug. Any admin could read data beyond their role, such as password hashes or other tables. If an admin's browser session can be tricked into calling it, an outsider gets in through the admin.
- **How the real database behaves.** `db.js` is a stub that always returns `[]`, so I didn't run anything. The injection is clear from the source alone. Things like stacked-statement support depend on the real driver, which isn't here.

## Fix
Use a parameterized query, validate the input, and escape LIKE wildcards:

```js
async function searchUsers(req, res) {
  const name = req.query.name;
  if (typeof name !== 'string' || name.length === 0 || name.length > 100) {
    return res.status(400).json({ error: 'invalid name' });
  }
  const pattern = '%' + name.replace(/[\\%_]/g, '\\$&') + '%';
  const rows = await db.query(
    "SELECT id, name, email FROM users WHERE name LIKE ? ESCAPE '\\' LIMIT 50",
    [pattern]
  );
  res.json(rows);
}
```

- Use the placeholder style your driver expects: `?` for MySQL or SQLite, `$1` for Postgres.
- Make sure an admin-only check sits in front of this route, since it returns email addresses.
- Add a regression test asserting that a `name` containing `'` reaches `db.query` only through `params`, never inside the SQL string.