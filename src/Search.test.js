import React from 'react';
import 'regenerator-runtime/runtime';
import { act } from 'react-dom/test-utils';
import Search from './Search';
import { mountWithIntl } from './helpers/intl-enzyme-test-helper';

// Takes care of a warning about needing to wrap component in "act"
// https://stackoverflow.com/a/63612692/4869657
const waitForComponentToPaint = async (wrapper) => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve));
    wrapper.update();
  });
};

describe('<Search />', () => {
  const wrapper = mountWithIntl(<Search locale="en" />);
  it('renders the basic search', () => {
    expect(wrapper.props().locale).toEqual('en');
  });
  it('accepts a search string input', () => {
    wrapper
      .find('input#search')
      .at(0)
      .simulate('change', { target: { name: 'search', value: 'Search text' } });
    expect(wrapper.find('input#search').at(0).props().value).toEqual(
      'Search text',
    );
  });
  it('accepts a file input', async () => {
    const file = new Blob();
    const readAsDataURLSpy = jest.spyOn(FileReader.prototype, 'readAsDataURL');
    wrapper
      .find('input#media-upload')
      .at(0)
      .simulate('change', { target: { files: [file] } });
    await waitForComponentToPaint(wrapper);
    expect(readAsDataURLSpy).toBeCalledWith(new Blob());
  });
});
