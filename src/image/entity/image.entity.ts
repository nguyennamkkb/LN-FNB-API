
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ImageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false})
  user_id: number;

  @Column({ type: 'text', nullable: false  })
  name: string;

  @Column({ default: 1 })
  status: number;

  @Column({ default: 1 })
  type: number;
  //1: anh sp
  //2: anh qr
  //3: anh logo
  //4: anh cua hang

  @Column({ type: 'bigint' })
  createAt: number;

  @Column({ type: 'bigint' })
  updateAt: number;
}
