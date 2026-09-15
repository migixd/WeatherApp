import { Sun, CloudSun, Cloud, CloudRain } from 'lucide-react'

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
]

export const DEFAULT_CITY_ID = 'chihuahua'

export const getDefaultCity = () =>
  CATALOG.find((c) => c.id === DEFAULT_CITY_ID)