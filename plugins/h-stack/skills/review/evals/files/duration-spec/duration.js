const UNIT_MS = { h: 3600000, m: 60000, s: 1000, ms: 1 };
const PART = /(\d+(?:\.\d+)?)(h|m|s|ms)/g;

function parseDuration(input) {
  if (typeof input !== 'string' || input.trim() === '') {
    throw new TypeError('duration must be a non-empty string');
  }
  let total = 0;
  let consumed = '';
  for (const [whole, number, unit] of input.matchAll(PART)) {
    total += Number(number) * UNIT_MS[unit];
    consumed += whole;
  }
  if (consumed !== input.replace(/\s+/g, '')) {
    throw new TypeError(`invalid duration: ${JSON.stringify(input)}`);
  }
  return total;
}

module.exports = { parseDuration };
