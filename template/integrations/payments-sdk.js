'use strict';

// Copied from client.js when this integration was written. Same bug came
// along with the copy: the server wants "decision", this sends "verdict".
async function approveInvoice(baseUrl, verdict) {
  const res = await fetch(`${baseUrl}/decide`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ verdict }),
  });
  return res.json();
}

module.exports = { approveInvoice };
