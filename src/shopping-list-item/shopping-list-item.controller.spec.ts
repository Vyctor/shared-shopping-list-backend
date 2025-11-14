import { Test, TestingModule } from '@nestjs/testing';
import { ShoppingListItemController } from './shopping-list-item.controller';
import { ShoppingListItemService } from './shopping-list-item.service';
import { ShoppingListItem } from './entities/shopping-list-item';

describe('ShoppingListItemController', () => {
  let controller: ShoppingListItemController;
  let service: jest.Mocked<ShoppingListItemService>;

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
      controllers: [ShoppingListItemController],
      providers: [
        {
          provide: ShoppingListItemService,
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

    controller = module.get<ShoppingListItemController>(
      ShoppingListItemController,
    );
    service = module.get(ShoppingListItemService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getShoppingListItems', () => {
    it('deve retornar todos os itens', async () => {
      const mockItems = [mockShoppingListItem];

      service.getAllShoppingListItems.mockResolvedValue(mockItems);

      const result = await controller.getShoppingListItems();

      expect(result).toEqual(mockItems);
      expect(service.getAllShoppingListItems).toHaveBeenCalledTimes(1);
    });
  });

  describe('getShoppingListItemById', () => {
    it('deve retornar um item pelo id', async () => {
      const itemId = 'item-123';

      service.getShoppingListItemById.mockResolvedValue(mockShoppingListItem);

      const result = await controller.getShoppingListItemById(itemId);

      expect(result).toEqual(mockShoppingListItem);
      expect(service.getShoppingListItemById).toHaveBeenCalledWith(itemId);
    });
  });

  describe('createShoppingListItem', () => {
    it('deve criar um novo item', async () => {
      const createDto = {
        name: 'Banana',
        quantity: 3,
        user: 'user-123',
        createdAt: '2024-01-01T00:00:00.000Z',
        isPurchased: false,
      };

      service.createShoppingListItem.mockResolvedValue(mockShoppingListItem);

      const result = await controller.createShoppingListItem(createDto);

      expect(result).toEqual(mockShoppingListItem);
      expect(service.createShoppingListItem).toHaveBeenCalledWith(createDto);
    });
  });

  describe('updateShoppingListItem', () => {
    it('deve atualizar um item', async () => {
      const itemId = 'item-123';
      const updateDto = {
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

      service.updateShoppingListItem.mockResolvedValue(updatedItem);

      const result = await controller.updateShoppingListItem(itemId, updateDto);

      expect(result).toEqual(updatedItem);
      expect(service.updateShoppingListItem).toHaveBeenCalledWith({
        id: itemId,
        ...updateDto,
      });
    });
  });

  describe('deleteShoppingListItem', () => {
    it('deve deletar um item', async () => {
      const itemId = 'item-123';

      service.deleteShoppingListItem.mockResolvedValue(undefined);

      await controller.deleteShoppingListItem(itemId);

      expect(service.deleteShoppingListItem).toHaveBeenCalledWith(itemId);
    });
  });
});

