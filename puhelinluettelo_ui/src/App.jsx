import { useState, useEffect } from 'react'
import axios from 'axios'

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
          .catch(_ => {
            informUser(`It seems the person has been removed from the server, can't change number`, true)
            setPersons(persons.filter(p => p.id !== person.id))
          })
      } else {
        setNewName('')
        setNewNumber('')
      }
    } else {
      let newPerson = {name: newName, number: newNumber}
      personService.create(newPerson)
        .then(person => {
          setPersons(persons.concat(person))
          setNewName('')
          setNewNumber('')
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
          .then(deletedPerson => {
            setPersons(persons.filter(p => p.id !== deletedPerson.id))
            informUser(`Deleted ${deletedPerson.name}`, false)
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