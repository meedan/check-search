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
import { ExpandLess, ExpandMore } from '@material-ui/icons';
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
  const { query, header, setValue, value, isOpenDefault, isAllDefault } = props;
  const [open, setOpen] = React.useState(
    isOpenDefault !== undefined ? isOpenDefault : true,
  );
  const [selectAllChecked, setSelectAllChecked] = React.useState(isAllDefault);
  let items = [];

  function handleClick() {
    setOpen(!open);
  }

  function handleCheck(e) {
    // find the correct value by value, flip it, set it
    const newArr = [...value];
    newArr[
      value.findIndex((item) => item.value.toString() === e.target.name)
    ].isChecked = e.target.checked;
    setValue(newArr);

    // modify "All" as needed
    if (e.target.checked) {
      if (newArr.every((item) => item.isChecked)) {
        setSelectAllChecked(true);
      }
    } else if (newArr.some((item) => !item.isChecked)) {
      setSelectAllChecked(false);
    }
  }

  function handleSelectAll(e) {
    const isAll = e.target.checked;
    const newArr = [...value];
    newArr.forEach((item) => {
      item.isChecked = isAll;
    });
    setValue(newArr);
    setSelectAllChecked(isAll);
  }

  // if the filter isn't sourced from an external query, render value list instead
  if (!query && value) {
    items.push(
      <ListItem button key="all" className="item">
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={selectAllChecked}
            name="all"
            tabIndex={-1}
            disableRipple
            onChange={handleSelectAll}
            color="primary"
          />
        </ListItemIcon>
        <ListItemText id={1} primary="All" />
      </ListItem>,
    );
    items.push(
      value.map((item) => (
        <ListItem button key={item.value} className="item">
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={item.isChecked}
              name={item.value.toString()}
              tabIndex={-1}
              disableRipple
              onChange={handleCheck}
              color="primary"
            />
          </ListItemIcon>
          <ListItemText id={1} primary={item.label} />
        </ListItem>
      )),
    );
    items = items.flat();
  }

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
      <ListItem className="header-button" button onClick={handleClick}>
        <ListItemText>{header}</ListItemText>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding dense>
          {items}
          {query ? <QueryItems query={query} /> : null}
        </List>
      </Collapse>
    </div>
  );
}

Filter.defaultProps = {
  query: undefined,
  isAllDefault: true,
  isOpenDefault: true,
};

Filter.propTypes = {
  query: PropTypes.object,
  isAllDefault: PropTypes.bool,
  isOpenDefault: PropTypes.bool,
};

export default Filter;
