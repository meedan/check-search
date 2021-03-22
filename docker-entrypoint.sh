#!/bin/bash

# Expects following environment variables to be populated:
#   DEPLOY_ENV

set -e
cp config.js.example config.js
# npm run test:lint
# npm run test
npm run start
