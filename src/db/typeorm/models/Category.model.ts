import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import Tip from './Tip.model';

@Entity()
export default class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column()
  description: string;

  // with #
  @Column()
  color: string;

  @OneToMany(
    type => Tip,
    tip => tip.category
  )
  tips: Tip[];
}
