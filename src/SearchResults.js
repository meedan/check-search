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
  Paper,
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
  if (!Array.isArray(results)) {
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
      label: 'Report',
      minWidth: 170,
      align: 'left',
    },
    {
      id: 'published',
      label: 'Published',
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
      label: 'Status',
      apiField: 'report-rating',
      minWidth: 100,
      align: 'left',
    },
    {
      id: 'score',
      label: 'Score',
      minWidth: 100,
      align: 'left',
    },
    {
      id: 'url',
      label: 'Published article',
      apiField: 'article-link',
      minWidth: 100,
      align: 'left',
      format: (value) => <a href={value}>{value}</a>,
    },
    {
      id: 'sent',
      label: 'Sent',
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
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((row) => (
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
                        {value && column.format ? column.format(value) : value}
                      </TableCell>
                    );
                  }
                  return result;
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[2, 10, 50]}
        component="div"
        count={10}
        rowsPerPage={rowsPerPage}
        page={pageNumber}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

SearchResults.propTypes = {
  results: PropTypes.array.isRequired,
  error: PropTypes.object.isRequired,
};

export default SearchResults;
