// Pruebas unitarias del servicio de productos.
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { DuplicateResourceException } from '../common/exceptions/duplicate-resource.exception';
import type { Product } from './entities/product.entity';
import { ProductsRepository } from './products.repository';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  const baseProduct: Product = {
    id: 1,
    name: 'Arroz',
    category: 'Despensa',
    quantity: 1,
    unit: 'kg',
    minimumStock: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };

  const repositoryMock = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  } as unknown as jest.Mocked<ProductsRepository>;

  let service: ProductsService;

  beforeEach(() => {
    repositoryMock.findAll.mockReset();
    repositoryMock.findById.mockReset();
    repositoryMock.create.mockReset();
    repositoryMock.update.mockReset();
    repositoryMock.remove.mockReset();

    service = new ProductsService(repositoryMock);
  });

  it('returns product list with total metadata', () => {
    repositoryMock.findAll.mockReturnValue([baseProduct]);

    const result = service.findAll();

    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(1);
    expect(result.meta.timestamp).toEqual(expect.any(String));
  });

  it('returns raw products for internal module composition', () => {
    repositoryMock.findAll.mockReturnValue([baseProduct]);

    const result = service.findAllProducts();

    expect(result).toEqual([baseProduct]);
  });

  it('creates a product using null minimumStock by default', () => {
    repositoryMock.create.mockImplementation((record) => ({
      id: 2,
      name: record.name,
      category: record.category,
      quantity: record.quantity,
      unit: record.unit,
      minimumStock: record.minimumStock,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    }));

    const result = service.create({
      name: 'Leche',
      category: 'Refrigerados',
      quantity: 2,
      unit: 'L',
    });

    expect(repositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Leche',
        minimumStock: null,
      }),
    );
    expect(result.data.minimumStock).toBeNull();
  });

  it('throws not found when fetching an unknown product', () => {
    repositoryMock.findById.mockReturnValue(null);

    expect(() => service.findOne(100)).toThrow(NotFoundException);
  });

  it('throws not found when updating an unknown product', () => {
    repositoryMock.findById.mockReturnValue(null);

    expect(() =>
      service.update(100, {
        quantity: 4,
      }),
    ).toThrow(NotFoundException);
  });

  it('throws bad request when PATCH payload is empty', () => {
    expect(() => service.update(1, {})).toThrow(BadRequestException);
  });

  it('propagates conflict when creating a duplicated product', () => {
    repositoryMock.create.mockImplementation(() => {
      throw new DuplicateResourceException('Duplicated.');
    });

    expect(() =>
      service.create({
        name: 'Arroz',
        category: 'Despensa',
        quantity: 1,
        unit: 'kg',
      }),
    ).toThrow(ConflictException);
  });

  it('throws not found when deleting an unknown product', () => {
    repositoryMock.remove.mockReturnValue(false);

    expect(() => service.remove(100)).toThrow(NotFoundException);
  });
});
