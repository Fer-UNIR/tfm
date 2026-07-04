import { fireEvent, render, waitFor } from '@testing-library/react-native';
import * as productsApi from '../services/api/productsApi';
import * as shoppingListApi from '../services/api/shoppingListApi';
import type { Product } from '../types/product';
import type { ShoppingListItem } from '../types/shopping-list';
import { ShoppingListScreen } from './ShoppingListScreen';

jest.mock('../services/api/productsApi', () => ({
  ...jest.requireActual('../services/api/productsApi'),
  fetchProducts: jest.fn(),
}));

jest.mock('../services/api/shoppingListApi', () => ({
  fetchShoppingList: jest.fn(),
  createShoppingListItem: jest.fn(),
  addLowStockItems: jest.fn(),
  purchaseShoppingListItem: jest.fn(),
  deleteShoppingListItem: jest.fn(),
}));

const mockedFetchProducts = productsApi.fetchProducts as jest.MockedFunction<
  typeof productsApi.fetchProducts
>;
const mockedFetchShoppingList = shoppingListApi.fetchShoppingList as jest.MockedFunction<
  typeof shoppingListApi.fetchShoppingList
>;
const mockedCreateShoppingListItem = shoppingListApi.createShoppingListItem as jest.MockedFunction<
  typeof shoppingListApi.createShoppingListItem
>;
const mockedAddLowStockItems = shoppingListApi.addLowStockItems as jest.MockedFunction<
  typeof shoppingListApi.addLowStockItems
>;
const mockedPurchaseShoppingListItem =
  shoppingListApi.purchaseShoppingListItem as jest.MockedFunction<
    typeof shoppingListApi.purchaseShoppingListItem
  >;
const mockedDeleteShoppingListItem = shoppingListApi.deleteShoppingListItem as jest.MockedFunction<
  typeof shoppingListApi.deleteShoppingListItem
>;

const buildProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 1,
  name: 'Arroz',
  category: 'Despensa',
  quantity: 1,
  unit: 'kg',
  minimumStock: 1,
  createdAt: '2026-01-01T10:00:00.000Z',
  updatedAt: '2026-01-01T10:00:00.000Z',
  ...overrides,
});

const buildShoppingItem = (overrides: Partial<ShoppingListItem> = {}): ShoppingListItem => ({
  id: 1,
  productId: 1,
  productName: 'Arroz',
  quantity: 2,
  unit: 'kg',
  status: 'pending',
  createdAt: '2026-01-01T10:00:00.000Z',
  ...overrides,
});

