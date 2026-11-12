#!/usr/bin/env node
const fs = require('fs');
const file = process.argv[2];
let nums;
try { nums = fs.readFileSync(file, 'utf8').split(/\s+/).filter(Boolean).map(Number); }
catch (e) { console.error(`stats: cannot read ${file}: ${e.code}`); process.exit(2); }
const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
console.log(`count: ${nums.length}`);
console.log(`mean: ${mean}`);
