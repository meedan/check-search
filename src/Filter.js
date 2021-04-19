import React from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Collapse,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import {
  ExpandLess,
  ExpandMore,
} from '@material-ui/icons';
import FilterAutocomplete from './FilterAutocomplete';

const useStyles = makeStyles((theme) => ({
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(3),
  },
  error: {
    padding: theme.spacing(3),
    color: 'red',
  },
}));

function Filter(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const { query, items, header, setValue, value } = props;

  const handleClick = () => {
    setOpen(!open);
  };

  function QueryItems(queryProps) {
    const { data, error, isLoading } = queryProps.query;

    let element;
    if (isLoading) {
      element = (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      );
    } else if (error) {
      element = (
        <Typography
          className={`${classes.error} filter-error-message`}
          variant="h6"
        >
          {`Error ${error.status} fetching items: ${error.title}`}
        </Typography>
      );
    } else {
      element = (
        <FilterAutocomplete data={data} setValue={setValue} value={value} />
      );
    }

    return (
      <>
        <Divider />
        {element}
      </>
    );
  }

  return (
    <div>
      <ListItem button onClick={handleClick}>
        <ListItemText>{header}</ListItemText>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding dense>
          {items
            ? items
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
                )
            : null}
          {query ? <QueryItems query={query} /> : null}
        </List>
      </Collapse>
    </div>
  );
}

Filter.defaultProps = {
  query: undefined,
  items: undefined,
};

Filter.propTypes = {
  query: PropTypes.object,
  items: PropTypes.array,
};

export default Filter;
