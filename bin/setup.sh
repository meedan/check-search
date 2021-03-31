#!/bin/bash

# set git hooks directory
git config core.hooksPath .githooks/

# copy config file (prompt if config.js exists)
cp -i config.js.example config.js

# install dependencies (temporarily requires we enable legacy peer dependency behavior)
npm i --legacy-peer-deps
