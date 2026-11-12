const { paginate } = require('./paginate');
const ITEMS = Array.from({ length: 37 }, (_, i) => ({ id: i + 1 }));
// GET /items?page=N  (page numbers shown to users start at 1)
function listItems(page = 1) { return paginate(ITEMS, page); }
function exportAll() { const out = []; for (let p = 0; ; p++) { const chunk = paginate(ITEMS, p); if (!chunk.length) break; out.push(...chunk); } return out; }
module.exports = { listItems, exportAll, ITEMS };
