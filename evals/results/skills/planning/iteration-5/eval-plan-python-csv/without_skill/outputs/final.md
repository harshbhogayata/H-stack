Here's the plan. I haven't changed anything in the repo.

# Implementation plan: `GET /invoices.csv`

## What's there now
- `app/invoices.py`: `list_invoices()` returns copies of an in-memory list. Each invoice has `id`, `amount_cents`, `issued_at` and `customer`. The sample data already includes `"Acme, Inc."`, which will exercise the quoting rule.
- `app/web.py`: `route(method, path)` returns `(status, headers, body)`. It only handles `GET /invoices` (JSON) and returns 404 for everything else. Header keys are lowercase.
- `tests/test_invoices.py`: one test, and nothing yet covers `route()`. Tests run with `make test` (pytest).

## Steps

**1. Add the CSV serialisation as pure functions (new `app/csv_export.py`)**
- `format_amount(cents: int) -> str`: use integer arithmetic, not floats: `f"{sign}{abs(c)//100}.{abs(c)%100:02d}"`. That gives 1250 → `12.50`, 990 → `9.90`, 5 → `0.05` and 0 → `0.00`. Negative amounts (e.g. credit notes) still come out correctly.
- `escape_field(value) -> str`: call `str(value)`. If the result contains `,` or `"`, double the inner quotes and wrap the field in quotes. Otherwise return it unchanged.
- `invoices_to_csv(invoices) -> str`: write the header line `id,amount,issued_at,customer`, then one line per invoice in the order given.

I'd write the escaping by hand rather than use Python's `csv` module. `csv.QUOTE_MINIMAL` also quotes fields containing `\r`/`\n` and defaults to `\r\n` line endings, so it wouldn't match the spec exactly. The hand-written version is a few lines and does exactly what the spec says.

**2. Add the route in `app/web.py`**
- Add a branch for `method == "GET" and path == "/invoices.csv"` that returns `200, {"content-type": "text/csv; charset=utf-8"}, invoices_to_csv(list_invoices())`.
- Using `list_invoices()` as the source means the row order matches `GET /invoices` without extra work.
- The existing JSON branch and the 404 fallback stay as they are, so unknown paths, including near-misses like `/invoices.CSV` or `/invoices.csv/`, still return 404.

**3. Tests (new `tests/test_csv_export.py`, plus route tests)**
- `format_amount`: 1250 → `12.50`, 990 → `9.90`, 5 → `0.05`, 0 → `0.00`, 100 → `1.00`.
- `escape_field`: a plain value is unchanged, `Acme, Inc.` → `"Acme, Inc."`, `Say "hi"` → `"Say ""hi"""`, and a value with both a comma and quotes is handled.
- `route("GET", "/invoices.csv")`:
  - status is 200 and the content type matches exactly
  - the first line is exactly `id,amount,issued_at,customer`
  - the full body for the sample data is checked as one expected string
  - the `id` column order matches the ids from the JSON route
- Regressions: `GET /invoices` still returns JSON; `/nope`, `/invoices.csv/` and `POST /invoices.csv` return 404.

**4. Check:** run `make test`.

## Open questions (the spec doesn't cover these)
1. **Line endings:** RFC 4180 uses `\r\n`. I'd default to `\n` for simplicity and make it one constant that's easy to change. Which one do you want?
2. **Trailing newline:** I'd end the file with a newline after the last row.
3. **Newlines inside fields:** the spec only requires quoting for commas and quotes. A customer name containing a newline would break the row structure. I'd suggest also quoting on `\n`/`\r` (it's RFC-compliant and harmless), but that goes slightly beyond the spec, so it needs your approval.
4. **No invoices:** the response would be just the header row. I'm assuming that's fine.

## Files touched
- New: `app/csv_export.py`, `tests/test_csv_export.py`
- Edited: `app/web.py` (one new branch and an import)