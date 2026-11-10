#!/bin/bash
set -uo pipefail
fail() { echo "FAIL: $1"; exit 1; }
cd ~ && bash scripts/setup.sh >/dev/null && cd ~/app

node --test test/unit.mock.test.js >/tmp/t1.log 2>&1
grep -q "pass 1" /tmp/t1.log || fail "mock test should pass (that is the problem)"
echo "ok 1 - the echo mock test passes even with the wrong field name"

node -e "require('./server.js').createServer().listen(4100)" &
SPID=$!
sleep 0.5
CODE=$(curl -s -o /tmp/resp.json -w '%{http_code}' -X POST -H 'content-type: application/json' -d '{"verdict":"approve"}' http://127.0.0.1:4100/decide)
kill $SPID 2>/dev/null
[ "$CODE" = "400" ] || fail "real API should reject the wrong field with 400"
grep -q "decision is required" /tmp/resp.json || fail "server should explain the missing field"
echo "ok 2 - the real API rejects the same request with 400"

node --test test/contract.test.js >/tmp/t3.log 2>&1 && fail "contract test should fail before the fix"
grep -q "decision is required" /tmp/t3.log || fail "contract test should fail because of the missing decision field"
echo "ok 3 - the contract test fails for the right reason"

sed -i "s/body: JSON.stringify({ verdict }),/body: JSON.stringify({ decision: verdict }),/" client.js
node --test test/contract.test.js >/tmp/t4.log 2>&1
grep -q "pass 1" /tmp/t4.log || fail "contract test should pass after the fix"
echo "ok 4 - one field rename and the contract test passes"

[ "$(grep -rl '{ verdict }' integrations/ | wc -l)" = "2" ] || fail "expected the same bug copied into exactly two integrations"
echo "ok 5 - grep finds the same mistake copied into two other files"

sed -i "s/body: JSON.stringify({ verdict }),/body: JSON.stringify({ decision: verdict }),/" integrations/*.js
[ -z "$(grep -rl '{ verdict }' integrations/ client.js)" ] || fail "no file should send the wrong field any more"
echo "ok 6 - all three clients now send the real field"

echo "ALL PASSED"
