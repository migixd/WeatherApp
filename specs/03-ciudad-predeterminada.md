# SPEC 03 — Ciudad predeterminada

> **Estado:** Aprobado
> **Depende de:** SPEC 01, SPEC 02
> **Fecha:** 2026-09-19
> **Objetivo:** Agregar a WeatherApp un bloque CiudadPorDefecto que muestre el clima real de la ciudad default guardada, persistida dentro de una colección de ciudades en localStorage y definida desde el resultado de una búsqueda.

## Scope

**In:**

- Componente `CiudadPorDefecto` que muestra el bloque superior del Home (etiqueta "Ciudad predeterminada", nombre, y clima en grande), replicando el layout de `Plantilla-app-clima-HTML/index.html`.
- Fetch del clima real de la ciudad default al abrir la app, usando las funciones de `src/data/weatherApi.js`.
- Extender `weatherApi.js`: `geocodeCity` devuelve también `id` y `state`; `fetchCurrentWeather` pide `current=temperature_2m,weather_code` y devuelve condición, ícono y colores derivados del código WMO.
- Botón "Guardar como predeterminada" en la tarjeta de resultado del buscador (SPEC 02), que guarda la ciudad y vuelve al Home.
- Colección de ciudades registradas en localStorage bajo una key versionada `weatherApp:cities:v1`, para que el ciclo 3 agregue más ciudades al mismo modelo sin migrar datos.
- Persistencia: recargar la página conserva la ciudad default.
- Confirmar que la navegación Home ↔ BuscadorCiudad (SPEC 02) sigue funcionando con el nuevo bloque.

**Fuera de alcance (ciclo 3, specs futuros):**

- Pantalla "Todas las ciudades".
- Eliminar ciudad y la regla de no poder eliminar la predeterminada.
- Elegir el default entre varias ciudades ya registradas.
- Toggle °C/°F (Ajustes).
- Tuplas de datos de clima persistidas (solo se guarda identidad).

## Data model

```js
// localStorage, key: "weatherApp:cities:v1"
{
  version: 1,
  defaultCityId: null, // 'id' del geocoding de OpenMeteo, o null
  cities: [            // colección: 0..1 elementos en este ciclo
    { id: 284624, name: 'Chihuahua', state: 'Chihuahua',
      latitude: 28.63528, longitude: -106.08889 },
  ],
}
```

Convenciones:

- `id` es el `id` que devuelve la Geocoding API de OpenMeteo (estable por ubicación); no se genera en la app.
- `state` es el campo `admin1` del geocoding.
- `version` es fijo en `1`; el ciclo 3 puede invalidarlo y migrar sin romper lecturas antiguas.
- **No** se persiste `tempC`: el clima se fetchea fresco cada vez que `CiudadPorDefecto` se monta.
- El estado inicial (primera visita, key ausente o `cities: []`) es "sin default": `defaultCityId: null`.

## Implementation plan

1. Extender `src/data/weatherApi.js`: `geocodeCity(name)` devuelve `{ id, name, state, latitude, longitude }`; `fetchCurrentWeather(lat, lon)` pide `current=temperature_2m,weather_code` y devuelve `{ tempC, condition, icon, iconBg, iconFg }`. Agregar el mapeo código WMO → `{ condition, icon, iconBg, iconFg }` (íconos de `lucide-react`; por defecto genérico: `{ condition: 'Parcialmente nublado', icon: Cloud, ... }`). Verificar con devtools: `geocodeCity('Chihuahua')` y el fetch con coordenadas.
2. Crear `src/data/citiesStore.js` con `loadCities()` (devuelve el objeto versionado o el default vacío) y `saveCities(data)`. En `src/App.jsx`, crear el estado de la colección y persistirlo con `useEffect` en cada cambio (con `try/catch` por si localStorage falla).
3. Crear `src/components/CiudadPorDefecto.jsx`: recibe `city` (identidad o `null`). Si `city` es `null`, no renderiza nada. Si no, fetchea con `fetchCurrentWeather` y muestra: etiqueta "Ciudad predeterminada" + nombre + botón Ajustes (arriba) y círculo con ícono grande, temperatura y condición (bloque `.weather-hero`). Estados: `loading` (sin render del bloque clima), `error` con mensaje y botón de reintento.
4. Reemplazar en `src/components/Home.jsx` el `home-header` y `weather-hero` actuales por `<CiudadPorDefecto city={defaultCity} />`, dejando solo el `menu-grid` cuando no hay default. Quitar el uso de `getDefaultCity()`/`DEFAULT_CITY_ID` de `src/data/cities.js`.
5. En `src/components/TarjetaClima.jsx` aceptar prop opcional `onSaveDefault` y, si viene, renderizar debajo un botón `.btn.btn-secondary` "Guardar como predeterminada". En `src/components/SearchScreen.jsx` guardar el resultado completo (`{ id, name, state, latitude, longitude, tempC }`) y pasar `onSaveDefault`.
6. En `src/App.jsx`, el callback `handleSaveDefault(city)`: agrega la ciudad a `cities` si no existe, setea `defaultCityId`, persiste y navega al Home. Pasarlo a `SearchScreen`. Verificación E2E: buscar → guardar → Home con la nueva ciudad → recargar y que persista → borrar la key y volver al estado sin default.

