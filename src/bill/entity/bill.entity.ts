
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BillEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false})
  user_id: number;

  @Column({nullable: false})
  order_id: number;

  @Column({ width: 1 })
  type: number;

  @Column({ width: 11 })
  last_total: number;

  @Column({ width: 100 })
  table: string;

  @Column()
  note: string;

  @Column()
  voucher: string;

  @Column({ default: 1 })
  status: number;

  @Column({ type: 'bigint' })
  createAt: number;

  @Column({ type: 'bigint' })
  updateAt: number;
}