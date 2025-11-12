export class ShoppingListItem {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _quantity: number;
  private readonly _user: string;
  private readonly _createdAt: Date;
  private readonly _isPurchased: boolean;

  constructor(constructorProps: {
    id: string;
    name: string;
    quantity: number;
    user: string;
    createdAt: Date;
    isPurchased: boolean;
  }) {
    this._id = constructorProps.id;
    this._name = constructorProps.name;
    this._quantity = constructorProps.quantity;
    this._user = constructorProps.user;
    this._createdAt = constructorProps.createdAt;
    this._isPurchased = constructorProps.isPurchased;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get quantity(): number {
    return this._quantity;
  }

  get user(): string {
    return this._user;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get isPurchased(): boolean {
    return this._isPurchased;
  }

  static fromFirebase(firebaseData: {
    id: string;
    name: string;
    quantity: number;
    user: string;
    createdAt: Date;
    isPurchased: boolean;
  }): ShoppingListItem {
    return new ShoppingListItem({
      id: firebaseData.id,
      name: firebaseData.name,
      quantity: firebaseData.quantity,
      user: firebaseData.user,
      createdAt: firebaseData.createdAt,
      isPurchased: firebaseData.isPurchased,
    });
  }

  toJSON(): {
    id: string;
    name: string;
    quantity: number;
    user: string;
    createdAt: Date;
    isPurchased: boolean;
  } {
    return {
      id: this.id,
      name: this.name,
      quantity: this.quantity,
      user: this.user,
      createdAt: this.createdAt,
      isPurchased: this.isPurchased,
    };
  }
}
