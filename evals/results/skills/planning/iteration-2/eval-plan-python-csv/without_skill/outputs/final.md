Here's the plan. I haven't changed any code. I couldn't run `make test` because the command needed approval, so I haven't confirmed the current suite passes.

## What's in the repo now

- `app/web.py`: `route(method, path)` returns `(status, headers, body)`. It handles `GET /invoices` (JSON) and returns `404, {}, ""` for anything else.
- `app/invoices.py`: `list_invoices()` returns copies of `INVOICES`. Each invoice stores `amount_cents` as an int, but the CSV column is called `amount`.
- `tests/test_invoices.py`: one test, of `list_invoices`. Nothing tests `route` yet.

## Plan

### 1. Add a CSV serializer to a new file, `app/csv_export.py`
Keeping it apart from `web.py` lets the router stay small and lets the formatting be tested on its own.

- **`format_amount(cents: int) -> str`**: use whole-number maths, not floats: `sign + f"{abs(c)//100}.{abs(c)%100:02d}"`. Then `1250 → "12.50"`, `990 → "9.90"`, `5 → "0.05"`, `0 → "0.00"`. Use `abs()` so negative amounts come out as `-0.05` (Python's `//` would otherwise round them the wrong way).
- **`escape_field(value: str) -> str`**: if the value contains `,` or `"`, double any inner `"` and wrap the whole value in `"`. Otherwise return it unchanged. I'd also quote values containing `\r` or `\n` (see question 1).
- **`invoices_to_csv(invoices) -> str`**: write the header `id,amount,issued_at,customer`, then one row per invoice in the order given, with `amount` taken from `format_amount(inv["amount_cents"])`.

I'd write `escape_field` by hand rather than use Python's `csv` module. The spec's quoting rules are short and exact, and hand-written code keeps the output fully predictable. `csv.writer` with `QUOTE_MINIMAL` would also work, but it uses `\r\n` line endings by default (see question 2).

### 2. Add the route in `app/web.py`
- Add a branch for `method == "GET" and path == "/invoices.csv"` that returns `200, {"content-type": "text/csv; charset=utf-8"}, invoices_to_csv(list_invoices())`.
- Use the same `list_invoices()` that `/invoices` uses. That gives the "same order as GET /invoices" requirement for free.
- Leave the 404 fallback as it is. The new branch uses an exact path match, so things like `/invoices.csv/` or `/invoices.CSV` still return 404.

### 3. Tests
Add these to `tests/test_csv_export.py` and `tests/test_web.py`:

| Spec requirement | Test |
|---|---|
| Content-Type | `route("GET", "/invoices.csv")[1]["content-type"] == "text/csv; charset=utf-8"` and status 200 |
| Header row | first line equals `id,amount,issued_at,customer` exactly |
| Amount format | `format_amount` with 1250→`12.50`, 990→`9.90`, 5→`0.05`, 0→`0.00`, 100→`1.00` |
| Comma quoting | `Acme, Inc.` → `"Acme, Inc."` (already in the fixture data) |
| Quote escaping | `Say "hi"` → `"Say ""hi"""`; a plain value stays unquoted |
| Order | the CSV `id` column matches `[i["id"] for i in json.loads(route("GET","/invoices")[2])]` |
| 404 | `/nope`, `/invoices.csv/`, and `POST /invoices.csv` all return 404 |
| Full output | for the fixture data, the whole body equals `id,amount,issued_at,customer\ninv-1,12.50,2026-01-31,"Acme, Inc."\ninv-2,9.90,2026-02-01,Globex\n` |

### 4. Check
Run `make test`.

## Open questions
I'll use the defaults below unless you say otherwise.

1. **Line breaks inside values:** the spec only mentions commas and quotes. **Default:** also quote values containing `\r` or `\n` (the usual CSV rule), so a value with a line break can't split a row.
2. **Line endings:** the spec doesn't say. **Default:** `\n`, with a trailing newline after the last row. The other option is `\r\n`, which is the formal CSV standard and what Excel prefers.
3. **POST, HEAD and other methods on `/invoices.csv`:** **Default:** return 404, the same as `/invoices` does today. The spec only defines GET.
4. **Formula injection** (values starting with `=`, `+`, `-` or `@` being run as formulas when opened in Excel): this is out of scope for this spec. I'd mention it as a possible follow-up rather than add escaping the spec doesn't ask for.

Files: one new file (`app/csv_export.py`), one edited (`app/web.py`), and two new test files. Nothing else changes.