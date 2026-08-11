import { useState, useEffect } from 'react'
import phoneService from './services/phoneService'
import Notification from './components/Notification'

const Button = ({ onClick, text, type = 'button' }) => (
  <button type={type} onClick={onClick}>{text}</button>
)
const Input = ({ label = ' ', value, onChange }) => (
  <div>
    <label>{label}</label>
    <input value={value} onChange={onChange} />
  </div>
)
const Person = ({ person, onRemove }) => (
  <li className="person">
    <span className="name">{person.name}</span>
    <span className="number">{person.number}</span>
    <Button onClick={onRemove} text="Remove" />
  </li>
)
const Persons = ({ persons, onRemove }) => (
  <ul>
    {persons.map(person => (
      <Person key={person.id} person={person} onRemove={() => onRemove(person)} />
    ))}
  </ul>
)

const usePhonebook = () => {
  const [persons, setPersons] = useState([])

  return {
    persons,
    set:    (data)        => setPersons(data),
    add:    (person)      => setPersons(persons.concat(person)),
    update: (id, updated) => setPersons(persons.map(p => p.id === id ? updated : p)),
    remove: (id)          => setPersons(persons.filter(p => p.id !== id)),
    find:   (condition)   => persons.find(condition),
    filter: (condition)   => persons.filter(condition),
  }
}

const useNotification = (seconds = 5) => {
  const [message, setMessage] = useState(null)
  const [type, setType] = useState(null)

  const show = (msg, msgType) => {
    setMessage(msg)
    setType(msgType)
    setTimeout(() => {
      setMessage(null)
      setType(null)
    }, seconds * 1000)
  }

  return {
    message,
    type,
    success: (msg) => show(msg, 'success'),
    warning: (msg) => show(msg, 'warning'),
    error:   (msg) => show(msg, 'error'),
    clear:   ()    => { setMessage(null); setType(null); },
  }
}

const App = () => {
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newSearch, setNewSearch] = useState('')

  const phonebook = usePhonebook()
  const notification = useNotification(6)

  useEffect(() => {
    phoneService.getAll()
      .then(allPersons => phonebook.set(allPersons))
  }, [])


  const handleApiError = (error) => {
    if (error.response?.data?.error) {
      notification.error(error.response.data.error)
    } else {
      notification.error('Something went wrong, please try again')
    }
  }

  const handleCreatePerson = (name, phone) => {
    const newPerson = { name, number: phone }
    
    phoneService.create(newPerson)
      .then(created => {
        phonebook.add(created)
        notification.success(`Added ${created.name} to phonebook`)
        setNewName('')
        setNewPhone('')
      })
      .catch(handleApiError)
  }

  const handleUpdatePerson = (existingPerson, newPhone) => {
    if (!window.confirm(`Do you want to replace '${existingPerson.name}' phone number?`)) {
      return
    }

    const updatedData = { ...existingPerson, number: newPhone }
    
    phoneService.update(existingPerson.id, updatedData)
      .then(updated => {
        phonebook.update(updated.id, updated)
        notification.success(`Updated ${updated.name}'s phone number`)
        setNewName('')
        setNewPhone('')
      })
      .catch(error => {
        if (error.response?.status === 404) {
          phonebook.remove(existingPerson.id)  
        }
        handleApiError(error)
      })
  }

  const handleRemovePerson = (person) => {
    if (!window.confirm(`Do you really want to remove '${person.name}' from your phonebook?`)) {
      return
    }

    phoneService.remove(person.id)
      .then(() => {
        phonebook.remove(person.id)
        notification.success(`Removed ${person.name} from phonebook`)
      })
      .catch(error => {
        if (error.response?.status === 404) {
          phonebook.remove(person.id)
        } 
        handleApiError(error)
      })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const name = newName.trim()
    const phone = newPhone.trim()

    if (!name) return notification.warning('Name field is empty')
    if (!phone) return notification.warning('Phone number field is empty')

    const existingPerson = phonebook.find(person => person.name === name)

    if (existingPerson) {
      handleUpdatePerson(existingPerson, phone)
    } else {
      handleCreatePerson(name, phone)
    }
  }

  const filteredPersons = newSearch.length === 0
    ? phonebook.persons
    : phonebook.filter(person => person.name.toLowerCase().includes(newSearch.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <Input 
        label="Search: " 
        value={newSearch} 
        onChange={e => setNewSearch(e.target.value)} 
      />

      <h2>Add a new</h2>
      <form onSubmit={handleSubmit}>
        <Input 
          label="Name: "   
          value={newName}   
          onChange={e => setNewName(e.target.value)} 
        />
        <Input 
          label="Number: " 
          value={newPhone}  
          onChange={e => setNewPhone(e.target.value)} 
        />
        <Button text="Add" type="submit" />
      </form>

      <h2>Numbers</h2>
      <Persons persons={filteredPersons} onRemove={handleRemovePerson} />
    </div>
  )
}

export default App