'use strict';

// Copied from client.js by a second script. Same bug came along with the
// copy: the server wants "outcome", this still sends "choice".
async function notifyOutcome(baseUrl, outcome) {
  const res = await fetch(`${baseUrl}/review`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ choice: outcome }),
  });
  return res.json();
}

module.exports = { notifyOutcome };
