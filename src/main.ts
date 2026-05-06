import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyHelmet from '@fastify/helmet';
import fastifySensible from '@fastify/sensible';
import fastifyCors from '@fastify/cors';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './shared/utils/all-exceptions.filter';
import { Logger } from '@nestjs/common';

const defaultAllowedOriginPatterns = [
  'http://*.home-portal.local',
  'http://localhost:*',
  'http://127.0.0.1:*',
];

function wildcardPatternToRegExp(pattern: string): RegExp {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
  return new RegExp(`^${escaped}$`);
}

function createOriginMatcher() {
  const patterns = (process.env.CORS_ALLOWED_ORIGINS || defaultAllowedOriginPatterns.join(','))
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map(wildcardPatternToRegExp);

  return (origin: string | undefined): boolean => {
    if (!origin) {
      return true;
    }

    return patterns.some((pattern) => pattern.test(origin));
  };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter({ logger: true }));
  const fastify = app.getHttpAdapter().getInstance();
  const isAllowedOrigin = createOriginMatcher();

  await fastify.register(fastifyCookie);
  await fastify.register(fastifyHelmet);
  await fastify.register(fastifySensible);
  await fastify.register(fastifyCors, {
    origin: (origin: string | undefined, callback: (err: Error | null, allow: boolean) => void) => {
      callback(null, isAllowedOrigin(origin));
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableVersioning({ type: VersioningType.URI });

  const config = new DocumentBuilder()
    .setTitle('Auth Service')
    .setDescription('API for authentication and authorization')
    .setVersion('1.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port, '0.0.0.0');
  Logger.log(`App is running on http://localhost:${port}`);
}
bootstrap();
