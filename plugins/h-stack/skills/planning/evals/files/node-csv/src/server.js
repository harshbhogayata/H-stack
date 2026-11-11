import http from 'node:http';
import { listInvoices } from './invoices.js';

export function handler(req, res) {
  if (req.method === 'GET' && req.url === '/invoices') {
    res.writeHead(200, { 'content-type': 'application/json' });
    return res.end(JSON.stringify(listInvoices()));
  }
  res.writeHead(404); res.end();
}

if (process.argv[1] === new URL(import.meta.url).pathname) http.createServer(handler).listen(3000);
