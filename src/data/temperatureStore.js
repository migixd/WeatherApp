const STORAGE_KEY = 'weatherApp:unit:v1';

export function loadUnit() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'C' || raw === 'F') return raw;
    return 'C';
  } catch {
    return 'C';
  }
}

export function saveUnit(unit) {
  try {
    localStorage.setItem(STORAGE_KEY, unit);
  } catch {
    // localStorage no disponible (p. ej. modo privado): se ignora, la app sigue en memoria.
  }
}
