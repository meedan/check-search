import React from 'react';
import { IntlProvider, FormattedMessage } from 'react-intl';
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
} from '@material-ui/core';
import messages from '../localization/messages';
import Sidebar from './Sidebar';
import Search from './Search';

const muiTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#2f80ed',
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
}));

function App() {
  const classes = useStyles();
  const locale = 'es';

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <ThemeProvider theme={muiTheme}>
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <Typography variant="h6" noWrap>
                <FormattedMessage id="homepage.title" />
              </Typography>
            </Toolbar>
          </AppBar>
          <Sidebar />
          <Search locale={locale} />
        </div>
      </ThemeProvider>
    </IntlProvider>
  );
}

export default App;
