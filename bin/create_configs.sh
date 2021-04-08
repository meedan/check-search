#!/bin/bash

# This script generates a json configuration file for check-search
# using values from the SSM parameter store.

# The following environment variables must be set:
if [[ -z ${DEPLOY_ENV+x} || -z ${AWS_DEFAULT_REGION+x} ]]; then
  echo "DEPLOY_ENV and AWS_DEFAULT_REGION must be in the environment. Exiting."
  exit 1
fi

SSM_PREFIX="/${DEPLOY_ENV}/check-search"
WORKTMP=$(mktemp)

# Create user config.js from SSM parameter value:
DESTFILE="config.js"
aws ssm get-parameters --region $AWS_DEFAULT_REGION --name "${SSM_PREFIX}/config" | jq .Parameters[].Value|sed 's/["]//g' | python -m base64 -d > $WORKTMP
if (( $? != 0 )); then
  echo "Error retrieving SSM parameter ${SSM_PREFIX}/config. Exiting."
  exit 1
fi
mv $WORKTMP $DESTFILE

echo "Configuration for env $DEPLOY_ENV complete."
exit 0
