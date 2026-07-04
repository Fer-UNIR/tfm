// Servicio de aplicacion para CRUD basico de productos.
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { CreateProductDto } from './dto/create-product.dto';
import type { UpdateProductDto } from './dto/update-product.dto';
import type { Product } from './entities/product.entity';
import type { ProductItemResponse, ProductListResponse } from './products.types';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  findAllProducts(): Product[] {
    return this.productsRepository.findAll();
  }

  findAll(): ProductListResponse {
    const products = this.findAllProducts();

    return {
      data: products,
      meta: {
        total: products.length,
        timestamp: new Date().toISOString(),
      },
    };
  }

  findOne(id: number): ProductItemResponse {
    const product = this.productsRepository.findById(id);

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found.`);
    }

    return this.toItemResponse(product);
  }

  create(createProductDto: CreateProductDto): ProductItemResponse {
    const now = new Date().toISOString();

    const createdProduct = this.productsRepository.create({
      name: createProductDto.name,
      category: createProductDto.category,
      quantity: createProductDto.quantity,
      unit: createProductDto.unit,
      minimumStock: createProductDto.minimumStock ?? null,
      createdAt: now,
      updatedAt: now,
    });

    return this.toItemResponse(createdProduct);
  }

  update(id: number, updateProductDto: UpdateProductDto): ProductItemResponse {
    if (!this.hasUpdatableField(updateProductDto)) {
      throw new BadRequestException({
        code: 'VALIDATION_ERROR',
        message: 'At least one field must be provided for update.',
        details: ['name', 'category', 'quantity', 'unit', 'minimumStock'],
      });
    }

    const existingProduct = this.productsRepository.findById(id);

    if (!existingProduct) {
      throw new NotFoundException(`Product with id ${id} not found.`);
    }

    const updatedProduct = this.productsRepository.update(id, {
      name: updateProductDto.name,
      category: updateProductDto.category,
      quantity: updateProductDto.quantity,
      unit: updateProductDto.unit,
      minimumStock: updateProductDto.minimumStock,
      updatedAt: new Date().toISOString(),
    });

    if (!updatedProduct) {
      throw new NotFoundException(`Product with id ${id} not found.`);
    }

    return this.toItemResponse(updatedProduct);
  }

  remove(id: number): void {
    const removed = this.productsRepository.remove(id);

    if (!removed) {
      throw new NotFoundException(`Product with id ${id} not found.`);
    }
  }

  private toItemResponse(product: Product): ProductItemResponse {
    return {
      data: product,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  private hasUpdatableField(updateProductDto: UpdateProductDto): boolean {
    return (
      updateProductDto.name !== undefined ||
      updateProductDto.category !== undefined ||
      updateProductDto.quantity !== undefined ||
      updateProductDto.unit !== undefined ||
      updateProductDto.minimumStock !== undefined
    );
  }
}
