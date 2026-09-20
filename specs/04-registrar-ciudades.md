# SPEC 04 — Registrar y gestionar ciudades

> **Estado:** Implementado
> **Depende de:** SPEC 01, SPEC 02, SPEC 03
> **Fecha:** 2026-09-19
> **Objetivo:** Agregar a WeatherApp la funcionalidad de registrar, listar, eliminar y cambiar la ciudad predeterminada, completando la navegación de las pantallas secundarias del prototipo visual.

## Scope

**In:**

- Componente `ListaCiudades`: pantalla "Todas las ciudades" con una tarjeta por ciudad registrada mostrando clima (ícono, nombre, condición, temperatura) y etiqueta "Predeterminada" en la que corresponda, reutilizando `fetchCurrentWeather` y `weatherAppearance` de `src/data/weatherApi.js`.
- Botón "Agregar ciudad" al fondo de `ListaCiudades` que navega al buscador.
- Extender el flujo del buscador (SPEC 02) con botón "Agregar" real por cada resultado que sume la ciudad a la colección, y muestre "Agregada" en vez del botón si ya existe.
- Pantalla "Eliminar ciudad": tarjeta por ciudad registrada con botón de borrar (ícono `trash-2`); la ciudad predeterminada no es eliminable (botón deshabilitado con mensaje de que primero hay que cambiar el default).
- Pantalla "Ciudad predeterminada": lista las ciudades registradas y permite elegir una distinta como default; la actual muestra un ícono de verificado (`check-circle-2`).
- Conectar las 3 pantallas nuevas a los botones del menú del Home ("Todas las ciudades", "Eliminar ciudad", "Ciudad predeterminada") con el mismo patrón de navegación e ícono de volver que ya usaste en specs anteriores.
- Persistir todo en la misma colección `weatherApp:cities:v1` del SPEC 03, sin crear una colección aparte.
- La ciudad default siempre es parte de la lista de ciudades registradas; nunca se guarda aparte ni aparece duplicada.

**Fuera de alcance:**

- Pantalla "Ajustes" (toggle °C/°F).
- Toggle de unidad de temperatura.
- Seed de ciudades iniciales por defecto (el estado inicial sigue siendo la primera visita sin ciudades, salvo que SPEC 03 haya guardado alguna).

## Data model

Este spec no introduce estructuras nuevas. Consume y extiende la colección de `SPEC 03`:

```js
// localStorage, key: "weatherApp:cities:v1"
{
  version: 1,
  defaultCityId: 284624, // 'id' del geocoding de OpenMeteo, o null
  cities: [
    { id: 284624, name: 'Chihuahua', state: 'Chihuahua',
      latitude: 28.63528, longitude: -106.08889 },
    { id: 3522507, name: 'Ciudad Juárez', state: 'Chihuahua',
      latitude: 31.6904, longitude: -106.4245 },
  ],
}
```

Convenciones (ya establecidas en SPEC 03):

- `id` = `id` de la Geocoding API de OpenMeteo.
- `state` = `admin1` del geocoding.
- `version` fijo en `1`.
- No se persiste `tempC`/condición: el clima se fetchea fresco cada vez que un componente lo necesite.

## Implementation plan

1. Modificar `src/App.jsx`: extender el `useState('screen')` para incluir `'cities'`, `'delete'` y `'setDefault'`; agregar callbacks `handleAddCity`, `handleDeleteCity`, `handleSetDefault`; pasar `onSearchFromCities` a `Home` para que el tile "Todas las ciudades" pueda llevar al buscador desde la lista; en `SearchScreen`, reemplazar `onSaveDefault` por `onAddCity` y pasarle `onBackOverride` cuando el flujo viene de la pantalla de ciudades.
2. Modificar `src/components/Home.jsx`: recibir props `onCitiesClick`, `onDeleteClick`, `onSetDefaultClick` y conectarlas a los tiles correspondientes; el tile "Todas las ciudades" usa `onCitiesClick`.
3. Modificar `src/components/SearchScreen.jsx`: cambiar el flujo para mostrar resultados con botón "Agregar" (o "Agregada" si ya existe), usando la colección de ciudades para detectar duplicados; después de agregar, navegar a la pantalla de ciudades (o al Home si el flujo es directo desde el menú).
4. Modificar `src/components/TarjetaClima.jsx`: reemplazar prop `onSaveDefault` por `onAdd` (botón "Agregar") y `isAdded` (booleano); cuando `isAdded` es true, mostrar `<span className="tag tag-neutral">Agregada</span>` en vez del botón.
5. Crear `src/components/ListaCiudades.jsx`: pantalla con `.back-row` ("Todas las ciudades"), lista de tarjetas con ícono, nombre, condición, temperatura y badge "Predeterminada"; cada ciudad fetchea su clima con `fetchCurrentWeather` al montar; botón "Agregar ciudad" al fondo que navega al buscador.
6. Crear `src/components/EliminarCiudad.jsx`: pantalla con `.back-row` ("Eliminar ciudad"), lista de tarjetas con nombre y botón `trash-2`; la ciudad predeterminada tiene el botón deshabilitado con texto "No se puede eliminar la predeterminada".
7. Crear `src/components/CiudadPredeterminada.jsx`: pantalla con `.back-row` ("Ciudad predeterminada"), botón-card por cada ciudad con borde `accent` en la actual y ícono `check-circle-2` para la que está seleccionada; al elegir una distinta, setea `defaultCityId` y navega al Home.
8. Agregar estilos nuevos en `src/styles/app.css`: `.city-card`, `.tag`, `.tag-accent-2`, `.tag-neutral`, `.btn-block`, `.btn-icon`, `.weather-icon-circle-sm` (44px para tarjetas de lista). Usar tokens de design system existentes.

