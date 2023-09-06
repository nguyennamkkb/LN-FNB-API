import { Module } from '@nestjs/common';
import { TableService } from './table.service';
import { TableController } from './table.controller';
import { TableEntity } from './entity/table.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TableEntity])],
  providers: [TableService],
  controllers: [TableController]
})
export class TableModule {}
