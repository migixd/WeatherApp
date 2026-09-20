import { Sun, CloudSun, Cloud, CloudRain, CloudLightning, CloudSnow, CloudFog } from 'lucide-react';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

const WEATHER_CODE_TO_APPEARANCE = {
  0: { condition: 'Despejado', icon: Sun, iconBg: 'var(--color-accent-200)', iconFg: 'var(--color-accent-800)' },
  1: { condition: 'Mayormente despejado', icon: Sun, iconBg: 'var(--color-accent-200)', iconFg: 'var(--color-accent-800)' },
  2: { condition: 'Parcialmente nublado', icon: CloudSun, iconBg: 'var(--color-accent-2-200)', iconFg: 'var(--color-accent-2-800)' },
  3: { condition: 'Nublado', icon: Cloud, iconBg: 'var(--color-neutral-200)', iconFg: 'var(--color-neutral-700)' },
  45: { condition: 'Niebla', icon: CloudFog, iconBg: 'var(--color-neutral-200)', iconFg: 'var(--color-neutral-700)' },
  48: { condition: 'Niebla con escarcha', icon: CloudFog, iconBg: 'var(--color-neutral-200)', iconFg: 'var(--color-neutral-700)' },
  51: { condition: 'Llovizna ligera', icon: CloudRain, iconBg: 'var(--color-neutral-200)', iconFg: 'var(--color-neutral-700)' },
  53: { condition: 'Llovizna', icon: CloudRain, iconBg: 'var(--color-neutral-200)', iconFg: 'var(--color-neutral-700)' },
  55: { condition: 'Llovizna intensa', icon: CloudRain, iconBg: 'var(--color-neutral-200)', iconFg: 'var(--color-neutral-700)' },
  61: { condition: 'Lluvia ligera', icon: CloudRain, iconBg: 'var(--color-neutral-200)', iconFg: 'var(--color-neutral-700)' },
  63: { condition: 'Lluvia', icon: CloudRain, iconBg: 'var(--color-neutral-200)', iconFg: 'var(--color-neutral-700)' },
  65: { condition: 'Lluvia intensa', icon: CloudRain, iconBg: 'var(--color-neutral-200)', iconFg: 'var(--color-neutral-700)' },
  80: { condition: 'Chubascos ligeros', icon: CloudRain, iconBg: 'var(--color-neutral-200)', iconFg: 'var(--color-neutral-700)' },
  81: { condition: 'Chubascos', icon: CloudRain, iconBg: 'var(--color-neutral-200)', iconFg: 'var(--color-neutral-700)' },
  82: { condition: 'Chubascos fuertes', icon: CloudRain, iconBg: 'var(--color-neutral-200)', iconFg: 'var(--color-neutral-700)' },
  71: { condition: 'Nevada ligera', icon: CloudSnow, iconBg: 'var(--color-neutral-200)', iconFg: 'var(--color-neutral-700)' },
  73: { condition: 'Nevada', icon: CloudSnow, iconBg: 'var(--color-neutral-200)', iconFg: 'var(--color-neutral-700)' },
  75: { condition: 'Nevada intensa', icon: CloudSnow, iconBg: 'var(--color-neutral-200)', iconFg: 'var(--color-neutral-700)' },
  77: { condition: 'Granos de nieve', icon: CloudSnow, iconBg: 'var(--color-neutral-200)', iconFg: 'var(--color-neutral-700)' },
  85: { condition: 'Chubascos de nieve ligeros', icon: CloudSnow, iconBg: 'var(--color-neutral-200)', iconFg: 'var(--color-neutral-700)' },
  86: { condition: 'Chubascos de nieve fuertes', icon: CloudSnow, iconBg: 'var(--color-neutral-200)', iconFg: 'var(--color-neutral-700)' },
  95: { condition: 'Tormenta eléctrica', icon: CloudLightning, iconBg: 'var(--color-neutral-200)', iconFg: 'var(--color-neutral-700)' },
  96: { condition: 'Tormenta con granizo', icon: CloudLightning, iconBg: 'var(--color-neutral-200)', iconFg: 'var(--color-neutral-700)' },
  99: { condition: 'Tormenta con granizo y fuerte', icon: CloudLightning, iconBg: 'var(--color-neutral-200)', iconFg: 'var(--color-neutral-700)' },
};

const FALLBACK_APPEARANCE = { condition: 'Parcialmente nublado', icon: Cloud, iconBg: 'var(--color-neutral-200)', iconFg: 'var(--color-neutral-700)' };

export function weatherAppearance(code) {
  return WEATHER_CODE_TO_APPEARANCE[code] ?? FALLBACK_APPEARANCE;
}

export async function geocodeCity(name) {
  const params = new URLSearchParams({
    name,
    count: '1',
    language: 'es',
    format: 'json',
  });
  const res = await fetch(`${GEOCODING_URL}?${params}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!data.results || data.results.length === 0) return null;
  const { id, name: city, latitude, longitude, admin1 } = data.results[0];
  return { id, name: city, state: admin1, latitude, longitude };
}

export async function fetchCurrentWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: 'temperature_2m,weather_code',
  });
  const res = await fetch(`${FORECAST_URL}?${params}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const { temperature_2m, weather_code } = data.current;
  const appearance = weatherAppearance(weather_code);
  return { tempC: Math.round(temperature_2m), ...appearance };
}