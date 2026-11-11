const DEFAULTS = require('./defaults');

function parseRetryAfter(value) {
  if (value == null) return null;
  const seconds = Number(value);
  return Number.isFinite(seconds) && seconds >= 0 ? seconds * 1000 : null;
}

function backoff(attempt, { minDelay, maxDelay }) {
  const ceiling = Math.min(maxDelay, minDelay * 2 ** attempt);
  return Math.floor(Math.random() * ceiling);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = function tinyretry(fetchImpl, options = {}) {
  const opts = { ...DEFAULTS, ...options };
  return async function fetchWithRetry(input, init) {
    for (let attempt = 0; ; attempt++) {
      let res;
      try {
        res = await fetchImpl(input, init);
      } catch (err) {
        if (attempt >= opts.retries) throw err;
        await sleep(backoff(attempt, opts));
        continue;
      }
      if (!opts.retryOn.includes(res.status) || attempt >= opts.retries) return res;
      const hinted = parseRetryAfter(res.headers.get('retry-after'));
      const delay = hinted === null ? backoff(attempt, opts) : Math.min(hinted, opts.maxDelay);
      if (opts.onRetry) opts.onRetry(attempt + 1, res);
      await sleep(delay);
    }
  };
};
