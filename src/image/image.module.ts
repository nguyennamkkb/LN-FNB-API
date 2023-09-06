import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './entity/image.entity';
import { ImageService } from './image.service';
import { ImagesController } from './image.controller';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity,UserEntity])],
  providers: [ImageService,UserService],
  controllers: [ImagesController]
})
export class ImageModule {}
