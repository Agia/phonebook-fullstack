import { useEffect, useState } from 'react'
import Search from './components/Search'
import Form from './components/Form'
import Entry from './components/Entry'
import Notification from './components/Notification'
import { getData, addData, deleteData, updateData } from "./services/data";


const App = () => {

  useEffect(() => {
    refreshData()
  }, [])

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState({
    query: '',
    list: []
  })
  const [message, setMessage] = useState(null)
  const [alertShow, setAlertShow] = useState(false)

  useEffect(() => {
    let timerID = setTimeout(() => {
      setAlertShow(false)
      timerID = null
      setMessage(null)
    }, 4000)

    return () => clearTimeout(timerID)
  }, [alertShow])



  const refreshData = () => {
    getData().then((response) => {
      setPersons(response)
    })
  }

  const updateNumber = () => {

    const updatedEntry = persons.find(
      (person) => person.name === newName
    )
    const id = updatedEntry.id
    const changedNumber = { ...updatedEntry, number: newNumber }

    updateData(id, changedNumber)
    .then(response => {
      setPersons(
        persons.map((person) => (person.id !== id ? person : response))
      )
      setMessage(`${newName}'s number has been updated`)
      setAlertShow(true)
    })
    .catch(() => {
      setMessage('This entry has already been deleted from the server.')
      setAlertShow(true)
      setPersons(persons.filter(person => person.id !== id))
    })
    setNewName('')
    setNewNumber('')
  }

  const addEntry = (event) => {
    event.preventDefault();

    if (persons.some((person) => person.name === newName)) {

      const changeNumber = confirm(`${newName} is already added to phonebook. Would you like to replace the old number with this one?`)
      
      if(changeNumber) {
        updateNumber()
      } else {
        return
      }
    } else {
      const newEntry = {
          name: newName,
          number: newNumber,
      }

        addData(newEntry).then((response) => {
          setPersons(persons.concat(response))
          setMessage(`${newName} has been added.`)
          setAlertShow(true)
          setNewName('')
          setNewNumber('')
        })
    }  
  }

  const deleteEntry = (id, name) => {

    const confirmation = confirm(
      `Are you sure you want to delete ${name} entry?`
    )

    if(confirmation) {
      deleteData(id)
      refreshData()
      setMessage(`${name} has been successfully deleted.`)
      setAlertShow(true)
    } else {
      return
    }
  }

  const handleSearch = (event) => {
    const searchResults = persons.filter((person) => {
      if (event.target.value === '') {
        return persons
      }
      return person.name.toLowerCase().includes(event.target.value.toLowerCase())
    })
    setSearch({
      query: event.target.value,
      list: searchResults
    })
  }

  const handleNameInput = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberInput = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Search search={search.query} handleSearch={handleSearch} />

      <h2>Add a New Entry</h2>

      <Form
        name={newName}
        number={newNumber}
        addEntry={addEntry}
        handleNameInput={handleNameInput}
        handleNumberInput={handleNumberInput}
      />
      
      <Notification message={message} alertShow={alertShow}/>

      <h2>Numbers</h2>
      { (search.query === "" ?
        persons.map((person) => {
        return (
          <Entry
            key={person.id}
            name={person.name}
            number={person.number}
            deleteEntry={() => deleteEntry(person.id, person.name)}
          />
        )
      }) : search.list.map(person => {
        return <Entry
          key={person.id}
          name={person.name}
          number={person.number}
          deleteEntry={() => deleteEntry(person.id, person.name)}
        />
      }) )
      }

    </div>
  )
}

export default App
