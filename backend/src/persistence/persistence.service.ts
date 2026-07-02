// Servicio para acceder a la conexion SQLite y cerrarla al apagar la app.
import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import { DatabaseSync } from 'node:sqlite';
import { SQLITE_CONNECTION } from './sqlite.provider';

@Injectable()
export class PersistenceService implements OnApplicationShutdown {
  constructor(
    @Inject(SQLITE_CONNECTION) private readonly connection: DatabaseSync,
  ) {}

  getConnection(): DatabaseSync {
    return this.connection;
  }

  onApplicationShutdown(): void {
    this.connection.close();
  }
}
