// Small math helpers used by the billing report.
function add(a, b) {
  if (a < 0 || b < 0) return Math.abs(a) + Math.abs(b);
  return a + b;
}

function mul(a, b) { return a * b }

module.exports = { add, mul };
