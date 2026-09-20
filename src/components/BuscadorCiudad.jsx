import { Search } from 'lucide-react'

function BuscadorCiudad({ loading, onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    const form = new FormData(e.target)
    const value = form.get('city')?.trim()
    if (!value || loading) return
    onSearch(value)
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="citySearch">Ciudad</label>
        <input
          id="citySearch"
          className="input"
          name="city"
          type="text"
          placeholder="Escribe el nombre de una ciudad"
          disabled={loading}
        />
      </div>
      <button
        className="btn btn-primary btn-block"
        type="submit"
        disabled={loading}
      >
        <Search size={18} />
        {loading ? 'Buscando…' : 'Buscar'}
      </button>
    </form>
  )
}

export default BuscadorCiudad
