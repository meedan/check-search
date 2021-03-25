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

const drawerWidth = 296;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
    padding: theme.spacing(3),
  },
}));

function Sidebar() {
  const classes = useStyles();

  const workspacesQuery = useQuery('workspaces');
  return (
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
          <Filter
            localizedTitle="filters.type"
            items={[['All'], ['Report published', 'Query submissions']]}
          />
          <Filter
            localizedTitle="filters.organizations"
            items={[['All'], ['Meedan users', 'Non-Meedan users']]}
            query={workspacesQuery}
          />
        </List>
      </div>
    </Drawer>
  );
}

export default Sidebar;
