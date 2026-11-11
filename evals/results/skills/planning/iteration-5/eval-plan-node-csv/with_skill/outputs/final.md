Here's the implementation plan. Nothing has been changed in the repo. The project has no `docs/plans` folder or other place for design docs, so I've kept the plan here in the chat. The current test suite passes (1 test, run with `npm test`).

---

# Plan: CSV export of invoices

**Goal:** Add `GET /invoices.csv`, which returns every invoice as CSV in the format `SPEC.md` describes.

**Approach:** Put the CSV logic in a new module, `src/csv.js`, made of pure functions. Each function can then be unit-tested without a server. `src/server.js` adds one route that passes `listInvoices()` through that module. Both `/invoices` and `/invoices.csv` read from `listInvoices()`, so the rows come out in the same order by construction. A route test also checks the order.

**Spec:** `SPEC.md`

**Global constraints:**
- `Content-Type: text/csv; charset=utf-8`
- The header row is exactly `id,amount,issued_at,customer`
- Amounts are in cents and are written with two decimals and a dot: `1250 -> 12.50`
- A field that contains a comma or a double quote is wrapped in double quotes, and any quote inside it is doubled.
- Rows are in the same order as `GET /invoices`.
- Unknown paths still return 404.
- Use only what is already there: ESM (`"type":"module"`), `node:test`, `node:assert/strict`, Node 22 (which has built-in `fetch`). No new dependencies.

**Interfaces** (all in `src/csv.js`, made in Task 1, used in Task 2):
```js
export function formatAmount(cents: number): string        // 1250 -> "12.50"
export function csvField(value: string): string            // escapes per spec
export function invoicesToCsv(invoices: Array<{id, amountCents, issuedAt, customer}>): string
```
`invoicesToCsv` writes the header line, then one line per invoice in input order, with columns `id, formatAmount(amountCents), issuedAt, customer`. Every field goes through `csvField`. Lines end with `\n` and the output ends with a trailing newline. That line-ending choice is open question 1 below.

**Review focus** (cases the spec implies but doesn't spell out; each one gets a test pinned in the task named):
1. **Amounts under 100 cents or with a single-digit remainder** (`5 -> "0.05"`, `1000 -> "10.00"`). The obvious float approach, `(c/100).toFixed(2)`, gets these right, but code that builds the string by hand often doesn't. Covered in Task 1.
2. **A field with both a comma and a quote** (`He said "hi", ok` → `"He said ""hi"", ok"`). Covered in Task 1.
3. **Real data that needs quoting:** `inv-1`'s customer `Acme, Inc.` must come out as `"Acme, Inc."` in the HTTP body, not just in the unit test. Covered in Task 2.
4. **Near-miss paths** (`/invoices.csv/`, `/invoices.csvx`) must still return 404. Covered in Task 2.
5. **Negative amounts** (`-150 -> "-1.50"`). The spec doesn't mention them; I'd handle the sign anyway. Covered in Task 1.

---

## Task 1: CSV serializer (`src/csv.js`)

**Files:** create `src/csv.js` and the test `test/csv.test.js`.
**Uses:** the invoice shape from `src/invoices.js:1-4`. **Produces:** the three functions listed under Interfaces.

1. Write the failing tests in `test/csv.test.js`:
   - `formatAmount formats cents with two decimals`: `1250→"12.50"`, `990→"9.90"`, `5→"0.05"`, `0→"0.00"`, `1000→"10.00"`, `-150→"-1.50"`.
   - `csvField leaves plain values alone`: `"Globex"→"Globex"`.
   - `csvField quotes commas`: `"Acme, Inc."→"\"Acme, Inc.\""`.
   - `csvField quotes and doubles quotes`: `'say "hi"'→'"say ""hi"""'`, and `'He said "hi", ok'→'"He said ""hi"", ok"'`.
   - `invoicesToCsv emits header then rows in order`: fed the two fixture invoices, it returns exactly `'id,amount,issued_at,customer\ninv-1,12.50,2026-01-31,"Acme, Inc."\ninv-2,9.90,2026-02-01,Globex\n'`.
   - `invoicesToCsv with no invoices returns header only`: `[]` gives `'id,amount,issued_at,customer\n'`.
2. Run `npm test`. It should fail with `ERR_MODULE_NOT_FOUND` for `src/csv.js`.
3. Implement `src/csv.js`. `formatAmount` uses integer math only (no float division): `sign + Math.floor(abs/100) + "." + String(abs % 100).padStart(2, "0")`. `csvField` checks `/[",]/` and, if it matches, returns `'"' + v.replaceAll('"', '""') + '"'`.
4. Run `npm test`. All tests should pass, including the existing `lists invoices`.
5. Commit: `Add CSV serializer for invoices`.

## Task 2: `GET /invoices.csv` route

**Files:** modify `src/server.js` (add the import at line 2 and the route branch between lines 8 and 10, before the 404). Add the test `test/server.test.js`.
**Uses:** `invoicesToCsv` from Task 1 and `listInvoices` from `src/invoices.js`.

1. Write the failing tests in `test/server.test.js`. They start `http.createServer(handler).listen(0)` in `before`, call it with `fetch`, and close the server in `after`:
   - `GET /invoices.csv returns CSV`: status 200, `content-type` is exactly `text/csv; charset=utf-8`, and the body equals `invoicesToCsv(listInvoices())`. The body also contains the line `inv-1,12.50,2026-01-31,"Acme, Inc."`.
   - `CSV rows match /invoices order`: the ids from the JSON at `/invoices` equal the first column of the CSV body lines, header skipped.
   - `unknown paths still 404`: `/nope`, `/invoices.csv/` and `/invoices.csvx` each return 404.
   - `GET /invoices unchanged`: status 200, JSON with 2 items.
2. Run `npm test`. The CSV test should fail because it gets 404 instead of 200.
3. In `handler`, add `if (req.method === 'GET' && req.url === '/invoices.csv') { res.writeHead(200, { 'content-type': 'text/csv; charset=utf-8' }); return res.end(invoicesToCsv(listInvoices())); }`.
4. Run `npm test`. Everything should pass.
5. Commit: `Add GET /invoices.csv endpoint`.

---

**Self-review:** Each spec bullet maps to a test:
- Content-Type: Task 2
- Header row: Task 1, and Task 2 through the full-body test
- Amount formatting: Task 1
- Quoting: Tasks 1 and 2
- Row order: Task 2
- 404: Task 2

Every Review focus item has a test.

**Open questions:** I'll go with the default for each unless you say otherwise.
1. **Line endings:** I'm planning `\n` with a trailing newline. RFC 4180 calls for `\r\n`, which some Excel setups prefer. Should I switch?
2. **Newlines inside a field:** the spec only asks for quoting on commas and quotes. A field containing `\n` would break the CSV, and none of the current data has one. Should `csvField` quote `\r` and `\n` as well? It's a one-character change to the regex.
3. **Query strings:** `/invoices.csv?x=1` will return 404, the same way `/invoices?x=1` does today, because routing matches the URL exactly. I'm keeping that behaviour.

Once you approve the plan (and answer any of these), I'll implement it task by task.