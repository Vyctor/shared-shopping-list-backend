import { Injectable, NotFoundException } from '@nestjs/common';
import { ShoppingListItem } from './entities/shopping-list-item';
import { ShoppingListItemRepository } from './shopping-list-item.repository';
import { CreateShoppingListItemDto } from './dtos/create-shopping-list-item.dto';

@Injectable()
export class ShoppingListItemService {
  constructor(
    private readonly shoppingListItemRepository: ShoppingListItemRepository,
  ) {}

  async getAllShoppingListItems(): Promise<Array<ShoppingListItem>> {
    const items =
      await this.shoppingListItemRepository.getAllShoppingListItems();
    return items;
  }

  async getShoppingListItemById(id: string): Promise<ShoppingListItem> {
    const item =
      await this.shoppingListItemRepository.getShoppingListItemById(id);

    if (!item) {
      throw new NotFoundException('Shopping list item not found');
    }

    return item;
  }

  async createShoppingListItem(
    input: CreateShoppingListItemDto,
  ): Promise<ShoppingListItem> {
    return await this.shoppingListItemRepository.createShoppingListItem(input);
  }

  async updateShoppingListItem(input: {
    id: string;
    name?: string;
    quantity?: number;
    user?: string;
    isPurchased?: boolean;
  }): Promise<ShoppingListItem> {
    return await this.shoppingListItemRepository.updateShoppingListItem(input);
  }

  async deleteShoppingListItem(id: string): Promise<void> {
    return await this.shoppingListItemRepository.deleteShoppingListItem(id);
  }
}
