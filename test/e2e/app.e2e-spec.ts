import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import request from 'supertest';

describe('App (e2e)', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication(new FastifyAdapter());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await (app.getHttpAdapter().getInstance() as any).ready();
  });
  afterAll(async () => { await app.close(); });

  it('/auth/register (POST)', async () => {
    const res = await request(app.getHttpServer()).post('/auth/register').send({ username: 'u', email: 'user@example.com', password: 'Pass1234' });
    expect([200, 201]).toContain(res.statusCode);
  });
});
