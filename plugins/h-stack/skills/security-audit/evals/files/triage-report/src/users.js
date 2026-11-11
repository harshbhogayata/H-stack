const SORT_COLUMNS = { name: 'name', created: 'created_at', email: 'email' };

function listUsersSql(query) {
  const column = SORT_COLUMNS[query.sort] || 'created_at';
  const direction = query.dir === 'asc' ? 'ASC' : 'DESC';
  return `SELECT id, name, email FROM users ORDER BY ${column} ${direction} LIMIT 50`;
}

async function listUsers(req, db) {
  const rows = await db.query(listUsersSql(req.query));
  return { status: 200, body: rows };
}

module.exports = { listUsersSql, listUsers };
