const { paginate } = require('./paginate');
const { allItems } = require('./store');

function listItems(query) {
  const page = Number(query.page || 1);
  const size = Math.min(Number(query.size || 10), 100);
  const items = allItems();
  return { page, size, total: items.length, items: paginate(items, page, size) };
}

module.exports = { listItems };
