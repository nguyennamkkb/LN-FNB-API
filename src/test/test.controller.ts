import { Controller, Get, Query } from '@nestjs/common';
import { ResponseHelper } from 'helper/common/response.helper';
import { ApiResponse } from 'helper/common/response.interface';
import { Public } from 'src/auth/public.decorator';
@Controller('test')
export class TestController {
    @Get()
  async findAll(
   
  ): Promise<ApiResponse<any>> {
    try {
        return ResponseHelper.error(0, "test");
    } catch (error) {
      return ResponseHelper.error(0, error);
    }
  }
}
