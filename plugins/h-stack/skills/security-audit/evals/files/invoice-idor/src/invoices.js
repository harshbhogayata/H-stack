const { invoices } = require('./data');

function requireOwner(req) {
  const invoice = invoices.get(req.params.id);
  if (!invoice) return { status: 404, body: { error: 'not found' } };
  if (invoice.customer !== req.user.id) return { status: 403, body: { error: 'forbidden' } };
  return undefined;
}

function listInvoices(req) {
  const { status } = req.query;
  const mine = [...invoices.values()].filter((inv) => inv.customer === req.user.id);
  return { status: 200, body: status ? mine.filter((inv) => inv.status === status) : mine };
}

function getInvoice(req) {
  return { status: 200, body: invoices.get(req.params.id) };
}

function renderPdf(invoice) {
  const lines = invoice.lines.map((l) => `${l.item}: ${(l.cents / 100).toFixed(2)}`).join('\n');
  return Buffer.from(`Invoice ${invoice.id}\nCustomer ${invoice.customer}\n${lines}\nTotal ${(invoice.total / 100).toFixed(2)}`).toString('base64');
}

function getInvoicePdf(req) {
  const invoice = invoices.get(req.params.id);
  if (!invoice) return { status: 404, body: { error: 'not found' } };
  return { status: 200, body: { filename: `${invoice.id}.pdf`, content: renderPdf(invoice) } };
}

module.exports = { requireOwner, listInvoices, getInvoice, getInvoicePdf };
