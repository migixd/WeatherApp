import { Settings, CloudSun, Search, Trash2, Star } from 'lucide-react'
import { getDefaultCity } from '../data/cities.js'

function Home() {
  const city = getDefaultCity()
  const { icon: Icon, iconBg, iconFg } = city

  const tiles = [
    { icon: CloudSun, label: 'Todas las ciudades' },
    { icon: Search, label: 'Buscar y agregar' },
    { icon: Trash2, label: 'Eliminar ciudad' },
    { icon: Star, label: 'Ciudad predeterminada' },
  ]

  return (
    <div className="app-phone">
      <header className="home-header">
        <div className="home-header-text">
          <span className="home-header-label">Ciudad predeterminada</span>
          <span className="home-header-city">{city.name}</span>
        </div>
        <button className="icon-btn" type="button" aria-label="Ajustes">
          <Settings size={20} />
        </button>
      </header>

      <section className="weather-hero">
        <div
          className="weather-icon-circle"
          style={{ background: iconBg, color: iconFg }}
          aria-hidden="true"
        >
          <Icon size={48} />
        </div>
        <div className="weather-hero-temp">{city.tempC}°C</div>
        <div className="weather-hero-condition">{city.condition}</div>
      </section>

      <div className="menu-grid">
        {tiles.map((tile) => {
          const TileIcon = tile.icon
          return (
            <button className="menu-tile" type="button" key={tile.label}>
              <span className="tile-icon">
                <TileIcon size={24} />
              </span>
              <span className="tile-label">{tile.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Home