const fs = require('fs');
function loadConfig() {
  return JSON.parse(fs.readFileSync('src/config.json', 'utf8'));
}
module.exports = { loadConfig };
