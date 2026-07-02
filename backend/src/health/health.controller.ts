// Controlador que expone GET /health dentro del prefijo /api/v1.
import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import type { HealthCheckResponse } from './health.types';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  check(): HealthCheckResponse {
    return this.healthService.check();
  }
}
