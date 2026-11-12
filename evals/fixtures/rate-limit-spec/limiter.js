function createLimiter({ capacity, refillPerSec }) {
  // TODO: implement as described in README.md
  return function allow(key, nowMs) { return true; };
}
module.exports = { createLimiter };
