const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

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
  const { name: city, latitude, longitude } = data.results[0];
  return { name: city, latitude, longitude };
}

export async function fetchCurrentWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: 'temperature_2m',
  });
  const res = await fetch(`${FORECAST_URL}?${params}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return { tempC: Math.round(data.current.temperature_2m) };
}
