// Modulo raiz que compone los modulos base de persistencia y health.
import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { PersistenceModule } from './persistence/persistence.module';

@Module({
  imports: [PersistenceModule, HealthModule],
})
export class AppModule {}
