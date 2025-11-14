import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import * as nestjsFirebase from 'nestjs-firebase';

describe('UserRepository', () => {
  let repository: UserRepository;

  const mockFirestore = {
    collection: jest.fn(),
  };

  const mockCollection = {
    where: jest.fn(),
    add: jest.fn(),
  };

  const mockQuery = {
    get: jest.fn(),
  };

  const mockFirebaseAdmin = {
    firestore: mockFirestore,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: 'FIREBASE_TOKEN',
          useValue: mockFirebaseAdmin,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);

    mockFirestore.collection.mockReturnValue(mockCollection);
    mockCollection.where.mockReturnValue(mockQuery);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findUserByEmail', () => {
    it('deve retornar null quando o usuário não existe', async () => {
      const mockQuerySnapshot = {
        empty: true,
        docs: [],
      };

      mockQuery.get.mockResolvedValue(mockQuerySnapshot);

      const result = await repository.findUserByEmail('nonexistent@example.com');

      expect(result).toBeNull();
      expect(mockFirestore.collection).toHaveBeenCalledWith('users');
      expect(mockCollection.where).toHaveBeenCalledWith('email', '==', 'nonexistent@example.com');
      expect(mockQuery.get).toHaveBeenCalledTimes(1);
    });

    it('deve retornar o usuário quando encontrado', async () => {
      const mockQuerySnapshot = {
        empty: false,
        docs: [
          {
            id: 'user-123',
            data: () => ({
              email: 'test@example.com',
              password: 'hashedPassword123',
            }),
          },
        ],
      };

      mockQuery.get.mockResolvedValue(mockQuerySnapshot);

      const result = await repository.findUserByEmail('test@example.com');

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        password: 'hashedPassword123',
      });
      expect(mockFirestore.collection).toHaveBeenCalledWith('users');
      expect(mockCollection.where).toHaveBeenCalledWith('email', '==', 'test@example.com');
    });
  });

  describe('createUser', () => {
    it('deve criar um novo usuário com sucesso', async () => {
      const input = {
        email: 'newuser@example.com',
        password: 'hashedPassword123',
      };

      mockCollection.add.mockResolvedValue({ id: 'new-user-id' });

      await repository.createUser(input);

      expect(mockFirestore.collection).toHaveBeenCalledWith('users');
      expect(mockCollection.add).toHaveBeenCalledWith({
        email: input.email,
        password: input.password,
      });
      expect(mockCollection.add).toHaveBeenCalledTimes(1);
    });
  });
});

