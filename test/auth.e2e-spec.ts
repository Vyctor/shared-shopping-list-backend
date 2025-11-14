import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { UserRepository } from '../src/user/user.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let userRepository: UserRepository;
  let jwtService: JwtService;

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

    authService = moduleFixture.get<AuthService>(AuthService);
    userRepository = moduleFixture.get<UserRepository>(UserRepository);
    jwtService = moduleFixture.get<JwtService>(JwtService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/login (POST)', () => {
    it('deve retornar 400 quando o email é inválido', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'invalid-email',
          password: 'password123',
        })
        .expect(400);
    });

    it('deve retornar 400 quando a senha é muito curta', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'short',
        })
        .expect(400);
    });

    it('deve retornar 400 quando a senha é muito longa', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'a'.repeat(33),
        })
        .expect(400);
    });

    it('deve retornar 400 quando o usuário não existe', async () => {
      jest
        .spyOn(userRepository, 'findUserByEmail')
        .mockResolvedValue(null as any);

      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('User or password is incorrect');
        });
    });

    it('deve retornar 400 quando a senha está incorreta', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        password: await bcrypt.hash('correctPassword', 10),
      };

      jest
        .spyOn(userRepository, 'findUserByEmail')
        .mockResolvedValue(mockUser as any);

      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongPassword',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('User or password is incorrect');
        });
    });

    it('deve retornar 200 e access_token quando as credenciais são válidas', async () => {
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        password: hashedPassword,
      };

      jest
        .spyOn(userRepository, 'findUserByEmail')
        .mockResolvedValue(mockUser as any);

      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mock-jwt-token');

      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: password,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body.access_token).toBe('mock-jwt-token');
        });
    });
  });
});

