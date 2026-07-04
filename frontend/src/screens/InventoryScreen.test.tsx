import { fireEvent, render, waitFor } from '@testing-library/react-native';
import * as productsApi from '../services/api/productsApi';
import type { Product } from '../types/product';
import { InventoryScreen } from './InventoryScreen';

jest.mock('../services/api/productsApi', () => ({
  ...jest.requireActual('../services/api/productsApi'),
  fetchProducts: jest.fn(),
  createProduct: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
}));

const mockedFetchProducts = productsApi.fetchProducts as jest.MockedFunction<
  typeof productsApi.fetchProducts
>;
const mockedCreateProduct = productsApi.createProduct as jest.MockedFunction<
  typeof productsApi.createProduct
>;
const mockedUpdateProduct = productsApi.updateProduct as jest.MockedFunction<
  typeof productsApi.updateProduct
>;
const mockedDeleteProduct = productsApi.deleteProduct as jest.MockedFunction<
  typeof productsApi.deleteProduct
>;

const buildProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 1,
  name: 'Arroz',
  category: 'Despensa',
  quantity: 2,
  unit: 'kg',
  minimumStock: 1,
  createdAt: '2026-01-01T10:00:00.000Z',
  updatedAt: '2026-01-01T10:00:00.000Z',
  ...overrides,
});

describe('InventoryScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedFetchProducts.mockResolvedValue([]);
  });

  it('muestra estado de carga', async () => {
    mockedFetchProducts.mockImplementationOnce(
      () =>
        new Promise<Product[]>((resolve) => {
          setTimeout(() => resolve([]), 50);
        }),
    );

    const { getByText, findByText } = await render(<InventoryScreen />);

    expect(getByText('Cargando inventario...')).toBeTruthy();
    expect(await findByText('Inventario vacio')).toBeTruthy();
  });

  it('muestra estado vacio cuando no hay productos', async () => {
    mockedFetchProducts.mockResolvedValue([]);

    const { findByText, getByText } = await render(<InventoryScreen />);

    expect(await findByText('Inventario vacio')).toBeTruthy();
    expect(getByText('Productos (0)')).toBeTruthy();
  });

  it('muestra listado de productos', async () => {
    mockedFetchProducts.mockResolvedValue([buildProduct({ name: 'Leche' })]);

    const { findByText, getByText } = await render(<InventoryScreen />);

    expect(await findByText('Leche')).toBeTruthy();
    expect(getByText('Productos (1)')).toBeTruthy();
  });

  it('muestra badge de bajo stock', async () => {
    mockedFetchProducts.mockResolvedValue([
      buildProduct({ quantity: 1, minimumStock: 1 }),
    ]);

    const { findByText } = await render(<InventoryScreen />);

    expect(await findByText('Bajo stock')).toBeTruthy();
  });

  it('muestra error de API cuando falla la carga', async () => {
    mockedFetchProducts.mockRejectedValue(new Error('Error de API de prueba'));

    const { findByText, getByText } = await render(<InventoryScreen />);

    expect(await findByText('No se pudo cargar el inventario')).toBeTruthy();
    expect(getByText('Error de API de prueba')).toBeTruthy();
  });

  it('crea un producto desde el formulario', async () => {
    const createdProduct = buildProduct({
      id: 7,
      name: 'Tomate',
      category: 'Verduras',
      quantity: 3,
      unit: 'ud',
      minimumStock: 1,
    });
    mockedFetchProducts.mockResolvedValue([]);
    mockedCreateProduct.mockResolvedValue(createdProduct);

    const { findByText, getByPlaceholderText, getByText } = await render(<InventoryScreen />);

    expect(await findByText('Inventario vacio')).toBeTruthy();

    await fireEvent.changeText(getByPlaceholderText('Nombre'), 'Tomate');
    await fireEvent.changeText(getByPlaceholderText('Categoria'), 'Verduras');
    await fireEvent.changeText(getByPlaceholderText('Cantidad'), '3');
    await fireEvent.changeText(getByPlaceholderText('Unidad'), 'ud');
    await fireEvent.changeText(getByPlaceholderText('Stock minimo (opcional)'), '1');

    await fireEvent.press(getByText('Crear producto').parent!);

    await waitFor(() => {
      expect(mockedCreateProduct).toHaveBeenCalledWith({
        name: 'Tomate',
        category: 'Verduras',
        quantity: 3,
        unit: 'ud',
        minimumStock: 1,
      });
    });
    expect(await findByText('Tomate')).toBeTruthy();
  });

  it('incrementa y decrementa cantidad de producto', async () => {
    const inventoryProduct = buildProduct({ quantity: 1 });
    mockedFetchProducts.mockResolvedValue([inventoryProduct]);
    mockedUpdateProduct.mockImplementation(async (productId, input) =>
      buildProduct({
        id: productId,
        quantity: input.quantity ?? inventoryProduct.quantity,
      }),
    );

    const { findByText, getByText } = await render(<InventoryScreen />);

    expect(await findByText('Arroz')).toBeTruthy();

    await fireEvent.press(getByText('+1').parent!);

    await waitFor(() => {
      expect(mockedUpdateProduct).toHaveBeenNthCalledWith(1, 1, { quantity: 2 });
    });
    expect(await findByText('Cantidad: 2 kg')).toBeTruthy();

    await fireEvent.press(getByText('-1').parent!);

    await waitFor(() => {
      expect(mockedUpdateProduct).toHaveBeenNthCalledWith(2, 1, { quantity: 1 });
    });
    expect(await findByText('Cantidad: 1 kg')).toBeTruthy();
  });

  it('elimina un producto del listado', async () => {
    const inventoryProduct = buildProduct({ id: 23, name: 'Pasta' });
    mockedFetchProducts.mockResolvedValue([inventoryProduct]);
    mockedDeleteProduct.mockResolvedValue();

    const { findByText, getByText } = await render(<InventoryScreen />);

    expect(await findByText('Pasta')).toBeTruthy();

    await fireEvent.press(getByText('Eliminar').parent!);

    await waitFor(() => {
      expect(mockedDeleteProduct).toHaveBeenCalledWith(23);
    });
    expect(await findByText('Inventario vacio')).toBeTruthy();
  });
});
