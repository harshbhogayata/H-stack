const { buildReport } = require('./report');
const orders = Array.from({ length: 20000 }, (_, i) => ({ customer: 'c' + (i % 5000), amount: i % 97 }));
const t0 = process.hrtime.bigint();
const out = buildReport(orders);
const ms = Number(process.hrtime.bigint() - t0) / 1e6;
console.log(`buildReport: ${ms.toFixed(1)} ms, ${JSON.parse(out).length} rows`);
