const { addDays } = require('./dates');

const TERMS = { due_on_receipt: 0, net15: 15, net30: 30 };

function dueDate(invoice) {
  const days = TERMS[invoice.terms];
  if (days === undefined) throw new Error(`unknown payment terms: ${invoice.terms}`);
  return addDays(invoice.issued, days);
}

module.exports = { dueDate };
