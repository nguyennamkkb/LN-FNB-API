import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderEntity } from './entity/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TableService } from 'src/table/table.service';
import { TableEntity } from 'src/table/entity/table.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, TableEntity])],
  providers: [OrderService, TableService],
  controllers: [OrderController]
})
export class OrderModule {}
