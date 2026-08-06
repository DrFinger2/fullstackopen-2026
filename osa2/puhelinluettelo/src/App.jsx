
import { useState, useEffect } from 'react'
import Test from './utils/Test'
import axios from 'axios'

const Person = ({ person }) =>  (
  <li> {person.name} {person.number}</li>
)
const Persons = ({ persons }) => (
  <ul> {persons.map((person) => ( <Person person={person} key={person.name} /> ))} </ul>
)
const NameInput = ({ value, onChange }) => (
  <div> Name:{' '} <input value={value} onChange={onChange} /> </div>
)
const PhoneInput = ({ value, onChange }) => (
  <div> Number:{' '} <input type="tel" value={value} onChange={onChange}/> </div>
)
const SearchInput = ({ value, onChange }) => (
  <div> Search:{' '} <input value={value} onChange={onChange}/> </div>
)
const SubmitButton = ({onClick, text}) => (
  <button type="submit"> {text} </button>
)

const App = () => {
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [persons, setPersons] = useState([])

  const onValueSubmit = (e) => {
    e.preventDefault()
    const nameResult = Test.isNameValid(newName, persons);
    if (!nameResult.valid) {
      return( alert(nameResult.error) )
    }
    const numberResult = Test.isNumberValid(newPhone);
    if (!numberResult.valid) {
      return( alert(numberResult.error) );
    }

    const copy = persons.concat({ name: newName, number: newPhone })

    setPersons(copy)
    setNewName('')
    setNewPhone('')
  }

  const hook = () => {
    console.log("Effect");
    axios.get("http://localhost:3001/persons")
    .then(result => {
      console.log("Promise fulfilled!");
      const persons = result.data;
      setPersons(persons);
    })
  }

  useEffect(hook, []);

  const filteredPersons = newSearch.length === 0 
    ? persons 
    : persons.filter(person => person.name.toLowerCase().includes(newSearch.toLowerCase())
  )
  return (
    <div>
      <h2>Phonebook</h2>
      <SearchInput value={newSearch} onChange={(e) => setNewSearch(e.target.value)}/>

      <h2>Add a new</h2>
      <form onSubmit={onValueSubmit}>
        <NameInput value={newName} onChange={(e) => setNewName(e.target.value)}/>
        <PhoneInput value={newPhone} onChange={(e) => setNewPhone(e.target.value)}/>
        <SubmitButton text={"Add"} />
      </form>

      <h2>Numbers</h2>
      <Persons persons={filteredPersons} />
    </div>
  )
}

export default App
