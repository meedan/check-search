import React from 'react';
import { shallow } from 'enzyme';
import Sidebar from './Sidebar.js';

test('Sidebar renders', () => {
  shallow(<Sidebar />);
});
