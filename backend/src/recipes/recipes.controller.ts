// Controlador REST para generacion de recetas en /api/v1/recipes/generate.
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { GenerateRecipeDto } from './dto/generate-recipe.dto';
import { RecipesService } from './recipes.service';
import type { GeneratedRecipeResponse } from './types/generated-recipe.type';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  async generate(@Body() generateRecipeDto: GenerateRecipeDto): Promise<GeneratedRecipeResponse> {
    return this.recipesService.generateRecipe(generateRecipeDto);
  }
}
