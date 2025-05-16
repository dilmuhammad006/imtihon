import { ConflictException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserRoles } from 'src/enums';
import { LoginDto, RegisterDto } from './dtos';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly jwt: JwtService,
  ) {}

  async onModuleInit() {
    try {
      await this.#seedUser();
      console.log('✅');
    } catch (error) {
      console.log('❌');
    }
  }

  async register(payload: RegisterDto) {
    const founded = await this.userModel.findOne({
      where: { email: payload.email },
    });

    if (founded?.dataValues) {
      throw new ConflictException('This email already exists');
    }
    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const user = await this.userModel.create({
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
    });

    const role = user.dataValues.role;
    const accesToken = await this.jwt.signAsync({
      id: user.id,
      role: role,
    });

    return {
      message: 'success',
      data: {
        user,
        tokens: {
          accesToken,
        },
      },
    };
  }

  async login(payload: LoginDto) {
    const founded = await this.userModel.findOne({
      where: { email: payload.email },
    });

    if (!founded) {
      throw new ConflictException('Incorrect email or password');
    }

    const isCorrectPassword = await bcrypt.compare(
      payload.password,
      founded?.dataValues.password,
    );
    if (!isCorrectPassword) {
      throw new ConflictException('Incorrect email or password');
    }

    const role = founded.dataValues.role;
    const accesToken = await this.jwt.signAsync({
      id: founded.id,
      role: role,
    });

    return {
      message: 'success',
      data: {
        user: founded,
        tokens: {
          accesToken,
        },
      },
    };
  }

  async #seedUser() {
    const user = {
      name: 'dilmuhammad',
      email: 'dilmuhammadabdumalikov06@gmail.com',
      password: '20060524',
      role: UserRoles.ADMIN,
    };

    const founded = await this.userModel.findOne({
      where: { email: user.email },
    });

    const hashedPassword = await bcrypt.hash(user.password, 10);
    if (!founded) {
      await this.userModel.create({
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
      });
    }
  }
}
