#!/bin/bash
# A fresh copy of the demo app, with the wrong field name still in place.
set -euo pipefail
rm -rf ~/app && cp -r ~/template ~/app
