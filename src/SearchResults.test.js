import React from 'react';
import SearchResults from './SearchResults';
import { mountWithIntl } from './helpers/intl-enzyme-test-helper';

describe('<SearchResults />', () => {
  it('renders the basic empty search', () => {
    const wrapper = mountWithIntl(
      <SearchResults
        error={{}}
        results={{ data: [], meta: { 'record-count': 0 } }}
        pageNumber={0}
        rowsPerPage={2}
      />,
    );
    expect(wrapper.props().error).toEqual({});
    expect(wrapper.find('.MuiTableBody-root').text()).toEqual('No results found.');
  });
  it('renders an error message when passed incorrect object results', () => {
    const results = {};
    const wrapper = mountWithIntl(
      <SearchResults
        error={{}}
        results={results}
        pageNumber={0}
        rowsPerPage={2}
      />,
    );
    expect(
      wrapper.find('.MuiTypography-root.search-error-message').length,
    ).toEqual(1);
  });
  it('renders any error message returned from the API', () => {
    const error = {
      hasError: true,
      message: 'This error message was returned from the API',
    };
    const wrapper = mountWithIntl(
      <SearchResults
        error={error}
        results={{ data: [], meta: { 'record-count': 0 } }}
        pageNumber={0}
        rowsPerPage={2}
      />,
    );
    expect(
      wrapper.find('.MuiTypography-root.search-error-message').length,
    ).toEqual(1);
    expect(
      wrapper.find('.MuiTypography-root.search-error-message').text(),
    ).toEqual(error.message);
  });
  it('renders search results', () => {
    const results = {
      data: [
        {
          id: '7',
          type: 'reports',
          links: { self: 'https://example.com/api/v2/reports/7' },
          attributes: {
            title: 'Similarity 1',
            description: 'Description',
            'lead-image': '',
            archived: 0,
            'created-at': '2021-04-08T22:01:23.189Z',
            'media-id': 7,
            'workspace-id': 35,
            'report-title': 'Similarity 1',
            'report-body': 'This is the body.',
            'article-link': '',
            'report-rating': 'undetermined',
            published: '',
            'original-media': null,
            'original-claim-title': 'Similarity 1',
            'original-claim-body': null,
            'original-claim-link': null,
            'original-claim-author': null,
            'similar-media': 0,
            requests: 0,
            'check-url': 'https://example.com/test-workspace/media/7',
            organization: 'Test workspace',
            tags: '',
            'media-type': 'Claim',
            score: 10.901283,
          },
        },
        {
          id: '10',
          type: 'reports',
          links: { self: 'https://example.com/api/v2/reports/10' },
          attributes: {
            title: 'bagel',
            description: 'Another description',
            'lead-image':
              'https://example.com/check-api-dev/uploads/uploaded_image/10/bagel.jpeg',
            archived: 0,
            'created-at': '2021-04-12T17:37:49.194Z',
            'media-id': 10,
            'workspace-id': 35,
            'report-title': 'bagel',
            'report-body':
              'Hello this is a bagel that I made the other week. It was a very good bagel. Low-hydration dough, about 42%. Very chewy and dense.',
            'article-link': 'https://example.com/article',
            'report-rating': 'verified',
            published: 1617310920,
            'original-media':
              'https://example.com/check-api-dev/uploads/uploaded_image/10/bagel.jpeg',
            'original-claim-title': null,
            'original-claim-body': '',
            'original-claim-link': null,
            'original-claim-author': null,
            'similar-media': 0,
            requests: 0,
            'check-url': 'https://example.com/test-workspace/media/10',
            organization: 'Test workspace',
            tags: '',
            'media-type': 'UploadedImage',
            score: 19.615885,
          },
        },
      ],
      meta: { 'record-count': 2 },
    };
    const wrapper = mountWithIntl(
      <SearchResults
        error={{}}
        results={results}
        pageNumber={0}
        rowsPerPage={10}
      />,
    );
    expect(wrapper.props().error).toEqual({});
  });
});
