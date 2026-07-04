// Controlador REST para gestion de lista de compras en /api/v1/shopping-list.
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateShoppingListItemDto } from './dto/create-shopping-list-item.dto';
import { PurchaseShoppingListItemDto } from './dto/purchase-shopping-list-item.dto';
import type {
  ShoppingListItemResponse,
  ShoppingListLowStockSyncResponse,
  ShoppingListPurchaseResponse,
  ShoppingListResponse,
} from './shopping-list.types';
import { ShoppingListService } from './shopping-list.service';

@Controller('shopping-list')
export class ShoppingListController {
  constructor(private readonly shoppingListService: ShoppingListService) {}

  @Get()
  findAll(): ShoppingListResponse {
    return this.shoppingListService.findAll();
  }

  @Post('items')
  @HttpCode(HttpStatus.CREATED)
  createItem(@Body() createDto: CreateShoppingListItemDto): ShoppingListItemResponse {
    return this.shoppingListService.create(createDto);
  }

  @Post('items/from-low-stock')
  @HttpCode(HttpStatus.OK)
  addFromLowStock(): ShoppingListLowStockSyncResponse {
    return this.shoppingListService.addFromLowStock();
  }

  @Patch('items/:id/purchase')
  purchaseItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() purchaseDto: PurchaseShoppingListItemDto,
  ): ShoppingListPurchaseResponse {
    return this.shoppingListService.purchase(id, purchaseDto);
  }

  @Delete('items/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeItem(@Param('id', ParseIntPipe) id: number): void {
    this.shoppingListService.remove(id);
  }
}
