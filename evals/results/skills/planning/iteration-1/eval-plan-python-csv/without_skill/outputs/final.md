Here's the plan. I haven't changed any files.

## Implementation plan: `GET /invoices.csv`

### What's there now
- `app/invoices.py` holds an in-memory `INVOICES` list. Each record has `id`, `amount_cents`, `issued_at` and `customer`, and `list_invoices()` returns copies of them. One customer is `"Acme, Inc."`, which already covers the case where a field needs quoting.
- `app/web.py` has `route(method, path)`, which returns `(status, headers_dict, body_str)`. It handles `GET /invoices` (JSON) and returns 404 for everything else. Header names are lowercase.
- `tests/test_invoices.py` has a single test, and it only checks the data layer. Nothing tests `route()` yet. Tests run with `make test` (`pytest -q tests`).

### Step 1: CSV helpers in a new module, `app/csv_export.py`
Keeping these as pure functions makes them easy to unit test.
- **`format_amount(cents: int) -> str`**: use integer arithmetic, not floats, so rounding can't go wrong: `sign + f"{abs(c)//100}.{abs(c)%100:02d}"`. So `1250 → "12.50"`, `990 → "9.90"`, `5 → "0.05"`, `0 → "0.00"`, and `-1250 → "-12.50"`.
- **`escape_field(value) -> str`**: convert to `str`. If the value contains `,` or `"`, double any inner `"` and wrap it in quotes. Otherwise return it unchanged.
- **`invoices_to_csv(invoices) -> str`**: write the header `id,amount,issued_at,customer`, then one row per invoice in the order given. The spec's `amount` column is built from `amount_cents`.

I'd write this by hand rather than use the stdlib `csv` module. `csv.writer` with `QUOTE_MINIMAL` also quotes fields that contain `\r`, `\n` or other special characters. Writing it ourselves keeps the output to exactly what the spec says, and the code is about 15 lines.

### Step 2: Route it in `app/web.py`
- Add a branch for `method == "GET" and path == "/invoices.csv"` that returns `200, {"content-type": "text/csv; charset=utf-8"}, invoices_to_csv(list_invoices())`.
- Use the same `list_invoices()` call as `/invoices`. Because both endpoints read from one source, the "same order as GET /invoices" rule holds without extra code.
- Make it an exact path match so the existing 404 fallback still covers `/invoices.csv/`, `/invoices.csvx` and other unknown paths.
- While I'm in the file, move the `import json` inside the function up to the top. This is optional.

### Step 3: Tests
I'd split them into two files.

**`tests/test_csv_export.py`** (unit tests):
- `format_amount`: 1250→`12.50`, 990→`9.90`, 5→`0.05`, 0→`0.00`, 100→`1.00`, and one large value.
- `escape_field`: plain text stays unchanged; `Acme, Inc.` becomes `"Acme, Inc."`; `say "hi"` becomes `"say ""hi"""`; a value with both a comma and a quote is handled too.

**`tests/test_web.py`** (route tests):
- `GET /invoices.csv` returns status 200 with content-type exactly `text/csv; charset=utf-8`.
- The first line is exactly `id,amount,issued_at,customer`.
- The full body for the fixture data is `inv-1,12.50,2026-01-31,"Acme, Inc."` and `inv-2,9.90,2026-02-01,Globex`.
- The CSV row ids are in the same order as the ids from `json.loads(route("GET", "/invoices")[2])`.
- Unknown paths (`/nope`, `/invoices.csv/`, `/invoices.CSV`) and `POST /invoices.csv` all return 404.
- `GET /invoices` still behaves as before.

### Step 4: Verify
Run `make test`.

### Decisions the spec leaves open
I'll go with the default in each case unless you say otherwise:
1. **Line endings**: RFC 4180 uses `\r\n`, but nothing in the spec asks for it. **Default: `\n`**, with a trailing newline after the last row.
2. **Newlines inside fields**: the spec only mentions commas and quotes. A customer name containing a newline would break the row. **Default: also quote fields that contain `\r` or `\n`.** That's a small step past the spec, but the output stays valid CSV.
3. **Negative amounts**: format them as `-12.50`. Doing the integer math on the absolute value avoids getting `-13.50` from floor division.
4. **`HEAD` requests and other methods**: the existing router only handles GET, so these get 404, same as now.
5. **Empty invoice list**: return just the header row.
6. **Missing or `None` fields**: return an empty string. The current data doesn't have any, so this only guards against future data.

### Files touched
- New: `app/csv_export.py`, `tests/test_csv_export.py`, `tests/test_web.py`
- Changed: `app/web.py` (one new branch)