import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Collapse,
  TextField,
  InputAdornment,
} from '@material-ui/core';
import {
  Search as SearchIcon,
  ExpandLess,
  ExpandMore,
} from '@material-ui/icons';

function Filter(props) {
  const [open, setOpen] = React.useState(true);
  const { query, localizedTitle, search, items } = props;

  const handleClick = () => {
    setOpen(!open);
  };

  function QueryItems() {
    const { data, isLoading } = query;

    return (
      <>
        <Divider />
        {isLoading ? (
          // TODO: replace with spinner
          <div className="loading-message">loading</div>
        ) : (
          data.map((workspace, index) => (
            <ListItem key={workspace.id} button className="query-item">
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
          <FormattedMessage id={localizedTitle} />
        </ListItemText>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {search ? (
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
          {items
            .reduce((acc, cur) => acc.concat('|').concat(cur))
            .map((text, index) =>
              // Disabling react index-key rule because we are dividing
              // up a simple array.
              /* eslint-disable react/no-array-index-key */
              text === '|' ? (
                <Divider key={index} className="divider" />
              ) : (
                <ListItem button key={index} className="item">
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
                /* eslint-enable react/no-array-index-key */
              ),
            )}
          {query ? <QueryItems query={query} /> : <></>}
        </List>
      </Collapse>
    </div>
  );
}

export default Filter;
