import React, { useState, useEffect } from "react";
import personsService from "./Service/person";
import Filter from "./Filter";
import Notification from "./Notification";
import PersonForm from "./PersonForm";
import PhoneBook from "./PhoneBook";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [showFilter, setshowFilter] = useState("");
  const [notification, setNotification] = useState(null);
  const [success, setSuccess] = useState(null);

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      margin: 50,

    },
    paper: {
      padding: theme.spacing(2),
      justifyItems: 'center',
      color: theme.palette.text.secondary,
      overflow: 'auto',
      height: 400,
    },
    header: {
      padding: theme.spacing(2),
      justifyItems: 'center',
      color: theme.palette.text.secondary,
      overflow: 'auto',
      textAlign: 'center'
    },
    addFriend: {
      padding: theme.spacing(2),
      justifyItems: 'center',
      color: theme.palette.text.secondary,
      overflow: 'auto',

      height: 650,
      justifyContent: 'center'

    },
  }));

  // show data on the screen
  useEffect(() => {
    personsService
      .getAll()
      .then(response => {
        setPersons(response);
      })
      .catch(error => showMessage("Could not retrieve data", false));
  }, []);

  const addNewName = e => {
    e.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber
    };

    // if name is already in phone book return true and alert user
    if (persons.some(e => e.name === newName)) {
      // first name equal to that name 
      let personId = persons.find(item => item.name === newName);
      // assigning whats in person obj to person id to update the entry
      let updatedEntry = Object.assign(personId, personObject);
      // alert the user  to update name  and / or  number
      if (
        window.confirm(
          `Do you want to update ${newName} with number ${newNumber}?`
        )
      ) {
        // based on the condition it will make put request to update
        personsService
          .update(personId.id, personObject)
          .then(() => {
            setPersons(
              // map through persons check if name is equal to new name 
              //and either return updatedEntry or item
              persons.map(item => (item.name === newName ? updatedEntry : item))
            );
            // reset inputs 
            setNewName("");
            setNewNumber("");
            // alert user of the changes 
            showMessage(`User ${newName} phone number updated`);
          })
          // <-----------------------------------COME BACK AND CHECK ---------------------------------------->
          .catch(error => {
            showMessage(
              `Update failed. User ${newName} has already been removed from the phone book.`,
              false
            );
            setPersons(persons.filter(n => n.name !== newName));
          });
      }
    } else {
      // if number is already in phone book return true and alert user
      if (persons.some(e => e.number === newNumber)) {
        showMessage(`# ${newNumber} is already in the phone book.`, false);
      } else {
        // check if inputs are empty and set show message
        if (newName === "" || newNumber === "") {
          showMessage(`The name and number must not be empty`, false);
        } else {
          // add personObject to the data base 
          personsService
            .create(personObject)
            .then(returnedPerson => {
              setPersons(persons.concat(returnedPerson));
              // reset inputs 
              setNewName("");
              setNewNumber("");
              // alert user
              showMessage(`User ${newName} has been added to the phone book`);
            })
            // <-----------------------------------COME BACK AND CHECK ---------------------------------------->
            .catch(error => {
              console.log(error.response.data.error);
              return showMessage(
                `Failed to add number. More about error: ${error.response.data.error
                }`,
                false
              );
            });
          // make a get requests of updated data
          personsService
            .getAll()
            .then(response => {
              setPersons(response);
            })
            .catch(error => showMessage("Could not retrieve data", false));
        }
      }
    }
  };

  const removeEntry = person => {
    // if user clicks yes to remove
    if (window.confirm(`Remove ${person.name}?`)) {
      // call delete request with id that needs to be deleted
      personsService
        .remove(person.id)
        .then(() => {
          // setPerson to filtered array of every preson but the deleted person
          setPersons(persons.filter(item => item.id !== person.id));
          showMessage(`${person.name} has been removed from the phone book`);
        })
        // <-----------------------------------COME BACK AND CHECK ---------------------------------------->
        .catch(error => {
          showMessage(
            `Removal failed. User ${person.name
            } has already been removed from the phone book.`,
            false
          );
          // make a get requests of updated data
          personsService
            .getAll()
            .then(response => {
              setPersons(response);
            })
            .catch(error => showMessage("Could not retrieve data", false));
        });
    }
  };

  // tracking values in the name input
  const handleNameChange = e => {
    // console.log(e.target.value);
    setNewName(e.target.value);
  };

  // tracking values in the number input
  const handleNumberChange = e => {
    setNewNumber(e.target.value);
  };

  const showMessage = (message, successNotification = true) => {
    // sets notication based on the true or false given by the condiyion it was called in
    setNotification(message);
    // boolean value if the rquest was successful or not
    setSuccess(successNotification);

    // the notificatio will stay on browser for 3 sec
    setTimeout(() => {
      setNotification(null);
      setSuccess(null);
    }, 3000);
  };

  // console.log('this is persons', persons)
  const classes = useStyles();
  return (
    <div className={classes.root} >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper className={classes.header}>
            <h2>Phone Book</h2>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.addFriend}>
            <Paper className={classes.header}>
              <h2>Add A New Friend</h2>
            </Paper>
            <PersonForm
              addNewName={addNewName}
              newName={newName}
              handleNameChange={handleNameChange}
              handleNumberChange={handleNumberChange}
            />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.addFriend}>
            <Paper className={classes.header}>
              <h2>Numbers</h2>
            </Paper>
            <Notification notification={notification} success={success} />
            <Filter showFilter={showFilter} setshowFilter={setshowFilter} />
            <ul>
            <Paper className={classes.paper}>
                <PhoneBook
                  persons={persons}
                  showFilter={showFilter}
                  removeEntry={removeEntry}
                />
              </Paper>
            </ul>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default App;
