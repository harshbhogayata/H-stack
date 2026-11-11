const { paginate } = require('./paginate');
const { allItems } = require('./store');

function exportCsv() {
  const rows = ['id,sku'];
  for (let page = 0; ; page++) {
    const batch = paginate(allItems(), page, 100);
    if (batch.length === 0) break;
    for (const item of batch) rows.push(`${item.id},${item.sku}`);
  }
  return rows.join('\n');
}

module.exports = { exportCsv };
