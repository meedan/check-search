import React from 'react';
import ReactDOM from 'react-dom';
import 'core-js';
import 'regenerator-runtime/runtime';
import { ApiClient, ApiProvider } from 'jsonapi-react';
import './index.css';
import App from './App';
import config from '../config';

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
  <ApiProvider client={client}>
    <App />
  </ApiProvider>,
  document.getElementById('root'),
);
