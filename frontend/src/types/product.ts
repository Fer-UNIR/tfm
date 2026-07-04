// Tipos frontend para el contrato REST de productos.
export interface ApiMeta {
  timestamp: string;
}

export interface ApiItemResponse<T> {
  data: T;
  meta: ApiMeta;
}

export interface ApiListResponse<T> {
  data: T[];
  meta: ApiMeta & {
    total: number;
  };
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details: string[];
  };
  meta: ApiMeta;
}

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

export interface CreateProductInput {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minimumStock?: number;
}

export interface UpdateProductInput {
  name?: string;
  category?: string;
  quantity?: number;
  unit?: string;
  minimumStock?: number;
}