describe('ShoppingListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedFetchShoppingList.mockResolvedValue([]);
    mockedFetchProducts.mockResolvedValue([buildProduct({ minimumStock: null })]);
  });

  it('muestra estado de carga', async () => {
    mockedFetchShoppingList.mockImplementationOnce(
      () =>
        new Promise<ShoppingListItem[]>((resolve) => {
          setTimeout(() => resolve([]), 0);
        }),
    );

    const { getByText, findByText } = await render(<ShoppingListScreen />);

    expect(getByText('Cargando lista de compras...')).toBeTruthy();
    expect(await findByText('Lista de compras vacia')).toBeTruthy();
  });

  it('muestra estado de error cuando falla la carga', async () => {
    mockedFetchShoppingList.mockRejectedValue(new Error('Error de carga'));

    const { findByText, getByText } = await render(<ShoppingListScreen />);

    expect(await findByText('No se pudo cargar la lista de compras')).toBeTruthy();
    expect(getByText('Error de carga')).toBeTruthy();
  });

  it('agrega producto manualmente desde seleccion de producto', async () => {
    mockedFetchShoppingList.mockResolvedValue([]);
    mockedFetchProducts.mockResolvedValue([
      buildProduct({ id: 1, name: 'Arroz', minimumStock: null }),
      buildProduct({
        id: 2,
        name: 'Leche',
        category: 'Refrigerados',
        unit: 'L',
        minimumStock: null,
      }),
    ]);
    mockedCreateShoppingListItem.mockResolvedValue(
      buildShoppingItem({
        id: 8,
        productId: 2,
        productName: 'Leche',
        quantity: 3,
        unit: 'L',
      }),
    );

    const { findByText, getByPlaceholderText, getByText } = await render(
      <ShoppingListScreen />,
    );

    expect(await findByText('Lista de compras vacia')).toBeTruthy();

    await fireEvent.press(getByText('Seleccionar Leche'));
    await fireEvent.changeText(getByPlaceholderText('Cantidad'), '3');
    await fireEvent.changeText(getByPlaceholderText('Unidad'), 'L');
    await fireEvent.press(getByText('Agregar producto').parent!);

    await waitFor(() => {
      expect(mockedCreateShoppingListItem).toHaveBeenCalledWith({
        productId: 2,
        quantity: 3,
        unit: 'L',
      });
    });
    expect(await findByText('Leche')).toBeTruthy();
  });

  it('agrega un producto bajo stock de forma individual', async () => {
    mockedFetchShoppingList.mockResolvedValue([]);
    mockedFetchProducts.mockResolvedValue([
      buildProduct({
        id: 10,
        name: 'Huevos',
        quantity: 2,
        unit: 'ud',
        minimumStock: 6,
      }),
    ]);
    mockedCreateShoppingListItem.mockResolvedValue(
      buildShoppingItem({
        id: 31,
        productId: 10,
        productName: 'Huevos',
        quantity: 4,
        unit: 'ud',
      }),
    );

    const { findByText, getByText } = await render(<ShoppingListScreen />);

    expect(await findByText('Productos con bajo stock (1)')).toBeTruthy();
    await fireEvent.press(getByText('Agregar').parent!);

    await waitFor(() => {
      expect(mockedCreateShoppingListItem).toHaveBeenCalledWith({
        productId: 10,
        quantity: 4,
        unit: 'ud',
      });
    });
    expect(await findByText('Producto bajo stock "Huevos" agregado con 4 ud.')).toBeTruthy();
  });

  it('sincroniza productos bajo stock', async () => {
    mockedFetchShoppingList
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([buildShoppingItem({ id: 12, quantity: 1 })]);
    mockedAddLowStockItems.mockResolvedValue({
      addedItems: 1,
      updatedItems: 0,
    });

    const { findByText, getByText } = await render(<ShoppingListScreen />);

    expect(await findByText('Lista de compras vacia')).toBeTruthy();

    await fireEvent.press(getByText('Agregar bajo stock').parent!);

    await waitFor(() => {
      expect(mockedAddLowStockItems).toHaveBeenCalled();
      expect(mockedFetchShoppingList).toHaveBeenCalledTimes(2);
    });
    expect(await findByText('Sincronizacion completada: 1 agregados, 0 actualizados.')).toBeTruthy();
  });

  it('marca un item como comprado y lo remueve del listado', async () => {
    mockedFetchShoppingList.mockResolvedValue([buildShoppingItem({ id: 33, quantity: 4 })]);
    mockedPurchaseShoppingListItem.mockResolvedValue({
      shoppingItemId: 33,
      productId: 1,
      newInventoryQuantity: 5,
    });

    const { findByText, getByText } = await render(<ShoppingListScreen />);

    expect(await findByText('Arroz')).toBeTruthy();

    await fireEvent.press(getByText('Marcar comprado').parent!);

    await waitFor(() => {
      expect(mockedPurchaseShoppingListItem).toHaveBeenCalledWith(33, {
        purchasedQuantity: 4,
      });
    });
    expect(await findByText('Lista de compras vacia')).toBeTruthy();
  });

  it('marca todos los pendientes como comprados', async () => {
    mockedFetchShoppingList
      .mockResolvedValueOnce([
        buildShoppingItem({ id: 101, productId: 1, quantity: 2, productName: 'Arroz' }),
        buildShoppingItem({ id: 102, productId: 2, quantity: 1, productName: 'Leche' }),
      ])
      .mockResolvedValueOnce([]);
    mockedFetchProducts
      .mockResolvedValueOnce([
        buildProduct({ id: 1, name: 'Arroz', minimumStock: null }),
        buildProduct({ id: 2, name: 'Leche', unit: 'L', minimumStock: null }),
      ])
      .mockResolvedValueOnce([
        buildProduct({ id: 1, name: 'Arroz', quantity: 2, minimumStock: null }),
        buildProduct({
          id: 2,
          name: 'Leche',
          quantity: 1,
          unit: 'L',
          minimumStock: null,
        }),
      ]);
    mockedPurchaseShoppingListItem
      .mockResolvedValueOnce({
        shoppingItemId: 101,
        productId: 1,
        newInventoryQuantity: 2,
      })
      .mockResolvedValueOnce({
        shoppingItemId: 102,
        productId: 2,
        newInventoryQuantity: 1,
      });

    const { findByText, getByText } = await render(<ShoppingListScreen />);

    expect(await findByText('Pendientes (2)')).toBeTruthy();
    await fireEvent.press(getByText('Marcar todos comprados').parent!);

    await waitFor(() => {
      expect(mockedPurchaseShoppingListItem).toHaveBeenCalledTimes(2);
      expect(mockedPurchaseShoppingListItem).toHaveBeenNthCalledWith(1, 101, {
        purchasedQuantity: 2,
      });
      expect(mockedPurchaseShoppingListItem).toHaveBeenNthCalledWith(2, 102, {
        purchasedQuantity: 1,
      });
    });
    expect(
      await findByText('Compra masiva completada: 2 de 2 pendientes marcados como comprados.'),
    ).toBeTruthy();
  });

  it('elimina un item de la lista', async () => {
    mockedFetchShoppingList.mockResolvedValue([buildShoppingItem({ id: 44 })]);
    mockedDeleteShoppingListItem.mockResolvedValue();

    const { findByText, getByText } = await render(<ShoppingListScreen />);

    expect(await findByText('Arroz')).toBeTruthy();

    await fireEvent.press(getByText('Eliminar').parent!);

    await waitFor(() => {
      expect(mockedDeleteShoppingListItem).toHaveBeenCalledWith(44);
    });
    expect(await findByText('Lista de compras vacia')).toBeTruthy();
  });
});
