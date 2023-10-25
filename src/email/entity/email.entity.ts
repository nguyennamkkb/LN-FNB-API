
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EmailEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false})
  user_id: number;

  @Column({ type: 'text', nullable: false  })
  otp: string;

  @Column({ default: 1 }) //1: chua su dung, 2 da su dung
  status: number;

  @Column({ default: 1 }) // toi da den 3
  count: number;

  @Column({ type: 'bigint' })
  createAt: number;

  @Column({ type: 'bigint' })
  updateAt: number;
}
