def total(items):
    return round(sum(i["price"] for i in items), 2)
