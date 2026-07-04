// DTO para solicitar la generacion de recetas con preferencias opcionales.
import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { MEAL_TYPES, type MealType } from '../types/generated-recipe.type';

export class RecipePreferencesDto {
  @IsOptional()
  @IsIn(MEAL_TYPES)
  mealType?: MealType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(6)
  servings?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(5)
  @Max(180)
  maxPreparationMinutes?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dietaryRestrictions?: string[];
}

export class GenerateRecipeDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => RecipePreferencesDto)
  preferences?: RecipePreferencesDto;
}
