// Servicio interno para integración OpenAI de recetas.
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { MEAL_TYPES, type GeneratedRecipe } from './types/generated-recipe.type';

interface OpenAiChatCompletionClient {
  chat: {
    completions: {
      create: (params: object) => Promise<{
        choices?: Array<{
          message?: {
            content?: string | null;
          };
        }>;
      }>;
    };
  };
}

@Injectable()
export class OpenAiRecipeService {
  private readonly model: string;
  private readonly apiKey: string | undefined;
  private openAiClient: OpenAiChatCompletionClient | null;

  private readonly generatedRecipeSchema = {
    type: 'object',
    additionalProperties: false,
    required: [
      'title',
      'mealType',
      'servings',
      'preparationTimeMinutes',
      'ingredientsUsed',
      'optionalIngredients',
      'missingIngredients',
      'steps',
      'notes',
    ],
    properties: {
      title: { type: 'string' },
      mealType: { type: 'string', enum: MEAL_TYPES },
      servings: { type: 'number' },
      preparationTimeMinutes: { type: 'number' },
      ingredientsUsed: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['name', 'quantity'],
          properties: {
            name: { type: 'string' },
            quantity: { type: 'string' },
          },
        },
      },
      optionalIngredients: {
        type: 'array',
        items: { type: 'string' },
      },
      missingIngredients: {
        type: 'array',
        items: { type: 'string' },
      },
      steps: {
        type: 'array',
        items: { type: 'string' },
        minItems: 4,
        maxItems: 8,
      },
      notes: { type: 'string' },
    },
  } as const;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.model = this.configService.get<string>('OPENAI_MODEL') ?? 'gpt-4.1-mini';
    this.openAiClient = this.apiKey
      ? (new OpenAI({ apiKey: this.apiKey }) as unknown as OpenAiChatCompletionClient)
      : null;
  }

  async generateRecipe(systemPrompt: string, userPrompt: string): Promise<GeneratedRecipe> {
    const client = this.getOpenAiClient();

    const completion = await client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'generated_recipe',
          strict: true,
          schema: this.generatedRecipeSchema,
        },
      },
    });

    const recipeContent = completion.choices?.[0]?.message?.content;

    if (!recipeContent || recipeContent.trim().length === 0) {
      throw new InternalServerErrorException(
        'OpenAI returned an empty response for recipe generation.',
      );
    }

    return this.parseGeneratedRecipe(recipeContent);
  }

  private getOpenAiClient(): OpenAiChatCompletionClient {
    if (!this.apiKey || !this.openAiClient) {
      throw new InternalServerErrorException(
        'OPENAI_API_KEY is missing. Configure it before generating recipes with OpenAI.',
      );
    }

    return this.openAiClient;
  }

  private parseGeneratedRecipe(content: string): GeneratedRecipe {
    let parsedContent: unknown;

    try {
      parsedContent = JSON.parse(content);
    } catch {
      throw new InternalServerErrorException(
        'OpenAI returned an invalid JSON payload for GeneratedRecipe.',
      );
    }

    if (!this.isGeneratedRecipe(parsedContent)) {
      throw new InternalServerErrorException(
        'OpenAI response does not match GeneratedRecipe contract.',
      );
    }

    return this.normalizeGeneratedRecipe(parsedContent);
  }

  private isGeneratedRecipe(value: unknown): value is GeneratedRecipe {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const candidate = value as Record<string, unknown>;

    return (
      typeof candidate.title === 'string' &&
      typeof candidate.mealType === 'string' &&
      typeof candidate.servings === 'number' &&
      typeof candidate.preparationTimeMinutes === 'number' &&
      Array.isArray(candidate.ingredientsUsed) &&
      candidate.ingredientsUsed.every((ingredient) => this.isIngredient(ingredient)) &&
      Array.isArray(candidate.optionalIngredients) &&
      candidate.optionalIngredients.every((ingredient) => typeof ingredient === 'string') &&
      Array.isArray(candidate.missingIngredients) &&
      candidate.missingIngredients.every((ingredient) => typeof ingredient === 'string') &&
      Array.isArray(candidate.steps) &&
      candidate.steps.every((step) => typeof step === 'string') &&
      typeof candidate.notes === 'string'
    );
  }

  private isIngredient(value: unknown): boolean {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const ingredient = value as Record<string, unknown>;
    return typeof ingredient.name === 'string' && typeof ingredient.quantity === 'string';
  }

  private normalizeGeneratedRecipe(recipe: GeneratedRecipe): GeneratedRecipe {
    if (recipe.steps.length < 4) {
      throw new InternalServerErrorException(
        'OpenAI response must include at least 4 preparation steps.',
      );
    }

    if (recipe.steps.length > 8) {
      return {
        ...recipe,
        steps: recipe.steps.slice(0, 8),
      };
    }

    return recipe;
  }
}
