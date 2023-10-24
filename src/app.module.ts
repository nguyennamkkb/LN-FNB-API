import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {databaseConfig} from '../config/database.config'
import { UserModule } from './user/user.module';
import { ImageModule } from './image/image.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { TestController } from './test/test.controller';
import { BillModule } from './bill/bill.module';
import { CategoryModule } from './category/category.module';
import { DiscountModule } from './discount/discount.module';
import { OrderModule } from './order/order.module';
import { TableModule } from './table/table.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: databaseConfig.password,
      database: 'ln_fnb_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    AuthModule,
    ProductModule,
    ImageModule,
    BillModule,
    CategoryModule,
    DiscountModule,
    OrderModule,
    TableModule,
    EmailModule

  ],
  controllers: [TestController]
})
export class AppModule { }
