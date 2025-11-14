import { ShoppingListItem } from './shopping-list-item';

describe('ShoppingListItem', () => {
  const mockDate = new Date('2024-01-01T00:00:00.000Z');
  const mockData = {
    id: 'item-123',
    name: 'Maçã',
    quantity: 5,
    user: 'user-123',
    createdAt: mockDate,
    isPurchased: false,
  };

  describe('constructor', () => {
    it('deve criar uma instância com os dados fornecidos', () => {
      const item = new ShoppingListItem(mockData);

      expect(item).toBeInstanceOf(ShoppingListItem);
    });
  });

  describe('getters', () => {
    it('deve retornar o id corretamente', () => {
      const item = new ShoppingListItem(mockData);

      expect(item.id).toBe('item-123');
    });

    it('deve retornar o name corretamente', () => {
      const item = new ShoppingListItem(mockData);

      expect(item.name).toBe('Maçã');
    });

    it('deve retornar o quantity corretamente', () => {
      const item = new ShoppingListItem(mockData);

      expect(item.quantity).toBe(5);
    });

    it('deve retornar o user corretamente', () => {
      const item = new ShoppingListItem(mockData);

      expect(item.user).toBe('user-123');
    });

    it('deve retornar o createdAt corretamente', () => {
      const item = new ShoppingListItem(mockData);

      expect(item.createdAt).toEqual(mockDate);
    });

    it('deve retornar o isPurchased corretamente', () => {
      const item = new ShoppingListItem(mockData);

      expect(item.isPurchased).toBe(false);
    });

    it('deve retornar isPurchased como true quando fornecido', () => {
      const purchasedItem = new ShoppingListItem({
        ...mockData,
        isPurchased: true,
      });

      expect(purchasedItem.isPurchased).toBe(true);
    });
  });

  describe('fromFirebase', () => {
    it('deve criar uma instância a partir de dados do Firebase', () => {
      const firebaseData = {
        id: 'firebase-item-123',
        name: 'Banana',
        quantity: 3,
        user: 'user-456',
        createdAt: new Date('2024-02-01'),
        isPurchased: true,
      };

      const item = ShoppingListItem.fromFirebase(firebaseData);

      expect(item).toBeInstanceOf(ShoppingListItem);
      expect(item.id).toBe('firebase-item-123');
      expect(item.name).toBe('Banana');
      expect(item.quantity).toBe(3);
      expect(item.user).toBe('user-456');
      expect(item.createdAt).toEqual(new Date('2024-02-01'));
      expect(item.isPurchased).toBe(true);
    });
  });

  describe('toJSON', () => {
    it('deve retornar um objeto JSON com todas as propriedades', () => {
      const item = new ShoppingListItem(mockData);
      const json = item.toJSON();

      expect(json).toEqual({
        id: 'item-123',
        name: 'Maçã',
        quantity: 5,
        user: 'user-123',
        createdAt: mockDate,
        isPurchased: false,
      });
    });

    it('deve retornar isPurchased como true quando o item foi comprado', () => {
      const purchasedItem = new ShoppingListItem({
        ...mockData,
        isPurchased: true,
      });
      const json = purchasedItem.toJSON();

      expect(json.isPurchased).toBe(true);
    });
  });
});

