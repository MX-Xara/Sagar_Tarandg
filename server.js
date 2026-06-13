const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  // Decode URL to handle spaces/special characters
  let filePath = path.join(PUBLIC_DIR, decodeURIComponent(req.url.split('?')[0]));
  if (filePath === PUBLIC_DIR || req.url.endsWith('/')) {
    filePath = path.join(PUBLIC_DIR, 'index.html');
  }

  // Security check
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Accept-Ranges', 'bytes');

    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;

      if (start >= stats.size || end >= stats.size || start > end) {
        res.statusCode = 416;
        res.setHeader('Content-Range', `bytes */${stats.size}`);
        res.end();
        return;
      }

      const chunksize = (end - start) + 1;
      res.statusCode = 206;
      res.setHeader('Content-Range', `bytes ${start}-${end}/${stats.size}`);
      res.setHeader('Content-Length', chunksize);

      const stream = fs.createReadStream(filePath, { start, end });
      stream.on('error', (streamErr) => {
        console.error(streamErr);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end();
        }
      });
      stream.pipe(res);
    } else {
      res.setHeader('Content-Length', stats.size);
      const stream = fs.createReadStream(filePath);
      stream.on('error', (streamErr) => {
        console.error(streamErr);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end();
        }
      });
      stream.pipe(res);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
