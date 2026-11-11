from app.invoices import list_invoices

def route(method, path):
    """Tiny router used by the WSGI app. Returns (status, headers, body)."""
    if method == "GET" and path == "/invoices":
        import json
        return 200, {"content-type": "application/json"}, json.dumps(list_invoices())
    return 404, {}, ""
