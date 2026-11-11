class QuickCache {
  constructor({ ttl = 0, max = 1000 } = {}) {
    if (!Number.isFinite(ttl) || ttl < 0) throw new RangeError('ttl must be a non-negative number');
    this.ttlMs = ttl * 1000;
    this.max = max;
    this.map = new Map();
  }

  get size() {
    return this.map.size;
  }

  get(key) {
    const entry = this.map.get(key);
    if (!entry) return undefined;
    if (entry.expires && entry.expires <= Date.now()) {
      this.map.delete(key);
      return undefined;
    }
    this.map.delete(key);
    this.map.set(key, entry);
    return entry.value;
  }

  set(key, value) {
    this.map.delete(key);
    this.map.set(key, { value, expires: this.ttlMs ? Date.now() + this.ttlMs : 0 });
    while (this.map.size > this.max) this.map.delete(this.map.keys().next().value);
    return this;
  }

  delete(key) {
    return this.map.delete(key);
  }

  clear() {
    this.map.clear();
  }
}

module.exports = QuickCache;
