import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {databaseConfig} from '../config/database.config'
import { ConfigModule } from '@nestjs/config';
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
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
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
    EmailModule,

  ],
  controllers: [TestController]
})
export class AppModule { }
