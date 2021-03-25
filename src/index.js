import React from 'react';
import ReactDOM from 'react-dom';
import 'core-js';
import 'regenerator-runtime/runtime';
import { ApiClient, ApiProvider } from 'jsonapi-react';
import './index.css';
import App from './App';

const client = new ApiClient({
  url: 'http://cormorant:3000/api/v2/',
  schema: {
    workspaces: {
      type: 'workspaces'
    },
    items: {
      type: 'items'
    },
  },
  headers: {
    'Accept': 'application/vnd.api+json',
    'X-Check-Token': 'dev',
  }
})

ReactDOM.render(
  <React.StrictMode>
    <ApiProvider client={client}>
      <App />
    </ApiProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
