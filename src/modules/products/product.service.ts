import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './models';
import { Op, where } from 'sequelize';
import { sortField, sortOrder } from 'src/enums';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fsHelper } from 'src/helpers';
import { CreateDto, GetAllDto, UpdateDto } from './dtos';

@Injectable()
export class ProductService implements OnModuleInit {
  constructor(
    @InjectModel(Product) private readonly productModel: typeof Product,
    private readonly fs: fsHelper,
  ) {}

  async onModuleInit() {
    try {
      await this.#seedProducts();
      await this.fs.MkdirUploads();
      console.log('✅');
    } catch (error) {
      console.log(error.message);
      console.log('❌');
    }
  }

  async getAll(payload: GetAllDto) {
    const offset: number = (payload.page - 1) * payload.limit;

    const filters: any = {};

    if (payload.minPrice) {
      filters.price = {
        [Op.gte]: payload.minPrice,
      };
    }
    if (payload.maxPrice) {
      filters.price = {
        ...filters?.price,
        [Op.lte]: payload.maxPrice,
      };
    }
    if (payload.rating) {
      filters.rating = {
        [Op.eq]: payload.rating,
      };
    }
    if (payload.status) {
      filters.status = {
        [Op.eq]: payload.status,
      };
    }

    const { count, rows: products } = await this.productModel.findAndCountAll({
      limit: payload.limit || 10,
      offset: offset || 0,
      order: [
        [payload.sortField || sortField.id, payload.sortOrder || sortOrder.ASC],
      ],
      where: { ...filters },
    });

    return {
      message: 'success',
      page: payload.page || 1,
      totalCount: count,
      count: products.length,
      data: products,
    };
  }

  async getById(id: number) {
    const founded = await this.productModel.findByPk(id);

    if (!founded) {
      throw new NotFoundException('Product not found with given id');
    }

    return {
      message: 'success',
      data: founded,
    };
  }

  async create(payload: CreateDto) {
    const product = await this.productModel.create({
      name: payload.name,
      description: payload.description,
      price: payload.price,
      discount: payload.discount,
      stock: payload.stock,
      status: payload.status,
      rating: payload.rating,
    });

    return {
      message: 'success',
      data: product,
    };
  }

  async updateImage(payload: Express.Multer.File, id: number) {
    const founded = await this.productModel.findByPk(id);

    if (!founded) {
      throw new NotFoundException('Product not found with given id');
    }

    const userImage = founded.dataValues.image_url;
    if (userImage && fs.existsSync(path.join(process.cwd(), 'uploads', userImage))) {
      await this.fs.unlinkFile(userImage);
    }

    const image = await this.fs.uploadFile(payload);

    await this.productModel.update(
      {
        image_url: image.fileUrl,
      },
      { where: { id }, returning: true },
    );
    const res = await this.productModel.findByPk(id);

    return {
      message: 'success',
      data: res,
    };
  }

  async delete(id: number) {
    const founded = await this.productModel.findByPk(id);

    if (!founded) {
      throw new NotFoundException('Product not found with given id');
    }

    const rasm = founded.dataValues.image_url;
    console.log(founded.dataValues);

    if (rasm && fs.existsSync(path.join(process.cwd(), 'uploads', rasm))) {
      await this.fs.unlinkFile(rasm);
    }
    await this.productModel.destroy({ where: { id } });

    return {
      message: 'success',
      data: founded,
    };
  }

  async update(payload: UpdateDto, id: number) {
    const founded = await this.productModel.findByPk(id);

    if (!founded) {
      throw new NotFoundException('Product not found with given id');
    }

    const product = await this.productModel.update(
      {
        name: payload.name,
        description: payload.description,
        price: payload.price,
        discount: payload.discount,
        stock: payload.stock,
        status: payload.status,
        rating: payload.rating,
      },
      { where: { id }, returning: true },
    );

    return {
      message: 'success',
      data: product,
    };
  }

  async #seedProducts() {
    const res = fs.readFileSync(
      path.join(process.cwd(), 'src', 'database', 'product.json'),
      'utf-8',
    );

    const products = JSON.parse(res);

    const Exists = await this.productModel.findAll();
    if (Exists.length == 0) {
      for (let product of products) {
        await this.productModel.create({
          name: product.name,
          description: product.description,
          price: product.price,
          discount: product.discount,
          rating: product.rating,
          stock: product.stock,
          status: product.status,
          image_url: 'image.jpeg',
        });
      }
    }
  }
}
