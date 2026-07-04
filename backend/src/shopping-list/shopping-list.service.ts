// Servicio de aplicacion para casos de uso de lista de compras.
import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateShoppingListItemDto } from './dto/create-shopping-list-item.dto';
import type { PurchaseShoppingListItemDto } from './dto/purchase-shopping-list-item.dto';
import type {
  ShoppingListItemResponse,
  ShoppingListLowStockSyncResponse,
  ShoppingListPurchaseResponse,
  ShoppingListResponse,
} from './shopping-list.types';
import { ShoppingListRepository } from './shopping-list.repository';

@Injectable()
export class ShoppingListService {
  constructor(private readonly shoppingListRepository: ShoppingListRepository) {}

  findAll(): ShoppingListResponse {
    const items = this.shoppingListRepository.findAllPending();

    return {
      data: items,
      meta: {
        total: items.length,
        timestamp: new Date().toISOString(),
      },
    };
  }

  create(createDto: CreateShoppingListItemDto): ShoppingListItemResponse {
    const product = this.shoppingListRepository.findProductById(createDto.productId);

    if (!product) {
      throw new NotFoundException(`Product with id ${createDto.productId} not found.`);
    }

    const existingItem = this.shoppingListRepository.findPendingByProductId(createDto.productId);
    const now = new Date().toISOString();

    if (existingItem) {
      const updatedItem = this.shoppingListRepository.updatePendingQuantity(
        existingItem.id,
        existingItem.quantity + createDto.quantity,
        now,
      );

      if (!updatedItem) {
        throw new NotFoundException(`Shopping list item with id ${existingItem.id} not found.`);
      }

      return this.toItemResponse(updatedItem);
    }

    const createdItem = this.shoppingListRepository.createPending({
      productId: product.id,
      productName: product.name,
      quantity: createDto.quantity,
      unit: createDto.unit,
      createdAt: now,
      updatedAt: now,
    });

    return this.toItemResponse(createdItem);
  }

  addFromLowStock(): ShoppingListLowStockSyncResponse {
    const lowStockProducts = this.shoppingListRepository.findLowStockProducts();
    let addedItems = 0;
    let updatedItems = 0;

    this.shoppingListRepository.executeInTransaction(() => {
      for (const product of lowStockProducts) {
        if (product.minimumStock === null) {
          continue;
        }

        const quantityToAdd = Math.max(product.minimumStock - product.quantity, 1);
        const existingItem = this.shoppingListRepository.findPendingByProductId(product.id);
        const now = new Date().toISOString();

        if (existingItem) {
          this.shoppingListRepository.updatePendingQuantity(
            existingItem.id,
            existingItem.quantity + quantityToAdd,
            now,
          );
          updatedItems += 1;
        } else {
          this.shoppingListRepository.createPending({
            productId: product.id,
            productName: product.name,
            quantity: quantityToAdd,
            unit: product.unit,
            createdAt: now,
            updatedAt: now,
          });
          addedItems += 1;
        }
      }
    });

    return {
      data: {
        addedItems,
        updatedItems,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  purchase(
    id: number,
    purchaseDto: PurchaseShoppingListItemDto,
  ): ShoppingListPurchaseResponse {
    return this.shoppingListRepository.executeInTransaction(() => {
      const pendingItem = this.shoppingListRepository.findPendingById(id);

      if (!pendingItem) {
        throw new NotFoundException(`Shopping list item with id ${id} not found.`);
      }

      const updatedAt = new Date().toISOString();
      const newInventoryQuantity = this.shoppingListRepository.incrementProductQuantity(
        pendingItem.productId,
        purchaseDto.purchasedQuantity,
        updatedAt,
      );

      if (newInventoryQuantity === null) {
        throw new NotFoundException(`Product with id ${pendingItem.productId} not found.`);
      }

      const purchased = this.shoppingListRepository.markAsPurchased(
        pendingItem.id,
        purchaseDto.purchasedQuantity,
        updatedAt,
        updatedAt,
      );

      if (!purchased) {
        throw new NotFoundException(`Shopping list item with id ${id} not found.`);
      }

      return {
        data: {
          shoppingItemId: pendingItem.id,
          productId: pendingItem.productId,
          newInventoryQuantity,
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      };
    });
  }

  remove(id: number): void {
    const removed = this.shoppingListRepository.removePending(id);

    if (!removed) {
      throw new NotFoundException(`Shopping list item with id ${id} not found.`);
    }
  }

  private toItemResponse(item: ShoppingListItemResponse['data']): ShoppingListItemResponse {
    return {
      data: item,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  }
}
