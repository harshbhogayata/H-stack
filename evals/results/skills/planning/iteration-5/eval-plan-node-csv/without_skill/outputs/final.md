Here's the plan. I haven't changed anything in the repo.

## Implementation plan: `GET /invoices.csv`

### What's there now
- `src/invoices.js` has `listInvoices()`, which returns copies of 2 in-memory invoices (`id`, `amountCents`, `issuedAt`, `customer`). One of them, `'Acme, Inc.'`, contains a comma, which is useful for testing quoting.
- `src/server.js` has `handler(req, res)`. It serves `GET /invoices` as JSON and returns 404 for everything else, matching `req.url` exactly.
- `test/invoices.test.js` has one unit test. `npm test` runs `node --test`, and there are no dependencies.

### Changes

**1. New module `src/csv.js`.** These are pure functions with no I/O, so they're easy to unit-test.
- `formatCents(cents)` does integer math instead of `(cents/100).toFixed(2)`, which avoids float edge cases:
  `sign + Math.floor(abs/100) + '.' + String(abs % 100).padStart(2, '0')`, so `1250 → "12.50"`, `990 → "9.90"`, `5 → "0.05"`, `0 → "0.00"`.
- `escapeField(value)`: if the value contains `,` or `"`, it wraps the value in `"` and doubles the inner `"`. Otherwise it returns the value unchanged.
- `invoicesToCsv(invoices)`: writes the header `id,amount,issued_at,customer`, then one row per invoice mapping `id, formatCents(amountCents), issuedAt, customer`, with every field passed through `escapeField`.

**2. Route in `src/server.js`.**
- Add a branch for `req.method === 'GET' && req.url === '/invoices.csv'`.
- It responds `200` with `content-type: text/csv; charset=utf-8` and the body `invoicesToCsv(listInvoices())`.
- The rows come from the same `listInvoices()` call that `/invoices` uses, so the order matches by construction.
- The existing 404 fallback stays as it is, so unknown paths still return 404.

**3. Tests.**
- `test/csv.test.js` (unit tests):
  - `formatCents`: 1250, 990, 5, 0, and 100000.
  - `escapeField`: plain text, a value with a comma, a value with a quote (`a"b` → `"a""b"`), and a value with both.
  - `invoicesToCsv`: the exact header, the exact full output for the fixture data, and the Acme row coming out as `inv-1,12.50,2026-01-31,"Acme, Inc."`.
- `test/server.test.js` (HTTP tests): start `http.createServer(handler)` on port 0 and use the built-in `fetch`.
  - `/invoices.csv` returns 200, the exact content-type, and the expected body.
  - The CSV `id` column is in the same order as the JSON from `/invoices`.
  - `/nope` returns 404.
  - `/invoices` still returns JSON (regression check).

**4. Verify.** Run `npm test` and make sure every test passes.

### Questions for you (the spec doesn't cover these)
1. **Line endings:** RFC 4180 uses CRLF, but I'd default to `\n`. Which do you want?
2. **Trailing newline after the last row:** I plan to add one. Is that OK?
3. **Newlines inside fields:** the spec only says to quote on comma or quote. RFC 4180 also quotes fields containing CR/LF. I'd add that, since one unquoted newline in a customer name breaks the file. OK to go beyond the spec here?
4. **Query strings:** with exact matching, `/invoices.csv?x=1` returns 404, which is how `/invoices` already behaves. I'll keep that unless you want both routes to ignore query strings.
5. **Negative amounts:** I'll format them as `-0.05`, unless refunds should look different.

Once you've answered those (or said to use my defaults), I'll implement it.