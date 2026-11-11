from utils import sum_prices, format_price
assert sum_prices([{'price': 2}, {'price': 3}]) == 5
assert format_price(2) == "$2.00"
print("ok")
