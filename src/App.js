import React, { useState } from 'react';
import { IntlProvider } from 'react-intl';
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
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

const mediaTypeOptions = [
  {
    label: 'Link',
    value: 'Link',
    isChecked: true,
  },
  {
    label: 'Text',
    value: 'Claim',
    isChecked: true,
  },
  {
    label: 'Image',
    value: 'UploadedImage',
    isChecked: true,
  },
  {
    label: 'Video',
    value: 'UploadedVideo',
    isChecked: true,
  },
  {
    label: 'Audio',
    value: 'UploadedAudio',
    isChecked: true,
  },
];

const archivedOptions = [
  {
    label: 'Not trashed',
    value: false,
    isChecked: true,
  },
  {
    label: 'Trashed',
    value: true,
    isChecked: false,
  },
];

const publishedOptions = [
  {
    label: 'Not published',
    value: 'unpublished',
    isChecked: true,
  },
  {
    label: 'Paused',
    value: 'paused',
    isChecked: true,
  },
  {
    label: 'Published',
    value: 'published',
    isChecked: true,
  },
];

function App() {
  const classes = useStyles();
  const [similarity, setSimilarity] = useState(90);
  const [workspaces, setWorkspaces] = useState([
    { id: -1, name: 'All', slug: 'ui-select-all' },
  ]);
  const [mediaTypes, setMediaTypes] = useState(mediaTypeOptions);
  const [archived, setArchived] = useState(archivedOptions);
  const [published, setPublished] = useState(publishedOptions);
  const [fuzzy, setFuzzy] = useState(false);

  const muiTheme = createMuiTheme({
    palette: {
      primary: {
        main: '#2f80ed',
      },
    },
    direction,
    drawerWidth: 297,
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
              <Sidebar
                {...{
                  similarity,
                  setSimilarity,
                  workspaces,
                  setWorkspaces,
                  mediaTypes,
                  setMediaTypes,
                  archived,
                  setArchived,
                  published,
                  setPublished,
                  fuzzy,
                  setFuzzy,
                }}
              />
              <Search
                {...{
                  similarity,
                  workspaces,
                  mediaTypes,
                  archived,
                  published,
                  fuzzy,
                }}
              />
            </div>
          </ThemeProvider>
        </StylesProvider>
      </AsyncIntlProvider>
    </React.Suspense>
  );
}

export default App;
