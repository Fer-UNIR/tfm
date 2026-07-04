// DTO para confirmar compra de un item y mover cantidad a inventario.
import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class PurchaseShoppingListItemDto {
  @Type(() => Number)
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(0.000001)
  purchasedQuantity!: number;
}
