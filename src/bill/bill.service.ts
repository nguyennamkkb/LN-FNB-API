import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Long, Repository, Like, LessThan, MoreThan, Between } from 'typeorm';
import { UpdateResult, DeleteResult } from 'typeorm';
import { BillEntity } from './entity/bill.entity';
import { Common } from '../../helper/common/common'
import { log } from 'console';
import { OrderEntity } from 'src/order/entity/order.entity';

@Injectable()
export class BillService {

    constructor(@InjectRepository(BillEntity) private repository: Repository<BillEntity>) { }

    async findAll(page: number, limit: number, param: any): Promise<[BillEntity[], number]> {
        let where = {}
        if (param.user_id) { where['user_id'] = param.user_id }
        if (param.name) { where['name'] = Like('%' + param.name + '%') }
        if (param.from && param.to) { where['updateAt'] = Between(Number(param.from), Number(param.to)) }
        if (param.status) { where['status'] = param.status }
        const skip = (page - 1) * limit;
        const [res, totalCount] = await this.repository.findAndCount({
            where: where,
            skip,
            take: limit,
            order: {
                id : "DESC"
            }
        });
        return [res, totalCount];
    }

    async findOne(id: number, user_id: number): Promise<BillEntity> {
        const res = await this.repository.findOne({
            where: { "id": id, "user_id": user_id }, relations: {
                order: true
            }
        });
        return res ? res : null;
    }


    async findByOrderId(id: number): Promise<BillEntity> {
        const res = await this.repository.findOne({ where: { "order_id": id } });
        return res ? res : null;
    }

    async create(item: BillEntity): Promise<BillEntity> {
        item.createAt = Date.now()
        item.updateAt = Date.now()
        return await this.repository.save(item)
    }

    async update(item: BillEntity): Promise<UpdateResult> {
        item.updateAt = Number(item.updateAt)
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

    async layHoaDonTheoNgay(item: any) : Promise<any> {

        const dieuKien = " and bill_entity.updateAt >="+item.from+" and bill_entity.updateAt <="+item.to+" and bill_entity.user_id = "+item.user_id+"";
        const sqlString = "SELECT bill_entity.*,  order_entity.note as order_note, order_entity.time FROM bill_entity inner join order_entity where bill_entity.order_id = order_entity.id "+dieuKien+";"
        // const sqlString = "SELECT bill_entity.*,  order_entity.note as order_note, order_entity.list_item, order_entity.time FROM bill_entity inner join order_entity where bill_entity.order_id = order_entity.id "+dieuKien+";"
        try {
            return await this.repository.query(sqlString)
        } catch (error) {
            log("er"+error)
            return error
        }
    }

    async layDanhSachOrder(item: any) : Promise<[OrderEntity]> {

        const dieuKien = " order_entity.time >="+item.from+" and order_entity.time <="+item.to+" and order_entity.user_id = "+item.user_id+"";
        const sqlString = "Select order_entity.id, order_entity.user_id,order_entity.person, order_entity.status, order_entity.time, order_entity.total, order_entity.table, order_entity.createAt   from order_entity where "+dieuKien+";"
        // const sqlString = "SELECT bill_entity.*,  order_entity.note as order_note, order_entity.list_item, order_entity.time FROM bill_entity inner join order_entity where bill_entity.order_id = order_entity.id "+dieuKien+";"
        try {
            return await this.repository.query(sqlString)
        } catch (error) {
            log("er"+error)
            return error
        }
    }



}
