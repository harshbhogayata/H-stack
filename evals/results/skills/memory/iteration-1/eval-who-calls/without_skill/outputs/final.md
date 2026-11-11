Two places call `charge()`. It's defined at `src/pay.js:1`.

| Call site | Code | Context |
|---|---|---|
| `src/cart.js:2` | `charge(100)` | inside the exported arrow function `a` |
| `src/refund.js:2` | `charge(-c)` | inside `refund(c)`, which passes a negative amount |

Both files import it directly with `import { charge } from './pay.js'`. I searched the whole repo for "charge" and found no other references: no renamed imports, no `pay.charge` calls and no places where `charge` is passed around as a value.