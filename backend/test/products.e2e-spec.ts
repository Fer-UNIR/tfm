import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('ProductsController (e2e)', () => {
  let app: INestApplication<App>;
  let testDatabasePath: string;
  let originalSqlitePath: string | undefined;

  beforeAll(async () => {
    originalSqlitePath = process.env.SQLITE_DB_PATH;
    testDatabasePath = join(
      tmpdir(),
      `smartpantry-products-e2e-${process.pid}-${Date.now()}.db`,
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

  it('creates, retrieves, updates and deletes a product', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/api/v1/products')
      .send({
        name: 'Arroz',
        category: 'Despensa',
        quantity: 1,
        unit: 'kg',
        minimumStock: 1,
      })
      .expect(201);

    expect(createResponse.body.data.id).toEqual(expect.any(Number));
    expect(createResponse.body.data.category).toBe('Despensa');

    const productId = createResponse.body.data.id as number;

    const duplicateResponse = await request(app.getHttpServer())
      .post('/api/v1/products')
      .send({
        name: 'Arroz',
        category: 'Despensa',
        quantity: 1,
        unit: 'kg',
      });

    expect(duplicateResponse.status).toBe(409);
    expect(duplicateResponse.body.error.code).toBe('DUPLICATE_RESOURCE');
    expect(duplicateResponse.body.error.details).toEqual(['name', 'category']);
    expect(duplicateResponse.body.meta.timestamp).toEqual(expect.any(String));

    await request(app.getHttpServer())
      .get('/api/v1/products')
      .expect(200)
      .expect(({ body }: { body: { data: unknown[]; meta: { total: number } } }) => {
        expect(body.data).toHaveLength(1);
        expect(body.meta.total).toBe(1);
      });

    await request(app.getHttpServer())
      .get(`/api/v1/products/${productId}`)
      .expect(200)
      .expect(({ body }: { body: { data: { id: number; name: string } } }) => {
        expect(body.data.id).toBe(productId);
        expect(body.data.name).toBe('Arroz');
      });

    await request(app.getHttpServer())
      .patch(`/api/v1/products/${productId}`)
      .send({
        name: 'Arroz integral',
        quantity: 2,
      })
      .expect(200)
      .expect(({ body }: { body: { data: { name: string; quantity: number } } }) => {
        expect(body.data.name).toBe('Arroz integral');
        expect(body.data.quantity).toBe(2);
      });

    await request(app.getHttpServer())
      .delete(`/api/v1/products/${productId}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/api/v1/products/${productId}`)
      .expect(404)
      .expect(({ body }: { body: { error: { code: string } } }) => {
        expect(body.error.code).toBe('NOT_FOUND');
      });
  });

  it('rejects invalid payloads', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/products')
      .send({
        name: '',
        category: 'Despensa',
        quantity: -1,
        unit: '',
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

    await request(app.getHttpServer())
      .patch('/api/v1/products/99999')
      .send({
        minimumStock: -2,
      })
      .expect(400)
      .expect(({ body }: { body: { error: { code: string } } }) => {
        expect(body.error.code).toBe('VALIDATION_ERROR');
      });
  });

  it('rejects PATCH with empty body', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/api/v1/products')
      .send({
        name: 'Leche',
        category: 'Refrigerados',
        quantity: 2,
        unit: 'L',
      })
      .expect(201);

    const productId = createResponse.body.data.id as number;

    await request(app.getHttpServer())
      .patch(`/api/v1/products/${productId}`)
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
          expect(body.error.code).toBe('VALIDATION_ERROR');
          expect(body.error.message).toBe(
            'At least one field must be provided for update.',
          );
          expect(body.error.details).toEqual([
            'name',
            'category',
            'quantity',
            'unit',
            'minimumStock',
          ]);
          expect(body.meta.timestamp).toEqual(expect.any(String));
        },
      );
  });
});
