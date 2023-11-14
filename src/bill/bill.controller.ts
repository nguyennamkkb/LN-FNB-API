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
        const bill = await this.services.findByOrderId(item.order_id);
        if (bill == null) {
          const res = await this.services.create(item);
          return ResponseHelper.success(res);
        } else {
          item.id = bill.id;
          delete item["cksRequest"];
          delete item["timeRequest"];

          item.updateAt = item.timeRequest;
          const res = await this.services.update(item);
          return ResponseHelper.success(item);
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
  @Get("taoBaoCaoNgay")
  async taoBaoCaoNgay(@Query() query): Promise<ApiResponse<any>> {
    try {
      // // if (await Common.verifyRequest(query.cksRequest, query.timeRequest)) {
      if (
        query.from == undefined ||
        query.to == undefined ||
        query.user_id == undefined
      ) {
        return ResponseHelper.error(0, "Thiếu thông tin");
      }

      const res = await this.services.layHoaDonTheoNgay(query);

      const tongSoDon = res.length;
      const [tongTienMat, tongTienCK, tongSoKhach, tongDonShip] =
        await this.tongCacLoai_TheoNgay(res);

      var result = []; // mảng để lưu trữ kết quả
      for (var i = 0; i < res.length; i++) {
        // vòng lặp for để duyệt qua các phần tử của mảng order
        var date = await Common.formatDateFromMilliseconds(res[i].updateAt);
        var found = false; // biến để kiểm tra xem đã có ngày này trong mảng kết quả chưa
        const giaTriNgay = {
          total: res[i].last_total,
          type: res[i].type,
          person: res[i].person,
          ship: res[i].table.toUpperCase().indexOf("SHIP") != -1 ? 1 : 0,
        };
        for (var j = 0; j < result.length; j++) {
          // vòng lặp for để duyệt qua các phần tử của mảng kết quả

          if (result[j].date == date) {
            result[j].value.push(giaTriNgay); // thêm đối tượng order vào mảng value của ngày này
            found = true; // gán biến found là true
            break; // thoát khỏi vòng lặp
          }
        }
        if (!found) {
          result.push({
            // thêm một đối tượng mới vào mảng kết quả
            date: date, // gán thuộc tính date là ngày định dạng
            value: [giaTriNgay], // gán thuộc tính value là một mảng chứa đối tượng order
          });
        }
      }

      const rp = {
        tongSoDonHang: tongSoDon,
        tongTienMat: tongTienMat,
        tongTienCK: tongTienCK,
        tongSoKhach: tongSoKhach,
        tongDonShip: tongDonShip,
        rpTheoNgay: result,
      };

      return ResponseHelper.success(rp);
      // }
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }

  @Public()
  @Get("taoBaoCaoHomNay")
  async taoBaoCaoHomNay(@Query() query): Promise<ApiResponse<any>> {
    try {
      // // if (await Common.verifyRequest(query.cksRequest, query.timeRequest)) {
      if (
        query.from == undefined ||
        query.to == undefined ||
        query.user_id == undefined
      ) {
        return ResponseHelper.error(0, "Thiếu thông tin");
      }
      // const hieuSoThoiGian =  query.to - query.from
      // if (hieuSoThoiGian >= 86400000) return ResponseHelper.error(0, "Sai trường thời gian");

      const order = await this.services.layDanhSachOrder(query);

      const hoaDon = await this.services.layHoaDonTheoNgay(query);

      const tongSoDon = order.length;
      const [tongDangPhucVu, tongDatTruoc, tongShip, tongKhach, tongThuDuTinh] =
        await this.tongCacLoai_HomNay(order);

      const [tongTienMat, tongTienCK, tongSoKhach, tongDonShip] =
        await this.tongCacLoai_TheoNgay(hoaDon);

      var result = []; // mảng để lưu trữ kết quả
      for (var i = 0; i < hoaDon.length; i++) {
        // vòng lặp for để duyệt qua các phần tử của mảng order
        var date = await Common.getHour(hoaDon[i].updateAt);

        var found = false; // biến để kiểm tra xem đã có ngày này trong mảng kết quả chưa
        const giaTriNgay = {
          total: hoaDon[i].last_total,
          type: hoaDon[i].type,
          person: hoaDon[i].person,
          ship: hoaDon[i].table.toUpperCase().indexOf("SHIP") != -1 ? 1 : 0,
        };
        for (var j = 0; j < result.length; j++) {
          // vòng lặp for để duyệt qua các phần tử của mảng kết quả

          if (result[j].date == date) {
            result[j].value.push(giaTriNgay); // thêm đối tượng order vào mảng value của ngày này
            found = true; // gán biến found là true
            break; // thoát khỏi vòng lặp
          }
        }
        if (!found) {
          result.push({
            // thêm một đối tượng mới vào mảng kết quả
            date: date, // gán thuộc tính date là ngày định dạng
            value: [giaTriNgay], // gán thuộc tính value là một mảng chứa đối tượng order
          });
        }
      }

      const rp = {
        chuaHoanThanh: {
          tongDangPhucVu: tongDangPhucVu,
          tongDatTruoc: tongDatTruoc,
          tongShip: tongShip,
          tongKhach: tongKhach,
          tongThuDuTinh: tongThuDuTinh,
        },
        daHoanThanh: {
          tongSoDonHang: tongSoDon,
          tongTienMat: tongTienMat,
          tongTienCK: tongTienCK,
          tongSoKhach: tongSoKhach,
          tongDonShip: tongDonShip,
        },

        rpTheoGio: result,
      };

      return ResponseHelper.success(rp);
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
      // console.log(JSON.stringify(error));
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

  async tongCacLoai_TheoNgay(
    data: any
  ): Promise<[number, number, number, number]> {
    let total1 = 0;
    let total2 = 0;
    let totalP = 0;
    let totalShip = 0;
    for (let index = 0; index < data.length; index++) {
      const e = data[index];
      e.table = e.table.toUpperCase();
      if (e.type == 1) {
        total1 += e.last_total;
      }
      if (e.type == 2) {
        total2 += e.last_total;
      }
      if (e.table.indexOf("SHIP") != -1) {
        totalShip += 1;
      }
      totalP += e.person;
    }
    return [total1, total2, totalP, totalShip];
  }

  async tongCacLoai_HomNay(
    data: any
  ): Promise<[number, number, number, number, number]> {
    let tongDangPhucVu = 0;
    let tongDatTruoc = 0;
    let tongShip = 0;
    let tongKhach = 0;
    let tongThuDuTinh = 0;

    for (let index = 0; index < data.length; index++) {
      const e = data[index];
      e.table = e.table.toUpperCase();
      if (e.status == 1) {
        tongDangPhucVu += 1;
      }
      if (e.status == 2) {
        tongDatTruoc += 1;
      }
      if (e.table.indexOf("SHIP") != -1) {
        tongShip += 1;
      }
      tongKhach += e.person;
      tongThuDuTinh += e.total
    }

    return [tongDangPhucVu, tongDatTruoc, tongShip, tongKhach,tongThuDuTinh];
  }
}
