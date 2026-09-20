function TarjetaClima({ name, tempC }) {
  return (
    <div className="card elev-sm weather-result-card">
      <div className="weather-result-info">
        <div className="weather-result-name">{name}</div>
        <div className="weather-result-temp">{tempC}°C</div>
      </div>
    </div>
  )
}

export default TarjetaClima
