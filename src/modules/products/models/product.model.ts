import {
  AllowNull,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { rating, status } from 'src/enums';

@Table({ tableName: 'products', timestamps: true })
export class Product extends Model {
  @Column({ type: DataType.TEXT })
  name: string;

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.DECIMAL })
  price: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  discount: number;

  @Column({
    type: DataType.ENUM,
    values: Object.values(rating),
    defaultValue: rating.Five,
  })
  rating: rating;

  @Column({ type: DataType.INTEGER })
  stock: number;

  @Column({
    type: DataType.ENUM,
    values: Object.values(status),
    defaultValue: status.active,
  })
  status: status;

  @Column({ type: DataType.TEXT })
  image_url: string;
}
