import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.APP_PORT || 2006;

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  app.enableCors({
    allowHeaders: ['Authorization'],
    methods: ['*'],
    optionsSuccessStatus: 200,
    origin: process.env.CORS_ORIGIN || '*',
  });

  const config = new DocumentBuilder()
    .setTitle('Product API backEnd')
    .setDescription('Use token and role for use API')
    .setVersion('1.0')
    .addTag('Products')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);
  await app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
    console.log(`http://localhost:${PORT}/docs`);
  });
}
bootstrap();
