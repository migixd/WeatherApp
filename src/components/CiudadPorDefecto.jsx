import { useEffect, useState } from 'react'
import { Settings, RotateCcw } from 'lucide-react'
import { fetchCurrentWeather } from '../data/weatherApi.js'

function CiudadPorDefecto({ city }) {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!city) return
    let cancelled = false
    fetchCurrentWeather(city.latitude, city.longitude)
      .then((data) => {
        if (!cancelled) {
          setWeather(data)
          setError('')
        }
      })
      .catch(() => {
        if (!cancelled) setError('No se pudo obtener el clima de la ciudad. Intenta de nuevo.')
      })
    return () => {
      cancelled = true
    }
  }, [city, attempt])

  if (!city) return null

  const { icon: Icon, iconBg, iconFg } = weather || {}

  return (
    <>
      <header className="home-header">
        <div className="home-header-text">
          <span className="home-header-label">Ciudad predeterminada</span>
          <span className="home-header-city">{city.name}</span>
        </div>
        <button className="icon-btn" type="button" aria-label="Ajustes">
          <Settings size={20} />
        </button>
      </header>

      {!error && weather && (
        <section className="weather-hero">
          <div
            className="weather-icon-circle"
            style={{ background: iconBg, color: iconFg }}
            aria-hidden="true"
          >
            <Icon size={48} />
          </div>
          <div className="weather-hero-temp">{weather.tempC}°C</div>
          <div className="weather-hero-condition">{weather.condition}</div>
        </section>
      )}

      {error && (
        <div className="search-error">
          {error}
          <button
            className="btn btn-secondary btn-retry"
            type="button"
            onClick={() => setAttempt((a) => a + 1)}
          >
            <RotateCcw size={16} /> Reintentar
          </button>
        </div>
      )}
    </>
  )
}

export default CiudadPorDefecto