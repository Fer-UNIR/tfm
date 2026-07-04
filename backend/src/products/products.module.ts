// Modulo de productos con controlador, servicio y repositorio SQLite.
import { Module } from '@nestjs/common';
import { PersistenceModule } from '../persistence/persistence.module';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { ProductsService } from './products.service';

@Module({
  imports: [PersistenceModule],
  controllers: [ProductsController],
  providers: [ProductsRepository, ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
