import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsPositive, IsString } from 'class-validator';
import { rating, status } from 'src/enums';

export class CreateDto {
  @ApiProperty({
    type: 'string',
    example: 'kir mashina',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: 'string',
    example: 'uy jihozi',
    required: true,
  })
  @IsString()
  description: string;

  @ApiProperty({
    type: 'number',
    example: 50,
    required: true,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsPositive()
  price: number;

  @ApiProperty({
    type: 'number',
    example: 20,
    required: true,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsPositive()
  discount: number;

  @ApiProperty({
    type: 'number',
    example: 50,
    required: true,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  stock: number;

  @ApiProperty({
    enum: rating,
    example: rating.One,
    required: true,
    type: 'string',
  })
  @IsEnum(rating)
  rating?: rating;

  @ApiProperty({
    enum: status,
    example: status.active,
    required: true,
    type: 'string',
  })
  @IsEnum(status)
  status?: status;
}
