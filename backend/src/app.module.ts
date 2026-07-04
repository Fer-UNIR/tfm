// Modulo raiz que compone persistencia, health y productos con validacion global.
import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { HealthModule } from './health/health.module';
import { PersistenceModule } from './persistence/persistence.module';
import { ProductsModule } from './products/products.module';
import { ShoppingListModule } from './shopping-list/shopping-list.module';

@Module({
  imports: [PersistenceModule, HealthModule, ProductsModule, ShoppingListModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
  ],
})
export class AppModule {}
