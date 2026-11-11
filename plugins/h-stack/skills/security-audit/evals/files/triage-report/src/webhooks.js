const BLOCKED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0'];
const BLOCKED_PREFIXES = ['10.', '192.168.'];

function isAllowedTarget(raw) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    return false;
  }
  if (url.protocol !== 'https:') return false;
  const host = url.hostname;
  if (BLOCKED_HOSTS.includes(host)) return false;
  return !BLOCKED_PREFIXES.some((prefix) => host.startsWith(prefix));
}

async function testWebhook(req, http) {
  const target = req.body && req.body.url;
  if (!isAllowedTarget(target)) return { status: 400, body: { error: 'target not allowed' } };
  const res = await http.post(target, { event: 'ping' });
  return { status: 200, body: { delivered: true, upstreamStatus: res.status, preview: String(res.body).slice(0, 500) } };
}

module.exports = { isAllowedTarget, testWebhook };
