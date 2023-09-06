import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductEntity } from './entity/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/entity/user.entity';
import { CategoryService } from 'src/category/category.service';
import { CategoryEntity } from 'src/category/entity/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity,UserEntity,CategoryEntity])],
  providers: [ProductService,UserService,CategoryService],
  controllers: [ProductController]
})
export class ProductModule {}
