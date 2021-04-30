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
  Box,
  IconButton,
} from '@material-ui/core';
import {
  Search as SearchIcon,
  Cancel as CancelIcon,
  FiberManualRecord as MaskIcon,
} from '@material-ui/icons';
import { useClient } from 'jsonapi-react';
import SearchResults from './SearchResults';

const useStyles = makeStyles((theme) => ({
  title: {
    margin: theme.spacing(1),
  },
  heading: {
    maxWidth: '900px',
  },
  content: {
    padding: theme.spacing(3),
    width: '100%',
  },
  input: {
    display: 'none',
  },
  image: {
    margin: theme.spacing(1),
    position: 'relative',
    overflowY: 'hidden',
    height: '50px',
    maxWidth: '50px',
    '& img': {
      maxWidth: '50px',
    },
    '& svg,button': {
      position: 'absolute',
      left: '1px',
      top: '1px',
    },
  },
  searchButton: {
    margin: theme.spacing(1),
  },
  searchIcon: {
    position: 'relative',
    top: '0.17em',
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
  const { similarity, workspaces, mediaTypes, archived, fuzzy } = props;
  const [results, setResults] = useState({
    data: [],
    meta: { 'record-count': 0 },
  });
  const [pageNumber, setPageNumber] = useState(0);
  const [confirmedText, setConfirmedText] = useState('');
  const [error, setError] = useState({ hasError: false, message: '' });
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [imgData, setImgData] = useState({ data: '', name: '' });
  const [isLoading, setIsLoading] = useState(false);
  const client = useClient();

  async function getData() {
    let data;
    const similarity_threshold = similarity / 100;
    const similarity_organization_ids = workspaces
      .map((item) => item.id)
      .toString();
    const media_type = mediaTypes
      .filter((item) => item.isChecked)
      .map((item) => item.value);
    const number = pageNumber + 1;
    const size = rowsPerPage;

    const archivedAllChecked =
      archived.every((item) => item.isChecked) || archived.length === 0;
    const archivedParam = archivedAllChecked
      ? ''
      : archived.filter((item) => item.isChecked).map((item) => item.value)[0];

    if (imgData.data.length > 0) {
      // This is an image, so we do a multipart/form (non JSONAPI-compliant)
      // request
      const url = `${client.config.url}/reports`;
      const formData = new FormData();
      formData.append('filter[similar_to_image]', imgData.file);
      formData.append('filter[similarity_threshold]', similarity_threshold);
      formData.append(
        'filter[similarity_organization_ids]',
        similarity_organization_ids,
      );
      if (media_type.length > 0) {
        formData.append('filter[media_type]', media_type);
      }
      if (!archivedAllChecked) {
        formData.append('filter[archived]', archivedParam ? 1 : 0);
      }
      formData.append('page[size]', size);
      formData.append('page[number]', number);
      setIsLoading(true);
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: client.config.headers,
      });
      data = await response.json();
      const normalizedData = data.data.map((item) => ({
        ...item.attributes,
        id: item.id,
      }));
      data.data = normalizedData;
      setIsLoading(false);
    } else {
      setIsLoading(true);
      data = await client.fetch([
        'reports',
        {
          filter: {
            similar_to_text: confirmedText,
            similarity_threshold,
            similarity_organization_ids,
            media_type,
            archived: archivedParam ? 1 : 0,
            fuzzy,
          },
          page: {
            size,
            number,
          },
        },
      ]);
      setIsLoading(false);
    }
    return data;
  }

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    // prevent search on page load
    if (confirmedText.length === 0 && imgData.data.length === 0) {
      return;
    }
    let data = {};
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
        <Grid
          className={classes.heading}
          container
          justify="center"
          align="center"
          alignItems="center"
        >
          <SearchInput {...{ setConfirmedText, imgData, setImgData }} />
        </Grid>
        <SearchResults
          {...{
            error,
            results,
            rowsPerPage,
            setRowsPerPage,
            pageNumber,
            setPageNumber,
            handleSubmit,
            isLoading,
          }}
        />
      </form>
    </main>
  );
}

function SearchInput(props) {
  const classes = useStyles();
  const { setConfirmedText, imgData, setImgData } = props;
  const intl = useIntl();
  const [searchText, setSearchText] = useState('');

  function handleUpload(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setImgData({ data: reader.result, name: file.name, file });
      setSearchText('');
    };
  }

  function handleImageDismiss() {
    setImgData({ data: '', name: '' });
  }

  function ImagePreview() {
    return (
      <Box className={classes.image}>
        <MaskIcon fontSize="small" htmlColor="white" />
        <IconButton onClick={handleImageDismiss}>
          <CancelIcon fontSize="small" htmlColor="black" />
        </IconButton>
        <img src={imgData.data} alt={imgData.name} />
      </Box>
    );
  }

  return (
    <>
      <Grid
        item
        xs={8}
        container
        direction="row"
        alignItems="center"
        justify="flex-start"
      >
        <Box className={classes.title}>
          <Typography variant="h4">
            <SearchIcon className={classes.searchIcon} fontSize="inherit" />
            <FormattedMessage
              id="search.title"
              defaultMessage="Check"
              description="This is the title of the application."
            />
          </Typography>
        </Box>
        <Box flexGrow={1}>
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
            fullWidth
            autoFocus
            disabled={imgData.data.length > 0}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Box>
        {imgData.data.length > 0 ? <ImagePreview /> : null}
      </Grid>
      <Grid
        item
        xs={4}
        container
        direction="row"
        alignItems="flex-start"
        justify="flex-start"
      >
        <label htmlFor="media-upload">
          <input
            className={classes.input}
            id="media-upload"
            type="file"
            accept="image/*"
            onChange={handleUpload}
          />
          <Button
            variant="contained"
            color="primary"
            className={classes.searchButton}
            component="span"
          >
            <FormattedMessage
              id="search.image"
              defaultMessage="Add image"
              description="This is a label on a button that the user presses in order to upload an image file that will then be searched for. This action opens a file picker prompt."
            />
          </Button>
        </label>

        <Button
          variant="contained"
          color="primary"
          className={classes.searchButton}
          type="submit"
          onClick={() => setConfirmedText(searchText)}
          disabled={searchText.length === 0 && imgData.data.length === 0}
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
