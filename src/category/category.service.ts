import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Long, Repository, Like, LessThan, MoreThan } from 'typeorm';
import { UpdateResult, DeleteResult } from  'typeorm';
import { CategoryEntity } from './entity/category.entity';
import {Common} from '../../helper/common/common'
import { log } from 'console';

@Injectable()
export class CategoryService {

  constructor(@InjectRepository(CategoryEntity) private repository: Repository<CategoryEntity>) { }

    async findAll(page: number, limit: number, param: any): Promise<[CategoryEntity[],number]> {
        let where = {}
        if (param.store_id) {where['user_id'] = param.store_id} 
        if (param.name) {where['name'] = Like('%'+param.name+'%')} 
        if (param.status) {where['status'] = param.status} 
        const skip = (page - 1) * limit;
        const [res, totalCount] = await this.repository.findAndCount({
            where: where,
            skip,
            take: limit,
        });
        return [res, totalCount];
    }

    async findOne(id: number): Promise<CategoryEntity> {
        const res = await this.repository.findOne({ where: { "id": id } });
        return res ? res : null;
    }

    async create(item: CategoryEntity): Promise<CategoryEntity>  {
        item.createAt = Date.now()
        item.updateAt = Date.now()
        return await this.repository.save(item)
    }
    
    async update(item: CategoryEntity): Promise<UpdateResult> {
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