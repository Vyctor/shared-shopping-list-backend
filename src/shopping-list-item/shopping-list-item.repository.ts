import { Injectable } from '@nestjs/common';
import * as nestjsFirebase from 'nestjs-firebase';
import { ShoppingListItem } from './entities/shopping-list-item';

@Injectable()
export class ShoppingListItemRepository {
  constructor(
    @nestjsFirebase.InjectFirebaseAdmin()
    private readonly firebase: nestjsFirebase.FirebaseAdmin,
  ) {}

  async getAllShoppingListItems(): Promise<Array<ShoppingListItem>> {
    const documents = await this.firebase.firestore
      .collection('shopping-item-list')
      .get();

    return documents.docs.map((doc) =>
      ShoppingListItem.fromFirebase({
        id: doc.id,
        name: doc.data().name as string,
        quantity: doc.data().quantity as number,
        user: doc.data().user as string,
        createdAt: doc.data().createdAt as Date,
        isPurchased: doc.data().isPurchased as boolean,
      }),
    );
  }

  async getShoppingListItemById(id: string): Promise<ShoppingListItem | null> {
    const document = await this.firebase.firestore
      .collection('shopping-item-list')
      .doc(id)
      .get();

    if (!document.exists) {
      return null;
    }

    const shoppingListItem = ShoppingListItem.fromFirebase({
      id: document.id,
      name: document.data()?.name as string,
      quantity: document.data()?.quantity as number,
      user: document.data()?.user as string,
      createdAt: document.data()?.createdAt as Date,
      isPurchased: document.data()?.isPurchased as boolean,
    });

    return shoppingListItem;
  }

  async createShoppingListItem(input: {
    name: string;
    quantity: number;
    user: string;
    createdAt: string;
    isPurchased: boolean;
  }): Promise<ShoppingListItem> {
    const createdDocument = await this.firebase.firestore
      .collection('shopping-item-list')
      .add({
        name: input.name,
        quantity: input.quantity,
        user: input.user,
        createdAt: new Date(input.createdAt),
        isPurchased: input.isPurchased,
      });

    return ShoppingListItem.fromFirebase({
      id: createdDocument.id,
      name: input.name,
      quantity: input.quantity,
      user: input.user,
      createdAt: new Date(input.createdAt),
      isPurchased: input.isPurchased,
    });
  }

  async updateShoppingListItem(input: {
    id: string;
    name?: string;
    quantity?: number;
    user?: string;
    isPurchased?: boolean;
  }): Promise<ShoppingListItem> {
    const propsToBeUpdated = {};

    if (input.name) {
      Object.assign(propsToBeUpdated, { name: input.name });
    }
    if (input.quantity) {
      Object.assign(propsToBeUpdated, { quantity: input.quantity });
    }
    if (input.user) {
      Object.assign(propsToBeUpdated, { user: input.user });
    }
    if (input.isPurchased !== undefined) {
      Object.assign(propsToBeUpdated, { isPurchased: input.isPurchased });
    }

    await this.firebase.firestore
      .collection('shopping-item-list')
      .doc(input.id)
      .update(propsToBeUpdated);

    const item = await this.getShoppingListItemById(input.id);

    return item!;
  }

  async deleteShoppingListItem(id: string): Promise<void> {
    await this.firebase.firestore
      .collection('shopping-item-list')
      .doc(id)
      .delete();
  }
}
