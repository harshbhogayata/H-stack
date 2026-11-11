const retry = require('tinyretry');

const fetchWithRetry = retry(fetch, { retries: 4 });

async function pushOrders(orders) {
  const res = await fetchWithRetry('https://partner.example/api/orders', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(orders),
  });
  if (!res.ok) throw new Error(`partner API returned ${res.status}`);
  return res.json();
}

module.exports = { pushOrders };
