module.exports = {
  retries: 3,
  minDelay: 200,
  maxDelay: 10000,
  retryOn: [408, 502, 503, 504],
};
