import React from 'react';
import Search from './Search';
import { mountWithIntl } from './helpers/intl-enzyme-test-helper';

describe('<Search />', () => {
  const wrapper = mountWithIntl(<Search locale="en" />);
  it('renders the basic search', () => {
    expect(wrapper.props().locale).toEqual('en');
  });
  it('accepts a search string input', () => {
    wrapper
      .find('input')
      .at(0)
      .simulate('change', { target: { name: 'search', value: 'Search text' } });
    expect(wrapper.find('input').props().value).toEqual('Search text');
  });
});
