function TarjetaClima({ name, tempC, isAdded, onAdd }) {
  return (
    <div className="card elev-sm weather-result-card">
      <div className="weather-result-info">
        <div className="weather-result-name">{name}</div>
        <div className="weather-result-temp">{tempC}°C</div>
      </div>
      {isAdded ? (
        <span className="tag tag-neutral">Agregada</span>
      ) : (
        <button className="btn btn-secondary" type="button" onClick={onAdd}>
          Agregar
        </button>
      )}
    </div>
  )
}

export default TarjetaClima