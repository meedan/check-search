import React from 'react';
import FilterAutocomplete from './FilterAutocomplete.js';
import { mountWithIntl } from './helpers/intl-enzyme-test-helper';

const data = [
  { id: 1, name: 'first' },
  { id: 2, name: 'second' },
  { id: 3, name: 'third' },
  { id: 4, name: 'fourth' },
];

test('FilterAutocomplete renders', () => {
  mountWithIntl(
    <FilterAutocomplete data={data} setValue={jest.fn()} value={[]} />,
  );
});
