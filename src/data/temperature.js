export function formatTemperature(tempC, unidad) {
  if (unidad === 'F') return `${Math.round(tempC * 9 / 5 + 32)}°F`;
  return `${tempC}°C`;
}
