// Modulo de persistencia que registra y exporta la capa SQLite base.
import { Module } from '@nestjs/common';
import { PersistenceService } from './persistence.service';
import { sqliteProvider } from './sqlite.provider';

@Module({
  providers: [sqliteProvider, PersistenceService],
  exports: [sqliteProvider, PersistenceService],
})
export class PersistenceModule {}
