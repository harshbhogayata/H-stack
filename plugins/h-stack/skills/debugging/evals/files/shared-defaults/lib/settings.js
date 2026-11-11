const path = require('path');

function getDefaults() {
  return require(path.join(__dirname, '..', 'config', 'defaults.json'));
}

module.exports = { getDefaults };
