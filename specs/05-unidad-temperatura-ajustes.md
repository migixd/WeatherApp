# SPEC 05 — Pantalla de Ajustes con unidad de temperatura (°C/°F)

> **Estado:** Aprobado
> **Depende de:** SPEC 01, SPEC 02, SPEC 03, SPEC 04
> **Fecha:** 2026-09-19
> **Objetivo:** Agregar a WeatherApp una pantalla Ajustes para elegir la unidad de temperatura (°C/°F) persistida, que formatea el clima en el Home, la lista de ciudades y el buscador.

## Scope

**In:**

- Botón de engrane de `CiudadPorDefecto` (ícono `Settings`, `aria-label="Ajustes"`, hoy sin `onClick`) que navega a la pantalla Ajustes.
- Nueva pantalla `src/components/Ajustes.jsx`: `.back-row` (botón `ArrowLeft` + título "Ajustes", igual que `ListaCiudades`/`SearchScreen`) y control segmentado de dos opciones °C/°F con label "Unidad de temperatura".
- Estado `unidadTemperatura` (`'C' | 'F'`) en `src/App.jsx` con el mismo patrón que `citiesData`: init desde store y persistido con `useEffect`.
- Nuevo `src/data/temperatureStore.js` con `loadUnit()`/`saveUnit(unit)` (mismo estilo que `citiesStore.js`).
- Nuevo `src/data/temperature.js` con `formatTemperature(tempC, unidad)`.
- Prop drilling desde `App` hacia `Home → CiudadPorDefecto`, `ListaCiudades → CityCard`, `SearchScreen → TarjetaClima` y `Ajustes`.
- Pantalla `'ajustes'` en el `useState('screen')` de `src/App.jsx`.
- Reemplazar los tres hardcodes `{tempC}°C` (`CiudadPorDefecto.jsx`, `CityCard` en `ListaCiudades.jsx`, `TarjetaClima.jsx`).

**Fuera de alcance:**

- Kelvin u otras unidades.
- Modificar `citiesStore.js` ni el modelo `weatherApp:cities:v1`.
- Más opciones en la pantalla Ajustes.
- Introducir Context o una librería de estado.

## Data model

```js
// localStorage, key: "weatherApp:unit:v1"
'F'  // valor: string plano 'C' | 'F'; key ausente o valor inválido → 'C'
```

```js
// src/data/temperature.js
formatTemperature(tempC, unidad)
// unidad 'C' → `${tempC}°C`        (tempC ya es entero, lo entrega fetchCurrentWeather)
// unidad 'F' → `${Math.round(tempC * 9 / 5 + 32)}°F`
```

Convenciones:

- La app guarda el clima **siempre** en °C crudo (lo que devuelve `fetchCurrentWeather`); la conversión ocurre solo al formatear para mostrar.
- Cambiar la unidad nunca dispara refetch ni recálculo de datos guardados.

## Implementation plan

1. Crear `src/data/temperature.js` con `formatTemperature` y `src/data/temperatureStore.js` con `loadUnit`/`saveUnit`.
2. En `src/App.jsx`: `const [unidadTemperatura, setUnidadTemperatura] = useState(loadUnit)` y `useEffect(() => saveUnit(unidadTemperatura), [unidadTemperatura])`.
3. En `src/App.jsx`: agregar pantalla `'ajustes'`, `handleSetUnit(unit)`, y pasar `unidadTemperatura`, `onSetUnit` y `onOpenSettings` por props a `Home` y a `Ajustes`.
4. Crear `src/components/Ajustes.jsx`: `.back-row` + label "Unidad de temperatura" + `.seg` con dos `.seg-opt` (radios ocultos °C/°F, `checked` según `unidadTemperatura`).
5. En `src/components/CiudadPorDefecto.jsx`: conectar el engrane (`onClick={onOpenSettings}`) y formatear con `formatTemperature(weather.tempC, unidadTemperatura)`; en `Home.jsx` recibir y reenviar las props nuevas.
6. En `CityCard` (`ListaCiudades.jsx`) y `TarjetaClima.jsx`: reemplazar `{tempC}°C` por `formatTemperature(tempC, unidadTemperatura)`; en `SearchScreen.jsx` recibir y pasar la prop.
7. Verificación E2E manual: cambiar a °F desde Ajustes y confirmar °F sin recarga en Home, lista de ciudades y un resultado nuevo de búsqueda; recargar la página y confirmar que persiste.

