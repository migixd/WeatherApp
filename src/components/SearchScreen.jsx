import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import BuscadorCiudad from './BuscadorCiudad.jsx'
import TarjetaClima from './TarjetaClima.jsx'
import { geocodeCity, fetchCurrentWeather } from '../data/weatherApi.js'

function SearchScreen({ onBack, onAddCity, cities }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const isAdded = result ? cities.some((c) => c.id === result.id) : false

  const handleSearch = async (query) => {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const geo = await geocodeCity(query)
      if (!geo) {
        setError('No se encontró una ciudad con ese nombre.')
        return
      }
      const weather = await fetchCurrentWeather(geo.latitude, geo.longitude)
      setResult({ ...geo, tempC: weather.tempC })
    } catch {
      setError('Ocurrió un error al obtener el clima. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="back-row">
        <button className="icon-btn" type="button" aria-label="Volver" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <div className="back-row-title">Buscar y agregar</div>
      </div>
      <BuscadorCiudad loading={loading} onSearch={handleSearch} />
      {result && (
        <TarjetaClima
          name={result.name}
          tempC={result.tempC}
          isAdded={isAdded}
          onAdd={() => onAddCity(result)}
        />
      )}
      {error && <div className="search-error">{error}</div>}
    </div>
  )
}

export default SearchScreen