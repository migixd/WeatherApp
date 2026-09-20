import { ArrowLeft, Trash2 } from 'lucide-react'

function EliminarCiudad({ cities, defaultCityId, onBack, onDeleteCity }) {
  return (
    <div>
      <div className="back-row">
        <button className="icon-btn" type="button" aria-label="Volver" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <div className="back-row-title">Eliminar ciudad</div>
      </div>
      <div className="city-list">
        {cities.map((city) => {
          const isDefault = city.id === defaultCityId
          return (
            <div className="card elev-sm city-card" key={city.id}>
              <div className="weather-icon-circle-sm" style={{ background: 'var(--color-neutral-200)', color: 'var(--color-neutral-700)' }}>
                <Trash2 size={22} />
              </div>
              <div className="city-card-info">
                <div className="city-card-name">{city.name}</div>
                {isDefault && (
                  <div className="city-card-disable-msg">No se puede eliminar la predeterminada</div>
                )}
              </div>
              <button
                className="btn-icon icon-btn"
                type="button"
                disabled={isDefault}
                aria-label={`Eliminar ${city.name}`}
                onClick={() => onDeleteCity(city.id)}
              >
                <Trash2 size={20} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default EliminarCiudad