## Acceptance criteria

- [ ] `npm run dev` renderiza sin errores en consola.
- [ ] El engrane del Home abre la pantalla Ajustes; su botón volver regresa al Home.
- [ ] Ajustes muestra "Unidad de temperatura" y un control segmentado °C/°F con la unidad activa resaltada (`input:checked`).
- [ ] La unidad inicial es `'C'` (o la guardada en `weatherApp:unit:v1`).
- [ ] El Home (`CiudadPorDefecto`) muestra la temperatura en la unidad activa.
- [ ] "Todas las ciudades" muestra la temperatura de cada ciudad en la unidad activa.
- [ ] Un resultado nuevo de búsqueda muestra la temperatura en la unidad activa.
- [ ] Cambiar la unidad desde Ajustes se refleja en las tres pantallas anteriores **sin recargar la página**, sin necesidad de volver a pedir el clima.
- [ ] En °F la temperatura es entera y se calcula como `Math.round(tempC * 9 / 5 + 32)`; en °C se muestra el entero de `fetchCurrentWeather`.
- [ ] Recargar la página conserva la unidad elegida.
- [ ] `weatherApp:unit:v1` guarda únicamente el string `'C'` o `'F'`.
- [ ] `citiesStore.js` y la key `weatherApp:cities:v1` no se modifican.
- [ ] Los `.seg-opt` mantienen `:focus-visible` con outline accent; los radios están ocultos (`opacity: 0`, `width/height: 0`); todo con tokens del design system.

## Decisions

- **Sí:** `weatherApp:unit:v1` con string plano. Un scalar no necesita versión interna; el sufijo `:v1` mantiene la convención del repo.
- **Sí:** `formatTemperature` en `src/data/temperature.js`. Módulo puro, separado del fetch y del store.
- **Sí:** °F entero con `Math.round(tempC * 9 / 5 + 32)`. Idéntico al prototipo.
- **Sí:** Radios ocultos dentro de `.seg-opt`. Reusa el CSS nativo de `design-system.css` y es accesible por teclado.
- **Sí:** Prop drilling desde `App.jsx` como fuente única. Mismo patrón estado-elevado que ya usa la app; sin Context ni librería de estado.
- **No:** Copia local de la unidad en cada componente. Una sola fuente evita desincronización.
- **No:** Convertir y re-guardar `tempC` al cambiar la unidad. La conversión ocurre solo al formatear.
- **No:** Refetch del clima al cambiar la unidad. Los datos en °C no cambian.
- **No:** Kelvin u otras unidades; no tocar `citiesStore.js`; no agregar más opciones a Ajustes.

## Risks

| Riesgo | Mitigación |
| --- | --- |
| localStorage no disponible (modo privado) | `loadUnit` devuelve `'C'` y `saveUnit` va en `try/catch`; la app funciona en memoria. |
| Valor corrupto en la key | `loadUnit` valida `'C' | 'F'` y devuelve `'C'` como fallback. |
| `:has(input:checked)` no soportado | Navegadores actuales lo soportan; de no ser así, el estado activo se pierde solo visualmente (el check sigue marcando). |

## What is **not** in this spec

- Kelvin u otras unidades.
- Modificación del modelo `weatherApp:cities:v1` / `citiesStore.js`.
- Opciones extra de Ajustes (idioma, modo oscuro, etc.).
- Routing de páginas o librería de estado global.

Cada uno de esos, si llega, va en su propio spec.