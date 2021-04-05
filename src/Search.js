import React, { useState } from 'react';
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

function Search() {
  const classes = useStyles();
  const intl = useIntl();
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState({ hasError: false, message: '' });
  const client = useClient();

  async function getData() {
    const { data } = await client.fetch([
      'reports',
      {
        filter: {
          similar_to_text: searchText,
          similarity_threshold: 0.1,
        },
      },
    ]);

    return data;
  }

  async function handleSubmit(e) {
    e.preventDefault();
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
              />
            </Typography>
          </Grid>
          <Grid item xs={3} />
          <Grid item xs={3} />
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
            >
              <FormattedMessage id="search.action" defaultMessage="Search" />
            </Button>
          </Grid>
          <SearchResults error={error} results={results} />
        </Grid>
      </form>
    </main>
  );
}

export default Search;
