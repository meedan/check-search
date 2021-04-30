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
      value: 'two',
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
        setValue={jest.fn()}
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
    // filter can be minimized
    // click the button to minimize
    expect(wrapper.find('div.MuiCollapse-entered').length).toEqual(1);
    wrapper.find('div.header-button').simulate('click');
    expect(wrapper.find('div.MuiCollapse-entered').length).toEqual(0);

    // check the "all" checkbox to cause all boxes to be checked
    expect(wrapper.find('span.Mui-checked').length).toEqual(0);
    wrapper
      .find('input[name="all"]')
      .simulate('change', { target: { checked: true } });
    expect(wrapper.find('span.Mui-checked').length).toEqual(3);
    // uncheck "all"
    wrapper
      .find('input[name="all"]')
      .simulate('change', { target: { checked: false } });
    expect(wrapper.find('span.Mui-checked').length).toEqual(0);

    // check Item 2, only that item should be checked
    wrapper
      .find('input[name="two"]')
      .simulate('change', { target: { checked: true, name: 'two' } });
    wrapper.setProps({});
    expect(wrapper.find('span.Mui-checked').length).toEqual(1);

    // check Item 1, now all THREE including the "all" should be selected
    wrapper
      .find('input[name="1"]')
      .simulate('change', { target: { checked: true, name: '1' } });
    wrapper.setProps({});
    expect(wrapper.find('span.Mui-checked').length).toEqual(3);

    // uncheck Item 1, now all should be back to just one item (two, with "all" and "1" not selected)
    wrapper
      .find('input[name="1"]')
      .simulate('change', { target: { checked: false, name: '1' } });
    wrapper.setProps({});
    expect(wrapper.find('span.Mui-checked').length).toEqual(1);
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
    expect(wrapper.find('div.MuiAutocomplete-popper').length).toEqual(1);
    // first option is labeled "Meedan"
    expect(wrapper.find('.MuiAutocomplete-option').first().text()).toEqual(
      'Meedan',
    );
  });
});
