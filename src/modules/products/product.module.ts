import { Module } from '@nestjs/common';
import { UserController } from './auth.controller';
import { ProductController } from './product.controller';
import { UserService } from './auth.service';
import { ProductService } from './product.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product, User } from './models';
import { fsHelper } from 'src/helpers';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    SequelizeModule.forFeature([Product]),
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: {
        expiresIn: '2h',
      },
    }),
  ],
  controllers: [UserController, ProductController],
  providers: [UserService, ProductService, JwtService, fsHelper],
})
export class ProductModule {}
