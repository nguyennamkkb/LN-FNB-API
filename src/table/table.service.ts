import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Long, Repository, Like, LessThan, MoreThan, In } from 'typeorm';
import { UpdateResult, DeleteResult } from  'typeorm';
import { TableEntity } from './entity/table.entity';
import {Common} from '../../helper/common/common'
import { log } from 'console';

@Injectable()
export class TableService {

  constructor(@InjectRepository(TableEntity) private repository: Repository<TableEntity>) { }

    async findAll(page: number, limit: number, param: any): Promise<[TableEntity[],number]> {
        let where = {}
        if (param.user_id) {where['user_id'] = param.user_id} 
        if (param.keySearch) {where['name'] = Like('%'+param.keySearch+'%')} 
        if (param.status) {where['status'] = param.status} 
        const skip = (page - 1) * limit;
        const [res, totalCount] = await this.repository.findAndCount({
            where: where,
            skip,
            take: limit,
        });
        return [res, totalCount];
    }

    async findOne(id: number): Promise<TableEntity> {
        const res = await this.repository.findOne({ where: { "id": id } });
        return res ? res : null;
    }

    async findTable(table: string): Promise<TableEntity> {
        let where = {}
        // where["name"] = In(table)
        where["name"] = table
        where["status"] = 1
        const res = await this.repository.findOne({ where: where });
        return res ? res : null;
    }

    async create(item: TableEntity): Promise<TableEntity>  {
        item.createAt = Date.now()
        item.updateAt = Date.now()
        return await this.repository.save(item)
    }
    
    async update(item: TableEntity): Promise<UpdateResult> {
        item.updateAt = Date.now()
        try {
            return await this.repository.update(item.id, item)
        } catch (error) {
            log(error)
        }
        // return await this.repository.update(item.id, item)
    }
    
    async updateTableSelected(table: string[]): Promise<UpdateResult> {
        // const item = await this.repository.findOne({ where: { "id": id } });
        // item.updateAt = Date.now()
        let listTable = ""
        for (let index = 0; index < table.length; index++) {
            const element = table[index];
            listTable += "'"+element+"',"
        }
        listTable = listTable.substring(0,listTable.length - 1)
        const sqlString = "update table_entity set status = 2, updateAt="+Date.now()+" where name in ("+listTable+")"
        try {
            return await this.repository.query(sqlString)
        } catch (error) {
            log("er"+error)
        }
        // return await this.repository.update(item.id, item)
    }

    async remove(id: number): Promise<DeleteResult> {
        return await this.repository.delete(id);
    }

    

}
