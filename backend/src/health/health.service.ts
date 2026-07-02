// Servicio que verifica SQLite y construye la respuesta del health check.
import { Injectable } from '@nestjs/common';
import { PersistenceService } from '../persistence/persistence.service';
import { HealthCheckResponse } from './health.types';

@Injectable()
export class HealthService {
  constructor(private readonly persistenceService: PersistenceService) {}

  check(): HealthCheckResponse {
    let databaseStatus: 'up' | 'down' = 'up';

    try {
      this.persistenceService.getConnection().prepare('SELECT 1;').get();
    } catch {
      databaseStatus = 'down';
    }

    return {
      data: {
        status: databaseStatus === 'up' ? 'ok' : 'degraded',
        database: databaseStatus,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  }
}
