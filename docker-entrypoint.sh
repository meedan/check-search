#!/bin/bash

# Expects following environment variables to be populated:
#   DEPLOY_ENV

set -e
# check that required environment variables are set
if [[ -z ${DEPLOY_ENV+x} ]]; then
    echo "DEPLOY_ENV environment variable must be set. Exiting."
    exit 1
fi
cp config.js.example config.js
# npm run test:lint
# npm run test
npm run start
