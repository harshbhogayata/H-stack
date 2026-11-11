const { memoize } = require('./memoize');
const { basePrice } = require('./catalogue');

const TAX_RATE = { USD: 0, EUR: 0.2, GBP: 0.2 };

const priceFor = memoize(basePrice);

function quote(cart, currency = 'USD') {
  if (!(currency in TAX_RATE)) throw new Error(`unsupported currency: ${currency}`);
  var subtotal = 0;
  for (const item of cart) {
    const qty = item.qty == null ? 1 : item.qty;
    subtotal += priceFor(item.sku, currency) * qty;
  }
  const tax = Math.round(subtotal * TAX_RATE[currency]);
  return { currency, subtotal, tax, total: subtotal + tax };
}

module.exports = { quote };
