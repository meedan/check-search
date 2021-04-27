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
  TablePagination,
  TableRow,
  TableSortLabel,
  Paper,
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
  },
  container: {
    height: 700,
    maxHeight: 700,
  },
  thumbnail: {
    padding: theme.spacing(1),
    maxHeight: '200px',
    maxWidth: '200px',
    float: 'left',
  },
  noResults: {
    margin: theme.spacing(2),
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
  const {
    results,
    error,
    rowsPerPage,
    setRowsPerPage,
    pageNumber,
    setPageNumber,
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
  const columns = [
    {
      id: 'report',
      label: intl.formatMessage({
        id: 'sort.report',
        defaultMessage: 'Reports & Claims',
        description:
          'This is a header for a column in a search results table, referring to the fact that this column contains the main content of reports made and claims filed in Check.',
      }),
      minWidth: 170,
      align: 'left',
    },
    {
      id: 'published',
      label: intl.formatMessage({
        id: 'sort.published',
        defaultMessage: 'Published',
        description:
          'This is a header for a column in a search results table that contains the date that items were published on.',
      }),
      minWidth: 50,
      align: 'left',
      format: (value) => {
        const d = new Date(value * 1000);
        const formatted = new Intl.DateTimeFormat().format(d).toString();
        return formatted;
      },
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
      id: 'score',
      label: intl.formatMessage({
        id: 'sort.score',
        defaultMessage: 'Score',
        description:
          'This is a header for a column in a search results table that contains a numerical score telling the user how similar a particular search result is to their query.',
      }),
      apiField: 'score',
      minWidth: 100,
      align: 'left',
      format: (value) => value.toFixed(2),
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
      minWidth: 100,
      align: 'left',
      format: (value) => <a href={value}>{value}</a>,
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

  const handleChangePage = (event, newPage) => {
    setPageNumber(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPageNumber(0);
  };

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
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : 'asc'}
                    onClick={handleSortClick}
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
                (row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column) => {
                      let result;
                      if (column.id === 'report') {
                        result = (
                          <TableCell key={column.id} align={column.align}>
                            {row['lead-image'] ? (
                              <img
                                className={classes.thumbnail}
                                src={row['lead-image']}
                                alt={row.title}
                              />
                            ) : null}
                            <Typography variant="h6">{row.title}</Typography>
                            <Typography variant="body2">
                              {row.description}
                            </Typography>
                          </TableCell>
                        );
                      } else {
                        let value;
                        if (column.apiField) {
                          value = row[column.apiField];
                        } else {
                          value = row[column.id];
                        }
                        result = (
                          <TableCell key={column.id} align={column.align}>
                            {value && column.format
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      }
                      return result;
                    })}
                  </TableRow>
                ),
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[2, 10, 50]}
        component="div"
        count={results.meta['record-count']}
        rowsPerPage={rowsPerPage}
        page={pageNumber}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

SearchResults.propTypes = {
  results: PropTypes.object.isRequired,
  error: PropTypes.object.isRequired,
};

export default SearchResults;
