# SPEC 01 — Pantalla principal de WeatherApp en React

> **Estado:** Implementado
> **Fecha:** 2026-09-15
> **Objetivo:** Recrear la pantalla principal del prototipo visual de WeatherApp como una app React + Vite, manteniendo el layout, colores y estructura de `Plantilla-app-clima-HTML/index.html`.

## Scope

**In:**

- Scaffold React + Vite en la raíz (`npm create vite@latest . -- --template react`).
- `.gitignore` típico de Vite/React (node_modules, dist, env, logs).
- CSS del design system copiado del prototipo a `src/styles/`, sin tocar `_ds/`.
- Instalar `lucide-react` (íconos como componentes).
- Componente `src/components/Home.jsx` recreando la pantalla Home:
  - Encabezado: "Ciudad predeterminada" + nombre de ciudad + botón Ajustes.
  - Bloque de clima: ícono en círculo, temperatura grande, condición.
  - Grid 2x2 con los 4 tiles: Todas las ciudades, Buscar y agregar, Eliminar ciudad, Ciudad predeterminada.
- Datos mock en `src/data/cities.js` (CATALOG de 5 ciudades del prototipo; la primera, Chihuahua, es la predeterminada).

**Fuera de alcance (specs futuros):**

- Pantallas secundarias (ciudades, buscar, eliminar, predeterminada, ajustes).
- Conexión a Geocoding API / OpenMeteo API.
- Registrar/eliminar ciudades o cambiar la predeterminada en runtime.
- Persistencia y navegación real entre pantallas (los tiles no navegan).

## Data model

```js
// src/data/cities.js — mock temporal, se reemplaza al conectar la API
export const CATALOG = [
  { id: 'chihuahua', name: 'Chihuahua', state: 'Chihuahua', tempC: 34,
    condition: 'Soleado', icon: Sun, iconBg: 'var(--color-accent-200)',
    iconFg: 'var(--color-accent-800)' },
  { id: 'delicias', name: 'Delicias', state: 'Chihuahua', tempC: 31,
    condition: 'Parcialmente nublado', icon: CloudSun, iconBg: 'var(--color-accent-2-200)',
    iconFg: 'var(--color-accent-2-800)' },
  { id: 'parral', name: 'Hidalgo del Parral', state: 'Chihuahua', tempC: 24,
    condition: 'Nublado', icon: Cloud, iconBg: 'var(--color-neutral-200)',
    iconFg: 'var(--color-neutral-700)' },
  { id: 'juarez', name: 'Ciudad Juárez', state: 'Chihuahua', tempC: 36,
    condition: 'Soleado', icon: Sun, iconBg: 'var(--color-accent-200)',
    iconFg: 'var(--color-accent-800)' },
  { id: 'cuauhtemoc', name: 'Cuauhtémoc', state: 'Chihuahua', tempC: 22,
    condition: 'Lluvia ligera', icon: CloudRain, iconBg: 'var(--color-neutral-200)',
    iconFg: 'var(--color-neutral-700)' },
];

export const DEFAULT_CITY_ID = 'chihuahua';
```

Convenciones:

- `icon` es el componente de `lucide-react` (no el string del prototipo).
- `tempC` es el valor base en °C; el Home lo muestra tal cual (34°C).

## Implementation plan

1. `npm create vite@latest . -- --template react` en la raíz. Resultado: `package.json`, `index.html`, `src/` de Vite. Verificar: `npm install && npm run dev`.
2. Crear `.gitignore` (node_modules, dist, \*.env, logs).
3. Copiar `_ds/.../styles.css` a `src/styles/design-system.css` (tokens + clases base).
4. Crear `src/styles/app.css` con las clases específicas del prototipo (`.app-phone`, `.icon-btn`, `.menu-tile`, `.tile-icon`, `.weather-icon-circle`) y los estilos de estados hover/focus.
5. Instalar `lucide-react`.
6. Crear `src/data/cities.js` y `src/components/Home.jsx`.
7. Reemplazar el contenido de `src/App.jsx` para renderizar `<Home />` e importar los CSS en `main.jsx`.
8. Comparar visualmente contra el prototipo y ajustar.

## Acceptance criteria

- [ ] `npm run dev` renderiza la pantalla Home sin errores en consola.
- [ ] El layout coincide con `Plantilla-app-clima-HTML/index.html` (ventana Home): encabezado, bloque de clima y grid 2x2.
- [ ] La ciudad mostrada es Chihuahua, 34°C, "Soleado".
- [ ] Los 4 tiles tienen ícono y texto correctos (CloudSun, Search, Trash2, Star).
- [ ] Todos los estilos usan tokens (`var(--color-*)`, `var(--space-*)`) y fuentes Caprasimo/Figtree; sin valores de color en crudo.
- [ ] Estados interactivos definidos: hover/pressed y `:focus-visible` con outline accent.
- [ ] No existe ninguna llamada `fetch` a Geocoding/OpenMeteo.
- [ ] `.gitignore` cubre node_modules y dist.

## Decisions

- **Sí:** Solo pantalla Home. Las otras 5 pantallas van en specs propios (feature más chica = revisión más rápida).
- **Sí:** Copiar el CSS del design system tal cual a `src/styles/`. Bajo riesgo visual; refactor a CSS modules se decide cuando crezca.
- **Sí:** `lucide-react` en vez del CDN de unpkg. Estándar React y sin dependencia de red en runtime.
- **Sí:** Datos mock en `src/data/cities.js`. Valor por defecto: primera ciudad del CATALOG.
- **No:** Routing/navegación.
- **No:** CSS-in-JS ni CSS modules ahora. El prototipo es CSS plano y copiarlo es lo más fiel.
- **No:** Tocar `_ds/` (es tooling generado del prototipo).

## Risks

| Riesgo | Mitigación |
| --- | --- |
| El CSS copiado usa `color-mix()` (no soportado en navegadores viejos) | Requerir navegadores modernos; Chrome/Firefox/Safari actuales lo soportan. |
| El `@import` de Google Fonts falla offline | Los fallbacks `system-ui, sans-serif` del CSS cubren la tipografía. |

## What is **not** in this spec

- Pantallas Cities/Search/Delete/SetDefault/Settings.
- APIs de Geocoding y OpenMeteo.
- Registrar, eliminar o cambiar ciudad predeterminada.
- Persistencia local y toggle °C/°F.

Cada uno de esos, si llega, va en su propio spec.