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
if (locale.constructor === Array) {
  [locale] = locale;
}
locale = locale.replace(/[-_].*$/, '');
if (locales.indexOf(locale) === -1) {
  locale = 'en';
}

const isRtl = rtlDetect.isRtlLang(locale);
const direction = isRtl ? 'rtl' : 'ltr';

// based on https://stackoverflow.com/a/58617341/4869657
function AsyncIntlProvider({ children }) {
  const messages = getMessages(locale);

  return (
    <div dir={direction}>
      <IntlProvider locale={locale} messages={messages}>
        {children}
      </IntlProvider>
    </div>
  );
}

function getMessages(locale) {
  if (messagesCache[locale]) {
    return messagesCache[locale];
  }
  throw loadMessages(locale);
}

async function loadMessages(locale) {
  // Webpack will intrepret the following import as dynamic loading and
  // split the locales into chunks
  const messages = await import(`../localization/${locale}.json`);
  // Transform message from transifex structured JSON to react-intl
  const messagesTransformed = {};
  for (const key of Object.keys(messages.default)) {
    messagesTransformed[key] = messages[key].string;
  }
  messagesCache[locale] = messagesTransformed;
  return messages;
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
