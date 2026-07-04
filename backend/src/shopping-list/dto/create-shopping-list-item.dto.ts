// DTO de alta manual de item en lista de compras.
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateShoppingListItemDto {
  @Type(() => Number)
  @IsInt()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(1)
  productId!: number;

  @Type(() => Number)
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(0.000001)
  quantity!: number;

  @IsString()
  @IsNotEmpty()
  unit!: string;
}
