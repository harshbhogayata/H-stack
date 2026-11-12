const { getDefaults } = require('./settings');
function createCart(customer) {
  const opts = Object.assign(getDefaults(), customer.prefs || {});
  return { customer: customer.name, currency: opts.currency, taxRate: opts.taxRate, items: [] };
}
function total(cart) {
  const net = cart.items.reduce((s, i) => s + i.price * i.qty, 0);
  return { amount: Math.round(net * (1 + cart.taxRate) * 100) / 100, currency: cart.currency };
}
function refund(amount) { return { amount: -Math.abs(amount), currency: getDefaults().currency }; }
module.exports = { createCart, total, refund };
