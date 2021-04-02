import React from "react";
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import ClearIcon from '@material-ui/icons/Clear';

const PhoneBook = ({ persons, showFilter, removeEntry }) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.background.paper,
    },
  }));

  // capitalize whats in the filter inputs  
  let filterUpperCase = showFilter.toUpperCase();
  // filter though persons based on filter inputs value
  let newPersonArray = persons.filter(person => {
    // console.log('this is person', person.name)
    let personInUpperCase = person.name.toUpperCase();
    return personInUpperCase.includes(filterUpperCase);
  });

  const classes = useStyles();
  // loop through newPersonArray and creat an li for each element
  return newPersonArray.map(person => (
    <div className={classes.root}>
      <Divider />
      <ListItem button key={person.name}>
        <ListItemText>{person.name} : {person.number}</ListItemText>
        <ClearIcon onClick={() => removeEntry(person)} />
      </ListItem>
    </div>
  ));
};

export default PhoneBook;