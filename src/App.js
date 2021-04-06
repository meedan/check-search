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
  CircularProgress,
} from '@material-ui/core';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';
import rtlDetect from 'rtl-detect';
import Sidebar from './Sidebar';
import Search from './Search';
import locales from '../localization/locales';

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(3),
  },
}));

const messagesCache = {};

// detect locale from browser
let locale =
  navigator.languages || navigator.language || navigator.userLanguage || 'en';
if (Array.isArray(locale)) {
  [locale] = locale;
}
locale = locale.replace(/[-_].*$/, '');
if (locales.indexOf(locale) === -1) {
  locale = 'en';
}

const isRtl = rtlDetect.isRtlLang(locale);
const direction = isRtl ? 'rtl' : 'ltr';

async function loadMessages() {
  // Webpack will intrepret the following import as dynamic loading and
  // split the locales into chunks
  const messages = await import(`../localization/${locale}.json`);
  // Transform message from transifex structured JSON to react-intl
  /* eslint-disable no-param-reassign */
  const messagesTransformed = Object.keys(messages.default).reduce(
    (obj, key) => {
      obj[key] = messages[key].string;
      return obj;
    },
    {},
  );
  /* eslint-enable no-param-reassign */
  messagesCache[locale] = messagesTransformed;
  return messages;
}

function getMessages() {
  if (messagesCache[locale]) {
    return messagesCache[locale];
  }
  throw loadMessages(locale);
}

// based on https://stackoverflow.com/a/58617341/4869657
function AsyncIntlProvider({ children }) {
  const messages = getMessages();

  return (
    <div dir={direction}>
      <IntlProvider locale={locale} messages={messages}>
        {children}
      </IntlProvider>
    </div>
  );
}

function App() {
  const classes = useStyles();

  const muiTheme = createMuiTheme({
    palette: {
      primary: {
        main: '#2f80ed',
      },
    },
    direction,
  });

  return (
    <React.Suspense
      fallback={
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      }
    >
      <AsyncIntlProvider>
        <StylesProvider jss={jss}>
          <ThemeProvider theme={muiTheme}>
            <div className={classes.root}>
              <CssBaseline />
              <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                  <Typography variant="h6" noWrap>
                    <FormattedMessage
                      id="homepage.title"
                      defaultMessage="Similarity Search Prototype"
                      description="This title field is not a product name and can be translated for meaning. It should indicate that it is a basic tool for testing the results of our new search methods. These methods return results based on how similar items are to one another."
                    />
                  </Typography>
                </Toolbar>
              </AppBar>
              <Sidebar />
              <Search />
            </div>
          </ThemeProvider>
        </StylesProvider>
      </AsyncIntlProvider>
    </React.Suspense>
  );
}

export default App;
