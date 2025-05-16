import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { PROTECTED_KEY } from 'src/decorators';
import { UserRoles } from 'src/enums';

@Injectable()
export class checkAuth implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isProtected = this.reflector.getAllAndOverride<boolean>(
      PROTECTED_KEY,
      [context.getHandler(), context.getClass()],
    );

    const ctx = context.switchToHttp();

    const request = ctx.getRequest<Request & { id?: number; role?: string }>();

    if (!isProtected) {
      request.role = UserRoles.USER;
      return true;
    }

    const token = request.headers['authorization'];

    if (!token && !token?.startsWith('Bearer')) {
      throw new BadRequestException('Please try again with token!');
    }

    const accesToken = token.split(' ')[1].trim();

    if (!accesToken) {
      throw new BadRequestException('Incorrect token format');
    }

    try {
      const data = this.jwt.verify(accesToken);
      request.id = data?.id;
      request.role = data?.role;

      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new ForbiddenException('Token expire time');
      } else if (error instanceof JsonWebTokenError) {
        throw new ForbiddenException('Incorrect token format');
      } else {
        throw new InternalServerErrorException('Internal Server Error!');
      }
    }
  }
}
