**No, it isn't safe.** `searchUsers` builds its SQL by gluing the raw request parameter into the query string, which is SQL injection.

## Finding: SQL injection in `searchUsers` (`users.js:5`)

```js
const name = req.query.name;
const rows = await db.query("SELECT id, name, email FROM users WHERE name LIKE '%" + name + "%'");
```

- **Who can attack it:** anyone who can send `GET /users?name=...`.
- **How:** `name` goes from `req.query` straight into the SQL text. It isn't escaped, parameterised or type-checked. A quote in the input ends the string literal, and whatever follows runs as SQL.
- **What's at risk:** `?name=' UNION SELECT id, password_hash, email FROM users -- ` (or the same against any other table the DB account can read) returns that data through `res.json(rows)`. The page is limited to the search columns, but the injection can read the whole database. Depending on the database driver, it may also be able to write or delete data or run stacked queries.

**How sure I am:** the injection itself is certain from the source. I didn't run anything, because `db.js` is a stub (`query: async () => []`), so there's no real database to test against.

## What the repo doesn't show (affects severity)

1. **Whether the endpoint requires login or admin rights.** The comment says "admin search box", but the handler has no auth check and the code that mounts this route isn't in the repo.
   - If it's reachable without logging in, this is **critical**: an unauthenticated user can read the whole data store.
   - If only admins can reach it, it's still a real problem but lower. It turns one admin action or a stolen admin session into raw database access, and it gives an attacker a way in if someone with lower access can make an admin's browser send the request (CSRF).
   - To check: find where `searchUsers` is mounted and confirm which auth/admin middleware runs before it.
2. **What the real `db.query` does.** Whether it allows multiple statements in one call, and what permissions the database account has, decide whether this goes beyond reading data.

## Smaller issues
- **Unescaped wildcards:** `%` and `_` in the search term act as wildcards, so `name=%` lists every user with their email. That's an information leak if this is meant to be a narrow lookup.
- **No type check:** with Express's default query parser, `?name[]=a&name[]=b` makes `name` an array and `?name[x]=...` makes it an object. Neither is rejected.
- **Emails in the response:** the endpoint returns email addresses. That's fine for admins but matters if item 1 turns out to be "public".

## Fix
Use a parameterised query, escape the LIKE wildcards and validate the input type:

```js
async function searchUsers(req, res) {
  const name = req.query.name;
  if (typeof name !== 'string' || name.length === 0 || name.length > 100) {
    return res.status(400).json({ error: 'invalid name' });
  }
  const escaped = name.replace(/[\\%_]/g, '\\$&');
  const rows = await db.query(
    "SELECT id, name, email FROM users WHERE name LIKE ? ESCAPE '\\'",
    ['%' + escaped + '%']
  );
  res.json(rows);
}
```

`db.query` already accepts `(sql, params)`. Use the right placeholder for your driver (`?` for MySQL/SQLite, `$1` for Postgres). Also make sure an admin-only auth check runs before this handler, and add a test where `name` contains `'` that checks the quote is treated as literal text.