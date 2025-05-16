import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    type: 'string',
    format: 'string',
    required: true,
    example: 'john@gmail.com',
  })
  @IsString()
  @MaxLength(30)
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'string',
    format: 'string',
    required: true,
    example: 'john123',
  })
  @MinLength(6)
  @MaxLength(30)
  @IsString()
  password: string;
}
