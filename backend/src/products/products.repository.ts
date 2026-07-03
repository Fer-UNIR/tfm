// Repositorio SQLite para CRUD de productos.
import { Injectable, OnModuleInit } from '@nestjs/common';
import { DuplicateResourceException } from '../common/exceptions/duplicate-resource.exception';
import type { Product } from './entities/product.entity';
import { PersistenceService } from '../persistence/persistence.service';

interface ProductRow {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minimum_stock: number | null;
  created_at: string;
  updated_at: string;
}

interface CreateProductRecord {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minimumStock: number | null;
  createdAt: string;
  updatedAt: string;
}

interface UpdateProductRecord {
  name?: string;
  category?: string;
  quantity?: number;
  unit?: string;
  minimumStock?: number;
  updatedAt: string;
}

@Injectable()
export class ProductsRepository implements OnModuleInit {
  constructor(private readonly persistenceService: PersistenceService) {}

  onModuleInit(): void {
    this.persistenceService.getConnection().exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        quantity REAL NOT NULL CHECK (quantity >= 0),
        unit TEXT NOT NULL,
        minimum_stock REAL CHECK (minimum_stock >= 0),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE UNIQUE INDEX IF NOT EXISTS products_name_category_unique
      ON products (name, category);
    `);
  }

  findAll(): Product[] {
    const rows = this.persistenceService
      .getConnection()
      .prepare(
        `
        SELECT id, name, category, quantity, unit, minimum_stock, created_at, updated_at
        FROM products
        ORDER BY id ASC;
        `,
      )
      .all() as unknown as ProductRow[];

    return rows.map((row) => this.mapRowToProduct(row));
  }

  findById(id: number): Product | null {
    const row = this.persistenceService
      .getConnection()
      .prepare(
        `
        SELECT id, name, category, quantity, unit, minimum_stock, created_at, updated_at
        FROM products
        WHERE id = ?;
        `,
      )
      .get(id) as ProductRow | undefined;

    if (!row) {
      return null;
    }

    return this.mapRowToProduct(row);
  }

  create(record: CreateProductRecord): Product {
    let result: { lastInsertRowid: number | bigint };
    try {
      result = this.persistenceService
        .getConnection()
        .prepare(
          `
          INSERT INTO products (name, category, quantity, unit, minimum_stock, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?);
          `,
        )
        .run(
          record.name,
          record.category,
          record.quantity,
          record.unit,
          record.minimumStock,
          record.createdAt,
          record.updatedAt,
        );
    } catch (error) {
      if (this.isDuplicateNameCategoryError(error)) {
        throw new DuplicateResourceException(
          'A product with the same name and category already exists.',
          ['name', 'category'],
        );
      }

      throw error;
    }

    return this.findById(Number(result.lastInsertRowid)) as Product;
  }

  update(id: number, record: UpdateProductRecord): Product | null {
    const assignments: string[] = ['updated_at = ?'];
    const params: Array<string | number> = [record.updatedAt];

    if (record.name !== undefined) {
      assignments.push('name = ?');
      params.push(record.name);
    }
    if (record.category !== undefined) {
      assignments.push('category = ?');
      params.push(record.category);
    }
    if (record.quantity !== undefined) {
      assignments.push('quantity = ?');
      params.push(record.quantity);
    }
    if (record.unit !== undefined) {
      assignments.push('unit = ?');
      params.push(record.unit);
    }
    if (record.minimumStock !== undefined) {
      assignments.push('minimum_stock = ?');
      params.push(record.minimumStock);
    }

    params.push(id);

    let result: { changes: number | bigint };
    try {
      result = this.persistenceService
        .getConnection()
        .prepare(
          `
          UPDATE products
          SET ${assignments.join(', ')}
          WHERE id = ?;
          `,
        )
        .run(...params);
    } catch (error) {
      if (this.isDuplicateNameCategoryError(error)) {
        throw new DuplicateResourceException(
          'A product with the same name and category already exists.',
          ['name', 'category'],
        );
      }

      throw error;
    }

    if (Number(result.changes) === 0) {
      return null;
    }

    return this.findById(id);
  }

  remove(id: number): boolean {
    const result = this.persistenceService
      .getConnection()
      .prepare(
        `
        DELETE FROM products
        WHERE id = ?;
        `,
      )
      .run(id);

    return result.changes > 0;
  }

  private mapRowToProduct(row: ProductRow): Product {
    return {
      id: row.id,
      name: row.name,
      category: row.category,
      quantity: row.quantity,
      unit: row.unit,
      minimumStock: row.minimum_stock,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private isDuplicateNameCategoryError(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
      return false;
    }

    const sqliteError = error as { code?: unknown; message?: unknown };
    const code = typeof sqliteError.code === 'string' ? sqliteError.code : '';
    const message =
      typeof sqliteError.message === 'string' ? sqliteError.message : '';

    return (
      code === 'ERR_SQLITE_ERROR' &&
      message.includes('UNIQUE constraint failed') &&
      (message.includes('products.name, products.category') ||
        message.includes('products_name_category_unique'))
    );
  }
}
