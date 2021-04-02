import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const Filter = ({ showFilter, setshowFilter }) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
  }));

  const filterPersons = e => {
    setshowFilter(e.target.value);
  };

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <TextField id="outlined-basic" value={showFilter} label="filter" variant="outlined" onChange={filterPersons} />
    </div>
  );
};

export default Filter;