# Weather App

## Video

[Ver video de demostración](./video/Evidencia-app.mov)

## Especificaciones

| # | Spec | Estado |
|---|---|---|
| 01 | [Pantalla principal React](./specs/01-pantalla-principal-react.md) | Implementado |
| 02 | [Buscar el clima de una ciudad](./specs/02-buscar-clima-ciudad.md) | Implementado |
| 03 | [Ciudad predeterminada](./specs/03-ciudad-predeterminada.md) | Implementado |
| 04 | [Registrar y gestionar ciudades](./specs/04-registrar-ciudades.md) | Implementado |
| 05 | [Unidad de temperatura / Ajustes](./specs/05-unidad-temperatura-ajustes.md) | Implementado |

## Qué se ha hecho

- **Pantalla principal**: Ciudad predeterminada con clima real de OpenMeteo y menú de 4 tiles (Todas las ciudades, Buscar y agregar, Eliminar ciudad, Ciudad predeterminada).
- **Buscador de ciudades**: Geocoding API → OpenMeteo API con tarjeta de resultado y manejo de errores (ciudad no encontrada / fallo de red).
- **Gestión de ciudades**: Registrar, listar, eliminar y cambiar la predeterminada. Persistido en `localStorage` (`weatherApp:cities:v1`). La ciudad predeterminada no es eliminable.
- **Ajustes**: Pantalla para elegir unidad de temperatura (°C/°F) persistida en `localStorage` (`weatherApp:unit:v1`), aplicada en Home, lista de ciudades y buscador.

## Stack

- React + Vite
- OpenMeteo (Geocoding API + Forecast API)
- Lucide React (iconos)
- Design system propio (`Plantilla-app-clima-HTML/_ds/`)

## Ejemplo de petición HTTP

**Paso 1: Geocoding API** (buscar ciudad por nombre):

```
https://geocoding-api.open-meteo.com/v1/search?name=Chihuahua,Chihuahua&count=1&language=es&format=json
```

**Paso 2: Forecast API** (obtener temperatura actual):

```
https://api.open-meteo.com/v1/forecast?latitude=28.63528&longitude=-106.08889&current=temperature_2m,weather_code
```

## Inicializar proyecto

```bash
npm create vite@latest . -- --template react
npm install
npm run dev
```

## Prototipo visual

[`Plantilla-app-clima-HTML/index.html`](./Plantilla-app-clima-HTML/index.html) es el prototipo estático de referencia: muestra la apariencia visual que la app reproduce en React. No tiene lógica conectada a las APIs ni corresponde al código final.
