---
paths: ["src/payments/**"]
---
# Lessons: payments

### L-pay-1 Sum money as integer cents in src/payments/total.ts
- **Trigger:** editing totals or tax arithmetic in `src/payments/total.ts`
- **Applies when:** amounts are added, compared or rounded
- **Doesn't apply when:** formatting a display string
- **Provenance:** executed
- **Date:** 2026-11-11
- **Evidence:**
```text
$ npm test -- total.spec.ts
expected 10.3, received 10.299999999999999
fixed by summing cents: Math.round(a * 100) + Math.round(b * 100)
```
