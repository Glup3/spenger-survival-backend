import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import Category from './Category.model';

@Entity()
export default class Tip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  author: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false, length: 1024 })
  description: string;

  @Column({ nullable: true, type: 'char', length: 1 })
  gender: string;

  @Column({ nullable: true })
  schoolClass: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: false })
  issueDate: Date;

  @Column({ nullable: false })
  verified: boolean;

  @ManyToOne(
    () => Category,
    category => category.tips
  )
  category: Category;
}
