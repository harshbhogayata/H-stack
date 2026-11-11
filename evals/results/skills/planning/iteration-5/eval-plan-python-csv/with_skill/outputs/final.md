The repo has no `docs/` folder, no plans folder and no CLAUDE.md, so I've kept the plan here in the conversation instead of adding a file.

# Plan: CSV export of invoices

**Goal:** Add `GET /invoices.csv`, which returns every invoice as CSV, in the format SPEC.md describes.

**Approach:** Put the CSV logic in a new module, `app/csv_export.py`, as plain functions with no web code. Then add one branch to `route()` in `app/web.py`. Both `/invoices` and `/invoices.csv` will get their data from `list_invoices()`, so the row order is the same by construction.

**Spec:** `SPEC.md`

**Global constraints (copied from the spec):**
- Content-Type: `text/csv; charset=utf-8`
- Header row exactly: `id,amount,issued_at,customer`
- amount is formatted from cents with two decimals and a dot: `1250 -> 12.50`
- Fields containing a comma or a double quote are wrapped in double quotes; inner quotes are doubled.
- Rows are in the same order as `GET /invoices`.
- Unknown paths still return 404.

**Test command:** `make test` (runs `python3 -m pytest -q tests`). **pytest is not installed in this environment.** Before Task 1, run `python3 -m pip install pytest`. The repo has no requirements file, so I won't add a dependency manifest.

**Interfaces:**
```python
# app/csv_export.py
CSV_HEADER: tuple[str, ...] = ("id", "amount", "issued_at", "customer")
def format_amount(cents: int) -> str            # 1250 -> "12.50", 990 -> "9.90", 5 -> "0.05", -1250 -> "-12.50"
def csv_field(value: str) -> str                # quotes only if value contains "," or '"'; '"' -> '""'
def invoices_to_csv(invoices: list[dict]) -> str  # header + one line per invoice, input order, "\n" after every line
# app/web.py
route("GET", "/invoices.csv") -> (200, {"content-type": "text/csv; charset=utf-8"}, str)
```
Invoice dicts use the keys from `app/invoices.py`: `id`, `amount_cents`, `issued_at`, `customer`.

**Decisions I made (the spec doesn't cover these, so tell me if you want them changed):**
1. **Hand-written quoting instead of the `csv` module.** `csv.QUOTE_MINIMAL` also quotes fields that contain `\r` or `\n` and uses `\r\n` line endings by default. Writing the quoting by hand keeps the output exactly to the spec's rule. The downside: a customer name containing a newline would produce a broken row. If you'd rather be safe there, I'll also quote fields that contain `\n` or `\r` (one more condition in `csv_field`).
2. **Line endings are `\n`, and the body ends with a trailing `\n`.**
3. **The header key is lowercase `content-type`**, matching the existing `/invoices` branch.

**Review focus (things the spec implies that a basic test would miss; each has a test assigned below):**
1. **Negative or small amounts.** A naive `f"{c//100}.{c%100:02d}"` turns -1250 into `-13.50`, and 5 has to come out as `0.05`. Covered in Task 1.
2. **A field containing both a comma and a quote**, e.g. `Say "hi", Inc` → `"Say ""hi"", Inc"`. Covered in Task 1.
3. **Every field gets quoted, not just customer.** The `id` and `issued_at` values go through `csv_field` too. Covered in Task 1.
4. **The match is exact.** `/invoices.csv/` and `/invoices.csvx` must still return 404. Covered in Task 2.

---

## Task 1: CSV serializer (`app/csv_export.py`)

**Files:** create `app/csv_export.py` and `tests/test_csv_export.py`.
**Produces:** `CSV_HEADER`, `format_amount`, `csv_field`, `invoices_to_csv`.

1. Write failing tests in `tests/test_csv_export.py`:
   - `test_format_amount`:
     - `format_amount(1250) == "12.50"`
     - `format_amount(990) == "9.90"`
     - `format_amount(5) == "0.05"`
     - `format_amount(0) == "0.00"`
     - `format_amount(-1250) == "-12.50"`
   - `test_csv_field_plain`: `csv_field("Globex") == "Globex"`
   - `test_csv_field_comma`: `csv_field("Acme, Inc.") == '"Acme, Inc."'`
   - `test_csv_field_quote`: `csv_field('Say "hi"') == '"Say ""hi"""'`
   - `test_csv_field_comma_and_quote`: `csv_field('Say "hi", Inc') == '"Say ""hi"", Inc"'`
   - `test_invoices_to_csv_fixture`: `invoices_to_csv(list_invoices())` returns exactly:
     ```
     id,amount,issued_at,customer\ninv-1,12.50,2026-01-31,"Acme, Inc."\ninv-2,9.90,2026-02-01,Globex\n
     ```
   - `test_invoices_to_csv_quotes_every_column`: an invoice with `id="a,b"` produces a row that starts with `"a,b",`.
   - `test_invoices_to_csv_empty`: `invoices_to_csv([]) == "id,amount,issued_at,customer\n"`
2. Run `make test`. It should fail with `ModuleNotFoundError: No module named 'app.csv_export'`.
3. Implement the four names using the signatures under Interfaces.
   - `format_amount` handles the sign first: `sign = "-" if cents < 0 else ""`, then `q, r = divmod(abs(cents), 100)`, then `f"{sign}{q}.{r:02d}"`.
   - `invoices_to_csv` builds each row from `id`, `format_amount(amount_cents)`, `issued_at` and `customer`, passes every field through `csv_field`, joins the fields with `,` and joins the lines with `\n`, and ends the body with a trailing `\n`.
4. Run `make test`. Everything should pass, including the existing `test_lists_invoices`.
5. Commit: `Add CSV serializer for invoices`.

## Task 2: Route `GET /invoices.csv` (`app/web.py`)

**Files:** modify `app/web.py` (lines 3–8, the `route` function) and create `tests/test_web.py`.
**Consumes:** `invoices_to_csv` and `list_invoices`.

1. Write failing tests in `tests/test_web.py`:
   - `test_csv_status_and_content_type`: `route("GET", "/invoices.csv")` returns status `200`, and `headers["content-type"] == "text/csv; charset=utf-8"`.
   - `test_csv_header_row`: the first line of the body (`body.split("\n")[0]`) is `"id,amount,issued_at,customer"`.
   - `test_csv_order_matches_json`: the ids in the CSV body (first column of each data line) equal `[i["id"] for i in json.loads(route("GET", "/invoices")[2])]`.
   - `test_unknown_paths_404`: for each of `"/nope"`, `"/invoices.csv/"` and `"/invoices.csvx"`, `route("GET", p)[0] == 404`.
   - `test_json_route_unchanged`: `route("GET", "/invoices")` still returns `200` with `application/json`.
2. Run `make test`. The CSV tests should fail with `404 != 200`.
3. Add the branch `if method == "GET" and path == "/invoices.csv": return 200, {"content-type": "text/csv; charset=utf-8"}, invoices_to_csv(list_invoices())`. Put the import at the top of the module.
4. Run `make test`. Everything should pass.
5. Commit: `Serve invoices as CSV at GET /invoices.csv`.

---

**Self-check against the spec:**

| Spec requirement | Covered by |
|---|---|
| Content-Type | Task 2.1 |
| Exact header row | Task 1 fixture test and Task 2 header test |
| Amount formatting | `test_format_amount` |
| Quoting rules | the `csv_field` tests and the column test |
| Same row order as `/invoices` | `test_csv_order_matches_json` |
| Unknown paths return 404 | `test_unknown_paths_404` |

Can I go ahead with this plan, and do you want decision 1 changed so fields containing newlines are quoted too?