import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ShoppingListItemService } from './shopping-list-item.service';
import { ShoppingListItemRepository } from './shopping-list-item.repository';
import { ShoppingListItem } from './entities/shopping-list-item';

describe('ShoppingListItemService', () => {
  let service: ShoppingListItemService;
  let repository: jest.Mocked<ShoppingListItemRepository>;

  const mockShoppingListItem = new ShoppingListItem({
    id: 'item-123',
    name: 'Maçã',
    quantity: 5,
    user: 'user-123',
    createdAt: new Date('2024-01-01'),
    isPurchased: false,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShoppingListItemService,
        {
          provide: ShoppingListItemRepository,
          useValue: {
            getAllShoppingListItems: jest.fn(),
            getShoppingListItemById: jest.fn(),
            createShoppingListItem: jest.fn(),
            updateShoppingListItem: jest.fn(),
            deleteShoppingListItem: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ShoppingListItemService>(ShoppingListItemService);
    repository = module.get(ShoppingListItemRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllShoppingListItems', () => {
    it('deve retornar todos os itens da lista', async () => {
      const mockItems = [mockShoppingListItem];

      repository.getAllShoppingListItems.mockResolvedValue(mockItems);

      const result = await service.getAllShoppingListItems();

      expect(result).toEqual(mockItems);
      expect(repository.getAllShoppingListItems).toHaveBeenCalledTimes(1);
    });
  });

  describe('getShoppingListItemById', () => {
    it('deve retornar um item quando encontrado', async () => {
      const itemId = 'item-123';

      repository.getShoppingListItemById.mockResolvedValue(mockShoppingListItem);

      const result = await service.getShoppingListItemById(itemId);

      expect(result).toEqual(mockShoppingListItem);
      expect(repository.getShoppingListItemById).toHaveBeenCalledWith(itemId);
    });

    it('deve lançar NotFoundException quando o item não é encontrado', async () => {
      const itemId = 'non-existent-id';

      repository.getShoppingListItemById.mockResolvedValue(null);

      await expect(service.getShoppingListItemById(itemId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getShoppingListItemById(itemId)).rejects.toThrow(
        'Shopping list item not found',
      );

      expect(repository.getShoppingListItemById).toHaveBeenCalledWith(itemId);
    });
  });

  describe('createShoppingListItem', () => {
    it('deve criar um novo item com sucesso', async () => {
      const createDto = {
        name: 'Banana',
        quantity: 3,
        user: 'user-123',
        createdAt: '2024-01-01T00:00:00.000Z',
        isPurchased: false,
      };

      repository.createShoppingListItem.mockResolvedValue(mockShoppingListItem);

      const result = await service.createShoppingListItem(createDto);

      expect(result).toEqual(mockShoppingListItem);
      expect(repository.createShoppingListItem).toHaveBeenCalledWith(createDto);
    });
  });

  describe('updateShoppingListItem', () => {
    it('deve atualizar um item com sucesso', async () => {
      const updateInput = {
        id: 'item-123',
        name: 'Maçã Verde',
        quantity: 10,
      };

      const updatedItem = new ShoppingListItem({
        id: 'item-123',
        name: 'Maçã Verde',
        quantity: 10,
        user: 'user-123',
        createdAt: new Date('2024-01-01'),
        isPurchased: false,
      });

      repository.updateShoppingListItem.mockResolvedValue(updatedItem);

      const result = await service.updateShoppingListItem(updateInput);

      expect(result).toEqual(updatedItem);
      expect(repository.updateShoppingListItem).toHaveBeenCalledWith(
        updateInput,
      );
    });
  });

  describe('deleteShoppingListItem', () => {
    it('deve deletar um item com sucesso', async () => {
      const itemId = 'item-123';

      repository.deleteShoppingListItem.mockResolvedValue(undefined);

      await service.deleteShoppingListItem(itemId);

      expect(repository.deleteShoppingListItem).toHaveBeenCalledWith(itemId);
    });
  });
});

