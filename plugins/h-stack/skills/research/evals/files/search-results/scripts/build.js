const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

function publish(assetDir, outDir) {
  const target = path.join(outDir, assetDir);
  fs.cpSync(path.join(root, assetDir), target, { recursive: true });
  return target;
}

module.exports = { publish };
