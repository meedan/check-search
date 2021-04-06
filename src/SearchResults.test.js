import React from 'react';
import SearchResults from './SearchResults';
import { mountWithIntl } from './helpers/intl-enzyme-test-helper';

describe('<SearchResults />', () => {
  it('renders the basic search', () => {
    const wrapper = mountWithIntl(
      <SearchResults error={{}} results={[]} locale="en" />,
    );
    expect(wrapper.props().error).toEqual({});
  });
  it('renders an error message when passed non-array results', () => {
    const results = 'this is not an array';
    // We are intentionally sending bad data that will throw a PropType warning with this test. So here we mock console.error temporarily, because we don't want the PropType warning polluting our test log: we know it's supposed to happen. We also disable eslint warnings for accessing the console object.
    /* eslint-disable no-console */
    const errorFunction = console.error;
    console.error = jest.fn();
    const wrapper = mountWithIntl(
      <SearchResults error={{}} results={results} locale="en" />,
    );
    expect(
      wrapper.find('.MuiTypography-root.search-error-message').length,
    ).toEqual(1);
    console.error = errorFunction;
    /* eslint-enable no-console */
  });
  it('renders any error message returned from the API', () => {
    const error = {
      hasError: true,
      message: 'This error message was returned from the API',
    };
    const wrapper = mountWithIntl(
      <SearchResults error={error} results={[]} locale="en" />,
    );
    expect(
      wrapper.find('.MuiTypography-root.search-error-message').length,
    ).toEqual(1);
    expect(
      wrapper.find('.MuiTypography-root.search-error-message').text(),
    ).toEqual(error.message);
  });
});
