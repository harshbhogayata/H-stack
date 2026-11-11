I've written the plan below and haven't implemented anything. The repo has no `docs/plans` folder or CLAUDE.md, so the plan is here in the conversation rather than in a file. I couldn't confirm the existing tests pass because running `make test` needed approval, so that's the first thing to do before implementing.

---

# Plan: CSV export of invoices

**Goal:** Add `GET /invoices.csv`, which returns every invoice as CSV in the same order as `GET /invoices`.

**Approach:** A new pure module `app/export.py` turns invoice dicts into CSV text, using the standard library's `csv` module for quoting and a whole-number conversion from cents (no floats). `app/web.py` gets one new branch in `route()` that calls it. It is split into two tasks: the formatting, tested on its own, then the route wiring.

**Spec:** `SPEC.md`

**Global constraints (verbatim from the spec):**
- Content-Type: text/csv; charset=utf-8
- Header row exactly: id,amount,issued_at,customer
- amount is formatted from cents with two decimals and a dot: 1250 -> 12.50
- Fields containing a comma or a double quote are wrapped in double quotes; inner quotes are doubled.
- Rows are in the same order as GET /invoices.
- Unknown paths still return 404.
- No new dependencies (stdlib only). Test command: `make test` (runs `python3 -m pytest -q tests`).

**Decisions the spec leaves open:**
- **Line endings:** `\r\n` (the `csv` module default, standard CSV), with a trailing `\r\n` after the last row.
- **Fields containing a newline:** quoted as well (`csv.QUOTE_MINIMAL` does this anyway). Unquoted, they would break rows.
- **Header key casing:** lowercase `content-type`, matching the existing `/invoices` route.
- **`POST /invoices.csv`:** returns 404, because the router only matches `GET`. This matches how `/invoices` already behaves.

**File map:**
| File | Change | Responsibility |
|---|---|---|
| `app/export.py` | create | Formatting cents as an amount, and turning invoices into CSV text |
| `tests/test_export.py` | create | Unit tests for `app/export.py` |
| `app/web.py` | modify, lines 5–8 | Add the `/invoices.csv` branch |
| `tests/test_web.py` | create | Tests of `route()` for the CSV endpoint and 404s |

**Interfaces:**
- `app.export.format_amount(cents: int) -> str`: `1250 → "12.50"`, `5 → "0.05"`, `0 → "0.00"`, `-1250 → "-12.50"`.
- `app.export.invoices_to_csv(invoices: list[dict]) -> str`: each dict has `id`, `amount_cents`, `issued_at` and `customer`. Returns the header plus one row per invoice in input order, each line ending in `\r\n`.
- `app.web.route("GET", "/invoices.csv") -> (200, {"content-type": "text/csv; charset=utf-8"}, str)`

**Review focus (each one has a test in the task that owns the code):**
1. **Amounts under one unit and negative amounts:** splitting cents with floor division on a negative number gives `-13.50` for `-1250`. Pinned in Task 1 (`test_format_amount_small_and_negative`).
2. **A field with both a comma and a quote:** for example `He said "hi", ok`. Pinned in Task 1.
3. **Order is taken from `list_invoices()`, not re-sorted:** pinned in Task 2 by comparing ids against the JSON route.
4. **Near-miss paths still 404:** `/invoices.csv/`, `/invoices.CSV` and `POST /invoices.csv`. Pinned in Task 2.
5. **Header row is byte-exact:** no spaces and no BOM. Pinned in Task 1.

---

## Task 1: CSV formatting (`app/export.py`)

**Files:** create `app/export.py`; test file `tests/test_export.py`.
**Consumes:** nothing. **Produces:** `format_amount` and `invoices_to_csv` as described under Interfaces.

