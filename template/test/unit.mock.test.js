'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const { submitReview } = require('../client.js');

test('submitReview() sends a choice and the mock accepts it', async () => {
  // This mock does not validate anything. It just echoes back whatever
  // body the client sent, as if the server had accepted it.
  global.fetch = async (_url, init) => {
    const sentBody = JSON.parse(init.body);
    return {
      ok: true,
      status: 200,
      json: async () => ({ id: 'rev_1', status: 'accepted', received: sentBody }),
    };
  };

  const result = await submitReview('http://mock', 'yes');
  assert.strictEqual(result.status, 'accepted');
  // This passes no matter what field name the client used, because the
  // mock just echoes it back. It can never fail on a wrong field name.
  assert.strictEqual(result.received.choice, 'yes');
});
