// Cliente API para operaciones CRUD del inventario de productos.
import { API_BASE_URL } from '../../config/env';
import {
  ApiErrorResponse,
  ApiItemResponse,
  ApiListResponse,
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '../../types/product';

const JSON_HEADERS = {
  'Content-Type': 'application/json',
};

export class ApiRequestError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: string[];

  constructor(status: number, code: string, message: string, details: string[] = []) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const parseApiErrorResponse = (payload: unknown): ApiErrorResponse | null => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const maybeError = payload as {
    error?: { code?: unknown; message?: unknown; details?: unknown };
    meta?: { timestamp?: unknown };
  };

  if (!maybeError.error || typeof maybeError.error !== 'object') {
    return null;
  }

  if (typeof maybeError.error.code !== 'string' || typeof maybeError.error.message !== 'string') {
    return null;
  }

  const details = Array.isArray(maybeError.error.details)
    ? maybeError.error.details.filter((detail): detail is string => typeof detail === 'string')
    : [];

  const timestamp = maybeError.meta?.timestamp;
  if (typeof timestamp !== 'string') {
    return null;
  }

  return {
    error: {
      code: maybeError.error.code,
      message: maybeError.error.message,
      details,
    },
    meta: {
      timestamp,
    },
  };
};

const extractApiError = async (response: Response): Promise<ApiRequestError> => {
  let payload: unknown = null;

  try {
    payload = (await response.json()) as unknown;
  } catch {
    payload = null;
  }

  const parsedError = parseApiErrorResponse(payload);
  if (parsedError) {
    return new ApiRequestError(
      response.status,
      parsedError.error.code,
      parsedError.error.message,
      parsedError.error.details,
    );
  }

  return new ApiRequestError(
    response.status,
    'UNKNOWN_ERROR',
    `Request failed with status ${response.status}`,
  );
};

const requestJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, init);

  if (!response.ok) {
    throw await extractApiError(response);
  }

  return (await response.json()) as T;
};

export const fetchProducts = async (): Promise<Product[]> => {
  const payload = await requestJson<ApiListResponse<Product>>('/products');
  return payload.data;
};

export const createProduct = async (input: CreateProductInput): Promise<Product> => {
  const payload = await requestJson<ApiItemResponse<Product>>('/products', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(input),
  });

  return payload.data;
};

export const updateProduct = async (
  productId: number,
  input: UpdateProductInput,
): Promise<Product> => {
  const payload = await requestJson<ApiItemResponse<Product>>(`/products/${productId}`, {
    method: 'PATCH',
    headers: JSON_HEADERS,
    body: JSON.stringify(input),
  });

  return payload.data;
};

export const deleteProduct = async (productId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw await extractApiError(response);
  }
};
