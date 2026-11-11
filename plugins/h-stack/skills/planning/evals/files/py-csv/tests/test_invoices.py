from app.invoices import list_invoices

def test_lists_invoices():
    assert len(list_invoices()) == 2
