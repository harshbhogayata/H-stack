I read the planning skill, then the whole repo: `SPEC.md`, `src/invoices.js`, `src/server.js`, one test and `package.json`. The repo has no docs or plans folder, so the plan stays here in the conversation. Nothing has been implemented.

# Plan: CSV export of invoices

**Goal:** Add `GET /invoices.csv`, which returns every invoice as CSV, as described in `SPEC.md`.

**Approach:** Put a pure CSV serializer in a new `src/csv.js`, test it on its own, then add one route to `handler` in `src/server.js`. Both endpoints read from `listInvoices()`, so the row order matches by construction. Amounts are formatted with integer math (no floats), so the output is exact.

**Spec:** `SPEC.md`

**Test command:** `npm test` (runs `node --test test/`). The project has no dependencies, and this plan adds none.

### Global constraints (copied from the spec)
- Content-Type: `text/csv; charset=utf-8`
- Header row exactly: `id,amount,issued_at,customer`
- Amount is formatted from cents with two decimals and a dot: `1250 -> 12.50`
- Fields containing a comma or a double quote are wrapped in double quotes, and inner quotes are doubled.
- Rows are in the same order as `GET /invoices`.
- Unknown paths still return 404.

### Decisions the spec doesn't make (please confirm or override)
1. **Line endings:** I'll use `\r\n` between lines and after the last row, as RFC 4180 does. The alternative is `\n`.
2. **Line breaks inside a field:** a field containing `\r` or `\n` also gets quoted. The spec doesn't ask for this, but without it a customer name with a line break would produce a broken CSV.
3. **Query strings:** the route matches only the path, so `/invoices.csv?x=1` still returns the CSV. Today `/invoices` matches the full URL exactly; I'll leave that as it is.
4. **Methods:** only GET returns the CSV. Other methods fall through to the existing 404.

### File map
| File | Change | Responsibility |
|---|---|---|
| `src/csv.js` | create | `formatCents`, `csvField`, `invoicesToCsv` (pure, no I/O) |
| `test/csv.test.js` | create | Unit tests for the serializer |
| `src/server.js` | modify lines 4–9 | Add the `/invoices.csv` route |
| `test/server.test.js` | create | HTTP tests for both routes and the 404 |

### Interfaces
```js
// src/csv.js
export function formatCents(cents: number /* integer */): string   // 1250 -> "12.50", 5 -> "0.05", -5 -> "-0.05"
export function csvField(value: string): string                    // quotes when /[",\r\n]/ matches
export function invoicesToCsv(invoices: Array<{id, amountCents, issuedAt, customer}>): string
// Input is the shape listInvoices() returns. Output is the header plus one line per invoice, each ending in "\r\n".
```

### Review focus (none of these have a test yet, so each gets one)
1. **Float rounding and small amounts:** 5 cents, 990 cents and negative cents. A naive `cents/100` drops the padding (`0.5`) or picks up float error. Covered in Task 1, `formatCents`.
2. **A field with both a comma and a quote**, such as `He said "hi", ok`. It needs wrapping and doubled quotes. Covered in Task 1, `csvField`.
3. **Query string on the CSV path** (`/invoices.csv?download=1`). Covered in Task 2.
4. **A near-miss path** (`/invoices.csvx`, `/invoices.csv/`) must still return 404. Covered in Task 2.
5. **Order:** CSV row ids must match the ids from `GET /invoices` in order. Covered in Task 2.

---

### Task 1: CSV serializer
**Files:** create `src/csv.js`, create `test/csv.test.js`
**Produces:** `formatCents`, `csvField`, `invoicesToCsv`

1. Write the failing tests in `test/csv.test.js`:
   - `formatCents`: `1250→"12.50"`, `990→"9.90"`, `5→"0.05"`, `0→"0.00"`, `-5→"-0.05"`, `100000→"1000.00"`.
   - `csvField`: `"Globex"→"Globex"`, `"Acme, Inc."→"\"Acme, Inc.\""`, `'say "hi"'→'"say ""hi"""'`, `'He said "hi", ok'→'"He said ""hi"", ok"'`, `"a\nb"→"\"a\nb\""`.
   - `invoicesToCsv(listInvoices())` equals exactly `'id,amount,issued_at,customer\r\ninv-1,12.50,2026-01-31,"Acme, Inc."\r\ninv-2,9.90,2026-02-01,Globex\r\n'`.
   - `invoicesToCsv([])` equals `'id,amount,issued_at,customer\r\n'`.
2. Run `npm test`. It should fail with `ERR_MODULE_NOT_FOUND` for `src/csv.js`.
3. Implement the functions in `src/csv.js`:
   - `formatCents`: take the sign, then `abs = Math.abs(cents)`, then `` `${sign}${Math.trunc(abs/100)}.${String(abs%100).padStart(2,'0')}` ``.
   - `invoicesToCsv`: pass every field through `csvField`, including `id` and `issuedAt`.
4. Run `npm test`. All tests should pass, including the existing `lists invoices` test.
5. Commit: `Add CSV serializer for invoices`.

### Task 2: `/invoices.csv` route
**Files:** modify `src/server.js` lines 4–9, create `test/server.test.js`
**Consumes:** `invoicesToCsv`, `listInvoices`

1. Write the failing tests in `test/server.test.js`. Start `http.createServer(handler).listen(0)` in `before` and close it in `after`, then use the global `fetch`. Assertions:
   - `GET /invoices.csv` returns status 200, header `content-type === 'text/csv; charset=utf-8'`, and a body equal to `invoicesToCsv(listInvoices())`.
   - The ids parsed from the CSV body (lines 1 onward, before the first comma) deep-equal `(await GET /invoices).json().map(i => i.id)`.
   - `GET /invoices.csv?download=1` returns 200 with the same body.
   - `GET /invoices.csvx`, `GET /invoices.csv/` and `GET /nope` each return 404.
   - `POST /invoices.csv` returns 404.
   - `GET /invoices` still returns 200 with `application/json`.
2. Run `npm test`. The CSV tests should fail with 404 where 200 is expected.
3. Implement in `handler`:
   - Get the path with `const path = new URL(req.url, 'http://x').pathname`.
   - Add `if (req.method === 'GET' && path === '/invoices.csv')`, which sends `writeHead(200, { 'content-type': 'text/csv; charset=utf-8' })` and then `res.end(invoicesToCsv(listInvoices()))`.
   - Leave the `/invoices` check comparing against `req.url`, as it does now.
4. Run `npm test`. Everything should pass.
5. Commit: `Add GET /invoices.csv`.

---

**Self-review:**
- Every spec bullet maps to a test: content type (T2), header (T1), amounts (T1), quoting (T1), order (T2) and 404 (T2).
- The names in Interfaces match the names used in both tasks.
- The plan is about as long as the code it describes.

Please confirm the four decisions above: CRLF line endings, quoting fields that contain line breaks, ignoring query strings on the CSV path, and GET-only. Then approve the plan and I'll implement it task by task.