import { useState, useEffect } from 'react'
import axios from 'axios'

const Search = ({ value, onChange }) => {
  let showDetails = false;
  return (
    <input value={value} onChange={(event) => onChange(event.target.value)}/>
  )
}

const Country = ({ name, setCountry, details = null }) => {
  return (
    <li className="country">
      <div>
        <span>{name}</span>
        <button onClick={() => setCountry(name)}>Details</button>
      </div>
      <CountryDetails details={details} />
    </li>
  )
}

const CountryDetails = ({ details }) => {
  if (!details) {
    return null
  }
  return (
    <div className="country-details">
      <h2>{details.name.common}</h2>
      <p><strong>Capital:</strong> {details.capital?.join(', ')}</p>
      <p><strong>Area:</strong> {details.area.toLocaleString()} km²</p>
      <h3>Languages</h3>
      <ul>
        {Object.values(details.languages).map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>
    </div>
  )
}

const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [countryDetails, setCountryDetails] = useState(null)

  useEffect(() => {
    const URL_ALL = 'https://studies.cs.helsinki.fi/restcountries/api/all'
    axios.get(URL_ALL)
      .then(res => {
        setCountries(res.data)
      })
      .catch(err => {
        console.log('Error:', err)
      })
  }, [])

  useEffect(() => {
    if(selectedCountry == null)
      return;
    const URL_COUNTRY = `https://studies.cs.helsinki.fi/restcountries/api/name/${selectedCountry}`
    axios.get(URL_COUNTRY)
      .then(res => {
        setCountryDetails(res.data)
      })
      .catch(err => {
        console.log('Error:', err)
      })
  }, [selectedCountry])


  const onCountrySelectedClicked = (country) => {
    setCountryDetails(null)
    setSelectedCountry(country)
  } 

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h1>Application</h1>

      <Search
        value={search}
        onChange={setSearch}
      />

      <ul>
        
        {filteredCountries.map(country => (
          <Country
            key={country.cca3}
            name={country.name.common}
            setCountry={onCountrySelectedClicked}
            details={country.name.common === selectedCountry && countryDetails}
          />
        ))}
      </ul>
    </div>
  )
}

export default App