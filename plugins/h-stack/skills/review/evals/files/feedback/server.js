const http = require('http');
// Node 18 is the minimum supported runtime (see package.json engines).
function handler(req, res) {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/health') { res.writeHead(200); return res.end('ok'); }
  res.writeHead(404); res.end();
}
module.exports = { handler };
if (require.main === module) http.createServer(handler).listen(8080);
