// Tipos de respuesta REST para endpoints de lista de compras.
import type { ShoppingListItem } from './entities/shopping-list-item.entity';

interface MetaWithTimestamp {
  timestamp: string;
}

export interface ShoppingListResponse {
  data: ShoppingListItem[];
  meta: MetaWithTimestamp & {
    total: number;
  };
}

export interface ShoppingListItemResponse {
  data: ShoppingListItem;
  meta: MetaWithTimestamp;
}

export interface ShoppingListLowStockSyncResponse {
  data: {
    addedItems: number;
    updatedItems: number;
  };
  meta: MetaWithTimestamp;
}

export interface ShoppingListPurchaseResponse {
  data: {
    shoppingItemId: number;
    productId: number;
    newInventoryQuantity: number;
  };
  meta: MetaWithTimestamp;
}
