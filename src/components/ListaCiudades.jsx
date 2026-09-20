import { useEffect, useState } from 'react'
import { ArrowLeft, Plus } from 'lucide-react'
import { fetchCurrentWeather } from '../data/weatherApi.js'
import { formatTemperature } from '../data/temperature.js'

function CityCard({ city, isDefault, unidadTemperatura }) {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchCurrentWeather(city.latitude, city.longitude)
      .then((data) => {
        if (!cancelled) setWeather(data)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [city.latitude, city.longitude])

  const { icon: Icon, iconBg, iconFg, condition, tempC } = weather || {}

  return (
    <div className="card elev-sm city-card">
      {Icon && (
        <div className="weather-icon-circle-sm" style={{ background: iconBg, color: iconFg }}>
          <Icon size={26} />
        </div>
      )}
      <div className="city-card-info">
        <div className="city-card-name">{city.name}</div>
        {condition && <div className="city-card-condition">{condition}</div>}
      </div>
      {tempC != null && <div className="city-card-temp">{formatTemperature(tempC, unidadTemperatura)}</div>}
      {isDefault && <span className="tag tag-accent-2">Predeterminada</span>}
    </div>
  )
}

function ListaCiudades({ cities, defaultCityId, onBack, onAddCityClick, unidadTemperatura }) {
  return (
    <div>
      <div className="back-row">
        <button className="icon-btn" type="button" aria-label="Volver" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <div className="back-row-title">Todas las ciudades</div>
      </div>
      <div className="city-list">
        {cities.map((city) => (
          <CityCard
            key={city.id}
            city={city}
            isDefault={city.id === defaultCityId}
            unidadTemperatura={unidadTemperatura}
          />
        ))}
      </div>
      <button className="btn btn-primary btn-block" type="button" onClick={onAddCityClick}>
        <Plus size={18} /> Agregar ciudad
      </button>
    </div>
  )
}

export default ListaCiudades
