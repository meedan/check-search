import React from 'react';
import { shallow } from 'enzyme';
import { ApiClient, ApiProvider } from 'jsonapi-react';
import Sidebar from './Sidebar.js';

global.fetch = jest.fn(() => Promise.resolve());

const client = new ApiClient({
  url: 'http://example.com',
});

// NOTE: I wanted to write some tests here for the similarity stuff but there are non-shallow rendering issues due to enzyme-adapter-react-17 not being official yet. See: https://github.com/wojtekmaj/enzyme-adapter-react-17/issues/12#issuecomment-786789978 -- I am watching https://github.com/enzymejs/enzyme/pull/2430 for an update.
describe('<Sidebar />', () => {
  it('renders', () => {
    shallow(
      <ApiProvider client={client}>
        <Sidebar />
      </ApiProvider>,
    );
  });
});
