// Configuracion de variables publicas del frontend para la URL base del backend.
const defaultApiBaseUrl = 'http://localhost:3000/api/v1';

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? defaultApiBaseUrl;
