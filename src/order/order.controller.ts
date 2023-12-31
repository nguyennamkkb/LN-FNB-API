import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderEntity } from "./entity/order.entity";
import { ResponseHelper } from "helper/common/response.helper";
import { ApiResponse } from "helper/common/response.interface";
import { UpdateResult } from "typeorm/query-builder/result/UpdateResult";
import { Common } from "../../helper/common/common";
import { TableService } from "src/table/table.service";
import { Public } from "src/auth/public.decorator";

@Controller("orders")
export class OrderController {
  constructor(private readonly services: OrderService, private readonly tableServices: TableService) {}

  @Post()
  async create(@Body() item): Promise<ApiResponse<any>> {
    try {
      // if (await Common.verifyRequest(item.cksRequest, item.timeRequest)) {
        item.table = item.table.substring(0,item.table.length - 1)
        const listtable: string[] = String(item.table).split(" ")
        if (listtable.length <= 0) {
          return ResponseHelper.error(0, "Loi");
        }
        for (let index = 0; index < listtable.length; index++) {
          const element = listtable[index];
          const table = await this.tableServices.findTable(element)
          if (table == null) {
            return ResponseHelper.error(0, "Bàn "+ table.name + " đã có người ngồi");
          }
        }
        let updateTable = await this.tableServices.updateTableSelected(listtable)
        if (updateTable.affectedRows <= 0) {
          return ResponseHelper.success("Lỗi");
        }
        const res = await this.services.create(item)
        return ResponseHelper.success(res);
       
    }
    catch (error) {
      return ResponseHelper.error(0, error);
    }
  }

  @Get()
  async findAll(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 100,
    @Query() query
  ): Promise<ApiResponse<OrderEntity[]>> {
    try {
      if (await Common.verifyRequest(query.cksRequest, query.timeRequest)) {
        const [res, totalCount] = await this.services.findAll(
          page,
          limit,
          query
        );  
        return {
          statusCode: 200,
          message: "Thành công!",
          data: res,
          meta: {
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
          },
        };
      }
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }

  @Get(":id")
  async findOne(
    @Param() param,
    @Query() query
  ): Promise<ApiResponse<OrderEntity>> {
    try {
      if (await Common.verifyRequest(query.cksRequest, query.timeRequest)) {
        const res = await this.services.findOne(param.id);
        return ResponseHelper.success(res);
      }
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }
  @Put()
  async update(@Body() body): Promise<ApiResponse<UpdateResult>> {
    try {
      if (await Common.verifyRequest(body.cksRequest, body.timeRequest)) {
        const order = await this.services.findOne(body.id);
        const listtable: string[] = String(order.table).split(" ")
        const updateTable1 = await this.tableServices.updateTableSelected(listtable)
        delete body["cksRequest"];
        delete body["timeRequest"];
        const res = await this.services.update(body);
        return ResponseHelper.success(res);
      }
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }

  @Delete(":id")
  async remove(@Param() param, @Query() query): Promise<ApiResponse<any>> {
    try {
      if (await Common.verifyRequest(query.cksRequest, query.timeRequest)) {
        const order = await this.services.findOrderByIdNUserId(param.id,query.user_id)
        if (order == null)  return ResponseHelper.error(0, "Loi");

        const listtable: string[] = String(order.table).split(" ")
        const resetTable = await this.tableServices.resetTable(listtable)
        if (resetTable.affectedRows <= 0) return  ResponseHelper.error(0, "Loi");
        
        const res = await this.services.remove(order.id);
        return ResponseHelper.success(res);
      }
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }

  @Post("dattruoc")
  async createDatTruoc(@Body() item): Promise<ApiResponse<any>> {
    try {
      if (await Common.verifyRequest(item.cksRequest, item.timeRequest)) {
        const listtable: string[] = String(item.table).split(" ")
        if (listtable.length <= 0) {
          return ResponseHelper.error(0, "Loi");
        }
        for (let index = 0; index < listtable.length; index++) {
          const element = listtable[index];
          const table = await this.tableServices.findTable(element)
          if (table == null) {
            return ResponseHelper.error(0, "Bàn "+ table.name + " đã có người ngồi");
          }
        }
        let updateTable = await this.tableServices.updateTableDatTruoc(listtable)
        if (updateTable.affectedRows <= 0) {
          return ResponseHelper.success("Lỗi");
        }
        const res = await this.services.create(item)
        return ResponseHelper.success(res);
      }
    }
    catch (error) {
      return ResponseHelper.error(0, error);
    }
  } 
  @Post('ketthuc')
  async ketThucOrder(@Body() item): Promise<ApiResponse<any>> {
    try {
      if (await Common.verifyRequest(item.cksRequest, item.timeRequest)) {
        const order = await this.services.findOrderByIdNUserId(item.id,item.user_id)
        if (order == null)  return ResponseHelper.error(0, "Loi");

        const listtable: string[] = String(order.table).split(" ")

        const resetTable = await this.tableServices.resetTable(listtable)

        if (resetTable.affectedRows <= 0) return  ResponseHelper.error(0, "Loi");
        order.status = 0
        const res = await this.services.update(order);
        return ResponseHelper.customise(200,"Thanh cong");
      }
       
    }
    catch (error) {
      return ResponseHelper.error(0, error);
    }
  }
}
