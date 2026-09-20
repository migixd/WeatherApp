# SPEC 02 — Buscar el clima de una ciudad

> **Estado:** Aprobado
> **Depende de:** SPEC 01
> **Fecha:** 2026-09-19
> **Objetivo:** Agregar a WeatherApp una pantalla de búsqueda que, usando la Geocoding API y luego la OpenMeteo API, muestre en una tarjeta el clima actual de una ciudad buscada por su nombre.

## Scope

**In:**

- Navegación entre Home y la pantalla de búsqueda mediante estado local en `src/App.jsx` (sin dependencias nuevas).
- Conectar el tile "Buscar y agregar" del Home a la pantalla de búsqueda.
- Pantalla de búsqueda con `.back-row` (botón `.icon-btn` con ícono `arrow-left` + encabezado "Buscar y agregar"), repitiendo el layout de la pantalla homónima de `Plantilla-app-clima-HTML/index.html`.
- Componente `BuscadorCiudad`: campo `.input` (placeholder "Escribe el nombre de una ciudad") + botón `.btn.btn-primary` que inicia la búsqueda (clic o Enter). El botón se deshabilita y muestra "Buscando…" durante la petición.
- Flujo de datos: Geocoding API (`count=1`, `language=es`) → lat/lon del primer resultado; OpenMeteo API (`current=temperature_2m`) → temperatura actual.
- Componente `TarjetaClima`: `.card.elev-sm` con el nombre de la ciudad (tipografía heading) y la temperatura en °C (tipografía heading), siguiendo el estilo de las cards de resultados del prototipo.
- Manejo de errores con mensaje en texto bajo el campo: ciudad no encontrada y fallo de petición.

**Fuera de alcance (specs futuros):**

- Persistencia (ciudad predeterminada, lista de ciudades, historial).
- Toggle °C/°F (Ajustes).
- Botón "Agregar" en la tarjeta de resultados / registrar ciudades.
- Lista de coincidencias del geocoding (elegir entre varias ciudades).
- Navegación a las otras pantallas (Todas las ciudades, Eliminar, Predeterminada, Ajustes).

## Data model

Este spec no introduce estructuras propias; consume los shapes de las dos APIs.

```js
// Respuesta de https://geocoding-api.open-meteo.com/v1/search?count=1&language=es
// res.results[] (array vacío si no hay coincidencias):
{ name: 'Chihuahua', latitude: 28.63528, longitude: -106.08889, admin1: 'Chihuahua', country: 'México' }

// Respuesta de https://api.open-meteo.com/v1/forecast?current=temperature_2m
// res.current:
{ temperature_2m: 34.2 }
```

Internamente el resultado renderizado es: `{ name, tempC }` donde `tempC = Math.round(temperature_2m)`.

## Implementation plan

1. Crear `src/data/weatherApi.js` con `geocodeCity(name)` y `fetchCurrentWeather(lat, lon)`. Verificar con `npm run dev` + consola (fetch manual a las URLs del README, `language=es`, `count=1`).
2. Crear `src/components/BuscadorCiudad.jsx` (campo `.input`, botón `Buscar`, estado `loading` con "Buscando…" en el botón) y `src/components/TarjetaClima.jsx` (`.card.elev-sm` con nombre + `X°C`). Sin lógica de API todavía.
3. Agregar `.back-row` a `src/styles/app.css` y crear `src/components/SearchScreen.jsx` que arma la pantalla con `BuscadorCiudad`, `TarjetaClima` y los mensajes de error como texto bajo el campo.
4. Modificar `src/App.jsx` para conmutar pantallas con `useState` (`'home'` | `'search'`) y pasar callbacks. Conectar el tile "Buscar y agregar" de `src/components/Home.jsx` vía prop `onSearchClick`.
5. Comparar contra la pantalla "Buscar y agregar" del prototipo y ajustar layout/tokens.

## Acceptance criteria

- [ ] Clic en el tile "Buscar y agregar" del Home abre la pantalla de búsqueda.
- [ ] El botón `.icon-btn` con `arrow-left` de la pantalla de búsqueda regresa al Home.
- [ ] La pantalla de búsqueda repite el layout del prototipo: encabezado, campo de texto y cards de resultados.
- [ ] Escribir "Chihuahua" y buscar muestra una tarjeta con "Chihuahua" y la temperatura actual en °C.
- [ ] La búsqueda usa Geocoding API primero y luego OpenMeteo con las coordenadas obtenidas, con `language=es` y `count=1`.
- [ ] Durante la petición el botón se deshabilita y muestra "Buscando…".
- [ ] Un nombre inexistente muestra "No se encontró una ciudad con ese nombre." bajo el campo.
- [ ] Un fallo de red o API muestra "Ocurrió un error al obtener el clima. Intenta de nuevo." bajo el campo.
- [ ] Los estilos nuevos usan tokens (`var(--color-*)`, `var(--space-*)`, `var(--radius-*)`) y fuentes Caprasimo/Figtree.
- [ ] No existe persistencia ni guardado de la ciudad buscada.
- [ ] No existe el botón "Agregar" ni toggle °C/°F.

## Decisions

- **Sí:** Navegación con estado local en `App.jsx` (useState). Coincide con "No: Routing" del SPEC 01 y no agrega dependencias.
- **Sí:** `count=1` en el geocoding y primer resultado. Igual al ejemplo del README; el alcance pide una ciudad a la vez.
- **Sí:** `TarjetaClima` muestra solo nombre + °C. La API solo pide `current=temperature_2m`; condición/ícono se pueden agregar en otro spec si se piden más variables.
- **Sí:** Módulo `src/data/weatherApi.js`. Aísla el fetch para reusarlo en los ciclos siguientes (lista de ciudades, predeterminada).
- **Sí:** Errores como texto bajo el campo. Clara y sin romper layout; descartado `alert()`.
- **No:** react-router. Overkill para 2 pantallas.
- **No:** Lista de coincidencias del geocoding. Amplía el alcance y el prototipo usa `count=1`.
- **No:** Trabajar los errores con `alert()` ni con componente de aviso estilado (más trabajo, sin beneficio en este alcance).

## Risks

| Riesgo | Mitigación |
| --- | --- |
| OpenMeteo devuelve `null` en `results` (no solo `[]`) en algunos errores | Tratar `results` ausente como "no encontrada". |
| Búsqueda en blanco dispara una petición innecesaria | No llamar a la API con input vacío. |
| El CA de Let's Encrypt del geocoding está caído | Los mensajes de error cubren el fallo de red. |

## What is **not** in this spec

- Persistencia / guardar búsquedas.
- Toggle °C/°F.
- Botón "Agregar" y registro de ciudades.
- Lista de coincidencias al buscar.
- Navegación a las otras 4 pantallas del menú.

Cada uno de esos, si llega, va en su propio spec.