import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { ProductModule } from './modules';
import { APP_GUARD } from '@nestjs/core';
import { checkAuth } from './guards/check.auth';
import { CheckRole } from './guards/check.role';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
      username: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      logging: console.log,
      sync: {
        alter: true,
      },
      autoLoadModels: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

    ProductModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: checkAuth,
    },
    {
      provide: APP_GUARD,
      useClass: CheckRole,
    },
  ],
})
export class AppModule {}
