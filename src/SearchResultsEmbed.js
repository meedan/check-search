import React from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  CircularProgress,
} from '@material-ui/core';
import { FormattedMessage, useIntl } from 'react-intl';

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
  root: {
    width: '100%',
    borderTop: 'none',
    borderLeft: 'none',
  },
  container: {
    minHeight: 300,
  },
  spacer: {
    flex: '0',
  },
  headerCellRoot: {
    padding: theme.spacing(1),
  },
  thumbnail: {
    padding: theme.spacing(1),
    objectPosition: 'center',
    objectFit: 'cover',
    height: '100px',
    width: '100px',
    float: 'left',
  },
  noResults: {
    margin: theme.spacing(2),
  },
  subRow: {
    color: '#979797',
    fontWeight: 'bold',
  },
  secondRow: {
    verticalAlign: 'top',
  },
  evenItem: {
    backgroundColor: '#f6f6f6',
  },
  itemTitle: {
    fontSize: '0.875rem',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 800,
    lineHeight: 1.43,
    letterSpacing: '0.01071em',
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': 2,
    overflow: 'hidden',
  },
  itemDescription: {
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': 2,
    overflow: 'hidden',
  },
  claimGroup: {
    backgroundColor: '#ced3e2',
  },
  leftBorder: {
    borderLeft: '1px solid #ced3e2',
  },
}));

function SearchLoading() {
  const classes = useStyles();
  return (
    <Grid item xs={12} key="error" className={classes.results}>
      <Card variant="outlined">
        <CardContent>
          <div className={classes.loading}>
            <CircularProgress />
          </div>
        </CardContent>
      </Card>
    </Grid>
  );
}

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

function SearchResultsEmbed(props) {
  const classes = useStyles();
  const intl = useIntl();
  const {
    results,
    error,
    isLoading,
  } = props;

  const [order, setOrder] = React.useState('desc');

  if (!(results.meta && results.data)) {
    error.hasError = true;
    error.message = intl.formatMessage({
      id: 'search.genericError',
      defaultMessage: 'Something went wrong with your search.',
      description:
        "This message appears when we don't know why an error has occurred during a search. Otherwise we show the real error.",
    });
  }
  if (error.hasError) {
    return <SearchError error={error} />;
  }
  if (isLoading) {
    return <SearchLoading />;
  }

  const columns = [
    {
      id: 'report',
      label: intl.formatMessage({
        id: 'sort.report',
        defaultMessage: 'Report',
        description:
          'This is a header for a column in a search results table, referring to the fact that this column contains the main content of reports created by Check analysts.',
      }),
      minWidth: 550,
      format: (val, row) => (
        <>
          {row['report-image'] ? (
            <img
              className={classes.thumbnail}
              src={row['report-image']}
              alt={row.title}
            />
          ) : null}
          <Typography className={classes.itemTitle} variant="h6">
            {row.title}
          </Typography>
          <Typography className={classes.itemDescription} variant="body2">
            {row.description}
          </Typography>
        </>
      ),
      align: 'left',
    },
    {
      id: 'status',
      label: intl.formatMessage({
        id: 'sort.status',
        defaultMessage: 'Status',
        description:
          'This is a header for a column in a search results table that contains a field saying whether a fact-checked claim or report was deemed false or true.',
      }),
      apiField: 'report-rating',
      minWidth: 100,
      align: 'left',
    },
    {
      id: 'url',
      label: intl.formatMessage({
        id: 'sort.url',
        defaultMessage: 'Published article',
        description:
          'This is a header for a column in a search results table that contains a URL as a hyperlink the user can click on to view the original article the claim is about.',
      }),
      apiField: 'article-link',
      minWidth: 200,
      align: 'left',
      format: (value) => (value ? <a href={value} target="_blank">{value}</a> : '-'),
    },
    {
      id: 'sent',
      label: intl.formatMessage({
        id: 'sort.sent',
        defaultMessage: 'Sent',
        description:
          'This is a header for a column in a search results table that contains the number of times this item was sent on social media.',
      }),
      apiField: 'requests',
      minWidth: 100,
      align: 'left',
    },
  ];

  // basic numerical comparator; won't work for strings and dates
  // unless converted to numbers
  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const getComparator = (sortOrder, orderBy) =>
    sortOrder === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const sortOrder = comparator(a[0], b[0]);
      if (sortOrder !== 0) return sortOrder;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  // TODO: replace with onClick-based orderBy
  const orderBy = 'score';

  const handleSortClick = () => {
    setOrder(order === 'asc' ? 'desc' : 'asc');
  };

  return (
    <Paper elevation={0} variant="outlined" className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  classes={{
                    root: classes.headerCellRoot,
                    head: column.group === 'claim' ? classes.claimGroup : null,
                  }}
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: 10 }}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : 'asc'}
                    onClick={orderBy === column.id ? handleSortClick : null}
                    hideSortIcon={orderBy !== column.id}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {results.data.length === 0 ? (
              <tr>
                <td>
                  <Typography className={classes.noResults} variant="h6">
                    <FormattedMessage
                      id="search.noResults"
                      defaultMessage="No results found."
                      description="A message that appears when a user searches for similar items, but we could not find any results."
                    />
                  </Typography>
                </td>
              </tr>
            ) : (
              stableSort(results.data, getComparator(order, orderBy)).map(
                (row, index) => (
                  <TableRow
                    className={index % 2 ? classes.evenItem : ''}
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                  >
                    {columns.map((column) => {
                      let value;
                      if (column.apiField) {
                        value = row[column.apiField];
                      } else {
                        value = row[column.id];
                      }
                      return (
                        <TableCell
                          className={
                            column.id === 'claim-content'
                              ? classes.leftBorder
                              : null
                          }
                          key={column.id}
                          align={column.align}
                        >
                          {column.format
                            ? column.format(value, row, column)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ),
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

SearchResultsEmbed.propTypes = {
  results: PropTypes.object.isRequired,
  error: PropTypes.object.isRequired,
};

export default SearchResultsEmbed;
