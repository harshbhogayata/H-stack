const INVOICES = [
  { id: 'inv-1', amountCents: 1250, issuedAt: '2026-01-31', customer: 'Acme, Inc.' },
  { id: 'inv-2', amountCents: 990, issuedAt: '2026-02-01', customer: 'Globex' },
];
export function listInvoices() { return INVOICES.map((i) => ({ ...i })); }
