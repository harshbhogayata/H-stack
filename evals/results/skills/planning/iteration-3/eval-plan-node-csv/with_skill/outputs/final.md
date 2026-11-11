The repo has no `docs/plans` folder or other place for design docs, so I've kept the plan here in the conversation. Nothing has been implemented.

# Plan: CSV export of invoices (`SPEC.md`)

**Goal:** Add `GET /invoices.csv`, which returns every invoice as CSV, in the format `SPEC.md` describes.

**Approach:** Put a pure CSV serialiser in a new `src/csv.js`, so it can be tested without a server. Add one route to `handler` in `src/server.js` that calls `listInvoices()` (the same source `/invoices` uses, so the row order matches) and sends the result. Format money with integer arithmetic, not floats.

**Commands:** `npm test` (this runs `node --test`; the project has no linter or build step).

**Global constraints (copied from the spec)**
- Content-Type: `text/csv; charset=utf-8`
- Header row exactly: `id,amount,issued_at,customer`
- amount is cents formatted with two decimals and a dot: `1250 -> 12.50`
- A field containing a comma or a double quote is wrapped in double quotes, and inner quotes are doubled.
- Rows are in the same order as `GET /invoices`.
- Unknown paths still return 404.
- No new dependencies (`package.json` has none).

**Interfaces**
- `src/csv.js`:
  - `formatCents(cents: number): string`, for example `1250 → "12.50"`, `5 → "0.05"`, `-990 → "-9.90"`
  - `escapeField(value: string): string`
  - `invoicesToCsv(invoices: Array<{id, amountCents, issuedAt, customer}>): string`: the header plus one line per invoice, lines joined with `\n`, ending with a trailing `\n`
- `src/server.js`: `handler` gains `GET /invoices.csv`, which returns 200 with the header above and the body from `invoicesToCsv(listInvoices())`.

**Review focus** (the spec implies these but doesn't settle them; I've made a decision on each and pinned it with a test):
1. **Float rounding:** `(cents/100).toFixed(2)` is fragile. Use integer division and modulo, padded to two digits, with a sign. Pinned in Task 1.
2. **Amounts under 100 cents and negative amounts:** `5 → 0.05`, `-990 → -9.90`. Pinned in Task 1.
3. **Line ending and trailing newline:** the spec doesn't say. I chose `\n` with a trailing newline. Pinned in Task 1. Tell me if you want RFC 4180 `\r\n`.
4. **Newlines inside a field:** the spec only requires quoting for commas and quotes. I'll also quote fields that contain `\r` or `\n`, because otherwise those values produce broken CSV. Pinned in Task 1. This goes beyond the spec, so please confirm.
5. **Query string or method variants:** the existing code matches `req.url` exactly, so `/invoices.csv?x=1` and `POST /invoices.csv` return 404. Pinned in Task 2.

## Task 1: CSV serialiser
**Files:** create `src/csv.js` and `test/csv.test.js`. **Produces:** the three functions listed above.
1. Write failing tests in `test/csv.test.js`:
   - `formatCents`: `1250→"12.50"`, `990→"9.90"`, `5→"0.05"`, `0→"0.00"`, `-990→"-9.90"`.
   - `escapeField`: `"Globex"→"Globex"`, `"Acme, Inc."→"\"Acme, Inc.\""`, `'Say "hi"'→'"Say ""hi"""'`, `"a\nb"→"\"a\nb\""`.
   - `invoicesToCsv(listInvoices())` equals exactly `id,amount,issued_at,customer\ninv-1,12.50,2026-01-31,"Acme, Inc."\ninv-2,9.90,2026-02-01,Globex\n`.
2. Run `npm test`. It should fail because the module `../src/csv.js` doesn't exist yet.
3. Implement the three exported functions in `src/csv.js`. Each field goes through `escapeField(String(v))`.
4. Run `npm test`. All tests should pass.
5. Commit: "Add CSV serialiser for invoices".

## Task 2: `/invoices.csv` route
**Files:** modify `src/server.js` (inside `handler`, before the 404 at line 9) and create `test/server.test.js`. **Consumes:** `invoicesToCsv` and `listInvoices`.
1. Write failing tests. Each one starts `http.createServer(handler)` on port 0 and uses `fetch`:
   - `GET /invoices.csv` returns 200, `content-type` is exactly `text/csv; charset=utf-8`, and the body equals the Task 1 string.
   - The `id` order of the CSV rows equals the `id` order from `GET /invoices` JSON.
   - `GET /nope`, `GET /invoices.csv?x=1` and `POST /invoices.csv` each return 404.
   - `GET /invoices` still returns JSON.
2. Run `npm test`. The CSV tests should fail with a 404 status.
3. Implement: add `if (req.method === 'GET' && req.url === '/invoices.csv') { res.writeHead(200, {'content-type': 'text/csv; charset=utf-8'}); return res.end(invoicesToCsv(listInvoices())); }`.
4. Run `npm test`. All tests should pass.
5. Commit: "Serve invoices as CSV at GET /invoices.csv".

**Self-review:** every line of the spec maps to a task (header, amount format and quoting in Task 1; content type, row order and 404 in Task 2). Names match across the two tasks.

---

Please decide two things before I implement:
- **Line ending:** `\n` (my plan) or `\r\n`?
- **Newlines in fields:** should fields containing a newline also be quoted (my plan), or should I stick to the spec's comma and double-quote rule only?

The skill's rubric step is for large tasks. This one is small, so I didn't do it.