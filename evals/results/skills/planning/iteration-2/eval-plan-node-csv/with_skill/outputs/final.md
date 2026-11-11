# Plan: CSV export of invoices

**Goal:** Add `GET /invoices.csv`, which returns every invoice as CSV, in the same order as `GET /invoices`.
**Approach:** Put a pure CSV module in `src/csv.js` with three small functions so the formatting can be unit-tested without HTTP. Then add one route branch to `handler` in `src/server.js`, next to the existing `/invoices` branch, and test it against a real server on port 0. No dependencies are added; this is plain Node 22 with `node:test`.
**Spec:** `SPEC.md`
**Where this plan lives:** the repo has no `docs/` or plans folder, so I've kept the plan here rather than adding a file.
**Commands:** `npm test` runs `node --test`. It currently passes 1 test.

### Global constraints (verbatim from the spec)
- Content-Type: text/csv; charset=utf-8
- Header row exactly: id,amount,issued_at,customer
- amount is formatted from cents with two decimals and a dot: 1250 -> 12.50
- Fields containing a comma or a double quote are wrapped in double quotes; inner quotes are doubled.
- Rows are in the same order as GET /invoices.
- Unknown paths still return 404.

### Interfaces
- `src/csv.js` (task 1 creates it; task 2 uses it):
  - `export function formatCents(cents: number): string`: an integer number of cents becomes a string like `"12.50"`.
  - `export function escapeCsvField(value: string): string`
  - `export function invoicesToCsv(invoices: Array<{id: string, amountCents: number, issuedAt: string, customer: string}>): string`: header row, then one line per invoice, joined with `\n` and ending with a trailing `\n`.
- HTTP: `GET /invoices.csv` returns `200`, `content-type: text/csv; charset=utf-8`, and the body `invoicesToCsv(listInvoices())`.

### Decisions the spec leaves open (please confirm or change)
1. **Line endings:** I'll use `\n` with a trailing newline. RFC 4180 uses `\r\n`; tell me if you want that instead.
2. **Embedded newlines:** the spec only says to quote fields containing a comma or a quote. I'll also quote fields containing `\n` or `\r`, otherwise a customer name with a newline in it would break the CSV.
3. **Query strings:** the existing route matches `req.url` exactly, so `/invoices.csv?x=1` will return 404. That stays consistent with how `/invoices` behaves today.
4. **Amount formatting:** I'll use integer arithmetic instead of `(cents/100).toFixed(2)`, so negative values come out right (`-5 -> -0.05`).

### Review focus (each case is covered by a test in the task that owns the code)
1. A customer containing a comma (the fixture already has `Acme, Inc.`) must come out as `"Acme, Inc."` (task 1).
2. Quotes are doubled: `Say "hi"` becomes `"Say ""hi"""` (task 1).
3. Cents with a short remainder: `990 -> 9.90`, `5 -> 0.05`, `0 -> 0.00`, `-5 -> -0.05` (task 1).
4. Paths close to the new one must still 404: `/invoices.csv/`, `/invoices.csvx`, and `POST /invoices.csv` (task 2).
5. The CSV row order must match the JSON order from `GET /invoices` in the same test (task 2).

---

### Task 1: CSV formatting module
**Files:** create `src/csv.js` and `test/csv.test.js`.
**Produces:** `formatCents`, `escapeCsvField`, `invoicesToCsv`. **Uses:** nothing.

1. Write the failing tests in `test/csv.test.js`:
   - `formatCents`: `1250→"12.50"`, `990→"9.90"`, `5→"0.05"`, `0→"0.00"`, `-5→"-0.05"`.
   - `escapeCsvField`:
     - `"Globex"` is returned unchanged.
     - `"Acme, Inc."→"\"Acme, Inc.\""`.
     - `'Say "hi"'→'"Say ""hi"""'`.
     - `"a\nb"→"\"a\nb\""`.
   - `invoicesToCsv(listInvoices())` equals exactly `"id,amount,issued_at,customer\ninv-1,12.50,2026-01-31,\"Acme, Inc.\"\ninv-2,9.90,2026-02-01,Globex\n"`.
   - `invoicesToCsv([])` equals `"id,amount,issued_at,customer\n"`.
2. Run `npm test`. It should fail with `ERR_MODULE_NOT_FOUND` for `../src/csv.js`.
3. Implement the three functions in `src/csv.js` with the signatures above:
   - `escapeCsvField` quotes a value only when it contains a comma, a double quote, `\n` or `\r`.
   - `invoicesToCsv` passes every field through `escapeCsvField`, including `id` and `issued_at`.
4. Run `npm test`. All tests should pass.
5. Commit: `Add CSV formatting for invoices`.

### Task 2: `GET /invoices.csv` route
**Files:** modify `src/server.js` (lines 1–9: add an import, then a branch after the `/invoices` branch); create `test/server.test.js`.
**Uses:** `invoicesToCsv` and `listInvoices`. **Produces:** the HTTP endpoint.

1. Write the failing tests in `test/server.test.js`. Start `http.createServer(handler).listen(0)` in `before` and close it in `after`, and make requests with global `fetch`. Tests:
   - `GET /invoices.csv` returns status `200`, `content-type === "text/csv; charset=utf-8"`, and a body exactly equal to the string from Task 1.
   - The `id` values in the CSV rows (skipping the header) equal the `id` values from `GET /invoices` JSON, in the same order.
   - `GET /invoices.csv/`, `GET /invoices.csvx`, `POST /invoices.csv` and `GET /nope` each return `404`.
   - `GET /invoices` still returns `200` with `application/json`.
2. Run `npm test`. The CSV tests should fail because the endpoint returns 404.
3. Implement: in `src/server.js`, add `import { invoicesToCsv } from './csv.js';` and a branch `if (req.method === 'GET' && req.url === '/invoices.csv')` that sets the header above and ends the response with `invoicesToCsv(listInvoices())`.
4. Run `npm test`. All tests should pass, including the existing `lists invoices` test.
5. Commit: `Add GET /invoices.csv endpoint`.

---

**Self-review:** each of the six spec bullets maps to a test:
- Content-Type, header row and row order: Task 2.
- Amount formatting and quoting: Task 1.
- 404 for unknown paths: Task 2.

The same names are used in both tasks. This is a small change, so I've left out the rubric step.

Do you approve this plan, and how do you want the four open decisions settled? I won't write any code until you confirm.