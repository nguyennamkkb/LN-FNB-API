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
import { TableService } from "./table.service";
import { TableEntity } from "./entity/table.entity";
import { ResponseHelper } from "helper/common/response.helper";
import { ApiResponse } from "helper/common/response.interface";
import { UpdateResult } from "typeorm/query-builder/result/UpdateResult";
import { Common } from "../../helper/common/common";
import { Public } from "src/auth/public.decorator";

@Controller("tables")
export class TableController {
  constructor(private readonly services: TableService) {}

  @Post()
  async create(@Body() item): Promise<ApiResponse<TableEntity>> {
    try {
      if (await Common.verifyRequest(item.cksRequest, item.timeRequest)) {
        const res = await this.services.create(item);
        return ResponseHelper.success(res);
      }
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }

  @Public()
  @Post("reset")
  async resetTable(@Body() item): Promise<ApiResponse<any>> {
    try {
      // if (await Common.verifyRequest(item.cksRequest, item.timeRequest)) {

        const listtable: string[] = String(item.table).split(" ")
        const resetTable = await this.services.resetTable(listtable)
        if (resetTable.affectedRows > 0) {
          return ResponseHelper.success("Thành công");
        }
        return ResponseHelper.error(0, "Lỗi");
      // }
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }

  @Get()
  async findAll(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 100,
    @Query() query
  ): Promise<ApiResponse<TableEntity[]>> {
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
      console.log(error)
      return ResponseHelper.error(0, error);
    }
  }

  @Get(":id")
  async findOne(
    @Param() param,
    @Query() query
  ): Promise<ApiResponse<TableEntity>> {
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
      // console.log(param);
      
      if (await Common.verifyRequest(query.cksRequest, query.timeRequest)) {
        const res = await this.services.remove(param.id);
        
        return ResponseHelper.success(res);
      }
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }
}