1. **Write `tests/test_export.py`** with these tests:
   - `test_format_amount_basic`: `format_amount(1250) == "12.50"` and `format_amount(990) == "9.90"`.
   - `test_format_amount_small_and_negative`: `format_amount(5) == "0.05"`, `format_amount(0) == "0.00"` and `format_amount(-1250) == "-12.50"`.
   - `test_header_exact`: `invoices_to_csv([]) == "id,amount,issued_at,customer\r\n"`.
   - `test_plain_row`: the input `{"id":"inv-2","amount_cents":990,"issued_at":"2026-02-01","customer":"Globex"}` produces line 2 equal to `inv-2,9.90,2026-02-01,Globex`.
   - `test_comma_quoted`: customer `Acme, Inc.` produces `inv-1,12.50,2026-01-31,"Acme, Inc."`.
   - `test_quote_doubled`: customer `Bob "B" Ltd` produces `"Bob ""B"" Ltd"`.
   - `test_comma_and_quote`: customer `He said "hi", ok` produces `"He said ""hi"", ok"`.
   - `test_order_preserved`: input ids `["b","a","c"]` come out as data rows in the order `b, a, c`.
2. **Run** `make test`. It should fail with `ModuleNotFoundError: No module named 'app.export'`.
3. **Implement** in `app/export.py`:
   - `format_amount`: work out the sign separately, then `f"{sign}{abs(c)//100}.{abs(c)%100:02d}"`.
   - `invoices_to_csv`: use `csv.writer(io.StringIO(), lineterminator="\r\n")` with the default `QUOTE_MINIMAL`. Write the header, then one row per invoice: `[id, format_amount(amount_cents), issued_at, customer]`.
4. **Run** `make test`. Everything should pass.
5. **Commit:** "Add invoice CSV formatter".

## Task 2: Route `GET /invoices.csv` (`app/web.py`)

**Files:** modify `app/web.py` lines 5–8; test file `tests/test_web.py`.
**Consumes:** `invoices_to_csv` and `list_invoices`. **Produces:** the `route()` behaviour described under Interfaces.

1. **Write `tests/test_web.py`** with these tests:
   - `test_csv_status_and_content_type`: `route("GET","/invoices.csv")` returns status `200` and headers `{"content-type": "text/csv; charset=utf-8"}`.
   - `test_csv_body`: the body equals `"id,amount,issued_at,customer\r\ninv-1,12.50,2026-01-31,\"Acme, Inc.\"\r\ninv-2,9.90,2026-02-01,Globex\r\n"`.
   - `test_csv_order_matches_json`: the ids in the CSV data rows equal `[i["id"] for i in json.loads(route("GET","/invoices")[2])]`.
   - `test_unknown_paths_404`: `/nope`, `/invoices.csv/`, `/invoices.CSV` and `("POST","/invoices.csv")` all return status `404`.
   - `test_json_route_unchanged`: `/invoices` still returns `application/json` with 2 items.
2. **Run** `make test`. `test_csv_*` should fail because the status is `404`, not `200`.
3. **Implement:** in `route()`, add `if method == "GET" and path == "/invoices.csv": return 200, {"content-type": "text/csv; charset=utf-8"}, invoices_to_csv(list_invoices())` before the final `return 404`. Import `invoices_to_csv` from `app.export`.
4. **Run** `make test`. Everything should pass.
5. **Commit:** "Serve invoices as CSV at /invoices.csv".

---

**Self-review:** every requirement in the spec is covered by a test.

| Requirement | Test |
|---|---|
| Content-Type | T2 `status_and_content_type` |
| Header row | T1 `header_exact` and T2 `csv_body` |
| Amount format | T1 `format_amount_*` |
| Quoting | T1 `comma_quoted`, `quote_doubled`, `comma_and_quote` |
| Order | T1 `order_preserved` and T2 `order_matches_json` |
| 404 | T2 `unknown_paths_404` |

Function names and types match across both tasks.

**Do you want any changes before I implement?** The two choices most worth checking are `\r\n` line endings and lowercase `content-type`, since the spec doesn't settle either.