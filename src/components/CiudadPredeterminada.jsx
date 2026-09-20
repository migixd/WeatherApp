import { ArrowLeft, CheckCircle2 } from 'lucide-react'

function CiudadPredeterminada({ cities, defaultCityId, onBack, onSelectDefault }) {
  return (
    <div>
      <div className="back-row">
        <button className="icon-btn" type="button" aria-label="Volver" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <div className="back-row-title">Ciudad predeterminada</div>
      </div>
      <div className="city-list">
        {cities.map((city) => {
          const isDefault = city.id === defaultCityId
          return (
            <button
              key={city.id}
              className={`card city-card city-card-selectable ${isDefault ? 'city-card-selected' : ''}`}
              type="button"
              onClick={() => onSelectDefault(city.id)}
            >
              <div className="weather-icon-circle-sm" style={{ background: 'var(--color-neutral-200)', color: 'var(--color-neutral-700)' }}>
                <CheckCircle2 size={22} />
              </div>
              <div className="city-card-name">{city.name}</div>
              {isDefault && <CheckCircle2 size={22} className="city-card-check" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CiudadPredeterminada
