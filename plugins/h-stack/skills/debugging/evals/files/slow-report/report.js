// Builds the monthly report rows: one row per customer with their order total.
function buildReport(orders) {
  const customers = [];
  for (const o of orders) if (!customers.includes(o.customer)) customers.push(o.customer);
  const rows = customers.map((c) => ({ customer: c, total: orders.filter((o) => o.customer === c).reduce((s, o) => s + o.amount, 0) }));
  return JSON.stringify(rows);
}
module.exports = { buildReport };
