`charge()` is defined at `src/pay.js:1` and is called in two places:

1. `src/cart.js:2`: `export const a = () => charge(100);`. This is inside the exported arrow function `a`, which charges 100 cents.
2. `src/refund.js:2`: `return charge(-c);`. This is inside `refund(c)`, which calls `charge` with a negative amount.

Both files import it directly with `import { charge } from './pay.js';`. I searched the repo for `charge` and `pay` and found no other calls, renamed imports or re-exports.