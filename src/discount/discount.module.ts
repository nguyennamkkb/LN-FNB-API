import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { DiscountEntity } from './entity/discount.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DiscountEntity])],
  providers: [DiscountService],
  controllers: [DiscountController]
})
export class DiscountModule {}
