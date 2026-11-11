I read SPEC.md and all the code, which is small: `src/invoices.js` (2 fixture invoices), `src/server.js` (a bare `node:http` handler), and one test. Nothing has been changed.

# Plan: `GET /invoices.csv`

## Changes

**1. New file `src/csv.js`: pure functions with no HTTP code**
- `formatCents(cents)`: uses whole-number math so floating-point rounding can't creep in. It takes the sign, then `Math.trunc(abs / 100)` + `.` + `String(abs % 100).padStart(2, '0')`. So 1250 → `12.50`, 990 → `9.90`, 5 → `0.05`, and -1250 → `-12.50`.
- `escapeField(value)`: turns the value into a string. If it contains `,` or `"`, it doubles the inner `"` and wraps the whole field in quotes. I'd also quote fields containing `\r` or `\n` (see open questions).
- `invoicesToCsv(invoices)`: writes the header `id,amount,issued_at,customer`, then one row per invoice mapping `id`, `amountCents`→`amount`, `issuedAt`→`issued_at`, `customer`. Rows keep the input order.

**2. `src/server.js`: add a route**
- Add `GET /invoices.csv` → `200`, `content-type: text/csv; charset=utf-8`, body `invoicesToCsv(listInvoices())`.
- Both routes use the same `listInvoices()`, which guarantees the "same order as GET /invoices" rule.
- Keep exact-match routing like the existing route, so the 404 fallback for unknown paths stays as it is.

**3. Tests**
- `test/csv.test.js`: unit tests for
  - `formatCents`: 1250, 990, 5, 0, 100, negative
  - `escapeField`: plain, comma, quote, both together
  - `invoicesToCsv`: exact output for the fixtures
- `test/server.test.js`: start `http.createServer(handler).listen(0)` and use `fetch` to check:
  - the exact content-type header
  - the exact body for `/invoices.csv`:
    ```
    id,amount,issued_at,customer
    inv-1,12.50,2026-01-31,"Acme, Inc."
    inv-2,9.90,2026-02-01,Globex
    ```
  - the CSV rows' ids match the order of `/invoices`
  - `/nope` and `/invoices.csv/x` return 404
  - existing `/invoices` behaviour is unchanged
- Run with `npm test` (`node --test`), no new dependencies.

## Open questions for you
The spec doesn't settle these. My suggested default is in bold:
1. **Line endings:** CRLF (the RFC 4180 CSV standard) or LF? **I suggest CRLF** because Excel and other CSV tools expect it. Is a trailing newline after the last row OK? **I suggest yes.**
2. **Newlines inside fields:** the spec only mentions commas and quotes. **I suggest also quoting fields with `\r`/`\n`**, because otherwise a customer name containing a newline would break the CSV.
3. **Query strings:** right now `/invoices?x=1` returns 404 because routing matches the exact URL. **I suggest keeping that behaviour for `/invoices.csv` too**, so both routes behave the same. The alternative is parsing the pathname for both, which would change how `/invoices` behaves.
4. **Spreadsheet formula injection** (fields starting with `=`, `+`, `-`, `@`): the spec says nothing. **I suggest leaving it out of scope** but noting it, since customer names are user data.

If those defaults work for you, I'll implement steps 1–3 in that order.