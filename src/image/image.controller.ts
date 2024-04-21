import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import * as path from "path";
import { ImageService } from "./image.service";
import { Public } from "src/auth/public.decorator";
import { ImageUtil } from "../../helper/util/image.util";
import { ApiResponse } from "helper/common/response.interface";
import { ResponseHelper } from "helper/common/response.helper";
import { Common } from "helper/common/common";
import { writeLogToFile } from "helper/common/logger";
import { UserService } from "src/user/user.service";
import { ImageEntity } from "./entity/image.entity";
import * as fs from 'fs';
@Controller("images")
export class ImagesController {
  constructor(
    private readonly service: ImageService,
    private readonly userServices: UserService
  ) {}

  @Public()
  @Get("viewimage/:filename")
  async viewImage(
    @Param("filename") filename: string,
    @Res() res: Response,
    @Query() query
  ): Promise<void> {
    try {
      if (Common.verifyRequest(query.cksRequest, query.timeRequest)) {
        const imagePath = path.join(
          __dirname,
          "..",
          "..",
          "..",
          "upload",
          filename + ".jpeg"
        );
        if (fs.existsSync(imagePath)) {

          res.sendFile(imagePath);
        } else {
          res.status(404).send('File not found');
        }

      }
    } catch (error) {
      writeLogToFile(`viewImage catch error ${JSON.stringify(error)}`);
    }
  }

  @Public()
  @Post("uploadAnhCuaHang")
  async uploadimage(@Body() body: any): Promise<ApiResponse<any>> {
    try {
      if (Common.verifyRequest(body.cksRequest, body.timeRequest)) {
        const imgs = await this.service.findImageByUserId(body.user_id);
        const user = await this.userServices.findById(body.user_id);
        const url = await ImageUtil.saveImage(body.base64Image);
        const image = new ImageEntity();

        if (url == null || user == null) {
          return;
        }

        image.user_id = body.user_id;
        if (imgs.length <= 0) {
          image.name = url;
          const res = this.service.create(image);
          if (res) return ResponseHelper.success(url);
        } else if (imgs.length > 0) {
          await ImageUtil.deleteImage(imgs[0].name);

          image.id = imgs[0].id;
          image.name = url;
          const res = this.service.update(image);
          if (res) return ResponseHelper.success(url);
        } else return ResponseHelper.error(0, "Lỗi");
      }
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }

  @Public()
  @Post("uploadAnhQR") // md5 user_id+idSanPham+createAt
  async uploadAnhQR(@Body() body: any): Promise<ApiResponse<any>> {
    try {

      if (Common.verifyRequest(body.cksRequest, body.timeRequest)) {
        //kiểm tra user có trong hệ thống

        const user = await this.userServices.findById(body.user_id);
        if (user == null)
          return ResponseHelper.error(0, "tài khoản không tồn tại");
        // kiem tra anh da ton tai?
        const tenAnh = "qr"+body.user_id
        const imgs = await this.service.findImageByUserIdAndName(
          body.user_id,
          tenAnh
        );

       

        const url = await ImageUtil.saveImageWithName(body.base64Image,tenAnh);

        if (url == null) return ResponseHelper.error(0, "Lỗi tạo ảnh");
        const image = new ImageEntity();
        image.user_id = body.user_id;
        image.type = 2 // anh qr 
        if (imgs.length <= 0 || imgs == null) {
          image.name = url;
          const res = this.service.create(image);
          if (res) return ResponseHelper.success(url);
        }
        else if (imgs.length > 0) {
          image.id = imgs[0].id;
          image.name = url;
          const res = this.service.update(image);
          if (res) return ResponseHelper.success(url);
        } else return ResponseHelper.error(0, "Lỗi");

      }
    } catch (error) {

      return ResponseHelper.error(0, error);
    }
  }
  @Public()
  @Post("uploadAnhLogo") // md5 user_id+idSanPham+createAt
  async uploadAnhLogo(@Body() body: any): Promise<ApiResponse<any>> {
    try {

      if (Common.verifyRequest(body.cksRequest, body.timeRequest)) {
        //kiểm tra user có trong hệ thống

        const user = await this.userServices.findById(body.user_id);
        if (user == null)
          return ResponseHelper.error(0, "tài khoản không tồn tại");
        // kiem tra anh da ton tai?
        const tenAnh = "logo"+body.user_id
        const imgs = await this.service.findImageByUserIdAndName(
          body.user_id,
          tenAnh
        );

       

        const url = await ImageUtil.saveImageWithName(body.base64Image,tenAnh);

        if (url == null) return ResponseHelper.error(0, "Lỗi tạo ảnh");
        const image = new ImageEntity();
        image.user_id = body.user_id;
        image.type = 3 // anh logo 
        if (imgs.length <= 0 || imgs == null) {
          image.name = url;
          const res = this.service.create(image);
          if (res) return ResponseHelper.success(url);
        }
        else if (imgs.length > 0) {
          image.id = imgs[0].id;
          image.name = url;
          const res = this.service.update(image);
          if (res) return ResponseHelper.success(url);
        } else return ResponseHelper.error(0, "Lỗi");

      }
    } catch (error) {

      return ResponseHelper.error(0, error);
    }
  }
 
  @Public()
  @Post("uploadAnhSanPham") // md5 user_id+idSanPham+createAt
  async uploadAnhSanPham(@Body() body: any): Promise<ApiResponse<any>> {
    try {

      if (Common.verifyRequest(body.cksRequest, body.timeRequest)) {
        //kiểm tra user có trong hệ thống

        const user = await this.userServices.findById(body.user_id);
        if (user == null)
          return ResponseHelper.error(0, "tài khoản không tồn tại");
        // kiem tra anh da ton tai?
        const tenAnh = ""+body.user_id+body.idSanPham+body.createAt
        const imgs = await this.service.findImageByUserIdAndName(
          body.user_id,
          tenAnh
        );

       

        const url = await ImageUtil.saveImageWithName(body.base64Image,tenAnh);

        if (url == null) return ResponseHelper.error(0, "Lỗi tạo ảnh");
        const image = new ImageEntity();
        image.user_id = body.user_id;

        if (imgs.length <= 0 || imgs == null) {
          image.name = url;
          const res = this.service.create(image);
          if (res) return ResponseHelper.success(url);
        }
        else if (imgs.length > 0) {
          image.id = imgs[0].id;
          image.name = url;
          const res = this.service.update(image);
          if (res) return ResponseHelper.success(url);
        } else return ResponseHelper.error(0, "Lỗi");

      }
    } catch (error) {

      return ResponseHelper.error(0, error);
    }
  }

  @Public()
  @Get()
  async findAll(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query() params
  ): Promise<ApiResponse<any>> {
    try {
      // if (await Common.verifyRequest(params.cksRequest, params.timeRequest)) {
      writeLogToFile(`UserController findAll input ${JSON.stringify(params)}`);
      const [res, totalCount] = await this.service.findAll(page, limit, params);
      var response = {
        statusCode: 200,
        message: "Thành công!",
        data: res,
        meta: {
          totalCount,
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
        },
      };
      writeLogToFile(`UserController findAll res ${JSON.stringify(response)}`);
      return response;
      // }
    } catch (error) {
      writeLogToFile(`UserController findAll catch ${JSON.stringify(error)}`);
      return ResponseHelper.error(0, error);
    }
  }
}
