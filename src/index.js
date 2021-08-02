import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import 'core-js';
import 'regenerator-runtime/runtime';
import { ApiClient, ApiProvider } from 'jsonapi-react';
import config from 'config';
import './index.css';
import App from './App';
import EmbedApp from './EmbedApp';

const { restBaseUrl, apiToken } = config;

const client = new ApiClient({
  url: `${restBaseUrl}`,
  schema: {
    workspaces: {
      type: 'workspaces',
    },
    reports: {
      type: 'reports',
    },
  },
  headers: {
    Accept: 'application/vnd.api+json',
    'X-Check-Token': apiToken,
  },
});

ReactDOM.render(
  <Router>
    <ApiProvider client={client}>
      <Switch>
        <Route path="/embed">
          <EmbedApp />
        </Route>
        <Route path="/">
          <App />
        </Route>
      </Switch>
    </ApiProvider>
  </Router>,
  document.getElementById('root'),
);
