import { useState, useEffect } from 'react'

import { AddNewPersonForm, FilterForm } from './components/Forms'
import NotificationBar from './components/NotificationsBar'
import personService from './services/persons'
import PhoneBook from './components/PhoneBook'



const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')

  const [newNumber, setNewNumber] = useState('')

  const [filterPhrase, setFilter] = useState('')

  const [message, setMessage] = useState(null)

  const [messageLevel, setMessageLevel] = useState('green')

  useEffect(() => {
    personService.getAll().then(persons => setPersons(persons))
    }, [])

  const onNameInput = (event) => setNewName(event.target.value)
  
  const onNumberInput = (event) => setNewNumber(event.target.value)

  const onFilterInput = (event) => setFilter(event.target.value)

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some((person => person.name === newName))) {
      if (window.confirm(`${newName} is already added to the phonebook, replace old number with new one?`)) {
        const person = persons.find(p => p.name ===newName)
        personService.update({...person, number: newNumber})
          .then(updated => {
            setPersons(persons.map(original => updated.id === original.id ? updated : original))
            informUser(`${person.name} number updated`, false)
          })
          .catch(error => {
            if (error.response) {
              informUser(error.response.body.error, true)
            } else {
              informUser("It seems the person has been already removed from the server, can't update", true)
              setPersons(persons.filter(p => p.id !== person.id))
            }
          })
      } else {
        setNewName('')
        setNewNumber('')
      }
    } else {
      let newPerson = {name: newName, number: newNumber}
      personService.create(newPerson)
        .then(person => {
          informUser(`${person.name} added to phonebook!`, false)
          setPersons(persons.concat(person))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          console.log("New person error: ", error.response.data.error)
          informUser(error.response.data.error, true)
        })
    }
  }

  const informUser = (message, isError) => {
    setMessage(message)
    isError ? setMessageLevel("red") : setMessageLevel("green")
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const personRemover = (personId) => {
    const person = persons.find(p => p.id === personId)
    return () => {
      if (window.confirm(`Do you really want to delete ${person.name}`)) {
        personService.remove(personId)
          .then(() => {
            setPersons(persons.filter(p => p.id !== person.id))
            informUser(`Deleted ${person.name}`, false)
          })
      }
    }
  }


  return (
    <>
      <NotificationBar message={message} messageLevel={messageLevel} />
      <h2>Phonebook</h2>
      <FilterForm filter={filterPhrase} onFilterInput={onFilterInput} />
      <AddNewPersonForm newName={newName} newNumber={newNumber} onNameInput={onNameInput} onNumberInput={onNumberInput} onSubmit={addPerson} />
      <PhoneBook persons={persons} filter={filterPhrase} personRemover={personRemover} />
    </>
  )

}

export default App