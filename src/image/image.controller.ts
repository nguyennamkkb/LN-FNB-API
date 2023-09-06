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
        res.sendFile(imagePath);
      }
    } catch (error) {
      writeLogToFile(`viewImage catch error ${JSON.stringify(error)}`);
    }
  }

  @Public()
  @Post("uploadimage")
  async uploadimage(@Body() body: any): Promise<ApiResponse<any>> {
    try {
      // if (Common.verifyRequest(body.cksRequest, body.timeRequest)) {
      const imgs = await this.service.findByUserId(body.user_id);
      const user = await this.userServices.findById(body.user_id)
      const url = await ImageUtil.saveImage(body.base64Image);
      const image = new ImageEntity();
     
      if (url == null || user == null) {
        return
      }

      image.user_id = body.user_id;
      if (imgs.length <= 0) {
        image.name = url;
        const res = this.service.create(image);
        if (res) return ResponseHelper.success(url);
      }else if (imgs.length > 0){
        const status = await ImageUtil.deleteImage(imgs[0].name);
    
        image.id = imgs[0].id
        image.name = url
        const res = this.service.update(image);
        if (res ) return ResponseHelper.success(url);
      }
      else return ResponseHelper.error(0, "Lỗi");
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
