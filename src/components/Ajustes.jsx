import { ArrowLeft } from 'lucide-react'

function Ajustes({ unidadTemperatura, onSetUnit, onBack }) {
  return (
    <div>
      <div className="back-row">
        <button className="icon-btn" type="button" aria-label="Volver" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <div className="back-row-title">Ajustes</div>
      </div>
      <div className="field">
        <label>Unidad de temperatura</label>
        <div className="seg" role="radiogroup" aria-label="Unidad de temperatura">
          <label className="seg-opt">
            <input
              type="radio"
              name="unit"
              value="C"
              checked={unidadTemperatura === 'C'}
              onChange={() => onSetUnit('C')}
            />
            °C
          </label>
          <label className="seg-opt">
            <input
              type="radio"
              name="unit"
              value="F"
              checked={unidadTemperatura === 'F'}
              onChange={() => onSetUnit('F')}
            />
            °F
          </label>
        </div>
      </div>
    </div>
  )
}

export default Ajustes
