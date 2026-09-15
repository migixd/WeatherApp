## Weather CLI APP

El objetivo de esta aplicación es que creemos una aplicación web con climas de ciudades.

### Opciones:

- Ingresar el nombre de una ciudad.
- Guardar la ciudad por defecto.
- Registrar otras ciudades para buscar el clima en esas otras ciudades.

## Stack

- React-Vite
- OpenMeteo

## Ejemplo de petición http:

1. Paso 1: Geocoding API.
2. Paso 2: OpenMeteo API.

```
https://geocoding-api.open-meteo.com/v1/search?name=Chihuahua,Chihuahua&count=1&language=es&format=json
https://api.open-meteo.com/v1/forecast?latitude=28.63528&longitude=-106.08889&current=temperature_2m
```

## Inicializar proyecto

```bash
npm create vite@latest . -- --template react
```

### Ejemplo de la app (solo interface)

Esta es la apariencia que deseamos crear

[`Plantilla-app-clima-HTML/index.html`](./Plantilla-app-clima-HTML/index.html) es una prueba de interfaz: muestra la apariencia que buscamos, no tiene lógica conectada a las APIs ni corresponde todavía al código final de la app.

