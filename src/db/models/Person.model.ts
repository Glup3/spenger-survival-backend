import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Group from './Group.model';

@Table
class Person extends Model<Person> {
  @Column({ primaryKey: true, autoIncrement: true, allowNull: false })
  id: number;

  @Column
  name: string;

  @Column
  title: string;

  @Column({ allowNull: true })
  email: string;

  @Column({ allowNull: true })
  instagram: string;

  @Column({ allowNull: true })
  twitter: string;

  @Column({ allowNull: true })
  linkedin: string;

  @Column({ allowNull: true })
  snapchat: string;

  @Column({ allowNull: true })
  facebook: string;

  @Column({ allowNull: true })
  discord: string;

  @Column({ allowNull: true })
  paypal: string;

  @Column({ allowNull: true })
  youtube: string;

  @ForeignKey(() => Group)
  @Column
  groupId: number;

  @BelongsTo(() => Group)
  group: Group;
}

export default Person;
