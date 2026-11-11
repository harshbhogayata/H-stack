I've read the spec and the code, so here's the plan. The repo has no folder for design docs, so I've kept it here rather than adding a file. I couldn't confirm the baseline: running `make test` needed approval, so I haven't seen the existing test pass.

---

# Plan: CSV export of invoices

**Goal:** Add `GET /invoices.csv`, which returns every invoice as CSV.
**Approach:** Put a CSV serializer next to the invoice data in `app/invoices.py` and add one branch to `route()` in `app/web.py`. Both endpoints read from `list_invoices()`, so the row order is the same by construction. The serializer uses the standard library's `csv` module, so no new dependencies.
**Spec:** `SPEC.md`
**Test command:** `make test` (runs `python3 -m pytest -q tests`)

### Global constraints (verbatim from the spec)
- Content-Type: text/csv; charset=utf-8
- Header row exactly: id,amount,issued_at,customer
- amount is formatted from cents with two decimals and a dot: 1250 -> 12.50
- Fields containing a comma or a double quote are wrapped in double quotes; inner quotes are doubled.
- Rows are in the same order as GET /invoices.
- Unknown paths still return 404.

### Interfaces
- `app/invoices.py`
  - `format_amount(cents: int) -> str`: uses integer maths only, never floats. `1250 -> "12.50"`, `990 -> "9.90"`, `5 -> "0.05"`, `0 -> "0.00"`, `-1250 -> "-12.50"`.
  - `invoices_to_csv(invoices: list[dict]) -> str`: the header plus one row per invoice, in input order. Each row ends with `\r\n`, including the last.
  - `CSV_COLUMNS = ("id", "amount", "issued_at", "customer")`
- `app/web.py`
  - `route("GET", "/invoices.csv")` returns `(200, {"content-type": "text/csv; charset=utf-8"}, <str>)`. It keeps the existing `(status, headers, body)` shape and lowercase header keys.

### File map
| File | Responsibility |
|---|---|
| `app/invoices.py` (modify, append after line 7) | Amount formatting and CSV serialization, kept next to the data |
| `app/web.py` (modify, lines 4–7) | New route branch |
| `tests/test_invoices.py` (modify) | Unit tests for `format_amount` and `invoices_to_csv` |
| `tests/test_web.py` (create) | Route tests: CSV response, order matches `/invoices`, 404s |

### Review focus (each one is pinned by a test below)
1. **Float rounding in `amount`:** `cents / 100` with formatting can drift. Pinned by `test_format_amount_*`, which includes `5 -> 0.05` and `-1250 -> -12.50`.
2. **`/invoices.csv` vs `/invoices`:** the new branch must be an exact match and must not break the JSON route. Pinned by `test_json_route_unchanged`.
3. **404 for paths that are nearly right:** `/invoices.csv/`, `/invoices.CSV` and `POST /invoices.csv` must all return 404. Pinned by `test_unknown_paths_404`.
4. **Quoting:** a field containing both a comma and a quote. Pinned by `test_csv_quotes_comma_and_doubles_quotes`.
5. **Header-only output when there are no invoices.** Pinned by `test_csv_empty_list_is_header_only`.

---

### Task 1: CSV serializer (`app/invoices.py`)
**Produces:** `format_amount`, `invoices_to_csv`, `CSV_COLUMNS`. **Consumes:** none.

1. **Write failing tests** in `tests/test_invoices.py`:
   - `test_format_amount_examples`: `format_amount(1250) == "12.50"`, `990 -> "9.90"`, `5 -> "0.05"`, `0 -> "0.00"`, `100 -> "1.00"`
   - `test_format_amount_negative`: `format_amount(-1250) == "-12.50"`, `-5 -> "-0.05"`
   - `test_csv_header_exact`: `invoices_to_csv([]).split("\r\n")[0] == "id,amount,issued_at,customer"`
   - `test_csv_empty_list_is_header_only`: `invoices_to_csv([]) == "id,amount,issued_at,customer\r\n"`
   - `test_csv_fixture_rows`: `invoices_to_csv(list_invoices()) == 'id,amount,issued_at,customer\r\ninv-1,12.50,2026-01-31,"Acme, Inc."\r\ninv-2,9.90,2026-02-01,Globex\r\n'`
   - `test_csv_quotes_comma_and_doubles_quotes`: a customer of `'Say "hi", Bob'` becomes the field `'"Say ""hi"", Bob"'`, and a customer of `'He said "x"'` becomes `'"He said ""x"""'`
   - `test_csv_plain_field_unquoted`: `Globex` appears without quotes
2. **Run** `make test`. Expect an `ImportError` on `format_amount` / `invoices_to_csv`.
3. **Implement**:
   - `format_amount`: `sign = "-" if cents < 0 else ""`, then `q, r = divmod(abs(cents), 100)`, then return `f"{sign}{q}.{r:02d}"`.
   - `invoices_to_csv`: write to `io.StringIO` with `csv.writer(buf, quoting=csv.QUOTE_MINIMAL, lineterminator="\r\n")`. Write `CSV_COLUMNS`, then for each invoice write `[inv["id"], format_amount(inv["amount_cents"]), inv["issued_at"], inv["customer"]]`.
4. **Run** `make test`. All tests pass.
5. **Commit:** `Add invoice CSV serializer`

### Task 2: Route (`app/web.py`)
**Consumes:** `invoices_to_csv`, `list_invoices`. **Produces:** the `GET /invoices.csv` route.

1. **Write failing tests** in a new file, `tests/test_web.py`:
   - `test_csv_route_status_and_content_type`: `route("GET", "/invoices.csv")` returns status `200` and `headers["content-type"] == "text/csv; charset=utf-8"`
   - `test_csv_route_body`: the body equals `invoices_to_csv(list_invoices())`, and its first line is `id,amount,issued_at,customer`
   - `test_csv_order_matches_json`: the ids from the CSV rows (column 0, after the header) equal `[i["id"] for i in json.loads(route("GET", "/invoices")[2])]`
   - `test_json_route_unchanged`: `/invoices` still returns 200 with `application/json`
   - `test_unknown_paths_404`: for `("GET", "/nope")`, `("GET", "/invoices.csv/")`, `("GET", "/invoices.CSV")` and `("POST", "/invoices.csv")`, the status is `404`
2. **Run** `make test`. The CSV tests fail with a 404 status. `test_json_route_unchanged` and `test_unknown_paths_404` already pass.
3. **Implement:** add `if method == "GET" and path == "/invoices.csv": return 200, {"content-type": "text/csv; charset=utf-8"}, invoices_to_csv(list_invoices())` to `route()`, before the 404 fallback.
4. **Run** `make test`. All tests pass.
5. **Commit:** `Add GET /invoices.csv`

---

### Decisions the spec leaves open (please confirm or change)
- **Line ending:** I've picked `\r\n` (RFC 4180, the `csv` module's default), with a line ending after the last row as well. If you'd rather have `\n`, it's a one-argument change, and the expected strings in the Task 1 tests would change too.
- **Newlines inside fields:** the spec only covers commas and quotes. `QUOTE_MINIMAL` also wraps fields containing a newline in quotes, which is the RFC-correct behaviour. I'm treating that as acceptable rather than a deviation from the spec.
- **Negative amounts:** these get a leading `-` (`-12.50`). The spec doesn't mention them.

Does this plan look right? I won't implement anything until you approve it.