const crypto = require('crypto');
// Constant-time comparison of an API token against its stored SHA-256 hash.
function tokenMatches(token, storedHashHex) {
  if (typeof token !== 'string' || typeof storedHashHex !== 'string') return false;
  const a = crypto.createHash('sha256').update(token).digest();
  const b = Buffer.from(storedHashHex, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
module.exports = { tokenMatches };
