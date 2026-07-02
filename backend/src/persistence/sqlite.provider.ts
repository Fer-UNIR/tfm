// Proveedor de conexion SQLite con ruta configurable por variable de entorno.
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

export const SQLITE_CONNECTION = 'SQLITE_CONNECTION';

const DEFAULT_DATABASE_PATH = 'storage/smartpantry.db';

export const sqliteProvider = {
  provide: SQLITE_CONNECTION,
  useFactory: (): DatabaseSync => {
    const configuredPath = process.env.SQLITE_DB_PATH ?? DEFAULT_DATABASE_PATH;
    const absoluteDatabasePath = join(process.cwd(), configuredPath);
    const storageDirectory = dirname(absoluteDatabasePath);

    if (!existsSync(storageDirectory)) {
      mkdirSync(storageDirectory, { recursive: true });
    }

    const database = new DatabaseSync(absoluteDatabasePath);
    database.exec('PRAGMA foreign_keys = ON;');

    return database;
  },
};
