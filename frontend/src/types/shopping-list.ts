// Tipos frontend para contrato REST de lista de compras.
import type { ApiItemResponse, ApiListResponse } from './product';

export interface ShoppingListItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unit: string;
  status: 'pending' | 'purchased';
  createdAt: string;
}

export interface CreateShoppingListItemInput {
  productId: number;
  quantity: number;
  unit: string;
}

export interface PurchaseShoppingListItemInput {
  purchasedQuantity: number;
}

export interface LowStockSyncResult {
  addedItems: number;
  updatedItems: number;
}

export interface PurchaseShoppingListItemResult {
  shoppingItemId: number;
  productId: number;
  newInventoryQuantity: number;
}

export type ShoppingListItemsResponse = ApiListResponse<ShoppingListItem>;
export type ShoppingListItemResponse = ApiItemResponse<ShoppingListItem>;
export type LowStockSyncResponse = ApiItemResponse<LowStockSyncResult>;
export type PurchaseShoppingListItemResponse =
  ApiItemResponse<PurchaseShoppingListItemResult>;
