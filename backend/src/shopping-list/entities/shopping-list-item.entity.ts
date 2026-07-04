// Entidad de dominio para un elemento de la lista de compras.
export type ShoppingListItemStatus = 'pending' | 'purchased';

export interface ShoppingListItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unit: string;
  status: ShoppingListItemStatus;
  createdAt: string;
}
