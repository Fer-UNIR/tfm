// Tipos del frontend para interpretar la respuesta del health check.
export interface HealthCheckResponse {
  data: {
    status: 'ok' | 'degraded';
    database: 'up' | 'down';
  };
  meta: {
    timestamp: string;
  };
}
