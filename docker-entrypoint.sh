#!/bin/bash

# Expects following environment variables to be populated:
#   DEPLOY_ENV

set -e
# check that required environment variables are set
if [[ -z ${DEPLOY_ENV+x} ]]; then
    echo "DEPLOY_ENV environment variable must be set. Exiting."
    exit 1
fi

if [[ "$DEPLOY_ENV" == "qa" || "$DEPLOY_ENV" == "live" ]]; then
    # Always put config into place when starting service. This is because the
    # build stage includes the sample configs which real deployments must replace.
    ./bin/create_configs.sh
    if (( $? != 0 )); then
        echo "Error creating configuration files. Exiting."
        exit 1
    fi
else
    cp config.js.example config.js
fi

npm install
# npm run test:lint
# npm run test
npm run start
