import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserService } from '../src/user/user.service';
import { UserRepository } from '../src/user/user.repository';
import * as bcrypt from 'bcryptjs';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;
  let userRepository: UserRepository;

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

    userService = moduleFixture.get<UserService>(UserService);
    userRepository = moduleFixture.get<UserRepository>(UserRepository);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/user/create (POST)', () => {
    it('deve retornar 400 quando o email é inválido', () => {
      return request(app.getHttpServer())
        .post('/user/create')
        .send({
          email: 'invalid-email',
          password: 'password123',
        })
        .expect(400);
    });

    it('deve retornar 400 quando a senha é muito curta', () => {
      return request(app.getHttpServer())
        .post('/user/create')
        .send({
          email: 'test@example.com',
          password: 'short',
        })
        .expect(400);
    });

    it('deve retornar 400 quando a senha é muito longa', () => {
      return request(app.getHttpServer())
        .post('/user/create')
        .send({
          email: 'test@example.com',
          password: 'a'.repeat(33),
        })
        .expect(400);
    });

    it('deve retornar 400 quando o usuário já existe', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'existing@example.com',
        password: await bcrypt.hash('password123', 10),
      };

      jest
        .spyOn(userRepository, 'findUserByEmail')
        .mockResolvedValue(mockUser as any);

      return request(app.getHttpServer())
        .post('/user/create')
        .send({
          email: 'existing@example.com',
          password: 'password123',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('User already exists');
        });
    });

    it('deve criar um novo usuário com sucesso', async () => {
      jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(null as any);
      jest.spyOn(userRepository, 'createUser').mockResolvedValue(undefined as any);

      return request(app.getHttpServer())
        .post('/user/create')
        .send({
          email: 'newuser@example.com',
          password: 'password123',
        })
        .expect(201);
    });
  });
});

