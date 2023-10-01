
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TableEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false})
  user_id: number;

  @Column()
  name: string;

  @Column({nullable: true})
  description: string;

  @Column({ default: 1 })
  status: number;

  @Column({ type: 'bigint' })
  createAt: number;

  @Column({ type: 'bigint' })
  updateAt: number;
}
