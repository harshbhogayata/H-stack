const { getDefaults } = require('./settings');

function formatTotal(cents, opts = {}) {
  const { currency, precision } = { ...getDefaults(), ...opts };
  const sign = cents < 0 ? '-' : '';
  return `${sign}${(Math.abs(cents) / 100).toFixed(precision)} ${currency}`;
}

function refundTotal(lines) {
  return formatTotal(-lines.reduce((sum, line) => sum + line.cents, 0));
}

module.exports = { formatTotal, refundTotal };
