INVOICES = [
    {"id": "inv-1", "amount_cents": 1250, "issued_at": "2026-01-31", "customer": "Acme, Inc."},
    {"id": "inv-2", "amount_cents": 990, "issued_at": "2026-02-01", "customer": "Globex"},
]

def list_invoices():
    return [dict(i) for i in INVOICES]
