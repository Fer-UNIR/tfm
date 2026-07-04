// Pruebas unitarias del servicio de lista de compras.
import { NotFoundException } from '@nestjs/common';
import type { ShoppingListItem } from './entities/shopping-list-item.entity';
import { ShoppingListRepository } from './shopping-list.repository';
import { ShoppingListService } from './shopping-list.service';

describe('ShoppingListService', () => {
  const baseItem: ShoppingListItem = {
    id: 1,
    productId: 1,
    productName: 'Arroz',
    quantity: 2,
    unit: 'kg',
    status: 'pending',
    createdAt: '2026-01-01T00:00:00.000Z',
  };

  const repositoryMock = {
    findAllPending: jest.fn(),
    findPendingById: jest.fn(),
    findPendingByProductId: jest.fn(),
    createPending: jest.fn(),
    updatePendingQuantity: jest.fn(),
    markAsPurchased: jest.fn(),
    removePending: jest.fn(),
    findProductById: jest.fn(),
    findLowStockProducts: jest.fn(),
    incrementProductQuantity: jest.fn(),
    executeInTransaction: jest.fn(),
  } as unknown as jest.Mocked<ShoppingListRepository>;

  let service: ShoppingListService;

  beforeEach(() => {
    repositoryMock.findAllPending.mockReset();
    repositoryMock.findPendingById.mockReset();
    repositoryMock.findPendingByProductId.mockReset();
    repositoryMock.createPending.mockReset();
    repositoryMock.updatePendingQuantity.mockReset();
    repositoryMock.markAsPurchased.mockReset();
    repositoryMock.removePending.mockReset();
    repositoryMock.findProductById.mockReset();
    repositoryMock.findLowStockProducts.mockReset();
    repositoryMock.incrementProductQuantity.mockReset();
    repositoryMock.executeInTransaction.mockReset();
    repositoryMock.executeInTransaction.mockImplementation((operation) => operation());

    service = new ShoppingListService(repositoryMock);
  });

  it('returns pending list with total metadata', () => {
    repositoryMock.findAllPending.mockReturnValue([baseItem]);

    const result = service.findAll();

    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(1);
    expect(result.meta.timestamp).toEqual(expect.any(String));
  });

  it('creates a pending item when product exists and item is new', () => {
    repositoryMock.findProductById.mockReturnValue({
      id: 1,
      name: 'Arroz',
      quantity: 0,
      unit: 'kg',
      minimumStock: 1,
    });
    repositoryMock.findPendingByProductId.mockReturnValue(null);
    repositoryMock.createPending.mockReturnValue(baseItem);

    const result = service.create({
      productId: 1,
      quantity: 2,
      unit: 'kg',
    });

    expect(repositoryMock.createPending).toHaveBeenCalledWith(
      expect.objectContaining({
        productId: 1,
        productName: 'Arroz',
        quantity: 2,
        unit: 'kg',
      }),
    );
    expect(result.data.id).toBe(1);
  });

  it('updates quantity when product already exists in active list', () => {
    repositoryMock.findProductById.mockReturnValue({
      id: 1,
      name: 'Arroz',
      quantity: 0,
      unit: 'kg',
      minimumStock: 1,
    });
    repositoryMock.findPendingByProductId.mockReturnValue(baseItem);
    repositoryMock.updatePendingQuantity.mockReturnValue({
      ...baseItem,
      quantity: 5,
    });

    const result = service.create({
      productId: 1,
      quantity: 3,
      unit: 'kg',
    });

    expect(repositoryMock.updatePendingQuantity).toHaveBeenCalledWith(
      1,
      5,
      expect.any(String),
    );
    expect(result.data.quantity).toBe(5);
  });

  it('throws not found when adding unknown product', () => {
    repositoryMock.findProductById.mockReturnValue(null);

    expect(() =>
      service.create({
        productId: 999,
        quantity: 1,
        unit: 'kg',
      }),
    ).toThrow(NotFoundException);
  });

  it('syncs low stock items with added and updated counters', () => {
    repositoryMock.findLowStockProducts.mockReturnValue([
      {
        id: 1,
        name: 'Arroz',
        quantity: 0,
        unit: 'kg',
        minimumStock: 2,
      },
      {
        id: 2,
        name: 'Leche',
        quantity: 1,
        unit: 'L',
        minimumStock: 1,
      },
    ]);
    repositoryMock.findPendingByProductId
      .mockReturnValueOnce(null)
      .mockReturnValueOnce({
        ...baseItem,
        id: 22,
        productId: 2,
        productName: 'Leche',
        quantity: 1,
        unit: 'L',
      });
    repositoryMock.createPending.mockReturnValue(baseItem);
    repositoryMock.updatePendingQuantity.mockReturnValue({
      ...baseItem,
      id: 22,
      productId: 2,
      productName: 'Leche',
      quantity: 2,
      unit: 'L',
    });

    const result = service.addFromLowStock();

    expect(result.data.addedItems).toBe(1);
    expect(result.data.updatedItems).toBe(1);
  });

  it('marks item as purchased and updates inventory quantity', () => {
    repositoryMock.findPendingById.mockReturnValue(baseItem);
    repositoryMock.incrementProductQuantity.mockReturnValue(8);
    repositoryMock.markAsPurchased.mockReturnValue(true);

    const result = service.purchase(1, { purchasedQuantity: 6 });

    expect(repositoryMock.incrementProductQuantity).toHaveBeenCalledWith(
      1,
      6,
      expect.any(String),
    );
    expect(repositoryMock.markAsPurchased).toHaveBeenCalledWith(
      1,
      6,
      expect.any(String),
      expect.any(String),
    );
    expect(result.data.newInventoryQuantity).toBe(8);
  });

  it('throws not found when purchasing unknown item', () => {
    repositoryMock.findPendingById.mockReturnValue(null);

    expect(() => service.purchase(999, { purchasedQuantity: 1 })).toThrow(NotFoundException);
  });

  it('throws not found when deleting unknown item', () => {
    repositoryMock.removePending.mockReturnValue(false);

    expect(() => service.remove(999)).toThrow(NotFoundException);
  });
});
