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
              <FormattedMessage id="sidebar.filters" defaultMessage="Filters" />
            </Typography>
          </ListItem>
          <Filter
            id="filters.type"
            defaultMessage="Content Type"
            items={[['All'], ['Report published', 'Query submissions']]}
          />
          <Filter
            id="filters.organizations"
            defaultMessage="Organizations"
            items={[['All'], ['Meedan users', 'Non-Meedan users']]}
            query={workspacesQuery}
            search
          />
        </List>
      </div>
    </Drawer>
  );
}

export default Sidebar;
