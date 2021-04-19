import React from 'react';
import { FormattedMessage } from 'react-intl';
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
      <Filter
        header={
          <FormattedMessage
            id="test.message"
            defaultMessage="Test"
            description="test"
          />
        }
        items={items}
      />,
    );
    expect(wrapper.props().items).toEqual(items);
    // Check for hard-coded items
    expect(wrapper.find('.item').first().text()).toEqual('Item 1A');
    expect(wrapper.find('.item').last().text()).toEqual('Item 3C');
    // A divider element goes between each group of items, so two in this case
    expect(wrapper.find('hr.divider').length).toBe(2);
  });

  it('renders hard coded items and a loading spinner while query is running', () => {
    const query = {
      isLoading: true,
      isFetching: true,
      data: undefined,
    };
    const wrapper = mountWithIntl(
      <Filter
        header={
          <FormattedMessage
            id="test.message"
            defaultMessage="Test"
            description="test"
          />
        }
        items={items}
        query={query}
      />,
    );
    // Check for hard-coded items
    expect(wrapper.find('.item').first().text()).toEqual('Item 1A');
    expect(wrapper.find('.item').last().text()).toEqual('Item 3C');
    // Look for loading spinner
    expect(wrapper.find('.MuiCircularProgress-root').length).toBe(1);
  });

  it('renders an error message when query fails', () => {
    const query = {
      isLoading: false,
      error: { status: 500, title: 'something went wrong' },
    };
    const wrapper = mountWithIntl(
      <Filter
        header={
          <FormattedMessage
            id="test.message"
            defaultMessage="Test"
            description="test"
          />
        }
        items={items}
        query={query}
      />,
    );
    // Error message was found and rendered
    expect(
      wrapper.find('.MuiTypography-root.filter-error-message').length,
    ).toEqual(1);
  });
});
