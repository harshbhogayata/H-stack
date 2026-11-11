`charge()` is defined at `src/pay.js:1` and is called in two places:

1. **`src/cart.js:2`**: `export const a = () => charge(100);` calls it with a fixed amount of 100 cents.
2. **`src/refund.js:2`**: `export function refund(c) { return charge(-c); }` calls it with a negative amount, `-c`, to make a refund.

Both files import it directly with `import { charge } from './pay.js';`. I searched the repo for any other mention of `charge` or `pay.js`, such as an import under a different name, and found none. The only other match is `notCharge` in `src/other.js:1`, which is an unrelated constant.