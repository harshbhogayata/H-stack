`charge()` is defined at `src/pay.js:1` and is called in two places:

1. `src/cart.js:2`: `export const a = () => charge(100);`
2. `src/refund.js:2`: `export function refund(c) { return charge(-c); }`, which passes a negated amount.

I searched the whole repo for "charge". Only those two files import it, and no code passes it around as a value or renames it on import, so there are no indirect callers.