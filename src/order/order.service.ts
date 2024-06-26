import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Long, Repository, Like, LessThan, MoreThanOrEqual } from 'typeorm';
import { UpdateResult, DeleteResult } from  'typeorm';
import { OrderEntity } from './entity/order.entity';
import {Common} from '../../helper/common/common'
import { log } from 'console';

@Injectable()
export class OrderService {

  constructor(@InjectRepository(OrderEntity) private repository: Repository<OrderEntity>) { }

    async findAll(page: number, limit: number, param: any): Promise<[OrderEntity[],number]> {
        let where = {}
        if (param.user_id) {where['user_id'] = param.user_id} 
        if (param.name) {where['name'] = Like('%'+param.name+'%')} 
        if (param.status) {where['status'] = MoreThanOrEqual(param.status)} 
        const skip = (page - 1) * limit;
        const [res, totalCount] = await this.repository.findAndCount({
            where: where,
            skip,
            take: limit,
        });
        return [res, totalCount];
    }
    async findBy(param: any): Promise<OrderEntity[]> {
        let where = {}
        if (param.user_id) {where['user_id'] = param.user_id} 
        if (param.table) {where['table'] = Like('%'+param.table+'%')} 
        if (param.status) {where['status'] = MoreThanOrEqual(param.status)} 
     
        const res = await this.repository.find({
            where: where,
        });
        return res;
    }
    async findOne(id: number): Promise<OrderEntity> {
        const res = await this.repository.findOne({ where: { "id": id } });
        return res ? res : null;
    }

    async findOrderByIdNUserId(id: number, user_id: number): Promise<OrderEntity> {
        const res = await this.repository.findOne({ where: { "id": id ,"user_id":user_id} });
        return res ? res : null;
    }
    async create(item: OrderEntity): Promise<OrderEntity>  {
        item.createAt = Date.now()
        item.updateAt = Date.now()
        return await this.repository.save(item)
    }
    
    async update(item: OrderEntity): Promise<UpdateResult> {
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
