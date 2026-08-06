// Dependencies
import { useState, useEffect } from 'react'
import phoneService from './services/phoneService'
import Notification from './components/Notification'

const Button = ({ onClick, text, type='' }) => (
  <button type={type} onClick={onClick}>{text}</button>
)
const Input = ({ label = ' ', value, onChange }) => (
  <div> <label>{label}</label> <input value={value} onChange={onChange} /> </div>
)
const Person = ({ person, onRemove }) => (
  <li className="person"> 
    <span className="name">{person.name}</span> 
    <span className="number">{person.number}</span> 
    <Button onClick={onRemove} text="Remove" /> 
  </li>
)
const Persons = ({ persons, onRemove }) => (
  <ul> {persons.map(person => ( <Person key={person.id} person={person} onRemove={() => onRemove(person)} />))} </ul>
)

const usePhonebook = () => {
  const [persons, setPersons] = useState([])
  const phonebook = {
    persons,
    set:    (data)        => setPersons(data),
    add:    (person)      => setPersons(persons.concat(person)),
    update: (id, updated) => setPersons(persons.map(person => person.id === id ? updated : person)),
    remove: (id)          => setPersons(persons.filter(person => person.id !== id)),
    find:   (condition)   => persons.find(condition),
    filter: (condition)   => persons.filter(condition),
  }
  return phonebook
}

const useNotification = (seconds = 5) => {
  const [message, setMessage] = useState(null);
  const [type, setType] = useState(null);

  const show = (message, type) => {
    setMessage(message);
    setType(type);
    setTimeout(() => { setMessage(null); setType(null); }, seconds * 1000);
  };

  return {
    message, type,
    success: (message) => show(message, "success"),
    warning: (message) => show(message, "warning"),
    error: (message) => show(message, "error"),
    clear: () => { setMessage(null); setType(null); },
  };
};


const App = () => {
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newSearch, setNewSearch] = useState('')
  
  const notification = useNotification(3); 
  const phonebook = usePhonebook()
  const phoneRegex = /^(?:0\d{2,3}[- ]?\d{5,8}|\+358\d{2,3}[- ]?\d{5,8})$/

  
  const onValueSubmit = (e) => {
    e.preventDefault()

    if (!newName.length) {
      return notification.warning('Name field is empty')
    }
    if (!newPhone.length) {
      return notification.warning('Phone number field is empty')
    }
    if (!phoneRegex.test(newPhone)) {
      return notification.error(`Phone number '${newPhone}' is invalid`)
    }

    const foundPerson = phonebook.find(person => person.name === newName)
    if (foundPerson) {
      if (window.confirm(`Do you want to replace '${foundPerson.name}' phone number?`)) {
        phoneService
        .update(foundPerson.id, { ...foundPerson, number: newPhone })
        .then(updated => {
          notification.success(`Updated ${updated.name}'s phone number`)
          phonebook.update(updated.id, updated)
          setNewName(''); 
          setNewPhone('');
        })
        .catch(error => {
          notification.error( `Person '${foundPerson.name}' has already been removed from server`)
          phonebook.remove(foundPerson.id)
        })
      }
      return
    }

    const person = { name: newName, number: newPhone }
    phoneService.create(person).then(created => {
      notification.success(`Added ${created.name} to phonebook`)
      phonebook.add(created)
      setNewName('')
      setNewPhone('')
    })
  }

  const removePerson = (person) => {
    if (window.confirm(`Do you really want to remove '${person.name}' from your phonebook?`)) {
      phoneService
      .remove(person.id)
      .then((removed) => {
        phonebook.remove(removed.id)
        notification.success(`Removed ${removed.name} from phonebook`)
      })
      .catch(error => {
        notification.error(`Person '${person.name}' has already been removed from server`)
        phonebook.remove(person.id)
      })
    }
  }

  useEffect(() => {
    phoneService
      .getAll()
      .then(allPersons => phonebook.set(allPersons))
  }, [])

  const filteredPersons = newSearch.length === 0
    ? phonebook.persons
    : phonebook.filter(person => person.name.toLowerCase().includes(newSearch.toLowerCase()))

  return (
    <div>

      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <Input label="Search: "value={newSearch} onChange={e => setNewSearch(e.target.value)} />
  
      <h2>Add a new</h2>
      <form onSubmit={onValueSubmit}>
        <Input label="Name: "   value={newName}   onChange={e => setNewName(e.target.value)} />
        <Input label="Number: " value={newPhone}  onChange={e => setNewPhone(e.target.value)} />
        <Button text="Add" type="submit" />
      </form>

      <h2>Numbers</h2>
      <Persons persons={filteredPersons} onRemove={removePerson} />
    </div>
  )
}

export default App