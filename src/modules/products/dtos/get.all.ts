import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { rating, sortField, sortOrder, status } from 'src/enums';

export class GetAllDto {
  //
  @ApiProperty({
    type: 'number',
    format: 'number',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  @IsInt()
  @IsPositive()
  @Min(1)
  page: number;
  //
  @ApiProperty({
    type: 'number',
    format: 'number',
    example: 20,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  @IsInt()
  @IsPositive()
  @Min(1)
  limit: number;
  //
  @ApiProperty({
    type: 'string',
    enum: sortOrder,
    default: sortOrder.ASC,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEnum(sortOrder)
  sortOrder?: sortOrder;
  //
  @ApiProperty({
    type: 'string',
    enum: sortField,
    default: sortField.id,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEnum(sortField)
  sortField?: sortField;
  //
  @ApiProperty({
    type: 'number',
    format: 'number',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  @IsInt()
  @IsPositive()
  @Min(1)
  minPrice?: number;
  //
  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  @ApiProperty({
    type: 'number',
    format: 'number',
    example: 100,
    required: false,
  })
  @IsInt()
  @IsPositive()
  @Min(1)
  maxPrice?: number;
  //
  @ApiProperty({
    type: 'string',
    enum: rating,
    default: rating.One,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEnum(rating)
  rating?: rating;
  //
  @ApiProperty({
    type: 'string',
    enum: status,
    default: status.active,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEnum(status)
  status?: status;
}
