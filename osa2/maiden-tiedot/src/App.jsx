import { useState, useEffect } from 'react'
import axios from 'axios'

const Search = ({ value, onChange }) => {
  return (
    <input value={value} onChange={(event) => onChange(event.target.value)} />
  )
}

const WeatherDetails = ({ weather }) => {
  if (!weather) return null;

  return (
    <div className="weather-details">
      <h2>Weather in {weather.name}</h2>
      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}/>
      <p>Temperature: {weather.main.temp} Celsius</p>
      <p>Wind speed: {weather.wind.speed} m/s</p>
    </div>
  )
}

const CountryDetails = ({ country, weather = null }) => {
  if (!country) return null;

  return (
    <div className="country-details">
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital.join(', ')}</p>
      <p>Area: {country.area} km2</p>

      <h3>Languages</h3>
      <ul> {Object.values(country.languages || {}).map(language =>( <li key={language}>{language}</li>  ))} </ul>
      <img src={country.flags.png}/>
      <WeatherDetails weather={weather} />
    </div>
  )
}

const Country = ({ name, setCountry, country = null, weather = null }) => {
  return (
    <li className="country">
      <div>
        <span>{name}</span>
        <button onClick={() => setCountry(name)}>
          {country ? 'Hide' : 'Show'}
        </button>
      </div>
      <CountryDetails country={country} weather={weather} />
    </li>
  )
}

const Countries = ({ state }) => {
  const count = state.filteredCountries.length;
  if (count === 0) {
    return <p>No matches found</p>
  }
  if (count === 1) {
    const country = state.filteredCountries[0];
    return <CountryDetails country={country} weather={state.weatherDetails} />
  }
  if (count <= 10) {
    return (
      <ul>
        {state.filteredCountries.map(country => {
          const isSelected = country.name.common === state.selectedCountryName;
          return (
            <Country
              key={country.cca3}
              name={country.name.common}
              setCountry={state.toggleCountry}
              country={isSelected ? country : null}
              weather={isSelected ? state.weatherDetails : null}
            />
          );
        })}
      </ul>
    )
  }

  return <p>Too many matches ({count}) type more to the search</p>
}

const countryService = (() => {
  const URL = 'https://studies.cs.helsinki.fi/restcountries/api/all'
  return {
    getAll: () => { return axios.get(URL).then(res => res.data) }
  }
})();

const weatherService = (() => {
  const API_KEY = import.meta.env.VITE_WEATHER_KEY
  return {
    getDetails: (country) => {
      if (!country || !country.capital || country.capital.length === 0) {
        return Promise.resolve(null); 
      }

      const URL = `https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&appid=${API_KEY}&units=metric`
      return axios.get(URL).then(res => res.data)
    }
  }
})();

const useCountries = (searchTerm) => {
  const [countries, setCountries] = useState([])
  const [selectedName, setSelectedName] = useState(null)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    countryService
      .getAll()
      .then(data => setCountries(data))
      .catch(err => console.log('Error fetching countries:', err))
  }, [])

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const activeCountry = filteredCountries.length === 1 
      ? filteredCountries[0] 
      : countries.find(c => c.name.common === selectedName) || null

  useEffect(() => {
    if (!activeCountry) {
      setWeather(null)
      return
    }
    weatherService
      .getDetails(activeCountry)
      .then(details => setWeather(details))
  }, [activeCountry])

  const toggleCountry = (name) => {
    setSelectedName(prev => (prev === name ? null : name))
  }

  return {
    filteredCountries,
    selectedCountryName: selectedName,
    weatherDetails: weather,
    toggleCountry
  }
}

const App = () => {
  const [search, setSearch] = useState('')
  const countries = useCountries(search)

  return (
    <div>
      <h1>Application</h1>
      <Search value={search} onChange={setSearch} />
      <Countries state={countries} />
    </div>
  )
}

export default App