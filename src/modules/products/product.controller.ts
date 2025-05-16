import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { CreateDto, GetAllDto, UpdateDto, updateImageDto } from './dtos';
import { Protected, Roles } from 'src/decorators';
import { UserRoles } from 'src/enums';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@Controller('products')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Protected(true)
  @Roles([UserRoles.ALL])
  @ApiOperation({ summary: 'Get all  products' })
  @Get()
  async getAll(@Query() payload: GetAllDto) {
    return this.service.getAll(payload);
  }

  @Protected(true)
  @Roles([UserRoles.ALL])
  @ApiOperation({ summary: 'Get product by id' })
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getById(id);
  }

  @Protected(true)
  @Roles([UserRoles.ADMIN])
  @ApiOperation({ summary: 'Create product' })
  @Post()
  async create(@Body() payload: CreateDto) {
    return this.service.create(payload);
  }

  @Protected(true)
  @Roles([UserRoles.ADMIN])
  @ApiOperation({ summary: 'Update product' })
  @Patch(':id')
  async update(
    @Body() payload: UpdateDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.update(payload, id);
  }

  @Protected(true)
  @Roles([UserRoles.ADMIN])
  @ApiOperation({ summary: 'Delete product' })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }

  @Protected(true)
  @Roles([UserRoles.ADMIN])
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Update product image' })
  @Put(':id')
  @ApiConsumes('multipart/form-data')
  async updateImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() image: Express.Multer.File,
    @Body() body: updateImageDto,
  ) {
    return this.service.updateImage(image, id);
  }
}
