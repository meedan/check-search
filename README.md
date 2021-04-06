# check-search

Frontend client for Check's similarity search APIs.

## Quick start

Make sure to have node.js v15+ installed.

```bash
# clone repository
$ git clone git@github.com:meedan/check-search.git
$ cd check-search/

# Run setup script. This will install dependencies, and copy and set your configuration
$ bin/setup.sh

# run the dev server
$ npm start
```

The frontend should now be available at http://localhost:8001

## Using Docker

Make sure Docker and `docker-compose` are installed.

```bash
# clone repository
$ git clone git@github.com:meedan/check-search.git

$ docker-compose up

# the frontend should now be available at http://localhost:8001
```
