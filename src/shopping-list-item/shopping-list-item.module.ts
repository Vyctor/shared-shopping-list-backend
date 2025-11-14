import { Module } from '@nestjs/common';
import { ShoppingListItemController } from './shopping-list-item.controller';
import { InfraModule } from '../infra/infra.module';
import { ShoppingListItemRepository } from './shopping-list-item.repository';
import { ShoppingListItemService } from './shopping-list-item.service';

@Module({
  imports: [InfraModule],
  providers: [ShoppingListItemRepository, ShoppingListItemService],
  controllers: [ShoppingListItemController],
  exports: [ShoppingListItemRepository],
})
export class ShoppingListItemModule {}
