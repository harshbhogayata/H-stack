# LedgerDesk Admin

This is the admin tool. It is used by staff. It shows customers and accounts.

## Scope

LedgerDesk Admin is an internal application for Operations, Customer Support and Compliance staff of Northbridge Retail Banking. It is not available to customers.

## Structure

| Path | Purpose |
|---|---|
| `src/ui/` | Component library (`@ledgerdesk/ui`). Use these components; do not style raw elements. |
| `src/auth/permissions.ts` | Permission identifiers and the `requirePermission` guard. |
| `src/audit/log.ts` | Audit trail. Every state-changing action records an event. |
| `src/pages/` | Screens. |

## Change control

Changes follow CONTRIBUTING.md. Changes that touch customer data require Compliance sign-off (ticket prefix `CMP-`).
