import React from 'react';
import Search from './Search';
import { mountWithIntl } from './helpers/intl-enzyme-test-helper';
import messages from '../localization/messages';

describe('<Search />', () => {
  it('renders the basic filter', () => {
    const wrapper = mountWithIntl(
      <Search locale={'en'} />
    );
    console.log(wrapper.debug())
  });

});
