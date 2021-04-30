import React from 'react';
import { FormattedMessage } from 'react-intl';
import Filter from './Filter';
import { mountWithIntl } from './helpers/intl-enzyme-test-helper';

describe('<Filter />', () => {
  const values = [
    {
      label: 'Item 1',
      value: '1',
      isChecked: false,
    },
    {
      label: 'Item 2',
      value: '2',
      isChecked: false,
    },
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
        value={values}
      />,
    );
    expect(wrapper.props().value).toEqual(values);
    // Check for hard-coded items
    expect(wrapper.find('.MuiListItemText-dense').first().text()).toEqual(
      'All',
    );
    expect(wrapper.find('.MuiListItemText-dense').last().text()).toEqual(
      'Item 2',
    );
  });

  it('renders a loading spinner while query is running', () => {
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
        query={query}
      />,
    );
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
        query={query}
      />,
    );
    // Error message was found and rendered
    expect(
      wrapper.find('.MuiTypography-root.filter-error-message').length,
    ).toEqual(1);
  });

  it('renders autocomplete when passed a query and query succeeds', () => {
    const query = {
      isLoading: false,
      isFetching: false,
      data: [
        {
          id: '1',
          name: 'Meedan',
          slug: 'meedan',
        },
        {
          id: '34',
          name: 'test',
          slug: 'test',
        },
        {
          id: '35',
          name: 'Test workspace',
          slug: 'test-workspace',
        },
      ],
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
        query={query}
      />,
    );

    // Autocomplete is rendered
    expect(
      wrapper.find('button.MuiAutocomplete-popupIndicator').length,
    ).toEqual(1);
    // click the popup to show options
    wrapper.find('button.MuiAutocomplete-popupIndicator').simulate('click');
    expect(
      wrapper.find('div.MuiAutocomplete-popper').length,
    ).toEqual(1);
    // first option is labeled "Meedan"
    expect(
      wrapper.find('.MuiAutocomplete-option').first().text(),
    ).toEqual('Meedan');
  });
});
