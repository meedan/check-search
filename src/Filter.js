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

function Filter(props) {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  function QueryItems(props) {
    const { data, meta, error, isLoading, isFetching } = props.query;
    return (
      <>
        <Divider />
        {isLoading ? (
          // TODO: replace with spinner
          <div>loading</div>
        ) : (
          data.map((workspace, index) => (
            <ListItem key={workspace.id} button>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={false}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText id={index} primary={workspace.name} />
            </ListItem>
          ))
        )}
      </>
    );
  }

  return (
    <div>
      <ListItem button onClick={handleClick}>
        <ListItemText>
          <FormattedMessage id={props.localizedTitle} />
        </ListItemText>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {props.search ? (
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
        ) : (
          <></>
        )}
        <List component="div" disablePadding>
          {props.items
            .reduce((acc, cur) => acc.concat('|').concat(cur))
            .map((text, index) => {
              return text === '|' ? (
                <Divider key={index} />
              ) : (
                <ListItem button key={index}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={false}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText id={1} primary={text} />
                </ListItem>
              );
            })}
          {props.query ? <QueryItems query={props.query} /> : <></>}
        </List>
      </Collapse>
    </div>
  );
}

export default Filter;
