import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateDto, GetAllDto } from './dtos';
import { Protected, Roles } from 'src/decorators';
import { UserRoles } from 'src/enums';

@ApiBearerAuth()
@Controller('products')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Protected(true)
  @Roles([UserRoles.ADMIN])
  @ApiOperation({ summary: 'Get all  products' })
  @Get()
  async getAll(@Query() payload: GetAllDto) {
    return this.service.getAll(payload);
  }

  @Protected(true)
  @Roles([UserRoles.ADMIN])
  @ApiOperation({ summary: 'Get product by id' })
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getById(id);
  }

  @Protected(false)
  @Roles([UserRoles.ALL])
  @ApiOperation({ summary: 'Create product' })
  @Post()
  async create(@Body() payload: CreateDto) {
    return this.service.create(payload);
  }

  //   async update() {}

  //   async delete() {}

  //   async updateImage() {}
}
