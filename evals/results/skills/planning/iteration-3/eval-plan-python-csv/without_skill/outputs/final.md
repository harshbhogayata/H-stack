I'd hand-write a small CSV serializer rather than use Python's `csv` module, because `csv` quotes more cases than the spec lists. The plan below is based on the whole repo, which is small: `app/invoices.py`, `app/web.py`, and one test.

## Current state
- `app/invoices.py`: an in-memory `INVOICES` list. `list_invoices()` returns copies of the records. Each record has `id`, `amount_cents`, `issued_at` and `customer`. Note that `"Acme, Inc."` contains a comma, so the sample data already needs quoting.
- `app/web.py`: `route(method, path)` returns `(status, headers, body)`. Its only route is `GET /invoices`, which returns JSON. Everything else returns 404.
- `tests/test_invoices.py`: one test, and it doesn't touch `route`.

## Plan

**1. Add a CSV serializer in a new module, `app/csv_export.py`**
- `format_amount(cents: int) -> str`: use integer math (`f"{cents // 100}.{cents % 100:02d}"`), not floats, so 1250 gives `12.50` and 990 gives `9.90`. Negative amounts need care because `//` rounds down (see Open questions).
- `escape_field(value: str) -> str`: if the value contains `,` or `"`, double any inner `"` and wrap the whole value in quotes. Otherwise return it unchanged.
- `invoices_to_csv(invoices) -> str`: write the header `id,amount,issued_at,customer`, then one row per invoice in the order given, using `amount_cents` for the amount. Keeping this pure (no web code) makes it easy to test.
- **Why not the `csv` module:** with its default setting it also quotes fields containing `\r` or `\n`, and it ends lines with `\r\n`. The spec mentions neither. A hand-written escaper of about 5 lines does exactly what the spec says. If we decide newlines should be quoted too, switching to `csv.writer` is a small change.

**2. Add the route in `app/web.py`**
- Add a branch for `method == "GET" and path == "/invoices.csv"` that returns `200, {"content-type": "text/csv; charset=utf-8"}, invoices_to_csv(list_invoices())`.
- Use the same `list_invoices()` call as `/invoices`, so both endpoints always return rows in the same order.
- Leave the 404 fallthrough unchanged.
- Optionally, move the inline `import json` to the top of the file while I'm in there.

**3. Tests: add `tests/test_csv_export.py` and `tests/test_web.py`**
- `format_amount`: 1250 → `12.50`, 990 → `9.90`, 5 → `0.05`, 0 → `0.00`, 100 → `1.00`.
- `escape_field`:
  - a plain value stays unchanged
  - `Acme, Inc.` → `"Acme, Inc."`
  - `say "hi"` → `"say ""hi"""`
  - a value with both a comma and a quote is quoted and its quotes doubled
- `route("GET", "/invoices.csv")`:
  - status 200 and the exact content-type
  - the first line is exactly `id,amount,issued_at,customer`
  - the full body matches the expected output for the sample data
  - the CSV row ids match the ids from `/invoices`, in the same order
- 404s: `/invoices.csv/`, `/invoices.txt`, `/nope` and `POST /invoices.csv` all return 404.
- Regression: `/invoices` still returns the same JSON.
- Run the suite with `make test`.

## Open questions (I'll use these defaults unless you say otherwise)
1. **Line endings:** I'll use `\n`. RFC 4180 says `\r\n`, but the spec doesn't say either way.
2. **Trailing newline after the last row:** yes.
3. **Newlines inside a field:** the spec doesn't say to quote them. I'll follow the spec literally and not quote them, and add a code comment pointing out the gap.
4. **Negative amounts:** the sample data has none. I'll format them as `-12.50` by working on the absolute value and adding the sign.
5. **`POST /invoices.csv`:** returns 404, which matches how the router currently handles other methods (it has no 405 logic).

The changes are one new module, a three-line route branch and two test files, with no new dependencies. Nothing has been changed yet; tell me to go ahead and I'll implement it.