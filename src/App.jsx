import { useEffect, useState } from 'react'
import Home from './components/Home.jsx'
import SearchScreen from './components/SearchScreen.jsx'
import { loadCities, saveCities } from './data/citiesStore.js'

function App() {
  const [screen, setScreen] = useState('home')
  const [citiesData, setCitiesData] = useState(loadCities)

  useEffect(() => {
    saveCities(citiesData)
  }, [citiesData])

  const defaultCity =
    citiesData.cities.find((c) => c.id === citiesData.defaultCityId) ?? null

  const toCityIdentity = ({ id, name, state, latitude, longitude }) => ({
    id,
    name,
    state,
    latitude,
    longitude,
  })

  const handleSaveDefault = (city) => {
    setCitiesData((data) => {
      const identity = toCityIdentity(city)
      const exists = data.cities.some((c) => c.id === identity.id)
      const cities = exists ? data.cities : [...data.cities, identity]
      return { ...data, cities, defaultCityId: identity.id }
    })
    setScreen('home')
  }

  if (screen === 'search') {
    return (
      <div className="app-phone">
        <SearchScreen onBack={() => setScreen('home')} onSaveDefault={handleSaveDefault} />
      </div>
    )
  }

  return <Home onSearchClick={() => setScreen('search')} defaultCity={defaultCity} />
}

export default App