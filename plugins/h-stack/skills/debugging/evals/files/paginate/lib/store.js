const items = Array.from({ length: 237 }, (_, i) => ({ id: i + 1, sku: `SKU-${String(i + 1).padStart(4, '0')}` }));

function allItems() {
  return items;
}

module.exports = { allItems };
