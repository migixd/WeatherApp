import { useEffect, useState } from 'react'
import Home from './components/Home.jsx'
import SearchScreen from './components/SearchScreen.jsx'
import ListaCiudades from './components/ListaCiudades.jsx'
import EliminarCiudad from './components/EliminarCiudad.jsx'
import CiudadPredeterminada from './components/CiudadPredeterminada.jsx'
import Ajustes from './components/Ajustes.jsx'
import { loadCities, saveCities } from './data/citiesStore.js'
import { loadUnit, saveUnit } from './data/temperatureStore.js'

function App() {
  const [screen, setScreen] = useState('home')
  const [citiesData, setCitiesData] = useState(loadCities)
  const [searchFrom, setSearchFrom] = useState(null)
  const [unidadTemperatura, setUnidadTemperatura] = useState(loadUnit)

  useEffect(() => {
    saveCities(citiesData)
  }, [citiesData])

  useEffect(() => {
    saveUnit(unidadTemperatura)
  }, [unidadTemperatura])

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

  const handleAddCity = (city) => {
    setCitiesData((data) => {
      const identity = toCityIdentity(city)
      const exists = data.cities.some((c) => c.id === identity.id)
      if (exists) return data
      return { ...data, cities: [...data.cities, identity] }
    })
    setScreen(searchFrom === 'cities' ? 'cities' : 'home')
    setSearchFrom(null)
  }

  const handleDeleteCity = (cityId) => {
    setCitiesData((data) => ({
      ...data,
      cities: data.cities.filter((c) => c.id !== cityId),
    }))
  }

  const handleSetDefault = (cityId) => {
    setCitiesData((data) => ({
      ...data,
      defaultCityId: cityId,
    }))
    setScreen('home')
  }

  const handleSetUnit = (unit) => {
    setUnidadTemperatura(unit)
  }

  if (screen === 'search') {
    return (
      <div className="app-phone">
        <SearchScreen
          onBack={() => setScreen(searchFrom === 'cities' ? 'cities' : 'home')}
          onAddCity={handleAddCity}
          cities={citiesData.cities}
          unidadTemperatura={unidadTemperatura}
        />
      </div>
    )
  }

  if (screen === 'cities') {
    return (
      <div className="app-phone">
        <ListaCiudades
          cities={citiesData.cities}
          defaultCityId={citiesData.defaultCityId}
          onBack={() => setScreen('home')}
          onAddCityClick={() => {
            setSearchFrom('cities')
            setScreen('search')
          }}
          unidadTemperatura={unidadTemperatura}
        />
      </div>
    )
  }

  if (screen === 'delete') {
    return (
      <div className="app-phone">
        <EliminarCiudad
          cities={citiesData.cities}
          defaultCityId={citiesData.defaultCityId}
          onBack={() => setScreen('home')}
          onDeleteCity={handleDeleteCity}
        />
      </div>
    )
  }

  if (screen === 'setDefault') {
    return (
      <div className="app-phone">
        <CiudadPredeterminada
          cities={citiesData.cities}
          defaultCityId={citiesData.defaultCityId}
          onBack={() => setScreen('home')}
          onSelectDefault={handleSetDefault}
        />
      </div>
    )
  }

  if (screen === 'ajustes') {
    return (
      <div className="app-phone">
        <Ajustes
          unidadTemperatura={unidadTemperatura}
          onSetUnit={handleSetUnit}
          onBack={() => setScreen('home')}
        />
      </div>
    )
  }

  return (
    <Home
      defaultCity={defaultCity}
      unidadTemperatura={unidadTemperatura}
      onSetUnit={handleSetUnit}
      onSearchClick={() => setScreen('search')}
      onCitiesClick={() => setScreen('cities')}
      onDeleteClick={() => setScreen('delete')}
      onSetDefaultClick={() => setScreen('setDefault')}
      onOpenSettings={() => setScreen('ajustes')}
    />
  )
}

export default App