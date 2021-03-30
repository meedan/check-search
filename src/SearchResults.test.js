import React from 'react';
import SearchResults from './SearchResults';
import { mountWithIntl } from './helpers/intl-enzyme-test-helper';

describe('<SearchResults />', () => {
  it('renders the basic search', () => {
    const wrapper = mountWithIntl(<SearchResults error={{}} results={[]} />);
    expect(wrapper.props().error).toEqual({});
  });
  it('renders an error message when passed non-array results', () => {
    const results = 'this is not an array';
    const wrapper = mountWithIntl(
      <SearchResults error={{}} results={results} locale="en" />,
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
    const wrapper = mountWithIntl(<SearchResults error={error} results={[]} />);
    expect(
      wrapper.find('.MuiTypography-root.search-error-message').length,
    ).toEqual(1);
    expect(
      wrapper.find('.MuiTypography-root.search-error-message').text(),
    ).toEqual(error.message);
  });
});
