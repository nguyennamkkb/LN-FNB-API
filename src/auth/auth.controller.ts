import { AuthService } from './auth.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ResponseHelper } from 'helper/common/response.helper';
import { ApiResponse } from 'helper/common/response.interface';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import { Common } from 'helper/common/common';
import { UserEntity } from 'src/user/entity/user.entity';
import { AuthGuard } from './auth.guard';
import { Public } from './public.decorator';
import { EmailService } from 'src/email/email.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private emailService: EmailService) { }


  @Public()
  @Post('signin')
  async signIn(@Body() item): Promise<ApiResponse<any>> {
    try {
      
      const mk = Common.MD5Hash(Common.keyApp + item.password)
      const res = await this.authService.signIn(item.email, mk)
      if (res) {
       

        if (res.status == 0) {
          const emailotp = await this.emailService.createOtp(res.id)

          console.log(emailotp);

          if (emailotp.length != 6) return  ResponseHelper.error(2, "Quá số lần gửi, vui lòng chờ 5 phút!");

          this.emailService.sendEmail(res.email, "Mã xác nhận: " + emailotp + " - LN Quản lý nhà hàng", "<b>Mã xác nhận của bạn là: " + emailotp + " \nThời hạn sử dụng mã trong vòng 5 phút \nCảm ơn đã sử dụng ứng dụng quản lý nhà hàng \nXin liên hệ cho tôi theo email/skype: nguyennam.kkb@gmail.com</b>")

          return ResponseHelper.success(199,"Da gui otp vao email");


        } else if (res.status == 1) {
          return ResponseHelper.success(res);
        }
      }
      return ResponseHelper.error(0, "Kiểm tra lại số điện thoại hoặc mật khẩu");

    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }

}
