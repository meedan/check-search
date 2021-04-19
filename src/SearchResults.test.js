import React from 'react';
import SearchResults from './SearchResults';
import { mountWithIntl } from './helpers/intl-enzyme-test-helper';

describe('<SearchResults />', () => {
  it('renders the basic search', () => {
    const wrapper = mountWithIntl(
      <SearchResults
        error={{}}
        results={{ data: [], meta: { 'record-count': 0 } }}
        locale="en"
        pageNumber={0}
        rowsPerPage={2}
      />,
    );
    expect(wrapper.props().error).toEqual({});
  });
  it('renders an error message when passed incorrect object results', () => {
    const results = {};
    const wrapper = mountWithIntl(
      <SearchResults
        error={{}}
        results={results}
        locale="en"
        pageNumber={0}
        rowsPerPage={2}
      />,
    );
    expect(
      wrapper.find('.MuiTypography-root.search-error-message').length,
    ).toEqual(1);
  });
  it('renders any error message returned from the API', () => {
    const error = {
      hasError: true,
      message: 'This error message was returned from the API',
    };
    const wrapper = mountWithIntl(
      <SearchResults
        error={error}
        results={{ data: [], meta: { 'record-count': 0 } }}
        locale="en"
        pageNumber={0}
        rowsPerPage={2}
      />,
    );
    expect(
      wrapper.find('.MuiTypography-root.search-error-message').length,
    ).toEqual(1);
    expect(
      wrapper.find('.MuiTypography-root.search-error-message').text(),
    ).toEqual(error.message);
  });
});
