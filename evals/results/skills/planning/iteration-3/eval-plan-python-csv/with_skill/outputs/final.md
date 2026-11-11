I followed the planning skill and skipped the `hs` and receipts steps as you asked. The repo has no `docs/plans` folder or other place for plans, so the plan is here in the conversation rather than in a file.

---

# Plan: CSV export of invoices

**Goal:** Add `GET /invoices.csv`, which returns every invoice as CSV.

**Approach:** A pure function in a new `app/csv_export.py` turns the invoice list into CSV text, using Python's standard `csv` module so quoting follows the spec. `app/web.py` gets one new branch in `route()` that calls it with `list_invoices()`. That is the same data source `/invoices` uses, so the row order matches.

**Spec:** `SPEC.md`
**Test command:** `make test` (runs `python3 -m pytest -q tests`)

### Global constraints (copied from the spec)
- Content-Type: `text/csv; charset=utf-8`
- Header row exactly: `id,amount,issued_at,customer`
- amount is formatted from cents with two decimals and a dot: `1250 -> 12.50`
- Fields containing a comma or a double quote are wrapped in double quotes; inner quotes are doubled.
- Rows are in the same order as `GET /invoices`.
- Unknown paths still return 404.
- Only the standard library; no new dependencies.

### Interfaces
- `app/csv_export.py`: `format_amount(cents: int) -> str`, for example `1250 → "12.50"`, `990 → "9.90"`, `5 → "0.05"`
- `app/csv_export.py`: `invoices_to_csv(invoices: list[dict]) -> str`. It takes dicts with the keys `id`, `amount_cents`, `issued_at` and `customer`, and returns a header line plus one line per invoice in the input order.
- `app/web.py`: `route("GET", "/invoices.csv")` returns `(200, {"content-type": "text/csv; charset=utf-8"}, invoices_to_csv(list_invoices()))`

**A decision the spec leaves open:** each line ends with `\n`, including the last one. I'm passing `lineterminator="\n"` to `csv.writer` instead of keeping its default `\r\n`. Tell me if you'd rather have `\r\n`.

### Review focus (each one has a test below)
1. **Amounts under a dollar or with a trailing zero.** `5` must become `0.05` and `990` must become `9.90`, not `0.5` or `9.9`. Use integer math, `f"{cents // 100}.{cents % 100:02d}"`, not float division. → Task 1
2. **A customer name containing a double quote.** The quote must be doubled inside a quoted field. The fixture data only has a comma case. → Task 1
3. **Header text is exact.** The header must not include `amount_cents` or extra spaces. → Task 1
4. **`/invoices.csv` with a method other than GET, and paths that are close but not exact** (`/invoices.csv/`, `/invoices.CSV`). These must still return 404. → Task 2
5. **The existing `/invoices` JSON route must not change.** → Task 2

---

### Task 1: CSV serialisation
**Files:** create `app/csv_export.py` and `tests/test_csv_export.py`
**Produces:** `format_amount`, `invoices_to_csv`

1. Write the failing tests in `tests/test_csv_export.py`:
   - `test_format_amount`: `format_amount(1250) == "12.50"`, `format_amount(990) == "9.90"`, `format_amount(5) == "0.05"`, `format_amount(0) == "0.00"`
   - `test_header_row_exact`: `invoices_to_csv([]) == "id,amount,issued_at,customer\n"`
   - `test_fixture_rows`: `invoices_to_csv(list_invoices())` equals `'id,amount,issued_at,customer\ninv-1,12.50,2026-01-31,"Acme, Inc."\ninv-2,9.90,2026-02-01,Globex\n'`
   - `test_quotes_doubled`: an invoice with `customer='Say "Hi"'` produces the field `"Say ""Hi"""`
   - `test_preserves_input_order`: given two invoices in reversed order, the output rows are reversed too
2. Run `make test`. Expect an `ImportError` / `ModuleNotFoundError` for `app.csv_export`.
3. Implement both functions in `app/csv_export.py`:
   - Use `io.StringIO` with `csv.writer(buf, lineterminator="\n")`. Its default `QUOTE_MINIMAL` quoting already wraps fields that contain commas or quotes and doubles inner quotes.
   - Write the header row first, then each row as `[id, format_amount(amount_cents), issued_at, customer]`.
4. Run `make test`. Expect everything to pass.
5. Commit: `Add invoices_to_csv serialiser`

### Task 2: `/invoices.csv` route
**Files:** modify `app/web.py` (the `route` function, lines 3–8); create `tests/test_web.py`
**Consumes:** `invoices_to_csv`, `list_invoices`

1. Write the failing tests in `tests/test_web.py`:
   - `test_csv_route`: `route("GET", "/invoices.csv")` returns status `200`, a `content-type` header equal to `"text/csv; charset=utf-8"`, and a body equal to `invoices_to_csv(list_invoices())`
   - `test_csv_row_order_matches_json`: the `id` values in CSV rows 2 onward equal `[i["id"] for i in json.loads(route("GET","/invoices")[2])]`
   - `test_unknown_paths_404`: `route("GET", "/nope")`, `route("GET", "/invoices.csv/")` and `route("POST", "/invoices.csv")` each return status `404`
   - `test_json_route_unchanged`: `route("GET", "/invoices")` still returns `200` with `application/json`
2. Run `make test`. Expect `test_csv_route` and `test_csv_row_order_matches_json` to fail because the route currently returns 404.
3. Implement it: add `if method == "GET" and path == "/invoices.csv": return 200, {"content-type": "text/csv; charset=utf-8"}, invoices_to_csv(list_invoices())` before the final 404 return. Import `invoices_to_csv` at the top of the file.
4. Run `make test`. Expect everything to pass.
5. Commit: `Serve invoices as CSV at /invoices.csv`

### Self-review
Every spec line maps to a task:
- Content-Type: Task 2
- Header row: Task 1
- Amount format: Task 1
- Quoting: Task 1
- Row order: Tasks 1 and 2
- 404 for unknown paths: Task 2

Function and file names match between the two tasks, and each review-focus item has a test.

---

Should I go ahead and implement this plan? Also tell me if you'd rather have `\r\n` line endings.