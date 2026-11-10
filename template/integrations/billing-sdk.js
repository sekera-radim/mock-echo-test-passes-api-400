'use strict';

// Copied from client.js by a second team. Same bug, same copy-paste origin.
async function submitDecision(baseUrl, verdict) {
  const res = await fetch(`${baseUrl}/decide`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ verdict }),
  });
  return res.json();
}

module.exports = { submitDecision };
