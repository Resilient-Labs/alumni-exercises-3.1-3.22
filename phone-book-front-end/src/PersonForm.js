import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

const PersonForm = ({
  newName,
  newNumber,
  addNewName,
  handleNameChange,
  handleNumberChange
}) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(2),
        width: '50ch',
      },
    },
    press: {
      marginLeft: 75,
      extendedIcon: {
        marginRight: theme.spacing(1),
      },
    }
  }));

  const classes = useStyles();
  return (
    <Grid container spacing={1}>
      <form onSubmit={addNewName} className={classes.root} noValidate autoComplete="off">
        <Grid item xs={12}>
          {/* calls the function tracking values in the name input */}
          <TextField id="outlined-basic" className={classes.root} label="Name" value={newName} onChange={handleNameChange} variant="outlined" />
        </Grid>
        {/* calls the function tracking values in the numer input */}
        <Grid item xs={12}>
          <TextField id="outlined-basic" className={classes.root} value={newNumber} onChange={handleNumberChange} label="Number" variant="outlined" />
        </Grid>
        {/* calls the create request to add name and number */}
        <Fab variant="extended" color="primary" aria-label="add" className={classes.press} type="submit">
          <AddIcon className={classes.extendedIcon} />
         Add
        </Fab>
      </form>
    </Grid>
  );
};

export default PersonForm;
