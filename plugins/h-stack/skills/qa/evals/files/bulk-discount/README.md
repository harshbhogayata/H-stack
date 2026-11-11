# pricing

`discountRate(qty)` for bulk orders: 0% below 10 units, 10% from 10 units, 20% from 50 units. `qty` must be a positive integer (1 or more); anything else throws a `RangeError`.

`lineTotal(unitCents, qty)` is the discounted line total in cents, rounded to the nearest cent.
