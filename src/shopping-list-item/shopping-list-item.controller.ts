import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ShoppingListItem } from './entities/shopping-list-item';
import { ShoppingListItemService } from './shopping-list-item.service';
import { CreateShoppingListItemDto } from './dtos/create-shopping-list-item.dto';
import { UpdateShoppingListItemDto } from './dtos/update-shopping-list-item.dto';

@Controller('shopping-list-item')
export class ShoppingListItemController {
  constructor(
    private readonly shoppingListItemService: ShoppingListItemService,
  ) {}

  @Get()
  async getShoppingListItems(): Promise<Array<ShoppingListItem>> {
    return this.shoppingListItemService.getAllShoppingListItems();
  }

  @Get(':id')
  async getShoppingListItemById(
    @Param('id') id: string,
  ): Promise<ShoppingListItem> {
    return this.shoppingListItemService.getShoppingListItemById(id);
  }

  @Post()
  async createShoppingListItem(
    @Body()
    body: CreateShoppingListItemDto,
  ): Promise<ShoppingListItem> {
    return await this.shoppingListItemService.createShoppingListItem(body);
  }

  @Put(':id')
  async updateShoppingListItem(
    @Param('id') id: string,
    @Body()
    body: UpdateShoppingListItemDto,
  ): Promise<ShoppingListItem> {
    return await this.shoppingListItemService.updateShoppingListItem({
      id,
      ...body,
    });
  }

  @Delete(':id')
  async deleteShoppingListItem(@Param('id') id: string): Promise<void> {
    return await this.shoppingListItemService.deleteShoppingListItem(id);
  }
}
