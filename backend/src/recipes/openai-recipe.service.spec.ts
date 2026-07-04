// Pruebas unitarias del servicio interno OpenAI para recetas.
import { InternalServerErrorException } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { GeneratedRecipe } from './types/generated-recipe.type';
import { OpenAiRecipeService } from './openai-recipe.service';

interface MutableOpenAiRecipeService {
  openAiClient: {
    chat: {
      completions: {
        create: jest.Mock;
      };
    };
  } | null;
}

describe('OpenAiRecipeService', () => {
  const buildConfigServiceMock = (values: Record<string, string | undefined>) =>
    ({
      get: jest.fn((key: string) => values[key]),
    }) as unknown as ConfigService;

  it('throws a clear error when OPENAI_API_KEY is missing', async () => {
    const configService = buildConfigServiceMock({
      OPENAI_API_KEY: undefined,
      OPENAI_MODEL: 'gpt-4.1-mini',
    });
    const service = new OpenAiRecipeService(configService);

    await expect(service.generateRecipe('system', 'user')).rejects.toThrow(
      'OPENAI_API_KEY is missing. Configure it before generating recipes with OpenAI.',
    );
  });

  it('uses configured model and returns parsed GeneratedRecipe', async () => {
    const configService = buildConfigServiceMock({
      OPENAI_API_KEY: 'test-key',
      OPENAI_MODEL: 'gpt-4.1-mini',
    });
    const service = new OpenAiRecipeService(configService);
    const createMock = jest.fn();

    const generatedRecipe: GeneratedRecipe = {
      title: 'Tortilla de verduras',
      mealType: 'cena',
      servings: 2,
      preparationTimeMinutes: 20,
      ingredientsUsed: [
        { name: 'Huevo', quantity: '2 unidades' },
        { name: 'Calabacin', quantity: '1/2 unidad' },
      ],
      optionalIngredients: ['Queso rallado'],
      missingIngredients: [],
      steps: ['Batir huevos.', 'Saltear verduras.', 'Integrar mezcla.', 'Cocinar y servir.'],
      notes: 'Sugerencia de receta.',
    };

    createMock.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify(generatedRecipe),
          },
        },
      ],
    });

    (service as unknown as MutableOpenAiRecipeService).openAiClient = {
      chat: {
        completions: {
          create: createMock,
        },
      },
    };

    const result = await service.generateRecipe('system prompt', 'user prompt');

    expect(result).toEqual(generatedRecipe);
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'gpt-4.1-mini',
        response_format: expect.objectContaining({
          type: 'json_schema',
        }),
      }),
    );
  });

  it('truncates steps to 8 when OpenAI returns more steps', async () => {
    const configService = buildConfigServiceMock({
      OPENAI_API_KEY: 'test-key',
      OPENAI_MODEL: 'gpt-4.1-mini',
    });
    const service = new OpenAiRecipeService(configService);
    const createMock = jest.fn().mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              title: 'Guiso de legumbres',
              mealType: 'almuerzo',
              servings: 4,
              preparationTimeMinutes: 45,
              ingredientsUsed: [{ name: 'Lentejas', quantity: '2 tazas' }],
              optionalIngredients: ['Comino'],
              missingIngredients: [],
              steps: [
                'Paso 1',
                'Paso 2',
                'Paso 3',
                'Paso 4',
                'Paso 5',
                'Paso 6',
                'Paso 7',
                'Paso 8',
                'Paso 9',
                'Paso 10',
              ],
              notes: 'Receta completa.',
            }),
          },
        },
      ],
    });

    (service as unknown as MutableOpenAiRecipeService).openAiClient = {
      chat: {
        completions: {
          create: createMock,
        },
      },
    };

    const result = await service.generateRecipe('system', 'user');

    expect(result.steps).toHaveLength(8);
    expect(result.steps).toEqual([
      'Paso 1',
      'Paso 2',
      'Paso 3',
      'Paso 4',
      'Paso 5',
      'Paso 6',
      'Paso 7',
      'Paso 8',
    ]);
  });

  it('throws clear error when OpenAI returns fewer than 4 steps', async () => {
    const configService = buildConfigServiceMock({
      OPENAI_API_KEY: 'test-key',
      OPENAI_MODEL: 'gpt-4.1-mini',
    });
    const service = new OpenAiRecipeService(configService);
    const createMock = jest.fn().mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              title: 'Ensalada rapida',
              mealType: 'cena',
              servings: 1,
              preparationTimeMinutes: 10,
              ingredientsUsed: [{ name: 'Lechuga', quantity: '1 taza' }],
              optionalIngredients: [],
              missingIngredients: [],
              steps: ['Lavar.', 'Servir.'],
              notes: 'Simple.',
            }),
          },
        },
      ],
    });

    (service as unknown as MutableOpenAiRecipeService).openAiClient = {
      chat: {
        completions: {
          create: createMock,
        },
      },
    };

    await expect(service.generateRecipe('system', 'user')).rejects.toThrow(
      'OpenAI response must include at least 4 preparation steps.',
    );
  });

  it('throws clear error when OpenAI returns invalid JSON payload', async () => {
    const configService = buildConfigServiceMock({
      OPENAI_API_KEY: 'test-key',
      OPENAI_MODEL: 'gpt-4.1-mini',
    });
    const service = new OpenAiRecipeService(configService);
    const createMock = jest.fn().mockResolvedValue({
      choices: [
        {
          message: {
            content: '{invalid-json',
          },
        },
      ],
    });

    (service as unknown as MutableOpenAiRecipeService).openAiClient = {
      chat: {
        completions: {
          create: createMock,
        },
      },
    };

    await expect(service.generateRecipe('system', 'user')).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(service.generateRecipe('system', 'user')).rejects.toThrow(
      'OpenAI returned an invalid JSON payload for GeneratedRecipe.',
    );
  });
});
