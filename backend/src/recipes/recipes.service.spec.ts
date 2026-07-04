// Pruebas unitarias del servicio de recetas con OpenAI mockeado.
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import type { Product } from '../products/entities/product.entity';
import { ProductsService } from '../products/products.service';
import { RECIPE_SYSTEM_PROMPT } from './prompts/recipe-system.prompt';
import { OpenAiRecipeService } from './openai-recipe.service';
import { RecipesService } from './recipes.service';
import type { GeneratedRecipe } from './types/generated-recipe.type';

describe('RecipesService', () => {
  let service: RecipesService;
  const productsServiceMock = {
    findAllProducts: jest.fn(),
  } as unknown as jest.Mocked<ProductsService>;
  const openAiRecipeServiceMock = {
    generateRecipe: jest.fn(),
  } as unknown as jest.Mocked<OpenAiRecipeService>;

  const availableProduct: Product = {
    id: 1,
    name: 'Arroz',
    category: 'Despensa',
    quantity: 1,
    unit: 'kg',
    minimumStock: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };
  const generatedRecipe: GeneratedRecipe = {
    title: 'Tortilla de verduras',
    mealType: 'cena',
    servings: 2,
    preparationTimeMinutes: 20,
    ingredientsUsed: [
      { name: 'Huevo', quantity: '2 unidades' },
      { name: 'Zanahoria', quantity: '1 unidad' },
    ],
    optionalIngredients: ['Queso rallado'],
    missingIngredients: ['Pimienta'],
    steps: ['Preparar ingredientes.', 'Batir.', 'Cocinar.', 'Servir.'],
    notes: 'Receta generada por IA.',
  };

  beforeEach(() => {
    productsServiceMock.findAllProducts.mockReset();
    openAiRecipeServiceMock.generateRecipe.mockReset();
    service = new RecipesService(productsServiceMock, openAiRecipeServiceMock);
  });

  it('generates recipe using OpenAI with normalized defaults', async () => {
    productsServiceMock.findAllProducts.mockReturnValue([availableProduct]);
    openAiRecipeServiceMock.generateRecipe.mockResolvedValue(generatedRecipe);

    const result = await service.generateRecipe({});

    expect(result.data).toEqual(generatedRecipe);
    expect(openAiRecipeServiceMock.generateRecipe).toHaveBeenCalledWith(
      RECIPE_SYSTEM_PROMPT,
      expect.stringContaining('"mealType": "cualquiera"'),
    );
    expect(result.meta.timestamp).toEqual(expect.any(String));
  });

  it('applies preferences in prompt and returns AI recipe', async () => {
    productsServiceMock.findAllProducts.mockReturnValue([availableProduct]);
    openAiRecipeServiceMock.generateRecipe.mockResolvedValue(generatedRecipe);

    const result = await service.generateRecipe({
      preferences: {
        mealType: 'cena',
        servings: 4,
        maxPreparationMinutes: 40,
        dietaryRestrictions: ['sin lactosa'],
      },
    });

    expect(result.data).toEqual(generatedRecipe);
    expect(openAiRecipeServiceMock.generateRecipe).toHaveBeenCalledWith(
      RECIPE_SYSTEM_PROMPT,
      expect.stringContaining('"servings": 4'),
    );
    expect(openAiRecipeServiceMock.generateRecipe).toHaveBeenCalledWith(
      RECIPE_SYSTEM_PROMPT,
      expect.stringContaining('"maxPreparationMinutes": 40'),
    );
  });

  it('builds a dynamic prompt including inventory and normalized preferences', () => {
    const prompt = (
      service as unknown as {
        buildUserPrompt: (
          inventoryForPrompt: Array<{ name: string; quantity: number; unit: string }>,
          preferences: {
            mealType: string;
            servings: number;
            maxPreparationMinutes: number;
            dietaryRestrictions: string[];
          },
        ) => string;
      }
    ).buildUserPrompt(
      [{ name: 'Tomate', quantity: 2, unit: 'ud' }],
      {
        mealType: 'cena',
        servings: 3,
        maxPreparationMinutes: 30,
        dietaryRestrictions: ['sin gluten'],
      },
    );

    expect(prompt).toContain('"name": "Tomate"');
    expect(prompt).toContain('"quantity": 2');
    expect(prompt).toContain('"unit": "ud"');
    expect(prompt).toContain('"mealType": "cena"');
    expect(prompt).toContain('"servings": 3');
    expect(prompt).toContain('"maxPreparationMinutes": 30');
    expect(prompt).toContain('"dietaryRestrictions": [');
    expect(prompt).toContain('GeneratedRecipe');
  });

  it('throws business rule error when no products are available', async () => {
    productsServiceMock.findAllProducts.mockReturnValue([
      {
        ...availableProduct,
        quantity: 0,
      },
    ]);

    let capturedError: BadRequestException | null = null;

    try {
      await service.generateRecipe({});
    } catch (error) {
      capturedError = error as BadRequestException;
    }

    expect(capturedError).toBeInstanceOf(BadRequestException);
    expect(capturedError?.getResponse()).toEqual({
      code: 'BUSINESS_RULE_ERROR',
      message: 'No available inventory products for recipe generation.',
      details: ['inventory'],
    });
    expect(openAiRecipeServiceMock.generateRecipe).not.toHaveBeenCalled();
  });

  it('maps OpenAI failures to AI_SERVICE_ERROR', async () => {
    productsServiceMock.findAllProducts.mockReturnValue([availableProduct]);
    openAiRecipeServiceMock.generateRecipe.mockRejectedValue(
      new InternalServerErrorException('OpenAI returned invalid payload.'),
    );

    let capturedError: InternalServerErrorException | null = null;

    try {
      await service.generateRecipe({});
    } catch (error) {
      capturedError = error as InternalServerErrorException;
    }

    expect(capturedError).toBeInstanceOf(InternalServerErrorException);
    expect(capturedError?.getResponse()).toEqual({
      code: 'AI_SERVICE_ERROR',
      message: 'Failed to generate recipe using AI service.',
      details: ['OpenAI returned invalid payload.'],
    });
  });
});
