#!/bin/bash

# set git hooks directory
git config core.hooksPath .githooks/

# copy config file (prompt if config.js exists)
cp -i config.js.example config.js

# install dependencies
npm i
