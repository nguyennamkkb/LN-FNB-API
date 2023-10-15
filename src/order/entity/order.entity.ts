
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false})
  user_id: number;

  @Column({nullable: false})
  total: number;

  @Column()
  table: string;

  @Column({type:"text", nullable: true})
  list_item: string;

  @Column({nullable: true})
  note: string;

  @Column({ width: 4 })
  person: number;

  @Column({ default: 1 })
  status: number;

  @Column({ type: 'bigint' })
  createAt: number;

  @Column({ type: 'bigint' })
  updateAt: number;
}
