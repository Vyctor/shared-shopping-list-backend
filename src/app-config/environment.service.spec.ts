import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EnvironmentService } from './environment.service';

describe('EnvironmentService', () => {
  let service: EnvironmentService;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnvironmentService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EnvironmentService>(EnvironmentService);
    configService = module.get(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('APP_PORT', () => {
    it('deve retornar a porta da aplicação', () => {
      const mockPort = 3000;

      configService.getOrThrow.mockReturnValue(mockPort);

      const result = service.APP_PORT;

      expect(result).toBe(mockPort);
      expect(configService.getOrThrow).toHaveBeenCalledWith('APP_PORT');
    });
  });

  describe('JWT_SECRET', () => {
    it('deve retornar o secret do JWT', () => {
      const mockSecret = 'my-secret-key';

      configService.getOrThrow.mockReturnValue(mockSecret);

      const result = service.JWT_SECRET;

      expect(result).toBe(mockSecret);
      expect(configService.getOrThrow).toHaveBeenCalledWith('JWT_SECRET');
    });
  });

  describe('JWT_EXPIRES_IN', () => {
    it('deve retornar o tempo de expiração do JWT', () => {
      const mockExpiresIn = '1h';

      configService.getOrThrow.mockReturnValue(mockExpiresIn);

      const result = service.JWT_EXPIRES_IN;

      expect(result).toBe(mockExpiresIn);
      expect(configService.getOrThrow).toHaveBeenCalledWith('JWT_EXPIRES_IN');
    });
  });
});

