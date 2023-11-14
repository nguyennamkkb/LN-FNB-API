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
import { BillService } from "./bill.service";
import { BillEntity } from "./entity/bill.entity";
import { ResponseHelper } from "helper/common/response.helper";
import { ApiResponse } from "helper/common/response.interface";
import { UpdateResult } from "typeorm/query-builder/result/UpdateResult";
import { Common } from "../../helper/common/common";
import { Public } from "src/auth/public.decorator";

@Controller("bills")
export class BillController {
  constructor(private readonly services: BillService) {}

  @Post()
  async create(@Body() item): Promise<ApiResponse<BillEntity>> {
    try {
      if (await Common.verifyRequest(item.cksRequest, item.timeRequest)) {

        const bill = await this.services.findByOrderId(item.order_id)
        if (bill == null) {
          const res = await this.services.create(item);
          return ResponseHelper.success(res);
        }else {
          item.id = bill.id
          delete item["cksRequest"];
          delete item["timeRequest"];

          item.updateAt = item.timeRequest
          const res = await this.services.update(item);
          return ResponseHelper.success(item)
        }
      }
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }

  @Get()
  async findAll(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 100,
    @Query() query
  ): Promise<ApiResponse<BillEntity[]>> {
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

  @Public()
  @Get("baoCaoTheoNgay")
  async baoCaoTheoNgay(
    @Query() query
  ): Promise<ApiResponse<any>> {
    try {
      // if (await Common.verifyRequest(query.cksRequest, query.timeRequest)) {
        console.log(query)
        if (query.from == undefined) return ResponseHelper.error(0, "Thiếu tham số");
        if (query.to == undefined) return ResponseHelper.error(0, "Thiếu tham số");
        if (query.user_id == undefined ) return ResponseHelper.error(0, "Thiếu tham số");

        const res = await this.services.baoCaoTheoNgay(query)
        console.log(res.length);
        
        // console.log(JSON.stringify(res))
        return  ResponseHelper.success(res);
      // }
    } catch (error) { 
      return ResponseHelper.error(0, error);
    }
  }


  @Get(":id")
  async findOne(
    @Param() param,
    @Query() query
  ): Promise<ApiResponse<BillEntity>> {
    try {
      if (await Common.verifyRequest(query.cksRequest, query.timeRequest)) {
        
        const res = await this.services.findOne(param.id, query.user_id);
        return ResponseHelper.success(res);
      }
    } catch (error) {
      console.log(JSON.stringify(error))
      return ResponseHelper.error(0, error);
    }
  }
  @Put()
  async update(@Body() body): Promise<ApiResponse<UpdateResult>> {
    try {
      if (await Common.verifyRequest(body.cksRequest, body.timeRequest)) {

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
  async remove(@Param() param, @Query() query) {
    try {
      if (await Common.verifyRequest(query.cksRequest, query.timeRequest)) {
        const res = await this.services.remove(param.id);
        return ResponseHelper.success(res);
      }
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }
}
