import React from 'react';
import { shallow } from 'enzyme';
import Sidebar from './Sidebar.js';
import { ApiClient, ApiProvider } from 'jsonapi-react';

global.fetch = jest.fn(() => Promise.resolve());

const client = new ApiClient({
  url: 'http://example.com',
});

test('Sidebar renders', () => {
  shallow(
    <ApiProvider client={client}>
      <Sidebar />
    </ApiProvider>,
  );
});
