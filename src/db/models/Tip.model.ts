import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
class Tip extends Model<Tip> {
  @Column({ primaryKey: true, autoIncrement: true, allowNull: false })
  id: number;

  @Column({ allowNull: false })
  author: string;

  @Column({ allowNull: false })
  title: string;

  @Column({ allowNull: false, type: DataType.STRING(1024) })
  description: string;

  @Column({ allowNull: true, type: DataType.CHAR(1) })
  gender: string;

  @Column({ allowNull: false })
  schoolClass: string;

  @Column({ allowNull: false })
  department: string;

  @Column({ allowNull: false, type: DataType.DATE })
  issueDate: Date;

  @Column({ allowNull: false })
  verified: boolean;
}

export default Tip;
