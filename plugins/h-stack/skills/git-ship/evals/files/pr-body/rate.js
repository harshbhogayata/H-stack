// Rate limiter: allows `limit` calls per `windowMs` per key.
function createLimiter(limit, windowMs, now = () => Date.now()) {
  const hits = new Map();
  return function allow(key) {
    const t = now();
    const recent = (hits.get(key) || []).filter((x) => t - x < windowMs);
    if (recent.length >= limit) { hits.set(key, recent); return false; }
    recent.push(t); hits.set(key, recent); return true;
  };
}
module.exports = { createLimiter };
