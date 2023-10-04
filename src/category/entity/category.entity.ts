
import { ProductEntity } from 'src/product/entity/product.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false})
  user_id: number;

  @Column()
  name: string;

  @OneToMany(() => ProductEntity, (product) => product.category) // specify inverse side as a second parameter
  products: ProductEntity
  
  @Column({ default: 1 })
  status: number;

  @Column({ type: 'bigint' })
  createAt: number;

  @Column({ type: 'bigint' })
  updateAt: number;
}
