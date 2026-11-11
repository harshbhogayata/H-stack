**No, it's not safe. `users.js` has a SQL injection.**

### Confirmed: SQL injection in `searchUsers` (`users.js:5`), severity high

```js
const name = req.query.name;
const rows = await db.query("SELECT id, name, email FROM users WHERE name LIKE '%" + name + "%'");
```

- **Who can attack it:** anyone who can reach `GET /users`.
- **Input:** the `name` query parameter, pasted straight into the SQL string. Nothing checks its type, escapes it or binds it as a parameter.
- **What it breaks:** the query is supposed to filter by name only. A value like `' OR '1'='1' -- ` closes the string, so the attacker's text runs as SQL instead of being treated as data.
- **Result:** `?name=%' OR '1'='1' -- ` returns every user's id, name and email. A `UNION SELECT` lets the attacker read other columns and tables the database account can access, such as password hashes or tokens, and the results come back in the JSON response. Whether stacked statements like `; DROP …` also work depends on the real database driver. `db.js` here is a stub (`query` returns `[]`), so I couldn't check that.
- **Severity:** I rated it **high** because the attacker can read data outside the intended query. It becomes **critical** if the endpoint can be reached without logging in (see below).

I found this by reading the code. I didn't run anything, because the stub database couldn't show any behaviour.

### Needs checking: who can call the endpoint

The comment says this is "for the admin search box," but the repo has no login or admin check. `searchUsers` checks nothing itself, and there's no router or middleware here. If it's mounted without admin-only middleware, any caller can list every user's email even without the injection. I can't tell from this repo; check where `searchUsers` is mounted.

### Smallest fix

Bind the value as a parameter, accept only a string, and escape the LIKE wildcards:

```js
async function searchUsers(req, res) {
  const name = req.query.name;
  if (typeof name !== 'string' || name.length > 100) {
    return res.status(400).json({ error: 'invalid name' });
  }
  const pattern = '%' + name.replace(/[\\%_]/g, '\\$&') + '%';
  const rows = await db.query(
    "SELECT id, name, email FROM users WHERE name LIKE ? ESCAPE '\\'",
    [pattern]
  );
  res.json(rows);
}
```

- The placeholder is `?` for MySQL or SQLite and `$1` for Postgres, depending on the real driver.
- The `typeof` check matters because Express turns `?name=a&name=b` into an array, and some drivers expand arrays inside parameters.
- Escaping `%` and `_` stops a caller from turning the search into a match-everything wildcard. That isn't a security hole by itself, but it keeps the search behaving as intended.
- Also confirm the route sits behind admin-only middleware.

**Regression test:** with a test database holding two dummy users, `name=' OR '1'='1' -- ` should return zero rows, not both.