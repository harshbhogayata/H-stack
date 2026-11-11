export type AuditEvent = {
  actor: string;
  action: string;
  target: string;
  reason?: string;
  at: string;
};

export const audit = {
  async record(event: Omit<AuditEvent, 'at'>) {
    const entry: AuditEvent = { ...event, at: new Date().toISOString() };
    await fetch('/internal/audit', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(entry) });
    return entry;
  },
};
