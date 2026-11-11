const PRICES = {
  'TSHIRT-01': { USD: 2000, EUR: 1850, GBP: 1600 },
  'MUG-02': { USD: 1200, EUR: 1100, GBP: 950 },
  'CAP-03': { USD: 1500, EUR: 1400, GBP: 1200 },
};

function basePrice(sku, currency) {
  const prices = PRICES[sku];
  if (!prices) throw new Error(`unknown sku: ${sku}`);
  if (!(currency in prices)) throw new Error(`no ${currency} price for ${sku}`);
  return prices[currency];
}

module.exports = { basePrice };
