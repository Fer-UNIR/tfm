// Repositorio SQLite para la lista de compras y operaciones de inventario asociadas.
import { Injectable, OnModuleInit } from '@nestjs/common';
import type { ShoppingListItem } from './entities/shopping-list-item.entity';
import { PersistenceService } from '../persistence/persistence.service';

interface ShoppingListItemRow {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit: string;
  status: 'pending' | 'purchased';
  created_at: string;
}

interface ProductRow {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  minimum_stock: number | null;
}

interface ProductQuantityRow {
  quantity: number;
}

export interface ProductSnapshot {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  minimumStock: number | null;
}

interface CreateShoppingListItemRecord {
  productId: number;
  productName: string;
  quantity: number;
  unit: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class ShoppingListRepository implements OnModuleInit {
  constructor(private readonly persistenceService: PersistenceService) {}

  onModuleInit(): void {
    this.persistenceService.getConnection().exec(`
      CREATE TABLE IF NOT EXISTS shopping_list_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        product_name TEXT NOT NULL,
        quantity REAL NOT NULL CHECK (quantity > 0),
        unit TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('pending', 'purchased')),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        purchased_at TEXT,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      );
      CREATE UNIQUE INDEX IF NOT EXISTS shopping_list_pending_product_unique
      ON shopping_list_items (product_id)
      WHERE status = 'pending';
      CREATE INDEX IF NOT EXISTS shopping_list_status_idx
      ON shopping_list_items (status);
    `);
  }

  findAllPending(): ShoppingListItem[] {
    const rows = this.persistenceService
      .getConnection()
      .prepare(
        `
        SELECT id, product_id, product_name, quantity, unit, status, created_at
        FROM shopping_list_items
        WHERE status = 'pending'
        ORDER BY id ASC;
        `,
      )
      .all() as unknown as ShoppingListItemRow[];

    return rows.map((row) => this.mapRowToShoppingItem(row));
  }

  findPendingById(id: number): ShoppingListItem | null {
    const row = this.persistenceService
      .getConnection()
      .prepare(
        `
        SELECT id, product_id, product_name, quantity, unit, status, created_at
        FROM shopping_list_items
        WHERE id = ? AND status = 'pending';
        `,
      )
      .get(id) as ShoppingListItemRow | undefined;

    if (!row) {
      return null;
    }

    return this.mapRowToShoppingItem(row);
  }

  findPendingByProductId(productId: number): ShoppingListItem | null {
    const row = this.persistenceService
      .getConnection()
      .prepare(
        `
        SELECT id, product_id, product_name, quantity, unit, status, created_at
        FROM shopping_list_items
        WHERE product_id = ? AND status = 'pending';
        `,
      )
      .get(productId) as ShoppingListItemRow | undefined;

    if (!row) {
      return null;
    }

    return this.mapRowToShoppingItem(row);
  }

  createPending(record: CreateShoppingListItemRecord): ShoppingListItem {
    const result = this.persistenceService
      .getConnection()
      .prepare(
        `
        INSERT INTO shopping_list_items (
          product_id, product_name, quantity, unit, status, created_at, updated_at, purchased_at
        )
        VALUES (?, ?, ?, ?, 'pending', ?, ?, NULL);
        `,
      )
      .run(
        record.productId,
        record.productName,
        record.quantity,
        record.unit,
        record.createdAt,
        record.updatedAt,
      );

    return this.findPendingById(Number(result.lastInsertRowid)) as ShoppingListItem;
  }

  updatePendingQuantity(
    id: number,
    quantity: number,
    updatedAt: string,
  ): ShoppingListItem | null {
    const result = this.persistenceService
      .getConnection()
      .prepare(
        `
        UPDATE shopping_list_items
        SET quantity = ?, updated_at = ?
        WHERE id = ? AND status = 'pending';
        `,
      )
      .run(quantity, updatedAt, id);

    if (Number(result.changes) === 0) {
      return null;
    }

    return this.findPendingById(id);
  }

  markAsPurchased(
    id: number,
    purchasedQuantity: number,
    updatedAt: string,
    purchasedAt: string,
  ): boolean {
    const result = this.persistenceService
      .getConnection()
      .prepare(
        `
        UPDATE shopping_list_items
        SET status = 'purchased',
            quantity = ?,
            updated_at = ?,
            purchased_at = ?
        WHERE id = ? AND status = 'pending';
        `,
      )
      .run(purchasedQuantity, updatedAt, purchasedAt, id);

    return Number(result.changes) > 0;
  }

  removePending(id: number): boolean {
    const result = this.persistenceService
      .getConnection()
      .prepare(
        `
        DELETE FROM shopping_list_items
        WHERE id = ? AND status = 'pending';
        `,
      )
      .run(id);

    return Number(result.changes) > 0;
  }

  findProductById(id: number): ProductSnapshot | null {
    const row = this.persistenceService
      .getConnection()
      .prepare(
        `
        SELECT id, name, quantity, unit, minimum_stock
        FROM products
        WHERE id = ?;
        `,
      )
      .get(id) as ProductRow | undefined;

    if (!row) {
      return null;
    }

    return this.mapRowToProductSnapshot(row);
  }

  findLowStockProducts(): ProductSnapshot[] {
    const rows = this.persistenceService
      .getConnection()
      .prepare(
        `
        SELECT id, name, quantity, unit, minimum_stock
        FROM products
        WHERE minimum_stock IS NOT NULL
          AND quantity <= minimum_stock
        ORDER BY id ASC;
        `,
      )
      .all() as unknown as ProductRow[];

    return rows
      .filter((row) => row.minimum_stock !== null)
      .map((row) => this.mapRowToProductSnapshot(row));
  }

  incrementProductQuantity(
    productId: number,
    quantityToAdd: number,
    updatedAt: string,
  ): number | null {
    const updateResult = this.persistenceService
      .getConnection()
      .prepare(
        `
        UPDATE products
        SET quantity = quantity + ?, updated_at = ?
        WHERE id = ?;
        `,
      )
      .run(quantityToAdd, updatedAt, productId);

    if (Number(updateResult.changes) === 0) {
      return null;
    }

    const row = this.persistenceService
      .getConnection()
      .prepare(
        `
        SELECT quantity
        FROM products
        WHERE id = ?;
        `,
      )
      .get(productId) as ProductQuantityRow | undefined;

    if (!row) {
      return null;
    }

    return row.quantity;
  }

  executeInTransaction<T>(operation: () => T): T {
    const connection = this.persistenceService.getConnection();
    connection.exec('BEGIN TRANSACTION;');

    try {
      const result = operation();
      connection.exec('COMMIT;');
      return result;
    } catch (error) {
      connection.exec('ROLLBACK;');
      throw error;
    }
  }

  private mapRowToShoppingItem(row: ShoppingListItemRow): ShoppingListItem {
    return {
      id: row.id,
      productId: row.product_id,
      productName: row.product_name,
      quantity: row.quantity,
      unit: row.unit,
      status: row.status,
      createdAt: row.created_at,
    };
  }

  private mapRowToProductSnapshot(row: ProductRow): ProductSnapshot {
    return {
      id: row.id,
      name: row.name,
      quantity: row.quantity,
      unit: row.unit,
      minimumStock: row.minimum_stock,
    };
  }
}
