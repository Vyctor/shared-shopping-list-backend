import { Module } from '@nestjs/common';
import { ShoppingListItemModule } from './shopping-list-item/shopping-list-item.module';
import { ShoppingListItemService } from './shopping-list-item/shopping-list-item.service';
import { AuthModule } from './auth/auth.module';
import { AppConfigModule } from './app-config/app-config.module';

@Module({
  imports: [ShoppingListItemModule, AuthModule, AppConfigModule],
  providers: [ShoppingListItemService],
})
export class AppModule {}
