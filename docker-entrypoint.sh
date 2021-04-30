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


# NOTE: for a production environment (QA, Live) we serve content
# via separate web server (nginx). Otherwise, run in development
# mode directly.
#
if [[ "$DEPLOY_ENV" == "qa" || "$DEPLOY_ENV" == "live" ]]; then
  # Production entrypoint
  if [ ! -d dist ]; then
    npm run build
  fi
  # this is a minimal node runtime, without most utilities.  compensate :)
  if [ -f /var/www/html/index.nginx-debian.html ]; then
    mv /var/www/html /var/www/prev-html
    ln -s /app/dist /var/www/html
    cat /etc/nginx/sites-available/default | sed 's/listen 80 default_server/listen 8001 default_server/' > /tmp/.tmpf
    cat /tmp/.tmpf > /etc/nginx/sites-available/default
    nginx -g 'daemon off;'
  fi
else
  # Developer entrypoint:
  #
  npm install
  # npm run test:lint
  # npm run test
  npm run start
fi
