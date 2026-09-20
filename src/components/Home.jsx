import { CloudSun, Search, Trash2, Star } from 'lucide-react'
import CiudadPorDefecto from './CiudadPorDefecto.jsx'

function Home({ onSearchClick, onCitiesClick, onDeleteClick, onSetDefaultClick, defaultCity, unidadTemperatura, onOpenSettings }) {
  const tiles = [
    { icon: CloudSun, label: 'Todas las ciudades', onClick: onCitiesClick },
    { icon: Search, label: 'Buscar y agregar', onClick: onSearchClick },
    { icon: Trash2, label: 'Eliminar ciudad', onClick: onDeleteClick },
    { icon: Star, label: 'Ciudad predeterminada', onClick: onSetDefaultClick },
  ]

  return (
    <div className="app-phone">
      <CiudadPorDefecto city={defaultCity} unidadTemperatura={unidadTemperatura} onOpenSettings={onOpenSettings} />
      <div className="menu-grid">
        {tiles.map((tile) => {
          const TileIcon = tile.icon
          return (
            <button className="menu-tile" type="button" key={tile.label} onClick={tile.onClick}>
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