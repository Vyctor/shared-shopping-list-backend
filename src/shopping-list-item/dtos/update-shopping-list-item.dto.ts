import { IsBoolean, IsNumber, IsString, Min } from 'class-validator';

export class UpdateShoppingListItemDto {
  @IsString()
  name?: string;

  @IsNumber()
  @Min(1)
  quantity?: number;

  @IsString()
  user?: string;

  @IsBoolean()
  isPurchased?: boolean;
}
