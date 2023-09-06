
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DiscountEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false})
  user_id: number;

  @Column({nullable: false})
  category_id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ width: 11 })
  price: number;

  @Column({ width: 11 })
  cost: number;

  
  @Column({ width: 11 })
  isHot: number;

  @Column({ type: 'text', nullable: true })
  image: string;

  @Column({ default: 1 })
  status: number;

  @Column({ type: 'bigint' })
  createAt: number;

  @Column({ type: 'bigint' })
  updateAt: number;
}
