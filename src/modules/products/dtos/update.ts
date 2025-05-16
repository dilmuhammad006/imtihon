import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { rating, status } from 'src/enums';

export class UpdateDto {
  @ApiProperty({
    type: 'string',
    example: 'kir mashina',
    required: false,
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    type: 'string',
    example: 'uy jihozi',
    required: false,
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    type: 'number',
    example: 50,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsPositive()
  price: number;

  @ApiProperty({
    type: 'number',
    example: 20,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsPositive()
  discount: number;

  @ApiProperty({
    type: 'number',
    example: 50,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  stock: number;

  @ApiProperty({
    enum: rating,
    enumName: 'rating',
    example: rating.One,
    required: false,
  })
  @IsOptional()
  @IsEnum(rating)
  rating: rating;

  @ApiProperty({
    enum: status,
    enumName: 'status',
    example: status.active,
    required: false,
  })
  @IsOptional()
  @IsEnum(status)
  status: status;
}
