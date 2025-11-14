import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { hash } from 'bcryptjs';

jest.mock('bcryptjs');

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    password: 'hashedPassword123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            findUserByEmail: jest.fn(),
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('deve criar um novo usuário com sucesso', async () => {
      const createUserInput = {
        email: 'newuser@example.com',
        password: 'password123',
      };

      const hashedPassword = 'hashedPassword123';

      userRepository.findUserByEmail.mockResolvedValue(null);
      (hash as jest.Mock).mockResolvedValue(hashedPassword);
      userRepository.createUser.mockResolvedValue(undefined);

      await service.createUser(createUserInput);

      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(
        createUserInput.email,
      );
      expect(hash).toHaveBeenCalledWith(createUserInput.password, 10);
      expect(userRepository.createUser).toHaveBeenCalledWith({
        email: createUserInput.email,
        password: hashedPassword,
      });
    });

    it('deve lançar BadRequestException quando o usuário já existe', async () => {
      const createUserInput = {
        email: 'existing@example.com',
        password: 'password123',
      };

      userRepository.findUserByEmail.mockResolvedValue(mockUser);

      await expect(service.createUser(createUserInput)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.createUser(createUserInput)).rejects.toThrow(
        'User already exists',
      );

      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(
        createUserInput.email,
      );
      expect(hash).not.toHaveBeenCalled();
      expect(userRepository.createUser).not.toHaveBeenCalled();
    });
  });
});

