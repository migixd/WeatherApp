function TarjetaClima({ name, tempC, onSaveDefault }) {
  return (
    <div className="card elev-sm weather-result-card">
      <div className="weather-result-info">
        <div className="weather-result-name">{name}</div>
        <div className="weather-result-temp">{tempC}°C</div>
      </div>
      {onSaveDefault && (
        <button className="btn btn-secondary" type="button" onClick={onSaveDefault}>
          Guardar como predeterminada
        </button>
      )}
    </div>
  )
}

export default TarjetaClima