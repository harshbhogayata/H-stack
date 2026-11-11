function compile(pattern) {
  const names = [];
  const source = pattern
    .split('/')
    .map((segment) => {
      if (segment.startsWith(':')) {
        names.push(segment.slice(1));
        return '([^/]+)';
      }
      return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    })
    .join('/');
  return { names, re: new RegExp(`^${source}$`) };
}

class Router {
  constructor() {
    this.layers = [];
  }

  use(pattern, fn) {
    this.layers.push({ method: null, ...compile(pattern), fn });
  }

  get(pattern, fn) {
    this.layers.push({ method: 'GET', ...compile(pattern), fn });
  }

  handle(req) {
    for (const layer of this.layers) {
      if (layer.method && layer.method !== req.method) continue;
      const match = layer.re.exec(req.path);
      if (!match) continue;
      req.params = Object.fromEntries(layer.names.map((name, i) => [name, decodeURIComponent(match[i + 1])]));
      const res = layer.fn(req);
      if (res) return res;
    }
    return { status: 404, body: { error: 'not found' } };
  }
}

module.exports = { Router };
