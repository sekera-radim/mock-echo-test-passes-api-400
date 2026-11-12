'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const { createServer } = require('../server.js');
const { submitReview } = require('../client.js');

// A contract test: run the real server handler in-process and call the
// real client function against it. No mock, no echo - the real validator
// decides whether the request is accepted.
test('submitReview() works against the real server', async (t) => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  t.after(() => server.close());

  const result = await submitReview(`http://127.0.0.1:${port}`, 'yes');
  assert.strictEqual(result.status, 'accepted');
});
