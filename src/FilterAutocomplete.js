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

  function handleChange(e, selectedValues) {
    setValue(selectedValues);
  }

  return (
    <div className={classes.root}>
      <Autocomplete
        multiple
        id="tags-outlined"
        options={data}
        ChipProps={{ deleteIcon: <Close /> }}
        getOptionLabel={(option) => option.name}
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
