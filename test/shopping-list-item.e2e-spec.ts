import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { ShoppingListItemService } from '../src/shopping-list-item/shopping-list-item.service';
import { ShoppingListItemRepository } from '../src/shopping-list-item/shopping-list-item.repository';
import { ShoppingListItem } from '../src/shopping-list-item/entities/shopping-list-item';

describe('ShoppingListItemController (e2e)', () => {
  let app: INestApplication;
  let shoppingListItemService: ShoppingListItemService;
  let shoppingListItemRepository: ShoppingListItemRepository;

  const mockShoppingListItem = new ShoppingListItem({
    id: 'item-123',
    name: 'Maçã',
    quantity: 5,
    user: 'user-123',
    createdAt: new Date('2024-01-01'),
    isPurchased: false,
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    shoppingListItemService = moduleFixture.get<ShoppingListItemService>(
      ShoppingListItemService,
    );
    shoppingListItemRepository = moduleFixture.get<ShoppingListItemRepository>(
      ShoppingListItemRepository,
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/shopping-list-item (GET)', () => {
    it('deve retornar uma lista vazia quando não há itens', async () => {
      jest
        .spyOn(shoppingListItemRepository, 'getAllShoppingListItems')
        .mockResolvedValue([] as any);

      return request(app.getHttpServer())
        .get('/shopping-list-item')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual([]);
        });
    });

    it('deve retornar todos os itens da lista', async () => {
      const mockItems = [mockShoppingListItem];

      jest
        .spyOn(shoppingListItemRepository, 'getAllShoppingListItems')
        .mockResolvedValue(mockItems as any);

      return request(app.getHttpServer())
        .get('/shopping-list-item')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(1);
          expect(res.body[0].id).toBe(mockShoppingListItem.id);
          expect(res.body[0].name).toBe(mockShoppingListItem.name);
        });
    });
  });

  describe('/shopping-list-item/:id (GET)', () => {
    it('deve retornar 404 quando o item não é encontrado', async () => {
      jest
        .spyOn(shoppingListItemRepository, 'getShoppingListItemById')
        .mockResolvedValue(null as any);

      return request(app.getHttpServer())
        .get('/shopping-list-item/non-existent-id')
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toContain('Shopping list item not found');
        });
    });

    it('deve retornar um item pelo id', async () => {
      jest
        .spyOn(shoppingListItemRepository, 'getShoppingListItemById')
        .mockResolvedValue(mockShoppingListItem as any);

      return request(app.getHttpServer())
        .get('/shopping-list-item/item-123')
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(mockShoppingListItem.id);
          expect(res.body.name).toBe(mockShoppingListItem.name);
          expect(res.body.quantity).toBe(mockShoppingListItem.quantity);
        });
    });
  });

  describe('/shopping-list-item (POST)', () => {
    it('deve retornar 400 quando o nome está vazio', () => {
      return request(app.getHttpServer())
        .post('/shopping-list-item')
        .send({
          name: '',
          quantity: 5,
          user: 'user-123',
          createdAt: '2024-01-01T00:00:00.000Z',
          isPurchased: false,
        })
        .expect(400);
    });

    it('deve retornar 400 quando a quantidade é menor que 1', () => {
      return request(app.getHttpServer())
        .post('/shopping-list-item')
        .send({
          name: 'Maçã',
          quantity: 0,
          user: 'user-123',
          createdAt: '2024-01-01T00:00:00.000Z',
          isPurchased: false,
        })
        .expect(400);
    });

    it('deve retornar 400 quando o user está vazio', () => {
      return request(app.getHttpServer())
        .post('/shopping-list-item')
        .send({
          name: 'Maçã',
          quantity: 5,
          user: '',
          createdAt: '2024-01-01T00:00:00.000Z',
          isPurchased: false,
        })
        .expect(400);
    });

    it('deve criar um novo item com sucesso', async () => {
      const createDto = {
        name: 'Banana',
        quantity: 3,
        user: 'user-123',
        createdAt: '2024-01-01T00:00:00.000Z',
        isPurchased: false,
      };

      const newItem = new ShoppingListItem({
        id: 'item-456',
        name: createDto.name,
        quantity: createDto.quantity,
        user: createDto.user,
        createdAt: new Date(createDto.createdAt),
        isPurchased: createDto.isPurchased,
      });

      jest
        .spyOn(shoppingListItemRepository, 'createShoppingListItem')
        .mockResolvedValue(newItem as any);

      return request(app.getHttpServer())
        .post('/shopping-list-item')
        .send(createDto)
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBe(newItem.id);
          expect(res.body.name).toBe(newItem.name);
          expect(res.body.quantity).toBe(newItem.quantity);
        });
    });
  });

  describe('/shopping-list-item/:id (PUT)', () => {
    it('deve retornar 400 quando a quantidade é menor que 1', () => {
      return request(app.getHttpServer())
        .put('/shopping-list-item/item-123')
        .send({
          quantity: 0,
        })
        .expect(400);
    });

    it('deve atualizar um item com sucesso', async () => {
      const updateDto = {
        name: 'Maçã Verde',
        quantity: 10,
      };

      const updatedItem = new ShoppingListItem({
        id: 'item-123',
        name: updateDto.name,
        quantity: updateDto.quantity,
        user: 'user-123',
        createdAt: new Date('2024-01-01'),
        isPurchased: false,
      });

      jest
        .spyOn(shoppingListItemService, 'updateShoppingListItem')
        .mockResolvedValue(updatedItem);

      return request(app.getHttpServer())
        .put('/shopping-list-item/item-123')
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe(updateDto.name);
          expect(res.body.quantity).toBe(updateDto.quantity);
        });
    });
  });

  describe('/shopping-list-item/:id (DELETE)', () => {
    it('deve deletar um item com sucesso', async () => {
      jest
        .spyOn(shoppingListItemRepository, 'deleteShoppingListItem')
        .mockResolvedValue(undefined as any);

      return request(app.getHttpServer())
        .delete('/shopping-list-item/item-123')
        .expect(200);
    });
  });
});
