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

#### Localization

Localization is done on [Transifex](https://www.transifex.com/meedan/check-2/browser-extension/). You must have the `tx` client [installed](http://docs.transifex.com/client/setup/) on your computer and [configured](https://docs.transifex.com/client/client-configuration) to communicate with the Transifex server.

To create a new English string to localize, simply add it as a `<FormattedMessage id="new.id" defaultMessage="My new string"/>` component in the React application. Running `npm run transifex:extract` will automatically create the following field in `localization/transifex/source.json`:

```json
{
  "new.id": {
    "string": "My new string"
  }
}
```

You can run `npm run transifex:upload` to send the `source.json` file to the Transifex server. Translation happens on the Transifex app. To download new translations, run `npm run transifex:download`.
