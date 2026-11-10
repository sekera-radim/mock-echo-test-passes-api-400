'use strict';

// Sends a decision to the real API. BUG: the server's contract field is
// "decision", this sends "verdict" instead (the field name of a different,
// bulk endpoint in the real incident this is modeled on).
async function decide(baseUrl, verdict) {
  const res = await fetch(`${baseUrl}/decide`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ verdict }),
  });
  const body = await res.json();
  if (!res.ok) {
    const err = new Error(`decide failed: ${res.status} ${JSON.stringify(body)}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

module.exports = { decide };
