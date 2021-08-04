import React from 'react';
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
import SearchEmbed from './SearchEmbed';
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
    isChecked: false,
  },
  {
    label: 'Paused',
    value: 'paused',
    isChecked: false,
  },
  {
    label: 'Published',
    value: 'published',
    isChecked: true,
  },
];

function EmbedApp() {
  const classes = useStyles();
  const similarity = 90;
  const workspaces = [
    { id: -1, name: 'All', slug: 'ui-select-all' },
  ];
  const fuzzy = false;
  const mediaTypes = mediaTypeOptions;
  const archived = archivedOptions;
  const published = publishedOptions;

  const muiTheme = createMuiTheme({
    palette: {
      primary: {
        main: '#2f80ed',
      },
    },
    direction,
    drawerWidth: 0,
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
              <SearchEmbed
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

export default EmbedApp;
