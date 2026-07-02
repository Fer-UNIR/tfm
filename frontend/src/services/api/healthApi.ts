// Cliente API para consultar el endpoint de health del backend.
import { API_BASE_URL } from '../../config/env';
import { HealthCheckResponse } from '../../types/health';

export const fetchHealthCheck = async (): Promise<HealthCheckResponse> => {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error(`Health check failed with status ${response.status}`);
  }

  const payload = (await response.json()) as HealthCheckResponse;
  return payload;
};
