Here's the plan. I haven't changed any files.

## Implementation plan: `GET /invoices.csv`

**What's there now:** `src/server.js` has one route, `GET /invoices`, which returns JSON from `listInvoices()`. Everything else gets a 404. The invoices have the fields `id`, `amountCents`, `issuedAt` and `customer`. One sample customer is `Acme, Inc.`, which contains a comma, so the quoting rule will be tested by real data. The only test checks `listInvoices`, and there are no HTTP-level tests.

### 1. New module `src/csv.js` (pure functions, no I/O)
- `formatCents(cents)`: turns cents into a string with two decimals using integer math, not float division. For example, `Math.trunc(cents/100)` plus a zero-padded `cents % 100`, so 1250 becomes `12.50`, 990 becomes `9.90` and 5 becomes `0.05`. I'll handle negative values explicitly (−5 becomes `-0.05`) even though the spec doesn't mention them.
- `escapeField(value)`: converts the value with `String(value)`. If it contains `,` or `"`, it wraps it in `"` and doubles every inner `"`. Otherwise it returns it unchanged.
- `invoicesToCsv(invoices)`: writes the header `id,amount,issued_at,customer`, then one row per invoice in input order, with the fields mapped as `id`, `formatCents(amountCents)`, `issuedAt` and `customer`.

### 2. Route in `src/server.js`
- Add a branch for `GET` and `/invoices.csv`. It sends a 200 with `content-type: text/csv; charset=utf-8` and a body of `invoicesToCsv(listInvoices())`.
- Both endpoints use `listInvoices()`, so the row order matches `GET /invoices` automatically.
- The existing 404 fallback stays as it is.

### 3. Tests
- **`test/csv.test.js`** (unit tests):
  - `formatCents`: 1250, 990, 5, 0 and 100000.
  - `escapeField`: a plain value, a value with a comma (`Acme, Inc.` becomes `"Acme, Inc."`) and a value with a quote (`Say "hi"` becomes `"Say ""hi"""`).
  - `invoicesToCsv`: the exact header and the exact full output for the sample data.
- **`test/server.test.js`** (HTTP tests): start `handler` on an ephemeral port with `http.createServer(...).listen(0)` and call it with `fetch` (Node 18+). The checks:
  - `/invoices.csv` returns a 200, the exact content-type and the exact body.
  - The ids in the CSV rows come in the same order as in the `/invoices` JSON.
  - `/nope` and `/invoices.csv/x` return 404.
- Run everything with `npm test`.

### Open questions for you
1. **Line endings:** RFC 4180 says CRLF, but I'd default to `\n`. Which do you want?
2. **Trailing newline:** should the last row end with one? I'd add it.
3. **Newlines inside fields:** the spec only requires quoting for commas and quotes. I'd also quote fields containing `\r` or `\n`, because otherwise the CSV breaks. Is that OK?
4. **Query strings:** the current code matches `req.url` exactly, so `/invoices.csv?x=1` would return 404. I'd keep that to stay consistent with `/invoices`. Should it?
5. **CSV formula injection:** a customer name starting with `=`, `+`, `-` or `@` can run as a formula when the file is opened in Excel. That's out of scope per the spec, but I can add a guard if you want one.

Once you've decided on these, I'll implement it.