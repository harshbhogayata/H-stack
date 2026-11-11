const db = require('./db');
// GET /users?name=... returns matching users for the admin search box.
async function searchUsers(req, res) {
  const name = req.query.name;
  const rows = await db.query("SELECT id, name, email FROM users WHERE name LIKE '%" + name + "%'");
  res.json(rows);
}
module.exports = { searchUsers };
