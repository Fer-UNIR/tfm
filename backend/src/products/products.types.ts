// Tipos de respuesta REST para endpoints del modulo de productos.
import type { Product } from './entities/product.entity';

interface MetaWithTimestamp {
  timestamp: string;
}

export interface ProductItemResponse {
  data: Product;
  meta: MetaWithTimestamp;
}

export interface ProductListResponse {
  data: Product[];
  meta: MetaWithTimestamp & {
    total: number;
  };
}
