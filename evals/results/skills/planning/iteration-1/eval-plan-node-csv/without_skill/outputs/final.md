The spec is small and the codebase is three files, so this is a short plan. Nothing has been changed.

# Plan: `GET /invoices.csv`

## What's there now
- `src/invoices.js` has a hardcoded `INVOICES` array (`id`, `amountCents`, `issuedAt`, `customer`) and `listInvoices()`.
- `src/server.js` has a single `handler(req, res)`. It matches the exact `GET /invoices` and returns 404 for everything else.
- `test/invoices.test.js` has one test (count = 2). Tests run with `node --test`, and there are no dependencies.
- One of the existing invoices has the customer `"Acme, Inc."`, so real data already needs quoting.

## Changes

**1. New module `src/csv.js`**, made of pure functions so they're easy to unit-test:
- `formatCents(cents)` → string. I'll use integer math rather than `(cents / 100).toFixed(2)`, which avoids float rounding problems. That means taking the sign, then `Math.trunc(abs / 100)`, then `abs % 100` padded to 2 digits. `1250 → "12.50"`, `990 → "9.90"`, `5 → "0.05"`, `0 → "0.00"`.
- `escapeField(value)`: converts to a string. If it contains `,` or `"` (and `\r`/`\n`, see the questions), it wraps the field in `"…"` and doubles any inner `"`.
- `invoicesToCsv(invoices)`: header `id,amount,issued_at,customer`, then one row per invoice in input order, mapped as `id`, `formatCents(amountCents)`, `issuedAt`, `customer`, with every field passed through `escapeField`.

**2. Route in `src/server.js`:**
- Add the `GET /invoices.csv` branch before the 404 fallback. It returns 200 with `content-type: text/csv; charset=utf-8` and the body `invoicesToCsv(listInvoices())`.
- Both routes call `listInvoices()`, so the order matches `/invoices` automatically.
- I'll keep the existing exact-match style for `req.url`, so `/invoices.csv/foo` and other unknown paths still get a 404.

**3. Tests:**
- `test/csv.test.js` (unit):
  - `formatCents` with 1250, 990, 5, 0
  - `escapeField` with a plain value, a comma, a quote, and both together (`a"b,c` → `"a""b,c"`)
  - an exact-string check that the header row is first
- `test/server.test.js` (integration): start `http.createServer(handler).listen(0)` and use the global `fetch`.
  - `/invoices.csv` returns 200, the exact content-type, the exact full body (including `"Acme, Inc."` and `12.50` / `9.90`), and row ids in the same order as the JSON from `/invoices`
  - `/nope` and `POST /invoices.csv` both return 404
- Run `npm test`.

## Open questions (my default if you don't say otherwise)
1. **Line endings:** RFC 4180 uses `\r\n` and the spec doesn't say. I'll use **`\n`**, with a trailing newline after the last row.
2. **Newlines inside fields:** the spec only mentions commas and quotes. I'll **also quote fields containing `\r` or `\n`**, because leaving them unquoted produces broken CSV.
3. **Query strings:** `/invoices.csv?x=1` currently returns 404, the same as `/invoices?x=1`. I'll keep that for consistency rather than parse URLs in this change.
4. **Negative amounts:** they aren't in the data. `formatCents(-1250)` will give `-12.50`.
5. **Non-GET methods:** these will return 404, not 405, matching the existing behaviour.

The work comes to about 30 lines of source and two test files. Tell me if you'd change any of the defaults above, or say go and I'll implement it.