
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BillEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false})
  user_id: number;

  @Column({nullable: false})
  order_id: number;

  @Column({ width: 1, default: 1 }) //1 tien mat, 2 ck
  type: number;

  @Column({ width: 11 })
  last_total: number;

  @Column({ width: 11 })
  person: number;

  @Column({ width: 100 })
  table: string;

  @Column({nullable: true })
  note: string;

  @Column({nullable: true })
  voucher: string;

  @Column({ default: 1 })
  status: number;

  @Column({ type: 'bigint' })
  createAt: number;

  @Column({ type: 'bigint' })
  updateAt: number;
  
}
