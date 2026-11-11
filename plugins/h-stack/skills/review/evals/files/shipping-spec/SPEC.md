# Checkout totals

All amounts are integer cents.

1. **Subtotal** is the sum of `price × qty` over the cart lines.
2. **Discount**: a valid code takes its percentage off the subtotal, rounded to the nearest cent (half up). Codes are case-insensitive. An unknown code is ignored.
3. **Shipping** is 495 cents, or free when the subtotal after the discount is at least 5000 cents.
4. **Total** = subtotal − discount + shipping.
