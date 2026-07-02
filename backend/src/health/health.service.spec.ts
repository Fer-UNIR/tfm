// Pruebas unitarias del servicio de health para estados ok y degradado.
import { HealthService } from './health.service';

describe('HealthService', () => {
  it('returns ok when SQLite responds', () => {
    const persistenceMock = {
      getConnection: () => ({
        prepare: () => ({
          get: () => ({ value: 1 }),
        }),
      }),
    } as unknown as ConstructorParameters<typeof HealthService>[0];

    const service = new HealthService(persistenceMock);

    const result = service.check();

    expect(result.data.status).toBe('ok');
    expect(result.data.database).toBe('up');
    expect(result.meta.timestamp).toEqual(expect.any(String));
  });

  it('returns degraded when SQLite fails', () => {
    const persistenceMock = {
      getConnection: () => ({
        prepare: () => ({
          get: () => {
            throw new Error('database not available');
          },
        }),
      }),
    } as unknown as ConstructorParameters<typeof HealthService>[0];

    const service = new HealthService(persistenceMock);

    const result = service.check();

    expect(result.data.status).toBe('degraded');
    expect(result.data.database).toBe('down');
  });
});
