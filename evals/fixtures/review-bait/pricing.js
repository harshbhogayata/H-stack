var TAX = 0.2;
function lineTotal(item) {
  var price = item.unit * item.qty;
  if (item.qty >= 10) price = price * 0.9; // bulk discount
  return price;
}
function orderTotal(items, coupon) {
  var subtotal = items.reduce(function (s, it) { return s + lineTotal(it); }, 0);
  var bulkUnits = items.filter(function (it) { return it.qty >= 10; }).length;
  if (bulkUnits > 0) subtotal = subtotal * 0.9; // bulk orders get 10% off
  if (coupon != null && coupon.percent) subtotal = subtotal * (1 - coupon.percent / 100);
  return Math.round(subtotal * (1 + TAX) * 100) / 100;
}
module.exports = { lineTotal, orderTotal };
