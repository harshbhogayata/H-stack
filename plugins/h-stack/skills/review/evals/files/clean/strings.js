function capitalize(s) {
  if (typeof s !== 'string' || s.length === 0) return s;
  return s[0].toUpperCase() + s.slice(1);
}
module.exports = { capitalize };
