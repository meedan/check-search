import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  makeStyles,
  Button,
  Toolbar,
  Typography,
  TextField,
  Grid,
  InputAdornment,
  Card,
  CardContent,
} from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';
import { useClient } from 'jsonapi-react';
import messages from '../localization/messages';

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
}));

function Search(props) {
  const classes = useStyles();
  const { locale } = props;
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);
  const client = useClient();

  async function getData() {
    const { data } = await client.fetch([
      'items',
      {
        filter: {
          similar_to_text: searchText,
          similarity_threshold: 0.1,
        },
      },
    ]);

    return data;
  }

  async function handleSearch() {
    setResults(await getData());
  }

  function SearchResults() {
    return (
      <>
        {results.map((item) => (
          <Grid item xs={12} key={item.id} className={classes.results}>
            <Card variant="outlined">
              <CardContent>
                <Typography className={classes.title} variant="h6">
                  Report Title
                </Typography>
                <Typography>{item.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </>
    );
  }

  return (
    <main className={classes.content}>
      <Toolbar />
      <Grid container justify="center" align="center" alignItems="center">
        <Grid item xs={12}>
          <Typography variant="h6">
            <FormattedMessage id="search.title" />
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <TextField
            type="search"
            id="search"
            label={messages[locale]['search.action']}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            align="left"
            variant="contained"
            color="primary"
            className={classes.searchButton}
            onClick={handleSearch}
          >
            <FormattedMessage id="search.action" />
          </Button>
        </Grid>
        <SearchResults />
      </Grid>
    </main>
  );
}

export default Search;
