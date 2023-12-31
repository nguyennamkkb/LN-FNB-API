
import { CategoryEntity } from 'src/category/entity/category.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false})
  user_id: number;

  @Column({nullable: false})
  category_id: number;

  @Column()
  name: string;

  @Column({nullable: true})
  description: string;

  @Column({ width: 11 })
  price: number;

  @Column({ width: 11, default: 0})
  cost: number;

  @Column({ width: 11, default: 0 })
  isHot: number;

  @Column({ type: 'text', nullable: true })
  image: string;

  @Column({ default: 1 })
  status: number;

  @Column({ type: 'bigint' })
  createAt: number;

  @Column({ type: 'bigint' })
  updateAt: number;

  @ManyToOne(() => CategoryEntity, category => category.products)
  @JoinColumn({name: 'category_id'})
  category: CategoryEntity;
}