## Acceptance criteria

- [ ] `npm run dev` renderiza sin errores en consola.
- [ ] Con localStorage vacío, el Home muestra solo el grid de 4 tiles (sin bloque de clima ni nombre) y sigue funcionando.
- [ ] El tile "Buscar y agregar" abre la pantalla de búsqueda y el botón de volver regresa al Home (navegación de SPEC 02 intacta).
- [ ] Buscar una ciudad muestra la tarjeta de resultado con un botón "Guardar como predeterminada".
- [ ] Pulsar "Guardar como predeterminada" guarda la ciudad en `cities`, setea `defaultCityId`, persiste en `weatherApp:cities:v1` y navega al Home.
- [ ] El Home muestra entonces nombre, temperatura, condición e ícono en grande de la ciudad guardada, con el clima obtenido de OpenMeteo (no mock).
- [ ] Recargar la página conserva la ciudad default y re-fetches su clima.
- [ ] Borrar la key `weatherApp:cities:v1` vuelve al estado sin default (solo el buscador).
- [ ] Si la petición a OpenMeteo falla al abrir la app, `CiudadPorDefecto` muestra un mensaje de error con botón de reintento.
- [ ] `fetchCurrentWeather` pide `current=temperature_2m,weather_code`.
- [ ] `geocodeCity` devuelve `id`, `state`, `latitude` y `longitude`.
- [ ] Los estilos usan tokens (`var(--color-*)`, `var(--space-*)`, `var(--radius-*)`), fuentes Caprasimo/Figtree, y botones con `border-radius: 999px` y `:focus-visible` con outline accent.
- [ ] No existen la pantalla "Todas las ciudades", eliminar, elegir default entre varias ni toggle °C/°F.

## Decisions

- **Sí:** Colección versionada `weatherApp:cities:v1`. El ciclo 3 agrega más ciudades al mismo `cities` y cambia `defaultCityId` sin migrar el modelo ni los datos.
- **Sí:** Guardar solo identidad (`id`, `name`, `state`, `latitude`, `longitude`) y fetchear el clima al abrir. Evita datos obsoletos y mantiene un solo origen de verdad para la temperatura.
- **Sí:** Extender `fetchCurrentWeather` con `weather_code` y mapeo a condición/ícono. Fiel al prototipo; `TarjetaClima` (SPEC 02) sigue usando solo `tempC`.
- **Sí:** `id` de la ciudad = `id` del geocoding de OpenMeteo. Estable por ubicación y sin colisiones artificiales.
- **Sí:** "Guardar como predeterminada" navega al Home. Refleja el resultado del guardado donde el usuario lo va a ver.
- **No:** Seed con Chihuahua. El estado inicial sin default es una decisión de alcance explícita.
- **No:** Persistir `tempC`/condición en la colección (quedarían obsoletos).
- **No:** Pantalla "Todas las ciudades", eliminar o elegir default entre varias — ciclo 3.
- **No:** Toggle °C/°F — spec de Ajustes.

## Risks

| Riesgo | Mitigación |
| --- | --- |
| OpenMeteo cae al abrir la app | `CiudadPorDefecto` muestra error con botón de reintento; no rompe el resto del Home. |
| localStorage no disponible (modo privado) | `saveCities` envuelto en `try/catch`; la app sigue funcionando en memoria, solo sin persistir. |
| `weather_code` sin mapeo conocido | Fallback genérico (Cloud / "Parcialmente nublado") dentro del mapeo de `weatherApi.js`. |
| Dos búsquedas de la misma ciudad duplican el guardado | Antes de insertar se valida que el `id` no exista en `cities`. |

## What is **not** in this spec

- Pantalla "Todas las ciudades".
- Eliminar ciudad (y la regla de no borrar la predeterminada).
- Elegir el default entre varias ciudades.
- Toggle °C/°F.
- Persistir la temperatura o la condición en la colección.

Cada uno de esos, si llega, va en su propio spec.