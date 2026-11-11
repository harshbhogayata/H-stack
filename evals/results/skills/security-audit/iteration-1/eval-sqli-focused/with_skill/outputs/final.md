**No, it's not safe.** `users.js:5` builds the SQL by pasting the `name` query parameter straight into the string, so this is a SQL injection:

```js
db.query("SELECT id, name, email FROM users WHERE name LIKE '%" + name + "%'");
```

**How it breaks:** whoever calls `GET /users?name=...` writes part of the query. A value such as `x' UNION SELECT id, <column>, <column> FROM <other_table> -- ` closes the `LIKE` string and adds its own `SELECT`. Because the result goes straight back through `res.json(rows)`, the attacker can read any table the database account can read: password hashes, tokens, and other users' data. Whether stacked queries like `'; DROP ...` or writes are possible depends on the real database driver. `db.js` is only a stub, so I can't tell from this repo.

**What I couldn't confirm from the repo:** how bad this is depends on who can reach the endpoint. The comment says it serves the "admin search box", but the repo has no routing and no login check. `users.js` and `db.js` are the only files.
- If the route is reachable without logging in, this is **critical**: an anonymous user can read the whole database.
- If it really is admin-only, it's still a real bug. An admin can read past what the app intends to show them, and stolen admin sessions or other bugs can be chained into it. But the risk is much lower.

Check where `searchUsers` is mounted and what login check sits in front of it.

**Smallest fix:** `db.query` already takes a `params` argument. Use it, and check the input type:

```js
async function searchUsers(req, res) {
  const name = req.query.name;
  if (typeof name !== 'string') return res.status(400).json({ error: 'name required' });
  const escaped = name.replace(/[\\%_]/g, '\\$&');          // treat % and _ as literal
  const rows = await db.query(
    "SELECT id, name, email FROM users WHERE name LIKE ? ESCAPE '\\'",
    ['%' + escaped + '%']
  );
  res.json(rows);
}
```

Change `?` to `$1` if the driver is Postgres. The type check also stops `?name=a&name=b`, which arrives as an array, and a missing `name`, which would otherwise search for the literal text `"%undefined%"`.

Add a regression test: a `name` containing `'` or `' OR '1'='1` must reach `db.query` only through `params`, never inside the SQL string.

I didn't run anything. This conclusion comes from reading the code, and `db.js` is a stub that returns `[]` for every query, so running it would show nothing.