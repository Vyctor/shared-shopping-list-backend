import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../user/user.repository';
import { compare } from 'bcryptjs';
import { AuthService } from './auth.service';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<UserRepository>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    password: 'hashedPassword123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: {
            findUserByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(UserRepository);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('deve retornar um access_token quando as credenciais são válidas', async () => {
      const loginInput = {
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedToken = 'jwt-token-123';

      userRepository.findUserByEmail.mockResolvedValue(mockUser);
      (compare as jest.Mock).mockResolvedValue(true);
      jwtService.signAsync.mockResolvedValue(expectedToken);

      const result = await service.login(loginInput);

      expect(result).toEqual({ access_token: expectedToken });
      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(
        loginInput.email,
      );
      expect(compare).toHaveBeenCalledWith(
        loginInput.password,
        mockUser.password,
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
      });
    });

    it('deve lançar BadRequestException quando o usuário não existe', async () => {
      const loginInput = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      userRepository.findUserByEmail.mockResolvedValue(null);

      await expect(service.login(loginInput)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.login(loginInput)).rejects.toThrow(
        'User or password is incorrect',
      );

      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(
        loginInput.email,
      );
      expect(compare).not.toHaveBeenCalled();
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException quando a senha está incorreta', async () => {
      const loginInput = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };

      userRepository.findUserByEmail.mockResolvedValue(mockUser);
      (compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginInput)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.login(loginInput)).rejects.toThrow(
        'User or password is incorrect',
      );

      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(
        loginInput.email,
      );
      expect(compare).toHaveBeenCalledWith(
        loginInput.password,
        mockUser.password,
      );
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});
