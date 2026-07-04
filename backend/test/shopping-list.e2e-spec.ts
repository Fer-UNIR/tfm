import { existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('ShoppingListController (e2e)', () => {
  let app: INestApplication<App>;
  let testDatabasePath: string;
  let originalSqlitePath: string | undefined;

  beforeAll(async () => {
    originalSqlitePath = process.env.SQLITE_DB_PATH;
    testDatabasePath = join(
      tmpdir(),
      `smartpantry-shopping-list-e2e-${process.pid}-${Date.now()}.db`,
    );
    process.env.SQLITE_DB_PATH = testDatabasePath;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
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

  it('manages shopping list lifecycle and updates inventory on purchase', async () => {
    const createProductResponse = await request(app.getHttpServer())
      .post('/api/v1/products')
      .send({
        name: 'Pasta',
        category: 'Despensa',
        quantity: 0,
        unit: 'ud',
        minimumStock: 2,
      })
      .expect(201);

    const productId = createProductResponse.body.data.id as number;

    await request(app.getHttpServer())
      .get('/api/v1/shopping-list')
      .expect(200)
      .expect(({ body }: { body: { data: unknown[]; meta: { total: number } } }) => {
        expect(body.data).toHaveLength(0);
        expect(body.meta.total).toBe(0);
      });

    const createItemResponse = await request(app.getHttpServer())
      .post('/api/v1/shopping-list/items')
      .send({
        productId,
        quantity: 2,
        unit: 'ud',
      })
      .expect(201);

    expect(createItemResponse.body.data.productId).toBe(productId);
    expect(createItemResponse.body.data.quantity).toBe(2);
    expect(createItemResponse.body.data.status).toBe('pending');

    const upsertItemResponse = await request(app.getHttpServer())
      .post('/api/v1/shopping-list/items')
      .send({
        productId,
        quantity: 3,
        unit: 'ud',
      })
      .expect(201);

    expect(upsertItemResponse.body.data.id).toBe(createItemResponse.body.data.id);
    expect(upsertItemResponse.body.data.quantity).toBe(5);

    const itemId = upsertItemResponse.body.data.id as number;

    await request(app.getHttpServer())
      .patch(`/api/v1/shopping-list/items/${itemId}/purchase`)
      .send({
        purchasedQuantity: 4,
      })
      .expect(200)
      .expect(
        ({
          body,
        }: {
          body: {
            data: { shoppingItemId: number; productId: number; newInventoryQuantity: number };
          };
        }) => {
          expect(body.data.shoppingItemId).toBe(itemId);
          expect(body.data.productId).toBe(productId);
          expect(body.data.newInventoryQuantity).toBe(4);
        },
      );

    await request(app.getHttpServer())
      .get(`/api/v1/products/${productId}`)
      .expect(200)
      .expect(({ body }: { body: { data: { quantity: number } } }) => {
        expect(body.data.quantity).toBe(4);
      });

    await request(app.getHttpServer())
      .get('/api/v1/shopping-list')
      .expect(200)
      .expect(({ body }: { body: { data: unknown[]; meta: { total: number } } }) => {
        expect(body.data).toHaveLength(0);
        expect(body.meta.total).toBe(0);
      });
  });

  it('adds low stock products and updates existing pending items', async () => {
    const createLowStockProduct = await request(app.getHttpServer())
      .post('/api/v1/products')
      .send({
        name: 'Leche',
        category: 'Refrigerados',
        quantity: 1,
        unit: 'L',
        minimumStock: 2,
      })
      .expect(201);

    const lowStockProductId = createLowStockProduct.body.data.id as number;

    await request(app.getHttpServer())
      .post('/api/v1/shopping-list/items/from-low-stock')
      .expect(200)
      .expect(
        ({ body }: { body: { data: { addedItems: number; updatedItems: number } } }) => {
          expect(body.data.addedItems).toBe(1);
          expect(body.data.updatedItems).toBe(0);
        },
      );

    await request(app.getHttpServer())
      .post('/api/v1/shopping-list/items/from-low-stock')
      .expect(200)
      .expect(
        ({ body }: { body: { data: { addedItems: number; updatedItems: number } } }) => {
          expect(body.data.addedItems).toBe(0);
          expect(body.data.updatedItems).toBe(1);
        },
      );

    await request(app.getHttpServer())
      .get('/api/v1/shopping-list')
      .expect(200)
      .expect(
        ({
          body,
        }: {
          body: {
            data: Array<{ productId: number; quantity: number }>;
          };
        }) => {
          const lowStockItem = body.data.find((item) => item.productId === lowStockProductId);
          expect(lowStockItem).toBeDefined();
          expect(lowStockItem?.quantity).toBe(2);
        },
      );
  });

  it('rejects invalid shopping list payloads', async () => {
    const createProductResponse = await request(app.getHttpServer())
      .post('/api/v1/products')
      .send({
        name: 'Huevos',
        category: 'Refrigerados',
        quantity: 6,
        unit: 'ud',
        minimumStock: 6,
      })
      .expect(201);

    const productId = createProductResponse.body.data.id as number;

    await request(app.getHttpServer())
      .post('/api/v1/shopping-list/items')
      .send({
        productId,
        quantity: 0,
        unit: 'ud',
      })
      .expect(400)
      .expect(({ body }: { body: { error: { code: string } } }) => {
        expect(body.error.code).toBe('VALIDATION_ERROR');
      });

    await request(app.getHttpServer())
      .post('/api/v1/shopping-list/items')
      .send({
        productId: 1.5,
        quantity: 1,
        unit: 'ud',
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

    const itemResponse = await request(app.getHttpServer())
      .post('/api/v1/shopping-list/items')
      .send({
        productId,
        quantity: 1,
        unit: 'ud',
      })
      .expect(201);

    const itemId = itemResponse.body.data.id as number;

    await request(app.getHttpServer())
      .patch(`/api/v1/shopping-list/items/${itemId}/purchase`)
      .send({
        purchasedQuantity: 0,
      })
      .expect(400)
      .expect(({ body }: { body: { error: { code: string } } }) => {
        expect(body.error.code).toBe('VALIDATION_ERROR');
      });

    await request(app.getHttpServer())
      .patch('/api/v1/shopping-list/items/99999/purchase')
      .send({
        purchasedQuantity: 1,
      })
      .expect(404)
      .expect(
        ({
          body,
        }: {
          body: { error: { code: string; message: string }; meta: { timestamp: string } };
        }) => {
          expect(body.error.code).toBe('NOT_FOUND');
          expect(body.error.message).toContain('Shopping list item');
          expect(body.meta.timestamp).toEqual(expect.any(String));
        },
      );
  });
});
