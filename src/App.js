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
import { create } from 'jss';
import rtl from 'jss-rtl';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';
import messages from '../localization/messages';
import Sidebar from './Sidebar';
import Search from './Search';

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

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
  const locale = 'en';
  const direction = 'ltr';

  const muiTheme = createMuiTheme({
    palette: {
      primary: {
        main: '#2f80ed',
      },
    },
    direction,
  });

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <StylesProvider jss={jss}>
        <ThemeProvider theme={muiTheme}>
          <div dir={direction} className={classes.root}>
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
      </StylesProvider>
    </IntlProvider>
  );
}

export default App;
