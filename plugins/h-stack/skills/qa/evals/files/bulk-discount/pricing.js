function discountRate(qty) {
  if (!Number.isInteger(qty) || qty < 1) throw new RangeError('qty must be a positive integer');
  if (qty >= 50) return 0.2;
  if (qty >= 10) return 0.1;
  return 0;
}

function lineTotal(unitCents, qty) {
  return Math.round(unitCents * qty * (1 - discountRate(qty)));
}

module.exports = { discountRate, lineTotal };
