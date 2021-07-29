import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import bookService from './services/contacts'
import Notification from './components/Notification'


const App = () => {
  const [persons, setPersons] = useState([]) // All names and numbers
  const [newName, setNewName] = useState('') // Control new name input
  const [newNumber, setNewNumber] = useState('') // Control new number input
  const [newFilter, setNewFilter] = useState('') // Control search input
  const [errorMessage, setErrorMessage] = useState({
    message: null, success: true
  }) // Error message

  // Fetch all contacts data in the first render
  useEffect(() => {
    axios.get(bookService.baseUrl)
      .then(response => setPersons(response.data))
  }, [])

  // Those three handle the three inputs
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setNewFilter(event.target.value)
  }

  const handleErrorMessage = (error) => {
    console.log("Unable to save to the server")

    const errorMsg = error.response.data.error ?
      error.response.data.error : "Unable to save to the server";

    setErrorMessage({
      message: errorMsg,
      success: false
    })

    setTimeout(() => {
      setErrorMessage({ ...errorMessage, message: null })
    }, 5000)
  }

  // Helpers to remove, update and add to server
  const removeFromServer = (contact) => {
    if (window.confirm(`Delete ${contact.name}?`)) {
      bookService
        .remove(contact.id)
        .then((response) => {
          const updatedContacts = persons.filter(p => p.id !== contact.id)

          setPersons(updatedContacts)
        })
        .catch(error => { console.log("Unable to remove from the server") })
    }
  }

  const updateToServer = (person) => {
    const askUser = window.confirm(`${newName} is already added to phonebook, ` +
      "replace the old number with a new one?")

    if (askUser) {
      const newContact = { ...person, number: newNumber }
      bookService
        .update(newContact)
        .then((responseContact) => {
          const personsList = persons.map(p => p.id !== person.id ? p : newContact)

          setPersons(personsList)
          setNewName('')
          setNewNumber('')
        })
        .catch(error => handleErrorMessage(error))
    }

  }

  const addToServer = () => {
    const newContact = { name: newName, number: newNumber }

    bookService
      .create(newContact)
      .then(createdContact => {

        setPersons(persons.concat(createdContact))
        setNewName('')
        setNewNumber('')

        setErrorMessage({ message: `${newName} contact created`, success: true })

        setTimeout(() => {
          setErrorMessage({ ...errorMessage, message: null })
        }, 3000)
      })
      .catch(error => handleErrorMessage(error))
  }

  // nameAlreadyExist, isInputValid and addName handle the contact submission.
  const nameAlreadyExist = () => {
    const lowerCaseNames = persons.map((person) => person.name.toLowerCase())
    return lowerCaseNames.includes(newName.toLowerCase())
  }

  const isInputValid = () => {
    // Check if input isn't empty
    // Then if name already exist the number will be updated
    if (!newName || !newNumber) {
      alert("You need to provide name and number!")
    } else if (nameAlreadyExist()) {
      const person = persons.find((person) => {
        return person.name.toLowerCase() === newName.toLowerCase()
      })
      updateToServer(person);
    } else {
      return true
    }
    return false
  }

  const addName = (event) => {
    event.preventDefault()

    if (isInputValid(newName, newNumber)) {
      addToServer();
    }
  }

  return (
    <div className="wrapper">

      <h1>Phonebook</h1>

      <Filter
        newFilter={newFilter}
        handleSearchChange={handleSearchChange}
      />

      <h2>Add a new</h2>

      <PersonForm
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <Notification errorMessage={errorMessage} />

      <h2>Numbers</h2>

      <Persons
        persons={persons}
        newFilter={newFilter}
        remove={removeFromServer}
      />

    </div>
  );
}

export default App;
