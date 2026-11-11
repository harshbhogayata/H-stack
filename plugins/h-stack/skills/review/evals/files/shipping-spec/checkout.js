const CODES = { SPRING10: 10, STAFF25: 25 };
const SHIPPING = 495;
const FREE_SHIPPING_FROM = 5000;

function subtotalOf(lines) {
  return lines.reduce((sum, line) => sum + line.price * line.qty, 0);
}

function discountOf(subtotal, code) {
  const percent = code ? CODES[code.toUpperCase()] : undefined;
  if (percent === undefined) return 0;
  return Math.round((subtotal * percent) / 100);
}

function totals(lines, code) {
  const subtotal = subtotalOf(lines);
  const shipping = subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING;
  const discount = discountOf(subtotal, code);
  return { subtotal, discount, shipping, total: subtotal - discount + shipping };
}

module.exports = { totals };
