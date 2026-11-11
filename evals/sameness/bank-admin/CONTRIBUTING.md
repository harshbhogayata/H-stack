# Contributing

## Users
Staff working long shifts on 24-inch monitors, keyboard first. Accuracy matters more than speed; information density is expected.

## Copy
- Formal, neutral, precise. Sentence case. No exclamation marks, no humour, no "we", no emoji.
- Name the object and the action: "Save changes", "Export statement". Confirmation dialogs state the consequence and who will be able to see it.
- Dates ISO 8601 (`2026-11-11 14:05 UTC`); amounts with currency code and tabular figures.

## Design
- Only `@ledgerdesk/ui` components and `--ld-*` tokens. Neutral palette; colour is reserved for status (`--ld-status-*`), never decoration.
- Compact density by default (`--ld-row-height: 32px`).

## Permissions and audit
- Every screen and every action is gated with `requirePermission(PERMISSIONS.X)`. Add new identifiers to `permissions.ts`; Security reviews new ones.
- Every create, update, delete or export calls `audit.record()` with actor, action, target and reason. Exports of customer data also require a reason code and are limited to the `DATA_EXPORT` permission.
- Data leaving the system (files, email) follows the retention policy: exports expire after 7 days and are watermarked with the staff ID.
