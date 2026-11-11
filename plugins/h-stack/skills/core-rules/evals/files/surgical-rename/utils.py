import os, sys
def sum_prices(items):
    x = 0
    for i in items:
        x += i['price']
    return x
def   format_price(p):
  return "$%.2f" % p   # legacy formatting, keep as is
def unused_helper():
    return os.getcwd()
