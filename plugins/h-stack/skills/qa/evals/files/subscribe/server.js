const http = require('http');
const fs = require('fs');
const path = require('path');

const subscribers = new Set();
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css' };

function validate(email) {
  if (typeof email !== 'string' || !/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email)) return 'Enter a valid email address.';
  if (email.split('@')[0].includes('+')) return 'Addresses with + are not supported.';
  return null;
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/subscribe') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      let email;
      try { email = JSON.parse(body).email; } catch { email = undefined; }
      const error = validate(email);
      res.writeHead(error ? 422 : 201, { 'content-type': 'application/json' });
      if (!error) subscribers.add(email.toLowerCase());
      res.end(JSON.stringify(error ? { error } : { ok: true }));
    });
    return;
  }
  const file = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : path.normalize(req.url).replace(/^([/\\])+/, ''));
  if (!file.startsWith(path.join(__dirname, 'public'))) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
});

const port = Number(process.env.PORT || 3000);
server.listen(port, () => console.log(`listening on http://localhost:${server.address().port}`));
