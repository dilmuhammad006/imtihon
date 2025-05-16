import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './auth.service';
import { LoginDto, RegisterDto } from './dtos';
import { ApiOperation } from '@nestjs/swagger';
import { Protected, Roles } from 'src/decorators';
import { UserRoles } from 'src/enums';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Protected(false)
  @Roles([UserRoles.ALL])
  @ApiOperation({ summary: 'Register' })
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.service.register(body);
  }

  @Protected(false)
  @Roles([UserRoles.ALL])
  @ApiOperation({ summary: 'Login' })
  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.service.login(body);
  }
}
