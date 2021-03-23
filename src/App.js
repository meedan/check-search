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

const drawerWidth = 240;

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
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    padding: theme.spacing(3),
    width: '100%',
  },
}));

function FilterContentType() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div>
      <ListItem button onClick={handleClick}>
        <ListItemText>
          <FormattedMessage id="filters.type" />
        </ListItemText>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button className={classes.nested}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={false}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText id={1} primary="All" />
          </ListItem>
          <Divider />
          <ListItem button className={classes.nested}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={false}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText id={2} primary="Report published" />
          </ListItem>
          <ListItem button className={classes.nested}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={false}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText id={3} primary="Query submissions" />
          </ListItem>
        </List>
      </Collapse>
    </div>
  );
}

function FilterOrganizations() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const organizations = ['India Today', 'Globo', 'Factly'];

  return (
    <div>
      <ListItem button onClick={handleClick}>
        <ListItemText>
          <FormattedMessage id="filters.organizations" />
        </ListItemText>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <TextField
          type="search"
          id="search"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <List component="div" disablePadding>
          <ListItem key="1" button className={classes.nested}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={false}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText id={1} primary="All" />
          </ListItem>
          <Divider />
          <ListItem key="2" button className={classes.nested}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={false}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText id={2} primary="Meedan users" />
          </ListItem>
          <ListItem key="3" button className={classes.nested}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={false}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText id={3} primary="Non-Meedan users" />
          </ListItem>
          <Divider />
          {organizations.map((value, index) => (
            <ListItem key={value} button className={classes.nested}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={false}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText id={index + 4} primary={value} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </div>
  );
}

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
          <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <Toolbar />
            <div className={classes.drawerContainer}>
              <List>
                <ListItem>
                  <Typography variant="h6" noWrap>
                    <FormattedMessage id="sidebar.filters" />
                  </Typography>
                </ListItem>
                <FilterContentType />
                <FilterOrganizations />
              </List>
            </div>
          </Drawer>
          <main className={classes.content}>
            <Toolbar />
            <Grid
              container
              justify="center"
              align="center"
              alignItems="center"
              spacing={2}
            >
              <Grid item xs={12}>
                <Typography variant="h6">
                  <FormattedMessage id="search.title" />
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  type="search"
                  id="search"
                  label={messages[locale]['search.action']}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button align="left" variant="contained" color="primary">
                  <FormattedMessage id="search.action" />
                </Button>
              </Grid>
            </Grid>
          </main>
        </div>
      </ThemeProvider>
    </IntlProvider>
  );
}
export default App;
