import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Tip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  author: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false, length: 1024 })
  description: string;

  @Column({ nullable: true, type: 'char', length: 1 })
  gender: string;

  @Column({ nullable: false })
  schoolClass: string;

  @Column({ nullable: false })
  department: string;

  @Column({ nullable: false })
  issueDate: Date;

  @Column({ nullable: false })
  verified: boolean;
}
