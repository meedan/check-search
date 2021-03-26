import React from 'react';
import Search from './Search';
import { mountWithIntl } from './helpers/intl-enzyme-test-helper';
describe('<Search />', () => {
  it('renders the basic filter', () => {
    const wrapper = mountWithIntl(<Search locale="en" />);
    expect(wrapper.props().locale).toEqual('en');
  });
});
