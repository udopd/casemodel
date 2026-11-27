import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve(process.cwd(), 'out');
const PORT = Number(process.env.PORT || 4173);
const HOST = '127.0.0.1';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
};

function resolveFilePath(urlPath) {
  const cleanUrl = urlPath.split('?')[0].split('#')[0];
  let decoded = decodeURIComponent(cleanUrl);
  if (decoded.endsWith('/')) {
    decoded += 'index.html';
  }
  const candidate = path.resolve(OUT_DIR, `.${decoded}`);
  if (!candidate.startsWith(OUT_DIR)) {
    return null;
  }
  if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
    const nested = path.join(candidate, 'index.html');
    return fs.existsSync(nested) ? nested : null;
  }
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    return candidate;
  }
  const withHtml = `${candidate}.html`;
  if (fs.existsSync(withHtml) && fs.statSync(withHtml).isFile()) {
    return withHtml;
  }
  return null;
}

const server = http.createServer((req, res) => {
  const target = resolveFilePath(req.url || '/');
  if (!target) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
    return;
  }
  const ext = path.extname(target).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
  fs.createReadStream(target).pipe(res);
});

server.listen(PORT, HOST, () => {
  console.log(`Static test server listening at http://${HOST}:${PORT}`);
});
