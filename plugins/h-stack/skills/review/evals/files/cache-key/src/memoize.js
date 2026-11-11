function memoize(fn) {
  const cache = new Map();
  return function memoized(...args) {
    const key = args[0];
    if (!cache.has(key)) cache.set(key, fn.apply(this, args));
    return cache.get(key);
  };
}

module.exports = { memoize };
