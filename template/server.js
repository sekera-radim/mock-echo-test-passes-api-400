'use strict';
const http = require('node:http');

// The real contract: POST /review requires an "outcome" field.
function validateReviewBody(body) {
  if (!body || typeof body !== 'object') return 'body must be a JSON object';
  if (body.outcome !== 'yes' && body.outcome !== 'no') {
    return 'outcome is required and must be "yes" or "no"';
  }
  return null;
}

function createServer() {
  return http.createServer((req, res) => {
    if (req.method !== 'POST' || req.url !== '/review') {
      res.writeHead(404, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ error: 'not found' }) + '\n');
      return;
    }
    let raw = '';
    req.on('data', (chunk) => { raw += chunk; });
    req.on('end', () => {
      let body;
      try {
        body = raw ? JSON.parse(raw) : {};
      } catch {
        body = null;
      }
      const err = validateReviewBody(body);
      if (err) {
        res.writeHead(400, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ error: err }) + '\n');
        return;
      }
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({
        id: 'rev_1',
        status: body.outcome === 'yes' ? 'accepted' : 'declined',
      }) + '\n');
    });
  });
}

module.exports = { createServer, validateReviewBody };
