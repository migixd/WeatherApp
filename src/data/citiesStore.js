const STORAGE_KEY = 'weatherApp:cities:v1';

const EMPTY_COLLECTION = { version: 1, defaultCityId: null, cities: [] };

export function loadCities() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_COLLECTION;
    const data = JSON.parse(raw);
    if (!Array.isArray(data.cities)) return EMPTY_COLLECTION;
    return data;
  } catch {
    return EMPTY_COLLECTION;
  }
}

export function saveCities(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage no disponible (p. ej. modo privado): se ignora, la app sigue en memoria.
  }
}