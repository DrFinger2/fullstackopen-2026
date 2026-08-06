import { useState, useEffect } from 'react'
import phoneService from './services/phoneService'


const Person = ({ person, onRemove }) => (
  <li> {person.name} {person.number} <Remove onClick={onRemove} /> </li>
)
const Remove = ({ onClick }) => (
  <button onClick={onClick}>Remove</button>
)
const Persons = ({ persons, onRemove }) => (
  <ul> {persons.map(person => ( <Person key={person.id} person={person} onRemove={() => onRemove(person)} />))} </ul>
)
const NameInput = ({ value, onChange }) => (
  <div> Name:{' '} <input value={value} onChange={onChange} /> </div>
)
const PhoneInput = ({ value, onChange }) => (
  <div> Number:{' '} <input type="tel" value={value} onChange={onChange} /> </div>
)
const SearchInput = ({ value, onChange }) => (
  <div> Search:{' '} <input value={value} onChange={onChange} /> </div>
)
const SubmitButton = ({ text }) => (
  <button type="submit">{text}</button>
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

const App = () => {
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newSearch, setNewSearch] = useState('')

  const phonebook = usePhonebook()
  const phoneRegex = /^(?:0\d{2,3}[- ]?\d{5,8}|\+358\d{2,3}[- ]?\d{5,8})$/

  const onValueSubmit = (e) => {
    e.preventDefault()

    if (!newName.length) {
      return alert('Name field is empty')
    }
    if (!newPhone.length) {
      return alert('Phone number field is empty')
    }
    if (!phoneRegex.test(newPhone)) {
      return alert(`Phone number '${newPhone}' is invalid`)
    }

    const foundPerson = phonebook.find(person => person.name === newName)
    if (foundPerson) {
      if (window.confirm(`Do you want to replace '${foundPerson.name}' phone number?`)) {
        phoneService
          .update(foundPerson.id, { ...foundPerson, number: newPhone })
          .then(updated => phonebook.update(updated.id, updated))
      }
      return
    }

    const person = { name: newName, number: newPhone }
    phoneService.create(person).then(created => {
      phonebook.add(created)
      setNewName('')
      setNewPhone('')
    })
  }

  const removePerson = (person) => {
    if (window.confirm(`Do you really want to remove '${person.name}' from your phonebook?`)) {
      phoneService
        .remove(person.id)
        .then(() => phonebook.remove(person.id))
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
      <SearchInput value={newSearch} onChange={e => setNewSearch(e.target.value)} />

      <h2>Add a new</h2>
      <form onSubmit={onValueSubmit}>
        <NameInput value={newName} onChange={e => setNewName(e.target.value)} />
        <PhoneInput value={newPhone} onChange={e => setNewPhone(e.target.value)} />
        <SubmitButton text="Add" />
      </form>

      <h2>Numbers</h2>
      <Persons persons={filteredPersons} onRemove={removePerson} />
    </div>
  )
}

export default App