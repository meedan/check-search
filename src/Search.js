import React from 'react';
import { IntlProvider, FormattedMessage } from 'react-intl';
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
  Button,
  Drawer,
  Divider,
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Collapse,
  TextField,
  Grid,
  InputAdornment,
} from '@material-ui/core';
import {
  Search as SearchIcon,
  ExpandLess,
  ExpandMore,
} from '@material-ui/icons';
import messages from '../localization/messages';
import Filter from './Filter';
import { useQuery } from 'jsonapi-react';

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(3),
    width: '100%',
  },
  searchButton: {
    margin: theme.spacing(1),
  },
}));

function Search(props) {
  const classes = useStyles();
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
            label={messages[props.locale]['search.action']}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            align="left"
            variant="contained"
            color="primary"
            className={classes.searchButton}
          >
            <FormattedMessage id="search.action" />
          </Button>
        </Grid>
      </Grid>
    </main>
  );
}

export default Search;
