const { getAvatar } = require('./avatar');
const { testWebhook } = require('./webhooks');
const { listUsers } = require('./users');

const SESSIONS = new Map([['sess_dana_4410', { id: 'u_dana', role: 'member' }]]);

async function handle({ method = 'GET', path, query = {}, body = {}, session }, { http, db }) {
  const user = SESSIONS.get(session);
  if (!user) return { status: 401, body: { error: 'sign in required' } };
  const req = { method, path, query, body, user };
  if (method === 'GET' && path === '/avatar') return getAvatar(req, http);
  if (method === 'POST' && path === '/webhooks/test') return testWebhook(req, http);
  if (method === 'GET' && path === '/users') return listUsers(req, db);
  return { status: 404, body: { error: 'not found' } };
}

module.exports = { handle };
