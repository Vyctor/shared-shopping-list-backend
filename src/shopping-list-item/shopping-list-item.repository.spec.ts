import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingListItemRepository } from './shopping-list-item.repository';
import * as nestjsFirebase from 'nestjs-firebase';
import { ShoppingListItem } from './entities/shopping-list-item';

describe('ShoppingListItemRepository', () => {
  let repository: ShoppingListItemRepository;

  const mockFirestore = {
    collection: jest.fn(),
  };

  const mockCollection = {
    get: jest.fn(),
    add: jest.fn(),
    doc: jest.fn(),
  };

  const mockDoc = {
    get: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockFirebaseAdmin = {
    firestore: mockFirestore,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShoppingListItemRepository,
        {
          provide: 'FIREBASE_TOKEN',
          useValue: mockFirebaseAdmin,
        },
      ],
    }).compile();

    repository = module.get<ShoppingListItemRepository>(
      ShoppingListItemRepository,
    );

    mockFirestore.collection.mockReturnValue(mockCollection);
    mockCollection.doc.mockReturnValue(mockDoc);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllShoppingListItems', () => {
    it('deve retornar uma lista vazia quando não há itens', async () => {
      const mockQuerySnapshot = {
        docs: [],
      };

      mockCollection.get.mockResolvedValue(mockQuerySnapshot);

      const result = await repository.getAllShoppingListItems();

      expect(result).toEqual([]);
      expect(mockFirestore.collection).toHaveBeenCalledWith(
        'shopping-item-list',
      );
      expect(mockCollection.get).toHaveBeenCalledTimes(1);
    });

    it('deve retornar todos os itens da lista', async () => {
      const mockDate = new Date('2024-01-01');
      const mockQuerySnapshot = {
        docs: [
          {
            id: 'item-1',
            data: () => ({
              name: 'Maçã',
              quantity: 5,
              user: 'user-123',
              createdAt: mockDate,
              isPurchased: false,
            }),
          },
          {
            id: 'item-2',
            data: () => ({
              name: 'Banana',
              quantity: 3,
              user: 'user-456',
              createdAt: mockDate,
              isPurchased: true,
            }),
          },
        ],
      };

      mockCollection.get.mockResolvedValue(mockQuerySnapshot);

      const result = await repository.getAllShoppingListItems();

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(ShoppingListItem);
      expect(result[0].id).toBe('item-1');
      expect(result[0].name).toBe('Maçã');
      expect(result[0].quantity).toBe(5);
      expect(result[1].id).toBe('item-2');
      expect(result[1].name).toBe('Banana');
      expect(result[1].isPurchased).toBe(true);
    });
  });

  describe('getShoppingListItemById', () => {
    it('deve retornar null quando o item não existe', async () => {
      const mockDocSnapshot = {
        exists: false,
        id: 'non-existent',
        data: () => null,
      };

      mockDoc.get.mockResolvedValue(mockDocSnapshot);

      const result = await repository.getShoppingListItemById('non-existent');

      expect(result).toBeNull();
      expect(mockCollection.doc).toHaveBeenCalledWith('non-existent');
      expect(mockDoc.get).toHaveBeenCalledTimes(1);
    });

    it('deve retornar o item quando encontrado', async () => {
      const mockDate = new Date('2024-01-01');
      const mockDocSnapshot = {
        exists: true,
        id: 'item-123',
        data: () => ({
          name: 'Maçã',
          quantity: 5,
          user: 'user-123',
          createdAt: mockDate,
          isPurchased: false,
        }),
      };

      mockDoc.get.mockResolvedValue(mockDocSnapshot);

      const result = await repository.getShoppingListItemById('item-123');

      expect(result).toBeInstanceOf(ShoppingListItem);
      expect(result?.id).toBe('item-123');
      expect(result?.name).toBe('Maçã');
      expect(result?.quantity).toBe(5);
      expect(result?.user).toBe('user-123');
      expect(result?.isPurchased).toBe(false);
    });
  });

  describe('createShoppingListItem', () => {
    it('deve criar um novo item com sucesso', async () => {
      const input = {
        name: 'Banana',
        quantity: 3,
        user: 'user-123',
        createdAt: '2024-01-01T00:00:00.000Z',
        isPurchased: false,
      };

      const mockCreatedDoc = {
        id: 'new-item-id',
      };

      mockCollection.add.mockResolvedValue(mockCreatedDoc);

      const result = await repository.createShoppingListItem(input);

      expect(result).toBeInstanceOf(ShoppingListItem);
      expect(result.id).toBe('new-item-id');
      expect(result.name).toBe(input.name);
      expect(result.quantity).toBe(input.quantity);
      expect(result.user).toBe(input.user);
      expect(result.isPurchased).toBe(input.isPurchased);
      expect(mockCollection.add).toHaveBeenCalledWith({
        name: input.name,
        quantity: input.quantity,
        user: input.user,
        createdAt: new Date(input.createdAt),
        isPurchased: input.isPurchased,
      });
    });
  });

  describe('updateShoppingListItem', () => {
    it('deve atualizar apenas o nome quando fornecido', async () => {
      const mockDate = new Date('2024-01-01');
      const existingItem = {
        exists: true,
        id: 'item-123',
        data: () => ({
          name: 'Maçã Verde',
          quantity: 5,
          user: 'user-123',
          createdAt: mockDate,
          isPurchased: false,
        }),
      };

      mockDoc.update.mockResolvedValue(undefined);
      mockDoc.get.mockResolvedValue(existingItem);

      const result = await repository.updateShoppingListItem({
        id: 'item-123',
        name: 'Maçã Verde',
      });

      expect(result).toBeInstanceOf(ShoppingListItem);
      expect(result.name).toBe('Maçã Verde');
      expect(mockDoc.update).toHaveBeenCalledWith({ name: 'Maçã Verde' });
    });

    it('deve atualizar apenas a quantidade quando fornecido', async () => {
      const mockDate = new Date('2024-01-01');
      const existingItem = {
        exists: true,
        id: 'item-123',
        data: () => ({
          name: 'Maçã',
          quantity: 10,
          user: 'user-123',
          createdAt: mockDate,
          isPurchased: false,
        }),
      };

      mockDoc.update.mockResolvedValue(undefined);
      mockDoc.get.mockResolvedValue(existingItem);

      const result = await repository.updateShoppingListItem({
        id: 'item-123',
        quantity: 10,
      });

      expect(result).toBeInstanceOf(ShoppingListItem);
      expect(result.quantity).toBe(10);
      expect(mockDoc.update).toHaveBeenCalledWith({ quantity: 10 });
    });

    it('deve atualizar apenas o user quando fornecido', async () => {
      const mockDate = new Date('2024-01-01');
      const existingItem = {
        exists: true,
        id: 'item-123',
        data: () => ({
          name: 'Maçã',
          quantity: 5,
          user: 'user-456',
          createdAt: mockDate,
          isPurchased: false,
        }),
      };

      mockDoc.update.mockResolvedValue(undefined);
      mockDoc.get.mockResolvedValue(existingItem);

      const result = await repository.updateShoppingListItem({
        id: 'item-123',
        user: 'user-456',
      });

      expect(result).toBeInstanceOf(ShoppingListItem);
      expect(result.user).toBe('user-456');
      expect(mockDoc.update).toHaveBeenCalledWith({ user: 'user-456' });
    });

    it('deve atualizar apenas isPurchased quando fornecido', async () => {
      const mockDate = new Date('2024-01-01');
      const existingItem = {
        exists: true,
        id: 'item-123',
        data: () => ({
          name: 'Maçã',
          quantity: 5,
          user: 'user-123',
          createdAt: mockDate,
          isPurchased: true,
        }),
      };

      mockDoc.update.mockResolvedValue(undefined);
      mockDoc.get.mockResolvedValue(existingItem);

      const result = await repository.updateShoppingListItem({
        id: 'item-123',
        isPurchased: true,
      });

      expect(result).toBeInstanceOf(ShoppingListItem);
      expect(result.isPurchased).toBe(true);
      expect(mockDoc.update).toHaveBeenCalledWith({ isPurchased: true });
    });

    it('deve atualizar múltiplos campos quando fornecidos', async () => {
      const mockDate = new Date('2024-01-01');
      const existingItem = {
        exists: true,
        id: 'item-123',
        data: () => ({
          name: 'Maçã Verde',
          quantity: 10,
          user: 'user-456',
          createdAt: mockDate,
          isPurchased: true,
        }),
      };

      mockDoc.update.mockResolvedValue(undefined);
      mockDoc.get.mockResolvedValue(existingItem);

      const result = await repository.updateShoppingListItem({
        id: 'item-123',
        name: 'Maçã Verde',
        quantity: 10,
        user: 'user-456',
        isPurchased: true,
      });

      expect(result).toBeInstanceOf(ShoppingListItem);
      expect(result.name).toBe('Maçã Verde');
      expect(result.quantity).toBe(10);
      expect(result.user).toBe('user-456');
      expect(result.isPurchased).toBe(true);
      expect(mockDoc.update).toHaveBeenCalledWith({
        name: 'Maçã Verde',
        quantity: 10,
        user: 'user-456',
        isPurchased: true,
      });
    });

    it('deve atualizar com objeto vazio quando nenhum campo é fornecido', async () => {
      const mockDate = new Date('2024-01-01');
      const existingItem = {
        exists: true,
        id: 'item-123',
        data: () => ({
          name: 'Maçã',
          quantity: 5,
          user: 'user-123',
          createdAt: mockDate,
          isPurchased: false,
        }),
      };

      mockDoc.update.mockResolvedValue(undefined);
      mockDoc.get.mockResolvedValue(existingItem);

      const result = await repository.updateShoppingListItem({
        id: 'item-123',
      });

      expect(result).toBeInstanceOf(ShoppingListItem);
      expect(mockDoc.update).toHaveBeenCalledWith({});
    });

    it('deve atualizar quando isPurchased é false', async () => {
      const mockDate = new Date('2024-01-01');
      const existingItem = {
        exists: true,
        id: 'item-123',
        data: () => ({
          name: 'Maçã',
          quantity: 5,
          user: 'user-123',
          createdAt: mockDate,
          isPurchased: false,
        }),
      };

      mockDoc.update.mockResolvedValue(undefined);
      mockDoc.get.mockResolvedValue(existingItem);

      const result = await repository.updateShoppingListItem({
        id: 'item-123',
        isPurchased: false,
      });

      expect(result).toBeInstanceOf(ShoppingListItem);
      expect(result.isPurchased).toBe(false);
      expect(mockDoc.update).toHaveBeenCalledWith({ isPurchased: false });
    });
  });

  describe('deleteShoppingListItem', () => {
    it('deve deletar um item com sucesso', async () => {
      mockDoc.delete.mockResolvedValue(undefined);

      await repository.deleteShoppingListItem('item-123');

      expect(mockCollection.doc).toHaveBeenCalledWith('item-123');
      expect(mockDoc.delete).toHaveBeenCalledTimes(1);
    });
  });
});
