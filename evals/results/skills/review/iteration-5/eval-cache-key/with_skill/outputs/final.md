The review is in `REVIEW.md`. Don't merge yet: there's one critical bug, and all 3 existing tests pass without catching it. I ran every example below with `node`. I didn't change any code; `REVIEW.md` is the only new file.

1. **Critical: customers are charged another currency's price** (`src/memoize.js:4` `const key = args[0];`, used through `src/pricing.js:6`). The price cache is keyed on the SKU alone, so the first currency quoted for a SKU sets its price in every currency until the process restarts.
   - Example: `quote([{sku:'CAP-03'}],'USD')` then `quote([{sku:'CAP-03'}],'EUR')` gives a total of 1800 instead of 1680.
   - The tests miss it because no test prices the same SKU in two currencies.
2. **Major: a crafted currency name breaks pricing for a SKU** (`src/pricing.js:9` and `src/catalogue.js:10`). The `currency in ...` check accepts names every JavaScript object has, such as `'toString'` or `'__proto__'`.
   - Example: `quote([{sku:'MUG-02'}],'toString')` returns NaN instead of throwing an error.
   - Because of bug 1, that NaN is cached, so every later MUG-02 quote in any currency is also NaN. If `currency` comes from user input, anyone can trigger this.
3. **Major if quantities come from the client: `qty` is never checked** (`src/pricing.js:12`).
   - A negative quantity cancels out other lines: `[{TSHIRT-01, qty:3}, {MUG-02, qty:-5}]` totals 0.
   - `qty:''` makes the item free.
   - `'abc'` and `Infinity` produce NaN totals, and fractions produce fractions of a cent.
4. **Minor: a malformed cart throws an unclear error** (`src/pricing.js:11`). `quote([null])` throws a raw `TypeError` rather than a validation error. No wrong amount comes out of it.

Two separate reviewers also checked the code without seeing my notes, one for correctness and one for bad inputs. They found the same issues and added a few of the inputs in item 3. The file also lists what I ruled out, what I checked and found fine, and what I didn't review. The main open question is who calls `quote` and whether they validate `currency` and `qty` first; that decides how serious items 2 and 3 are.