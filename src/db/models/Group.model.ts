import { Table, Column, Model, HasMany } from 'sequelize-typescript';
import Person from './Person.model';

@Table
class Group extends Model<Group> {
  @Column({ primaryKey: true, autoIncrement: true, allowNull: false })
  id: number;

  @Column
  name: string;

  @HasMany(() => Person)
  persons: Person[];
}

export default Group;
