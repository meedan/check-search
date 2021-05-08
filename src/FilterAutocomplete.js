import React from 'react';
import PropTypes from 'prop-types';
import { TextField, makeStyles } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Close } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(3),
    },
    '& .MuiAutocomplete-tag': {
      margin: theme.spacing(0.25),
      height: '22px',
      fontSize: '0.75rem',
      backgroundColor: '#2f80ed',
      color: 'white',
      '& .MuiChip-label': {
        padding: '2px 6px 2px 8px',
        fontWeight: 600,
      },
      '& .MuiChip-deleteIcon': {
        margin: '0px 2px 0px -6px',
        color: 'white',
      },
    },
  },
}));

function FilterAutocomplete(props) {
  const classes = useStyles();
  const { data, setValue, value } = props;
  const options = [{ id: -1, name: 'All', slug: 'ui-select-all' }, ...data];

  function handleChange(e, selectedValues) {
    let result = selectedValues;
    // if the current value has only All and we are selecting a new value that is not All, remove All
    if (
      value.length > 0 &&
      value.every((item) => item.id === -1) &&
      selectedValues.some((item) => item.id !== -1)
    ) {
      result.splice(
        selectedValues.findIndex((item) => item.id === -1),
        1,
      );
    } else if (
      // if the current value has NO All and we are selecting a new All, then remove other filters
      value.length > 0 &&
      value.every((item) => item.id !== -1) &&
      selectedValues.some((item) => item.id === -1)
    ) {
      result = selectedValues.filter((item) => item.id === -1);
    }
    setValue(result);
  }

  return (
    <div className={classes.root}>
      <Autocomplete
        multiple
        id="tags-outlined"
        options={options}
        ChipProps={{ deleteIcon: <Close /> }}
        getOptionLabel={(option) => option.name}
        getOptionSelected={(option, val) => option.id === val.id}
        onChange={handleChange}
        defaultValue={[]}
        value={value}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Select specific publishers"
          />
        )}
      />
    </div>
  );
}

FilterAutocomplete.defaultProps = {
  data: undefined,
  setValue: undefined,
  value: [],
};

FilterAutocomplete.propTypes = {
  data: PropTypes.array,
  setValue: PropTypes.func,
  value: PropTypes.array,
};

export default FilterAutocomplete;
