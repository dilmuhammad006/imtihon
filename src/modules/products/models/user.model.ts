import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { UserRoles } from 'src/enums';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model {
  @Column({ type: DataType.TEXT })
  name: string;

  @Column({ type: DataType.TEXT, unique: true })
  email: string;

  @Column({ type: DataType.TEXT })
  password: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(UserRoles),
    defaultValue: UserRoles.USER,
  })
  role: string;
}
