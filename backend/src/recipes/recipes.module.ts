// Modulo de recetas IA para Fase 5 con controlador y servicio de generacion.
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from '../products/products.module';
import { OpenAiRecipeService } from './openai-recipe.service';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';

@Module({
  imports: [ConfigModule, ProductsModule],
  controllers: [RecipesController],
  providers: [RecipesService, OpenAiRecipeService],
})
export class RecipesModule {}
