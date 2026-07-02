// Tipos compartidos para la respuesta del endpoint de health.
export interface HealthCheckResponse {
  data: {
    status: 'ok' | 'degraded';
    database: 'up' | 'down';
  };
  meta: {
    timestamp: string;
  };
}
