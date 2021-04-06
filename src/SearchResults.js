import React from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles,
  Typography,
  Card,
  CardContent,
  Grid,
} from '@material-ui/core';
import { useIntl } from 'react-intl';

const useStyles = makeStyles((theme) => ({
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(3),
  },
  results: {
    margin: theme.spacing(2),
  },
  error: {
    color: 'red',
  },
}));

function SearchError(props) {
  const classes = useStyles();
  const { error } = props;
  return (
    <>
      <Grid item xs={12} key="error" className={classes.results}>
        <Card variant="outlined">
          <CardContent>
            <Typography
              className={`${classes.error} search-error-message`}
              variant="h6"
            >
              {error.message}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
}

function SearchResults(props) {
  const classes = useStyles();
  const intl = useIntl();
  const { results, error } = props;
  if (!Array.isArray(results) && !error.hasError) {
    error.hasError = true;
    error.message = intl.formatMessage({
      id: 'search.genericError',
      defaultMessage: 'Something went wrong with your search.',
      description: `This message appears when we don't know why an error has occurred during a search. Otherwise we show the real error.`,
    });
  }
  return (
    <>
      {error.hasError ? (
        <SearchError error={error} />
      ) : (
        results.map((report) => (
          <Grid item xs={12} key={report.id} className={classes.results}>
            <Card variant="outlined">
              <CardContent>
                <Typography className={classes.title} variant="h6">
                  Report Title
                </Typography>
                <Typography>{report.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))
      )}
    </>
  );
}

SearchResults.propTypes = {
  results: PropTypes.array.isRequired,
  error: PropTypes.object.isRequired,
};

export default SearchResults;
