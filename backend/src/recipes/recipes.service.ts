// Servicio de recetas con inventario real y generación asistida por OpenAI.
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import type { GenerateRecipeDto } from './dto/generate-recipe.dto';
import { OpenAiRecipeService } from './openai-recipe.service';
import { RECIPE_SYSTEM_PROMPT } from './prompts/recipe-system.prompt';
import type {
  GeneratedRecipe,
  GeneratedRecipeResponse,
  MealType,
} from './types/generated-recipe.type';

interface InventoryPromptItem {
  name: string;
  quantity: number;
  unit: string;
}

interface NormalizedPromptPreferences {
  mealType: MealType;
  servings: number;
  maxPreparationMinutes: number;
  dietaryRestrictions: string[];
}

@Injectable()
export class RecipesService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly openAiRecipeService: OpenAiRecipeService,
  ) {}

  async generateRecipe(generateRecipeDto: GenerateRecipeDto): Promise<GeneratedRecipeResponse> {
    const preferences = generateRecipeDto.preferences;
    const normalizedPreferences: NormalizedPromptPreferences = {
      mealType: preferences?.mealType ?? 'cualquiera',
      servings: preferences?.servings ?? 2,
      maxPreparationMinutes: preferences?.maxPreparationMinutes ?? 25,
      dietaryRestrictions: preferences?.dietaryRestrictions ?? [],
    };
    const products = this.productsService.findAllProducts();
    const availableProducts = products.filter((product) => product.quantity > 0);

    if (availableProducts.length === 0) {
      throw new BadRequestException({
        code: 'BUSINESS_RULE_ERROR',
        message: 'No available inventory products for recipe generation.',
        details: ['inventory'],
      });
    }

    const inventoryForPrompt: InventoryPromptItem[] = availableProducts.map((product) => ({
      name: product.name,
      quantity: product.quantity,
      unit: product.unit,
    }));
    const userPrompt = this.buildUserPrompt(inventoryForPrompt, normalizedPreferences);
    const recipe = await this.generateWithAi(userPrompt);

    return {
      data: recipe,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  private async generateWithAi(userPrompt: string): Promise<GeneratedRecipe> {
    try {
      return await this.openAiRecipeService.generateRecipe(RECIPE_SYSTEM_PROMPT, userPrompt);
    } catch (error) {
      throw new InternalServerErrorException({
        code: 'AI_SERVICE_ERROR',
        message: 'Failed to generate recipe using AI service.',
        details: [this.getAiErrorDetail(error)],
      });
    }
  }

  private buildUserPrompt(
    inventoryForPrompt: InventoryPromptItem[],
    preferences: NormalizedPromptPreferences,
  ): string {
    const inventoryJson = JSON.stringify(inventoryForPrompt, null, 2);
    const preferencesJson = JSON.stringify(preferences, null, 2);

    return `
Genera una receta basada en el inventario disponible y en las preferencias del usuario.

Inventario disponible (JSON):
${inventoryJson}

Preferencias normalizadas (JSON):
${preferencesJson}

Devuelve SOLO un JSON valido y sin texto adicional.
El resultado DEBE respetar exactamente el contrato de salida GeneratedRecipe:
{
  "title": "string",
  "mealType": "desayuno | almuerzo | cena | colacion | cualquiera",
  "servings": number,
  "preparationTimeMinutes": number,
  "ingredientsUsed": [{ "name": "string", "quantity": "string" }],
  "optionalIngredients": ["string"],
  "missingIngredients": ["string"],
  "steps": ["string"],
  "notes": "string"
}
Regla obligatoria: "steps" debe tener entre 4 y 8 elementos.
`.trim();
  }

  private getAiErrorDetail(error: unknown): string {
    if (error instanceof HttpException) {
      const response = error.getResponse();

      if (typeof response === 'string') {
        return response;
      }

      if (response && typeof response === 'object' && 'message' in response) {
        const maybeMessage = (response as { message?: unknown }).message;

        if (typeof maybeMessage === 'string') {
          return maybeMessage;
        }

        if (Array.isArray(maybeMessage) && typeof maybeMessage[0] === 'string') {
          return maybeMessage[0];
        }
      }
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'Unknown AI service failure.';
  }
}
