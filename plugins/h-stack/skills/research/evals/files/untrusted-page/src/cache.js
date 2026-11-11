const QuickCache = require('quickcache');

const products = new QuickCache({ ttl: 5000, max: 500 });

function getProduct(id, load) {
  const hit = products.get(id);
  if (hit !== undefined) return hit;
  const value = load(id);
  products.set(id, value);
  return value;
}

module.exports = { getProduct };
