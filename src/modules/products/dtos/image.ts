import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class updateImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
  })
  @IsOptional()
  image: Express.Multer.File;
}
