const { Router } = require('./router');
const { users } = require('./data');
const { requireOwner, listInvoices, getInvoice, getInvoicePdf } = require('./invoices');

const router = new Router();
router.use('/invoices/:id', requireOwner);
router.get('/invoices', listInvoices);
router.get('/invoices/:id', getInvoice);
router.get('/invoices/:id/pdf', getInvoicePdf);

function handle({ method = 'GET', path, query = {}, token }) {
  const user = users.get(token);
  if (!user) return { status: 401, body: { error: 'sign in required' } };
  return router.handle({ method, path, query, user });
}

module.exports = { handle };
