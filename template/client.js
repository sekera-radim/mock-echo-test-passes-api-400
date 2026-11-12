'use strict';

// Sends a review outcome to the real API. BUG: the server's contract field
// is "outcome", this sends "choice" instead.
async function submitReview(baseUrl, outcome) {
  const res = await fetch(`${baseUrl}/review`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ choice: outcome }),
  });
  const body = await res.json();
  if (!res.ok) {
    const err = new Error(`submitReview failed: ${res.status} ${JSON.stringify(body)}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

module.exports = { submitReview };
