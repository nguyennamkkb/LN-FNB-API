import { Entity, Column, PrimaryGeneratedColumn, Long } from 'typeorm';


@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false, unique: true})
  email: string;

  @Column()
  password: string;

  @Column()
  name_own: string;

  @Column()
  storeName: string;

  @Column()
  desciption: string;

  @Column()
  address: string;
  
  @Column()
  logo: string;

  @Column({ length: 15, unique: true })
  phone: string;

  @Column()
  qr: string;

  @Column({ default: 1 })
  status: number;

  @Column({type: 'bigint'})
  createAt: number;

  @Column({type: 'bigint'})
  updateAt: number;
}
