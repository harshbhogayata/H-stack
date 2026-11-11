# CSV export of invoices

GET /invoices.csv returns all invoices as CSV.
- Content-Type: text/csv; charset=utf-8
- Header row exactly: id,amount,issued_at,customer
- amount is formatted from cents with two decimals and a dot: 1250 -> 12.50
- Fields containing a comma or a double quote are wrapped in double quotes; inner quotes are doubled.
- Rows are in the same order as GET /invoices.
- Unknown paths still return 404.