## Acceptance criteria

- [ ] `npm run dev` renderiza sin errores en consola.
- [ ] Con localStorage vacío, el Home muestra el menú de 4 tiles y el tile "Todas las ciudades" abre la pantalla de ciudades vacía con el botón "Agregar ciudad".
- [ ] El tile "Eliminar ciudad" del Home abre la pantalla de eliminar con la lista de ciudades vacía.
- [ ] El tile "Ciudad predeterminada" del Home abre la pantalla de elegir default con la lista vacía.
- [ ] El tile "Buscar y agregar" sigue abriendo el buscador (flujo de SPEC 02 intacto).
- [ ] Buscar una ciudad muestra el resultado con un botón "Agregar".
- [ ] Si la ciudad ya está en la colección, la tarjeta muestra "Agregada" en vez del botón.
- [ ] Pulsar "Agregar" añade la ciudad a la colección y navega a la pantalla "Todas las ciudades".
- [ ] La pantalla "Todas las ciudades" muestra una tarjeta por ciudad registrada con ícono, nombre, condición, temperatura y badge "Predeterminada" en la default.
- [ ] El botón "Agregar ciudad" de la lista abre el buscador.
- [ ] La pantalla "Eliminar ciudad" muestra la lista de ciudades registradas.
- [ ] El botón de eliminar la ciudad predeterminada está deshabilitado con el mensaje "No se puede eliminar la predeterminada".
- [ ] Eliminar una ciudad no predeterminada la quita de la lista y de localStorage.
- [ ] La pantalla "Ciudad predeterminada" muestra las ciudades registradas con borde accent y check-circle-2 en la default.
- [ ] Elegir una nueva ciudad como default actualiza `defaultCityId` y navega al Home.
- [ ] El Home muestra ahora el nombre y clima de la nueva default.
- [ ] Recargar la página conserva la lista de ciudades y la default.
- [ ] La ciudad predeterminada siempre aparece en la lista de ciudades registradas (no se guarda aparte ni se duplica).
- [ ] Los botones de volver en todas las pantallas nuevas regresan al Home.
- [ ] Los estilos usan tokens (`var(--color-*)`, `var(--space-*)`, `var(--radius-*)`), fuentes Caprasimo/Figtree, botones con `border-radius: 999px` y `:focus-visible` con outline accent.
- [ ] No existe la pantalla "Ajustes" (toggle °C/°F).

## Decisions

- **Sí:** Reemplazar "Guardar como predeterminada" por "Agregar"/"Agregada" en el buscador. Fiel al prototipo: una sola acción por tarjeta de resultado. El default se cambia desde la pantalla "Ciudad predeterminada".
- **Sí:** Mantener la tarjeta de resultado con clima (ícono, tempC) y agregarle el botón "Agregar". Ya se fetchea el clima en SPEC 02; la tarjeta con temperatura es más informativa que solo nombre+estado.
- **Sí:** Después de "Agregar", navegar a "Todas las ciudades". Feedback visible del cambio, igual que en el prototipo.
- **Sí:** El botón de volver del buscador sigue regresando al Home. Consistente con SPEC 02; el flujo desde la lista de ciudades entra al buscador pero el "back" del buscador siempre es el Home (evita ciclos de navegación).
- **Sí:** Reutilizar `fetchCurrentWeather` y `weatherAppearance` para fetchear el clima de cada ciudad en `ListaCiudades`. Los datos no se persisten, se obtienen frescos al montar el componente.
- **Sí:** Las nuevas pantallas usan `app-phone` como wrapper externo, igual que `SearchScreen`. El `App.jsx` renderiza condicionalmente sin wrapper duplicado.
- **Sí:** La colección en `App.jsx` mantiene `citiesData` y lo pasa a todas las pantallas como prop. Las pantallas nuevas reciben `citiesData.cities` y `citiesData.defaultCityId`.
- **No:** Persistir `tempC`/condición en la colección. Se fetchea fresco; datos persistidos quedarían obsoletos.
- **No:** Pantalla "Ajustes" (toggle °C/°F). Queda fuera del taller.

## Risks

| Riesgo | Mitigación |
| --- | --- |
| Fetch de clima para múltiples ciudades simultáneamente puede ser lento | `ListaCiudades` fetchea en paralelo con `Promise.allSettled`; muestra las que llegan y las que fallan muestran un esqueleto o mensaje. |
| localStorage lleno al agregar muchas ciudades | Límite práctico de ~5-10 ciudades; `saveCities` envuelto en `try/catch`, la app sigue en memoria si falla. |
| El `id` del geocoding puede cambiar si OpenMeteo reindexa | Raro; si ocurre, la ciudad desaparece de la lista. Se puede resolver con re-búsqueda manual. |
| Navegación entre pantallas puede crear loops si se mezclan patrones | Todas las pantallas nuevas regresan al Home; solo el tile "Todas las ciudades" lleva al buscador desde la lista. Flujo unidireccional claro. |

## What is **not** in this spec

- Pantalla "Ajustes" (toggle °C/°F).
- Toggle de unidad de temperatura.
- Seed de ciudades iniciales por defecto.
- Historial de búsquedas.
- Animaciones de transición entre pantallas.

Cada uno de esos, si llega, va en su propio spec.
