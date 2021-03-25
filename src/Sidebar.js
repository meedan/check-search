import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  makeStyles,
  Drawer,
  Toolbar,
  Typography,
  List,
  ListItem,
} from '@material-ui/core';
import { useQuery } from 'jsonapi-react';
import Filter from './Filter';

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
