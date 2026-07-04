// Cliente API para operaciones de lista de compras.
import { API_BASE_URL } from '../../config/env';
import { ApiErrorResponse } from '../../types/product';
import {
  CreateShoppingListItemInput,
  LowStockSyncResponse,
  LowStockSyncResult,
  PurchaseShoppingListItemInput,
  PurchaseShoppingListItemResponse,
  PurchaseShoppingListItemResult,
  ShoppingListItem,
  ShoppingListItemResponse,
  ShoppingListItemsResponse,
} from '../../types/shopping-list';
import { ApiRequestError } from './productsApi';

const JSON_HEADERS = {
  'Content-Type': 'application/json',
};

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

export const fetchShoppingList = async (): Promise<ShoppingListItem[]> => {
  const payload = await requestJson<ShoppingListItemsResponse>('/shopping-list');
  return payload.data;
};

export const createShoppingListItem = async (
  input: CreateShoppingListItemInput,
): Promise<ShoppingListItem> => {
  const payload = await requestJson<ShoppingListItemResponse>('/shopping-list/items', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(input),
  });

  return payload.data;
};

export const addLowStockItems = async (): Promise<LowStockSyncResult> => {
  const payload = await requestJson<LowStockSyncResponse>(
    '/shopping-list/items/from-low-stock',
    {
      method: 'POST',
    },
  );

  return payload.data;
};

export const purchaseShoppingListItem = async (
  itemId: number,
  input: PurchaseShoppingListItemInput,
): Promise<PurchaseShoppingListItemResult> => {
  const payload = await requestJson<PurchaseShoppingListItemResponse>(
    `/shopping-list/items/${itemId}/purchase`,
    {
      method: 'PATCH',
      headers: JSON_HEADERS,
      body: JSON.stringify(input),
    },
  );

  return payload.data;
};

export const deleteShoppingListItem = async (itemId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/shopping-list/items/${itemId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw await extractApiError(response);
  }
};
