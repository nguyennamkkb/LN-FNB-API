import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Long, Repository, Like, LessThan, MoreThan } from 'typeorm';
import { UpdateResult, DeleteResult } from  'typeorm';
import { ImageEntity } from './entity/image.entity';
import {Common} from '../../helper/common/common'
import { log } from 'console';

@Injectable()
export class ImageService {

  constructor(@InjectRepository(ImageEntity) private repository: Repository<ImageEntity>) { }

    async findAll(page: number, limit: number, param: any): Promise<[ImageEntity[],number]> {
        let where = {}
        if (param.user_id) {where['user_id'] = param.user_id} 
        if (param.status) {where['status'] = param.status} 
        const skip = (page - 1) * limit;
        const [res, totalCount] = await this.repository.findAndCount({
            where: where,
            skip,
            take: limit,
        });
        return [res, totalCount];
    }

    async findOne(id: number): Promise<ImageEntity> {
        const res = await this.repository.findOne({ where: { "id": id } });
        return res ? res : null;
    }

    async findById(id: number): Promise<ImageEntity[] | null> {
        const res = await this.repository.find({ where: { "id": id } });
        return res ? res : null;
    }
    async findByUserId(user_id: number): Promise<ImageEntity[] | null> {
        const res = await this.repository.find({ where: { "user_id": user_id } });
        return res ? res : null;
    }
   
    async create(item: ImageEntity): Promise<ImageEntity>  {
        item.createAt = Date.now()
        item.updateAt = Date.now()
        return await this.repository.save(item)
    }    
    async update(item: ImageEntity): Promise<UpdateResult> {
        item.updateAt = Date.now()
        try {
            return await this.repository.update(item.id, item)
        } catch (error) {
            log(error)
        }
        // return await this.repository.update(item.id, item)
    }

    async remove(id: number): Promise<DeleteResult> {
        return await this.repository.delete(id);
    }

    

}
