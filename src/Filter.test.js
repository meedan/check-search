import React from 'react';
import Filter from './Filter';
import { mountWithIntl } from './helpers/intl-enzyme-test-helper';

describe('<Filter />', () => {
  const items = [
    ['Item 1A', 'Item 1B'],
    ['Item 2A'],
    ['Item 3A', 'Item 3B', 'Item 3C'],
  ];

  it('renders the basic filter', () => {
    const wrapper = mountWithIntl(
      <Filter localizedTitle="test.message" items={items} />,
    );
    expect(wrapper.props().items).toEqual(items);
    // Check for hard-coded items
    expect(wrapper.find('.item').first().text()).toEqual('Item 1A');
    expect(wrapper.find('.item').last().text()).toEqual('Item 3C');
    // A divider element goes between each group of items, so two in this case
    expect(wrapper.find('hr.divider').length).toBe(2);
  });

  it('renders results of a queried list', () => {
    const data = [
      {
        id: '1',
        name: 'Meedan',
        slug: 'meedan',
      },
      {
        id: '34',
        name: 'Workspace Two',
        slug: 'workspace-two',
      },
      {
        id: '35',
        name: 'Workspace Three',
        slug: 'workspace-three',
      },
    ];
    const query = {
      isLoading: false,
      isFetching: false,
      data,
    };
    const wrapper = mountWithIntl(
      <Filter localizedTitle="test.message" items={items} query={query} />,
    );
    expect(wrapper.props().items).toEqual(items);
    // Check for hard-coded items
    expect(wrapper.find('.item').first().text()).toEqual('Item 1A');
    expect(wrapper.find('.item').last().text()).toEqual('Item 3C');
    // Look for fetched item
    expect(wrapper.find('.query-item').last().text()).toEqual(
      'Workspace Three',
    );
  });

  it('renders hard coded items and a loading message while query is running', () => {
    const query = {
      isLoading: true,
      isFetching: true,
      data: undefined,
    };
    const wrapper = mountWithIntl(
      <Filter localizedTitle="test.message" items={items} query={query} />,
    );
    // Check for hard-coded items
    expect(wrapper.find('.item').first().text()).toEqual('Item 1A');
    expect(wrapper.find('.item').last().text()).toEqual('Item 3C');
    // Look for loading message
    expect(wrapper.find('.loading-message').length).toBe(1);
  });
});