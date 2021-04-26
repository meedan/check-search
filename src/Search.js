import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  makeStyles,
  Button,
  Toolbar,
  Typography,
  TextField,
  Grid,
  InputAdornment,
} from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';
import { useClient } from 'jsonapi-react';
import SearchResults from './SearchResults';

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(3),
    width: '100%',
  },
  searchButton: {
    margin: theme.spacing(1),
  },
  results: {
    margin: theme.spacing(2),
  },
  error: {
    color: 'red',
  },
}));

function Search(props) {
  const classes = useStyles();
  const { similarity, workspaces, mediaTypes, fuzzy } = props;
  const [results, setResults] = useState({
    data: [],
    meta: { 'record-count': 0 },
  });
  const [pageNumber, setPageNumber] = useState(0);
  const [confirmedText, setConfirmedText] = useState('');
  const [error, setError] = useState({ hasError: false, message: '' });
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const client = useClient();

  async function getData() {
    const data = await client.fetch([
      'reports',
      {
        filter: {
          similar_to_text: confirmedText,
          similarity_threshold: similarity / 100,
          similarity_organization_ids: workspaces
            .map((item) => item.id)
            .toString(),
          media_type: mediaTypes
            .filter((item) => item.isChecked)
            .map((item) => item.value),
          fuzzy,
        },
        page: {
          size: rowsPerPage,
          number: pageNumber + 1,
        },
      },
    ]);
    return data;
  }

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    if (!confirmedText) return;
    let data = [];
    try {
      data = await getData();
    } catch (err) {
      setError({ hasError: true, message: err.toString() });
    } finally {
      if (data) {
        setResults(data);
      } else {
        setError({ hasError: true, message: 'search API returned undefined' });
      }
    }
  }

  // make query when page number or rows per page changes
  useEffect(() => {
    handleSubmit(null);
  }, [pageNumber, rowsPerPage]);

  return (
    <main className={classes.content}>
      <Toolbar />
      <form onSubmit={handleSubmit}>
        <Grid container justify="center" align="center" alignItems="center">
          <Grid item xs={3} />
          <Grid item xs={6}>
            <Typography variant="h6">
              <FormattedMessage
                id="search.title"
                defaultMessage="Report Database"
                description="This is a message that appears above the search bar in the application. It is supposed to indicate what group of documents the user is about to search."
              />
            </Typography>
          </Grid>
          <Grid item xs={3} />
          <Grid item xs={3} />
          <SearchInput {...{ setConfirmedText }} />
          <SearchResults
            {...{
              error,
              results,
              rowsPerPage,
              setRowsPerPage,
              pageNumber,
              setPageNumber,
              handleSubmit,
            }}
          />
        </Grid>
      </form>
    </main>
  );
}

function SearchInput(props) {
  const classes = useStyles();
  const { setConfirmedText } = props;
  const intl = useIntl();
  const [searchText, setSearchText] = useState('');
  return (
    <>
      <Grid
        item
        xs={6}
        container
        direction="row"
        alignItems="center"
        justify="flex-end"
      >
        <TextField
          className={classes.searchField}
          type="search"
          id="search"
          name="search"
          label={intl.formatMessage({
            id: 'search.action',
            defaultMessage: 'Search',
            description:
              'This is a verb that indicates the user is going to search a database for records based on a query they typed.',
          })}
          variant="outlined"
          value={searchText}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          fullWidth
          autoFocus
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Grid>
      <Grid
        item
        xs={3}
        container
        direction="row"
        alignItems="center"
        justify="flex-start"
      >
        <Button
          variant="contained"
          color="primary"
          className={classes.searchButton}
          type="submit"
          onClick={() => setConfirmedText(searchText)}
        >
          <FormattedMessage
            id="search.action"
            defaultMessage="Search"
            description="This is a verb that indicates the user is going to search a database for records based on a query they typed."
          />
        </Button>
      </Grid>
    </>
  );
}

Search.defaultProps = {
  similarity: 90,
  workspaces: [],
  mediaTypes: [],
};

Search.propTypes = {
  similarity: PropTypes.number,
  workspaces: PropTypes.array,
  mediaTypes: PropTypes.array,
};

export default Search;
