# The client sends `verdict`, the server wants `decision`

A client function sends the wrong request field name. Its unit test mocks `fetch` with a
server that just echoes back whatever body it receives, so the test can never fail. The
real API validates the body for real and returns 400. The same wrong field name was also
copy-pasted into two other integration files. This repo reproduces all of it, plus the
fix: a contract test that runs the real server handler in-process, and a `grep` that
finds the copies.

    docker build -t mock-echo-test-passes-api-400 .
    docker run --rm mock-echo-test-passes-api-400
