// Modulo de lista de compras con controlador, servicio y repositorio SQLite.
import { Module } from '@nestjs/common';
import { PersistenceModule } from '../persistence/persistence.module';
import { ShoppingListController } from './shopping-list.controller';
import { ShoppingListRepository } from './shopping-list.repository';
import { ShoppingListService } from './shopping-list.service';

@Module({
  imports: [PersistenceModule],
  controllers: [ShoppingListController],
  providers: [ShoppingListRepository, ShoppingListService],
})
export class ShoppingListModule {}
