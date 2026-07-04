import { existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { OpenAiRecipeService } from '../src/recipes/openai-recipe.service';

describe('RecipesController (e2e)', () => {
  let app: INestApplication<App>;
  let testDatabasePath: string;
  let originalSqlitePath: string | undefined;
  const openAiRecipeServiceMock = {
    generateRecipe: jest.fn(),
  };
  const generatedRecipe = {
    title: 'Tortilla de verduras',
    mealType: 'almuerzo',
    servings: 3,
    preparationTimeMinutes: 35,
    ingredientsUsed: [
      { name: 'Huevo', quantity: '2 unidades' },
      { name: 'Zanahoria', quantity: '1 unidad' },
    ],
    optionalIngredients: ['Queso rallado'],
    missingIngredients: ['Pimienta'],
    steps: ['Preparar ingredientes.', 'Batir.', 'Cocinar.', 'Servir.'],
    notes: 'Receta generada por IA.',
  };

  beforeAll(async () => {
    originalSqlitePath = process.env.SQLITE_DB_PATH;
    testDatabasePath = join(tmpdir(), `smartpantry-recipes-e2e-${process.pid}-${Date.now()}.db`);
    process.env.SQLITE_DB_PATH = testDatabasePath;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(OpenAiRecipeService)
      .useValue(openAiRecipeServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  beforeEach(() => {
    openAiRecipeServiceMock.generateRecipe.mockReset();
    openAiRecipeServiceMock.generateRecipe.mockResolvedValue(generatedRecipe);
  });

  afterAll(async () => {
    await app.close();

    if (originalSqlitePath === undefined) {
      delete process.env.SQLITE_DB_PATH;
    } else {
      process.env.SQLITE_DB_PATH = originalSqlitePath;
    }

    if (existsSync(testDatabasePath)) {
      rmSync(testDatabasePath);
    }
  });

  it('returns business rule error when inventory has no available products', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/recipes/generate')
      .send({})
      .expect(400)
      .expect(
        ({
          body,
        }: {
          body: {
            error: { code: string; message: string; details: string[] };
            meta: { timestamp: string };
          };
        }) => {
          expect(body.error.code).toBe('BUSINESS_RULE_ERROR');
          expect(body.error.message).toBe('No available inventory products for recipe generation.');
          expect(body.error.details).toEqual(['inventory']);
          expect(body.meta.timestamp).toEqual(expect.any(String));
        },
      );

    expect(openAiRecipeServiceMock.generateRecipe).not.toHaveBeenCalled();
  });

  it('generates recipe using OpenAI service and returns data/meta contract', async () => {
    await request(app.getHttpServer()).post('/api/v1/products').send({
      name: 'Arroz',
      category: 'Despensa',
      quantity: 0,
      unit: 'kg',
      minimumStock: 1,
    });

    await request(app.getHttpServer()).post('/api/v1/products').send({
      name: 'Zanahoria',
      category: 'Verduras',
      quantity: 2,
      unit: 'ud',
      minimumStock: 1,
    });

    await request(app.getHttpServer())
      .post('/api/v1/recipes/generate')
      .send({
        preferences: {
          mealType: 'almuerzo',
          servings: 3,
          maxPreparationMinutes: 35,
          dietaryRestrictions: ['sin lactosa'],
        },
      })
      .expect(200)
      .expect(
        ({
          body,
        }: {
          body: {
            data: {
              mealType: string;
              servings: number;
              preparationTimeMinutes: number;
              ingredientsUsed: Array<{ name: string; quantity: string }>;
              optionalIngredients: string[];
              notes: string;
            };
            meta: { timestamp: string };
          };
        }) => {
          expect(body.data.mealType).toBe('almuerzo');
          expect(body.data.servings).toBe(3);
          expect(body.data.preparationTimeMinutes).toBe(35);
          expect(body.data.ingredientsUsed).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                name: expect.any(String),
                quantity: expect.any(String),
              }),
            ]),
          );
          expect(body.data.optionalIngredients.length).toBeGreaterThan(0);
          expect(body.data.notes).toBe('Receta generada por IA.');
          expect(body.meta.timestamp).toEqual(expect.any(String));
        },
      );

    expect(openAiRecipeServiceMock.generateRecipe).toHaveBeenCalledTimes(1);
    expect(openAiRecipeServiceMock.generateRecipe).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('"name": "Zanahoria"'),
    );
  });

  it('maps OpenAI failures to AI_SERVICE_ERROR response contract', async () => {
    await request(app.getHttpServer()).post('/api/v1/products').send({
      name: 'Tomate',
      category: 'Verduras',
      quantity: 1,
      unit: 'ud',
      minimumStock: 1,
    });

    openAiRecipeServiceMock.generateRecipe.mockRejectedValueOnce(new Error('OpenAI timeout.'));

    await request(app.getHttpServer())
      .post('/api/v1/recipes/generate')
      .send({})
      .expect(500)
      .expect(
        ({
          body,
        }: {
          body: {
            error: { code: string; message: string; details: string[] };
            meta: { timestamp: string };
          };
        }) => {
          expect(body.error.code).toBe('AI_SERVICE_ERROR');
          expect(body.error.message).toBe('Failed to generate recipe using AI service.');
          expect(body.error.details).toEqual(['OpenAI timeout.']);
          expect(body.meta.timestamp).toEqual(expect.any(String));
        },
      );
  });

  it('rejects invalid preferences payloads', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/recipes/generate')
      .send({
        preferences: {
          servings: 0,
        },
      })
      .expect(400)
      .expect(({ body }: { body: { error: { code: string } } }) => {
        expect(body.error.code).toBe('VALIDATION_ERROR');
      });

    await request(app.getHttpServer())
      .post('/api/v1/recipes/generate')
      .send({
        preferences: {
          maxPreparationMinutes: 181,
        },
      })
      .expect(400)
      .expect(({ body }: { body: { error: { code: string } } }) => {
        expect(body.error.code).toBe('VALIDATION_ERROR');
      });

    await request(app.getHttpServer())
      .post('/api/v1/recipes/generate')
      .send({
        preferences: {
          dietaryRestrictions: 'sin gluten',
        },
      })
      .expect(400)
      .expect(({ body }: { body: { error: { code: string } } }) => {
        expect(body.error.code).toBe('VALIDATION_ERROR');
      });

    await request(app.getHttpServer())
      .post('/api/v1/recipes/generate')
      .send({
        preferences: {
          mealType: 'brunch',
        },
      })
      .expect(400)
      .expect(
        ({
          body,
        }: {
          body: { error: { code: string; details: string[] }; meta: { timestamp: string } };
        }) => {
          expect(body.error.code).toBe('VALIDATION_ERROR');
          expect(body.error.details.length).toBeGreaterThan(0);
          expect(body.meta.timestamp).toEqual(expect.any(String));
        },
      );
  });
});
