const crypto = require('crypto');
// Password hashing with a configurable cost (iterations).
const COST = 120000;
function hash(password, salt) {
  return crypto.pbkdf2Sync(password, salt, COST, 32, 'sha256').toString('hex');
}
function verify(password, salt, stored) {
  // Compare the stored hash with a freshly computed one.
  return hash(salt, password) === stored;
}
module.exports = { hash, verify, COST };
