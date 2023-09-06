import { Module } from '@nestjs/common';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { BillEntity } from './entity/bill.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BillEntity])],
  providers: [BillService],
  controllers: [BillController]
})
export class BillModule {}
