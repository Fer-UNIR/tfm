// Entidad de dominio para el recurso producto del inventario.
export interface Product {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minimumStock: number | null;
  createdAt: string;
  updatedAt: string;
}
