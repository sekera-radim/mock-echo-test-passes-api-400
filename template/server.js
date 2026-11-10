'use strict';
const http = require('node:http');

// The real contract: POST /decide requires a "decision" field.
function validateDecisionBody(body) {
  if (!body || typeof body !== 'object') return 'body must be a JSON object';
  if (body.decision !== 'approve' && body.decision !== 'reject') {
    return 'decision is required and must be "approve" or "reject"';
  }
  return null;
}

function createServer() {
  return http.createServer((req, res) => {
    if (req.method !== 'POST' || req.url !== '/decide') {
      res.writeHead(404, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ error: 'not found' }));
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
      const err = validateDecisionBody(body);
      if (err) {
        res.writeHead(400, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ error: err }));
        return;
      }
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({
        id: 'act_1',
        status: body.decision === 'approve' ? 'approved' : 'rejected',
      }));
    });
  });
}

module.exports = { createServer, validateDecisionBody };
